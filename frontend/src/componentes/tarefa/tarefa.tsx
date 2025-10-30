import { useState, useEffect } from 'react';
import axios from 'axios';
import '../paginas/Paginas-CSS/tarefa.css';

// Interface estrutura de uma tarefa
interface TarefaProps {
    id: number;
    titulo: string;
    descricao: string;
    concluida: boolean;
    dataCriacao: string;
    dataConclusao?: string;
    dataLimite?: string;
    prioridade: 'baixa' | 'media' | 'alta';
    categoria: string;
    autor?: string;
    stdinput?: string;
    stdoutput: string;
}

function TarefaComponent() {

    const [tarefas, setTarefas] = useState<TarefaProps[]>([]); // Estado para armazenar as tarefas
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
    const [error, setError] = useState<string | null>(null); // Estado para armazenar erros
    const [selectedTarefa, setSelectedTarefa] = useState<TarefaProps | null>(null); // Estado para armazenar a tarefa selecionada para detalhes

    // Efeito para buscar as tarefas da API quando o componente é montado
    useEffect(() => {

        const fetchTarefas = async () => {

            try {

                const response = await axios.get<TarefaProps[]>('http://localhost:5001/api/tarefas');
                setTarefas(response.data);

            } catch (err) {

                setError('Falha ao carregar as tarefas. Tente novamente mais tarde.');
                console.error(err);

            } finally {

                setLoading(false);

            }
        };

        fetchTarefas();
    }, []);

    // Funções para abrir e fechar os detalhes
    const handleOpenModal = (tarefa: TarefaProps) => {
        setSelectedTarefa(tarefa);
    };

    const handleCloseModal = () => {
        setSelectedTarefa(null);
    };

    if (loading) return <div className="loading">Carregando tarefas...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="tarefa-page-container">
            <header className="tarefa-header">
                <img src="/TereZinho.svg" alt="CodeSpace Logo" className="logo" />
                <span className="site-name">CodeSpace - Minhas Tarefas</span>
            </header>

            <main className="tarefa-main-content">
                <div className="tarefas-grid">
                    {tarefas.map((tarefa) => (
                        <div key={tarefa.id} className="tarefa-card" onClick={() => handleOpenModal(tarefa)}>
                            <div className="card-content">
                                <h3>{tarefa.titulo}</h3>
                                <p className="categoria">{tarefa.categoria}</p>
                                <span className={`status ${tarefa.concluida ? 'concluida' : 'pendente'}`}>
                                    {tarefa.concluida ? 'Concluída ✔' : 'Pendente 🕒'}
                                </span>
                            </div>
                            <div className={`prioridade-bar ${tarefa.prioridade}`}></div>
                        </div>
                    ))}
                </div>
            </main>

            {selectedTarefa && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={handleCloseModal}>×</button>
                        <h2>{selectedTarefa.titulo}</h2>
                        <p><strong>Descrição:</strong> {selectedTarefa.descricao}</p>
                        <p><strong>Categoria:</strong> {selectedTarefa.categoria}</p>
                        <p><strong>Prioridade:</strong> <span className={`prioridade-text ${selectedTarefa.prioridade}`}>{selectedTarefa.prioridade}</span></p>
                        <p><strong>Data de Criação:</strong> {new Date(selectedTarefa.dataCriacao).toLocaleDateString()}</p>
                        {selectedTarefa.dataLimite && <p><strong>Data Limite:</strong> {new Date(selectedTarefa.dataLimite).toLocaleDateString()}</p>}
                        <hr />
                        <h4>Requisitos de Saída</h4>
                        <pre className="code-block">{selectedTarefa.stdoutput}</pre>
                        {/* Aqui você pode adicionar o editor de código para o `stdinput` */}
                    </div>
                </div>
            )}

            <footer className="tarefa-footer">
                <p>Autores: Elitinho123456 / Guilherme Figueiredo Terenciani</p>
                <p>&copy; {new Date().getFullYear()} CodeSpace - Todos os direitos reservados.</p>
                <p>
                    <a href="https://github.com/guilhermeterenciani/ifcode" target="_blank" rel="noopener noreferrer">
                        Repositório do GitHub
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default TarefaComponent;