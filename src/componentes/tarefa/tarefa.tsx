// import { useState } from 'react';
import '../paginas/Paginas-CSS/homepag.css';
import '../paginas/Paginas-CSS/errorpag.css';

// interface TarefaProps {
//     id: number; // Numero único para identificar a tarefa
//     titulo: string; // Título da tarefa
//     descricao: string; // Descrição da tarefa
//     concluida: boolean; // Indica se a tarefa foi concluída ou não
//     dataCriacao: string; // Data de criação da tarefa
//     dataConclusao?: string; // Data de conclusão da tarefa (opcional)
//     dataLimite?: string; // Data limite para conclusão da tarefa (opcional)
//     prioridade: 'baixa' | 'media' | 'alta'; // Prioridade da tarefa
//     categoria: string; // Categoria da tarefa
//     autor?: string; // Autor da tarefa (opcional)
//     stadinput: string; //  Input da tarefa esperada
//     stdoutput: string; // Output da tarefa esperada
// }  

function TarefaComponent() {


    // const [tarefas, setTarefas] = useState<TarefaProps[]>([
    //     {
    //         id: 1,
    //         titulo: 'Implementar autenticação de usuário Teste',
    //         descricao: 'Desenvolver o sistema de autenticação de usuários com login e registro.',
    //         concluida: false,
    //         dataCriacao: '2025-01-01',
    //         dataConclusao: '',
    //         dataLimite: '2025-01-15',
    //         prioridade: 'alta',
    //         categoria: 'Desenvolvimento',
    //         autor: 'Elitinho123456',
    //         stadinput: 'Usuário e senha',
    //         stdoutput: 'Usuário autenticado com sucesso'
    //     }
    // ]);

    return (
        <>

            <div className="home-page-container">

                <header className="home-header">
// Consider extracting the header, main, and footer into separate components for better modularity
                    <div className="header-content">

                        <img src="/TereZinho.svg" alt="CodeSpace Logo" className="logo" />
                        <span className="site-name">CodeSpace</span>

                    </div>
                </header>

                <main className="home-main-content">

                </main>

                <footer className="home-footer">

                    <p>Autores: Elitinho123456 / Guilherme Figueiredo Terenciani</p>
                    <p>&copy; 2025 CodeSpace - Todos os direitos reservados.</p>
                    <p>
                        <a href="https://github.com/guilhermeterenciani/ifcode" target="_blank" rel="noopener noreferrer">
                            Repositório do GitHub
                        </a>
                    </p>

                </footer>
            </div>
            
        </>

    )
}

export default TarefaComponent;