import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/authUtils';
import './Paginas-CSS/homepag.css';
import './Paginas-CSS/errorpag.css';

export default function HomePage() {

    const { isLoggedIn, isAnonymous } = useAuth();
    const navigate = useNavigate();

    const handleTarefasClick = () => {
        if (!isLoggedIn) {
            alert('Você precisa estar logado para acessar as tarefas.');
        } else {
            navigate('/Tarefas');
        }
    };

    return (

        <div className="home-page-container">

            <header className="home-header">
                <div className="header-content">

                    <img src="/TereZinho.svg" alt="CodeSpace Logo" className="logo" />
                    <span className="site-name">CodeSpace</span>

                </div>
            </header>

            <main className="home-main-content">

                <h1>Bem Vindo {isLoggedIn && !isAnonymous ? ' de volta!' : '!'}</h1> {/*Mostra o nome do Usuario caso ele tenha logado*/}
                <div className="home-buttons">

                    <Link to={isLoggedIn ? '/profile' : '/login'} className='home-button'>
                        Perfil
                    </Link>

                    <Link to='/Code_Runner' className='home-button'>
                        Playground {/*Coloquei Playground como nome por conta que é apenas para teste*/}
                    </Link>

                    <button
                        className='home-button'
                        disabled={!isLoggedIn}
                        onClick={handleTarefasClick}
                        style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed', opacity: isLoggedIn ? 1 : 0.6 }}
                    >
                        Tarefas
                    </button>

                </div>

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
    );
}