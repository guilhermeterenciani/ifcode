// server.ts - TypeScript com RabbitMQ
import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import Docker from 'dockerode';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as tar from 'tar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ===== TIPOS =====
interface Config {
  RABBITMQ_URL: string;
  QUEUE_NAME: string;
  TIMEOUT: number;
  MEMORY: number;
  CPU_QUOTA: number;
  CLEANUP_RETRIES: number;
  CLEANUP_RETRY_DELAY: number;
}

interface Problem {
  title: string;
  testFile: string;
}

interface SubmissionMessage {
  submissionId: string;
  problemId: number;
  code: string;
}

interface ExecutionResult {
  success: boolean;
  output: string;
  passed: number;
  failed: number;
  total: number;
  error: string | null;
}

interface StoredResult {
  submissionId: string;
  status: 'processing' | 'success' | 'failed' | 'error';
  message?: string;
  details?: {
    output: string;
    passed: number;
    failed: number;
    total: number;
    error: string | null;
  };
  timestamp?: number;
}

// ===== CONFIGURAÇÕES =====
const CONFIG: Config = {
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
  QUEUE_NAME: 'code-submissions',
  TIMEOUT: 60000,
  MEMORY: 256 * 1024 * 1024,
  CPU_QUOTA: 50000,
  CLEANUP_RETRIES: 3,
  CLEANUP_RETRY_DELAY: 1000,
};

// Middlewares
app.use(cors());
app.use(express.json());


// Docker instance
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// Armazenamento em memória para resultados
const results = new Map<string, StoredResult>();

// RabbitMQ connection
let channel: Channel | null = null;
let connection: Connection | null = null;

// ===== DEFINIÇÃO DOS PROBLEMAS =====
const problems: Record<number, Problem> = {
  1: {
    title: "Soma de Dois Números",
    testFile: `
import { soma } from './solution.js';

test('soma 2 + 3 deve ser 5', () => {
  expect(soma(2, 3)).toBe(5);
});

test('soma 0 + 0 deve ser 0', () => {
  expect(soma(0, 0)).toBe(0);
});

test('soma -1 + 1 deve ser 0', () => {
  expect(soma(-1, 1)).toBe(0);
});

test('soma 100 + 200 deve ser 300', () => {
  expect(soma(100, 200)).toBe(300);
});
    `,
  },
  2: {
    title: "Número Par",
    testFile: `
    console.log("Hello World!");
import { ehPar } from './solution.js';

test('4 é par', () => {
  expect(ehPar(4)).toBe(true);
});

test('7 é ímpar', () => {
  expect(ehPar(7)).toBe(false);
});

test('0 é par', () => {
  expect(ehPar(0)).toBe(true);
});

test('-2 é par', () => {
  expect(ehPar(-2)).toBe(true);
});
    `,
  },
};

// ===== CONEXÃO COM RABBITMQ =====
async function connectToRabbitMQ(retryCount = 0, maxRetries = 30): Promise<Connection> {
  const baseDelay = 2000; // 2 segundos
  const maxDelay = 30000; // 30 segundos
  
  try {
    console.log(`🔄 Tentando conectar ao RabbitMQ (tentativa ${retryCount + 1}/${maxRetries})...`);
    
    const conn: Connection = await amqp.connect(CONFIG.RABBITMQ_URL, { timeout: 10000 });
    console.log('✅ Conectado ao RabbitMQ');

    channel = await conn.createChannel();
    await channel.assertQueue(CONFIG.QUEUE_NAME, { durable: true });

    console.log(`📬 Fila "${CONFIG.QUEUE_NAME}" criada/conectada`);

    // Handler de desconexão
    conn.on('close', () => {
      console.error('❌ Conexão com RabbitMQ fechada. Tentando reconectar...');
      channel = null;
      setTimeout(() => connectToRabbitMQ(0, maxRetries), 5000);
    });

    conn.on('error', (err: Error) => {
      console.error('❌ Erro na conexão RabbitMQ:', err.message);
    });

    return conn;
  } catch (error) {
    const err = error as Error;
    
    if (retryCount >= maxRetries - 1) {
      console.error(`❌ Falha ao conectar ao RabbitMQ após ${maxRetries} tentativas`);
      throw new Error(`Não foi possível conectar ao RabbitMQ: ${err.message}`);
    }
    
    // Backoff exponencial com limite máximo
    const delay = Math.min(baseDelay * Math.pow(1.5, retryCount), maxDelay);
    console.log(`⏳ RabbitMQ não disponível. Tentando novamente em ${(delay / 1000).toFixed(1)}s...`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return connectToRabbitMQ(retryCount + 1, maxRetries);
  }
}

// ===== AUTO-EXPORT DE FUNÇÕES =====
function addExportsToCode(code: string): string {
  // Se já tem exports, retorna o código original
  if (/export\s+(?:default|{|function|const|let|var|class)/i.test(code)) {
    return code;
  }

  const exportedNames = new Set<string>();

  // 1. Function declarations: function nomeFuncao(...)
  const funcDeclarations = code.matchAll(/function\s+(\w+)\s*\(/g);
  for (const match of funcDeclarations) {
    exportedNames.add(match[1]!);
  }

  // 2. Arrow functions e function expressions: const/let/var nome = ...
  const varDeclarations = code.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\(|async)/g);
  for (const match of varDeclarations) {
    exportedNames.add(match[1]!);
  }

  // 3. Classes: class NomeClasse
  const classDeclarations = code.matchAll(/class\s+(\w+)/g);
  for (const match of classDeclarations) {
    exportedNames.add(match[1]!);
  }

  // Adiciona exports no final do código
  if (exportedNames.size > 0) {
    const exports = Array.from(exportedNames)
      .map(name => `export { ${name} };`)
      .join('\n');
    return `${code}\n\n${exports}`;
  }

  return code;
}

// ===== WORKER - EXECUÇÃO NO DOCKER =====
async function executeCode(
  userCode: string,
  testFile: string,
  executionId: string
): Promise<ExecutionResult> {
  const workDir = path.join(__dirname, 'temp', executionId);
  let container: Docker.Container | null = null;
  let timeoutHandle: NodeJS.Timeout | null = null;

  try {
    // Cria diretório temporário
    await fs.mkdir(workDir, { recursive: true });

    // Adiciona exports automaticamente ao código do usuário
    const codeWithExports = addExportsToCode(userCode);
    console.log(codeWithExports);
    await fs.writeFile(path.join(workDir, 'solution.js'), codeWithExports);
    await fs.writeFile(path.join(workDir, 'solution.test.js'), testFile);

    // Package.json com Jest e suporte a ES Modules
    const packageJson = {
      name: 'code-test',
      version: '1.0.0',
      type: 'module',
      scripts: {
        solution: 'node solution.js',
        test: 'NODE_OPTIONS=--experimental-vm-modules jest --json --outputFile=result.json --testLocationInResults --noStackTrace',
      },
      devDependencies: {
        jest: '^29.7.0',
      },
    };
    await fs.writeFile(
      path.join(workDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Jest config para ES Modules
    const jestConfig = {
      testEnvironment: 'node',
      testMatch: ['**/*.test.js'],
      verbose: false,
      silent: true,
      transform: {},
    };
    await fs.writeFile(
      path.join(workDir, 'jest.config.json'),
      JSON.stringify(jestConfig, null, 2)
    );

    // Cria container Docker
    console.log('Files in workDir:', await fs.readdir(workDir));
    container = await docker.createContainer({
      Image: 'node:25-alpine',
      WorkingDir: '/app',
      Cmd: ['/bin/sh', '-c', 'ls -la /app'], //'npm install && npm run solution'],
      //copy the logs to the container
      name: `code-judge-${executionId}`,
      HostConfig: {
        // Binds: [`${workDir}:/app`],
        Memory: CONFIG.MEMORY,
        MemorySwap: CONFIG.MEMORY,
        CpuQuota: CONFIG.CPU_QUOTA,
        NetworkMode: 'none',
      },
      AttachStdout: true,
      AttachStderr: true,
    });

    console.log(`[${executionId}] Container criado`);

    // Inicia container
    container.start();

    await container.putArchive(await tar.pack(workDir), { path: '/app' });

    // Promise para capturar output

    const outputPromise = captureOutput(container);

    // Promise de timeout com kill garantido
    const timeoutPromise = new Promise<string>((_, reject) => {
      timeoutHandle = setTimeout(async () => {
        console.log(`[${executionId}] ⏱️  Timeout atingido`);
        await forceKillContainer(container!, executionId);
        reject(new Error('Timeout: execução demorou mais de 30 segundos'));
      }, CONFIG.TIMEOUT);
    });

    // Race entre output e timeout.
   const output = await Promise.race([outputPromise, timeoutPromise]);
   
   console.log(`[${executionId}] Output:`, output);
    // Cancela timeout se concluído com sucesso
    if (timeoutHandle) clearTimeout(timeoutHandle);
    console.log(`[${executionId}] ✅ Execução concluída`);

    // Aguarda container finalizar
    await container.wait();

 
  

    // Remove container
    await safeRemoveContainer(container, executionId);

    // Lê resultado JSON do Jest (protegido contra burla)
    const result = await parseJestResult(workDir, output);

    // Limpa diretório temporário
    //await cleanupWorkDir(workDir, executionId);

    return result;

  } catch (error) {
    const err = error as Error;
    console.error(`[${executionId}] ❌ Erro:`, err.message);

    if (timeoutHandle) clearTimeout(timeoutHandle);
    if (container) await forceKillContainer(container, executionId);
    await cleanupWorkDir(workDir, executionId);

    return {
      success: false,
      output: '',
      passed: 0,
      failed: 0,
      total: 0,
      error: err.message,
    };
  }
}

// ===== PARSE SEGURO DO RESULTADO JEST =====
async function parseJestResult(workDir: string, consoleOutput: string): Promise<ExecutionResult> {
  try {
    // Tenta ler o arquivo JSON gerado pelo Jest
    const resultPath = path.join(workDir, 'result.json');
    const resultContent = await fs.readFile(resultPath, 'utf8');
    const jestResult = JSON.parse(resultContent);

    // Extrai dados do JSON oficial do Jest (não pode ser burlado)
    const { numPassedTests, numFailedTests, numTotalTests, success } = jestResult;

    // Formata output para o usuário
    let userOutput = '';
    if (jestResult.testResults && jestResult.testResults.length > 0) {
      const testSuite = jestResult.testResults[0];

      if (!testSuite) {
        return {
          success,
          output: 'Testes executados com sucesso',
          passed: numPassedTests,
          failed: numFailedTests,
          total: numTotalTests,
          error: null,
        };
      }

      userOutput = testSuite.assertionResults.map((test: any) => {
        const status = test.status === 'passed' ? '✓' : '✗';
        const message = test.status === 'failed'
          ? `\n  ${test.failureMessages.join('\n  ')}`
          : '';
        return `${status} ${test.title}${message}`;
      }).join('\n');
    }

    return {
      success,
      output: userOutput || 'Testes executados com sucesso',
      passed: numPassedTests,
      failed: numFailedTests,
      total: numTotalTests,
      error: null,
    };

  } catch (error) {
    // Fallback para parsing do console
    console.warn(`[parseJestResult] Não foi possível ler result.json, usando console output`);
    return parseConsoleOutput(consoleOutput);
  }
}

// Fallback: parse do console
function parseConsoleOutput(output: string): ExecutionResult {
  const cleanOutput = output.replace(/\u001b\[[0-9;]*m/g, '');

  // Regex robusta que não pode ser burlada por console.log
  const passedMatch = cleanOutput.match(/Tests:.*?(\d+) passed/);
  const failedMatch = cleanOutput.match(/Tests:.*?(\d+) failed/);
  if (!passedMatch || !failedMatch) {
    return {
      success: false,
      output: 'Regex de contagem de testes não encontrado',
      passed: 0,
      failed: 0,
      total: 0,
      error: null,
    };
  }
  if (!passedMatch[1] || !failedMatch[1]) {
    return {
      success: false,
      output: 'Regex de contagem de testes não encontrado',
      passed: 0,
      failed: 0,
      total: 0,
      error: null,
    };
  }

  const passed = parseInt(passedMatch[1]);
  const failed = parseInt(failedMatch[1]);
  const total = passed + failed;

  return {
    success: failed === 0 && passed > 0,
    output: cleanOutput,
    passed,
    failed,
    total,
    error: null,
  };
}

// ===== HELPERS DE LIMPEZA =====
async function forceKillContainer(container: Docker.Container, executionId: string): Promise<void> {
  for (let attempt = 1; attempt <= CONFIG.CLEANUP_RETRIES; attempt++) {
    try {
      try {
        await container.kill();
        console.log(`[${executionId}] 💀 Container morto (tentativa ${attempt})`);
      } catch (killError) {
        const err = killError as Error;
        if (!err.message.includes('is not running')) {
          throw killError;
        }
      }

      await container.remove({ force: true, v: true });
      console.log(`[${executionId}] 🗑️  Container removido (tentativa ${attempt})`);
      return;

    } catch (error) {
      const err = error as Error;
      console.error(`[${executionId}] ⚠️  Erro ao limpar (tentativa ${attempt}):`, err.message);

      if (attempt < CONFIG.CLEANUP_RETRIES) {
        await sleep(CONFIG.CLEANUP_RETRY_DELAY);
      }
    }
  }
}

async function safeRemoveContainer(container: Docker.Container, executionId: string): Promise<void> {
  try {
    await container.remove({ v: true });
    console.log(`[${executionId}] 🗑️  Container removido`);
  } catch (error) {
    const err = error as Error;
    console.error(`[${executionId}] ⚠️  Erro ao remover:`, err.message);
    await forceKillContainer(container, executionId);
  }
}

async function cleanupWorkDir(workDir: string, executionId: string): Promise<void> {
  try {
    await fs.rm(workDir, { recursive: true, force: true });
    console.log(`[${executionId}] 🧹 Diretório limpo`);
  } catch (error) {
    const err = error as Error;
    console.error(`[${executionId}] ⚠️  Erro ao limpar diretório:`, err.message);
  }
}

async function captureOutput(container: Docker.Container): Promise<string> {
  return new Promise((resolve, reject) => {
    let output = '';

    container.logs(
      {
        follow: true,
        stdout: true,
        stderr: true,
      },
      (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        if (!stream) {
          reject(new Error('Stream is undefined'));
          return;
        }

        stream.on('data', (chunk: Buffer) => {
          output += chunk.toString('utf8');
        });

        stream.on('end', () => {
          resolve(output);
        });

        stream.on('error', reject);
      }
    );
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== LIMPEZA DE CONTAINERS ÓRFÃOS =====
async function cleanupOrphanedContainers(): Promise<void> {
  try {
    console.log('🧹 Iniciando limpeza de containers órfãos');
    const containers = await docker.listContainers({ all: true });
    const orphaned = containers.filter(c =>
      c.Names.some(name => name.includes('code-judge-'))
    );

    if (orphaned.length > 0) {
      console.log(`🧹 Encontrados ${orphaned.length} containers órfãos`);

      for (const containerInfo of orphaned) {
        try {
          const container = docker.getContainer(containerInfo.Id);
          await container.remove({ force: true, v: true });
          console.log(`🗑️  Container órfão removido: ${containerInfo.Names[0]}`);
        } catch (error) {
          const err = error as Error;
          console.error(`⚠️  Erro ao remover órfão ${containerInfo.Id}:`, err.message);
        }
      }
    }
  } catch (error) {
    const err = error as Error;
    console.error('⚠️  Erro na limpeza de órfãos:', err.message);
  }
}

// ===== CONSUMER RABBITMQ =====
async function startConsumer(): Promise<void> {
  if (!channel) {
    throw new Error('Channel não está disponível');
  }

  try {
    await channel.prefetch(1); // Processa 1 job por vez

    console.log('👂 Aguardando mensagens na fila...');

    channel.consume(CONFIG.QUEUE_NAME, async (msg: ConsumeMessage | null) => {
      if (msg === null || !channel) return;

      const data: SubmissionMessage = JSON.parse(msg.content.toString());
      const { submissionId, problemId, code } = data;

      console.log(`\n📨 Recebida submissão: ${submissionId}`);

      // Valida problema
      const problem = problems[problemId];
      if (!problem) {
        results.set(submissionId, {
          submissionId,
          status: 'error',
          message: 'Problema não encontrado',
        });
        if (channel) {
          channel.ack(msg);
        }
        return;
      }

      // Marca como processando
      results.set(submissionId, {
        status: 'processing',
        submissionId,
      });

      try {
        // Executa código no Docker
        const result = await executeCode(code, problem.testFile, submissionId);

        // Atualiza resultado
        results.set(submissionId, {
          submissionId,
          status: result.success ? 'success' : 'failed',
          details: {
            output: result.output,
            passed: result.passed,
            failed: result.failed,
            total: result.total,
            error: result.error,
          },
        });

        console.log(`✅ Submissão ${submissionId} processada: ${result.passed}/${result.total} testes`);

        // Acknowledge da mensagem
        if (channel) {
          channel.ack(msg);
        }

      } catch (error) {
        const err = error as Error;
        console.error(`❌ Erro ao processar ${submissionId}:`, err.message);

        results.set(submissionId, {
          submissionId,
          status: 'error',
          message: 'Erro ao executar código',
          details: {
            output: '',
            passed: 0,
            failed: 0,
            total: 0,
            error: err.message,
          },
        });

        // Rejeita mensagem e reinsere na fila
        if (channel) {
          channel.nack(msg, false, true);
        }
      }
    }, { noAck: false });

  } catch (error) {
    const err = error as Error;
    console.error('❌ Erro ao iniciar consumer:', err.message);
    throw error;
  }
}

// ===== ROTAS HTTP =====
app.post('/api/submit', async (req: Request, res: Response) => {
  const { problemId, code } = req.body;

  if (!problemId || !code) {
    return res.status(400).json({ error: 'problemId e code são obrigatórios' });
  }

  const problem = problems[problemId];
  if (!problem) {
    return res.status(404).json({ error: 'Problema não encontrado' });
  }

  const submissionId = uuidv4();

  // Envia para fila RabbitMQ
  const message: SubmissionMessage = {
    submissionId,
    problemId,
    code,
  };


  try {
    if (!channel) {
      return res.status(500).json({ error: 'RabbitMQ não conectado' });
    }


    channel.sendToQueue(
      CONFIG.QUEUE_NAME,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    // Inicializa resultado como processando
    results.set(submissionId, {
      status: 'processing',
      submissionId,
    });

    res.json({ submissionId });
  } catch (error) {
    const err = error as Error;
    console.error('Erro ao enviar para fila:', err.message);
    res.status(500).json({ error: 'Erro ao enviar submissão' });
  }
});

app.get('/api/result/:submissionId', (req: Request, res: Response) => {
  const { submissionId } = req.params;

  if (!submissionId) {
    return res.status(400).json({ error: 'submissionId é obrigatório' });
  }

  const result = results.get(submissionId);

  if (!result) {
    return res.status(404).json({ error: 'Submissão não encontrada' });
  }

  res.json(result);
});


app.get('/health', async (req: Request, res: Response) => {
  const containers = await docker.listContainers();
  const judgeContainers = containers.filter(c =>
    c.Names.some(name => name.includes('code-judge-'))
  );

  res.json({
    status: 'ok',
    rabbitmq: channel ? 'connected' : 'disconnected',
    activeContainers: judgeContainers.length,
    cachedResults: results.size,
  });
});

// ===== INICIALIZAÇÃO =====
async function start(): Promise<void> {
  try {
    // Conecta ao RabbitMQ
    await connectToRabbitMQ();

    // Inicia consumer
    await startConsumer();

    // Limpeza periódica de containers órfãos (a cada 10 minutos)
    setInterval(cleanupOrphanedContainers, 30000);//1000 * 60 * 10);

    // Limpeza periódica de resultados antigos (a cada 5 minutos)
    setInterval(() => {
      const now = Date.now();
      const maxAge = 1000 * 60 * 30; // 30 minutos

      for (const [key, value] of results.entries()) {
        if (value.timestamp && now - value.timestamp > maxAge) {
          results.delete(key);
        }
      }
    }, 1000 * 60 * 5);

    // Inicia servidor HTTP
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📬 RabbitMQ conectado: ${CONFIG.RABBITMQ_URL}`);
      console.log(`🐳 Docker disponível`);
      console.log(`✅ Sistema pronto!\n`);
    });

  } catch (error) {
    const err = error as Error;
    console.error('❌ Erro ao iniciar servidor:', err.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️  Encerrando servidor...');

  if (channel) await channel.close();
  await cleanupOrphanedContainers();

  process.exit(0);
});

// Inicia aplicação
start();