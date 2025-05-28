import { useState } from 'react';
import { MonacoEditor } from './MonacoEditor';

export function CodeRunner() {
    const [code, setCode] = useState<string>(
        '// Escreva seu código aqui\nconsole.log("Olá, mundo!");\n\n// Você pode usar alert() também'
    );
    const [output, setOutput] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);

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

    const executeCode = () => {
        setIsRunning(true);
        setOutput([]);

        const consoleCapture = captureConsole();

        try {
            // Usando Function para evitar problemas de escopo
            new Function(code)();
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
        <div className="code-runner-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
                <button
                    onClick={executeCode}
                    disabled={isRunning}
                    style={{
                        padding: '0.5rem 1rem',
                        background: isRunning ? '#555' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {isRunning ? 'Executando...' : 'Executar Código (Ctrl+Enter)'}
                </button>

                <button
                    onClick={clearOutput}
                    style={{
                        padding: '0.5rem 1rem',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Limpar Output
                </button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div style={{ flex: 1 }}>
                    <MonacoEditor
                        code={code}
                        onChange={(value) => setCode(value || '')}
                        language="javascript"
                        height="100%"
                    />
                </div>

                <div style={{
                    flex: '0 0 30%',
                    background: '#1E1E1E',
                    color: '#FFF',
                    padding: '1rem',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap'
                }}>
                    <h3 style={{ marginTop: 0 }}>Output:</h3>
                    {output.length === 0 ? (
                        <p style={{ color: '#888' }}>Nenhum output ainda. Execute seu código para ver o resultado.</p>
                    ) : (
                        output.map((line, index) => (
                            <div key={index} style={{ marginBottom: '0.5rem' }}>{line}</div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}