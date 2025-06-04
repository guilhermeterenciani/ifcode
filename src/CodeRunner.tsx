import { useState } from 'react';
import { MonacoEditor } from './MonacoEditor';
import axios from 'axios'

interface RunCodeResponse {
    token: string;
}

export function CodeRunner() {

    const [code, setCode] = useState<string>(
        '// Escreva seu código aqui\nconsole.log("Olá, mundo!");\n\n// Você pode usar alert() também'
    );

    const [output, setOutput] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const sendCode = async (code: string): Promise<void> => {
        
        try {

            const response = await axios.post<RunCodeResponse>(
                `http://localhost:5001/run-code`,
                { code }
            );

            console.log('Submission token:', response.data.token);


            // const result = await axios.get(`/submission-result/${response.data.token}`);
            // console.log(result.data);

        } catch (error) {
            console.error('Error submitting code:', error);
            setOutput(prev => [...prev, `❌ Erro desconhecido: ${error instanceof Error ? error.message : String(error)}`]);
        }
    };

    // Captura console.log do usuário
    const captureConsole = () => {

        const originalConsole = { ...console };
        const newOutput: string[] = [];

        console.log = (...args) => {
            newOutput.push(args.join(' '));
            originalConsole.log(...args);
        };

        console.warn = (...args) => {
            newOutput.push(`⚠️ ${args.join(' ')}`);
            originalConsole.warn(...args);
        };

        console.error = (...args) => {
            newOutput.push(`❌ ${args.join(' ')}`);
            originalConsole.error(...args);
        };

        return {

            restore: () => {
                console.log = originalConsole.log;
                console.warn = originalConsole.warn;
                console.error = originalConsole.error;
            },
            getOutput: () => newOutput

        };

    };

    const executeCode = async () => {

        setIsRunning(true);
        setOutput([]);

        const consoleCapture = captureConsole();

        try {

            // Executa localmente
            new Function(code)();

            // Envia para o Judge0 direto apenas para facilitar o teste
            await sendCode(code);

        } catch (error) {

            setOutput(prev => [...prev, `❌ Erro: ${error instanceof Error ? error.message : String(error)}`]);

        } finally {

            setOutput(prev => [...prev, ...consoleCapture.getOutput()]);
            consoleCapture.restore();
            setIsRunning(false);

        }
    };

    const clearOutput = () => {
        setOutput([]);
    };

    return (
        <div className="code-runner-container" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: '#121212'
        }}>
            <div style={{
                display: 'flex',
                flex: 1,
                overflow: 'hidden',
                gap: '1rem',
                padding: '1rem'
            }}>
                <div style={{
                    flex: 1,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    <MonacoEditor
                        code={code}
                        onChange={(value) => setCode(value || '')}
                        language="typescript"
                        height="100%"
                    />
                </div>

                <div style={{
                    flex: '0 0 30%',
                    background: '#1E1E1E',
                    color: '#e0e0e0',
                    padding: '1rem',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    <h3 style={{
                        marginTop: 0,
                        color: '#ffffff',
                        borderBottom: '1px solid #333',
                        paddingBottom: '0.5rem'
                    }}>Output</h3>
                    {output.length === 0 ? (
                        <p style={{ color: '#888' }}>Nenhum output ainda. Execute seu código para ver o resultado.</p>
                    ) : (
                        output.map((line, index) => (
                            <div key={index} style={{
                                marginBottom: '0.5rem',
                                color: line.startsWith('❌') ? '#ff6b6b' :
                                    line.startsWith('⚠️') ? '#ffd166' : '#e0e0e0'
                            }}>{line}</div>
                        ))
                    )}
                </div>
            </div>
            <div style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                borderTop: '1px solid #333',
                backgroundColor: '#1E1E1E'
            }}>
                <button
                    onClick={executeCode}
                    disabled={isRunning}
                    style={{
                        padding: '0.5rem 1.5rem',
                        background: isRunning ? '#555' : '#2A8DFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background 0.2s',
                    }}
                >
                    {isRunning ? 'Executando...' : 'Executar Código'}
                </button>

                <button
                    onClick={clearOutput}
                    style={{
                        padding: '0.5rem 1.5rem',
                        background: '#444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background 0.2s',
                    }}
                >
                    Limpar Output
                </button>
            </div>
        </div>
    );
}