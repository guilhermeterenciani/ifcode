import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authUtils';
import './Paginas-CSS/homepag.css';
import './Paginas-CSS/errorpag.css';

export default function ProfilePage() {
    const { isLoggedIn, isAnonymous, userName, logout } = useAuth();

    if (!isLoggedIn) {

        return (

            <div className="error-page-container"> {/* Reutilizando o css da pagina de erro por conveniencia */}

                <header className="error-header">
                    <div className="header-content">

                        <img src="/TereZinho.svg" alt="CodeSpace Logo" className="logo" />
                        <span className="site-name">CodeSpace</span>

                    </div>
                </header>

                <main className="error-main-content">

                    <h1>Acesso Negado</h1>
                    <p>Por Favor <Link to="/login" className="home-link">log</Link> em uma conta para ver o perfil.</p>

                </main>

                <footer className="error-footer">

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

    return (
        <div className="error-page-container"> {/* Reusing error page container for similar layout */}
            <header className="error-header">
                <div className="header-content">
                    <img src="/TereZinho.svg" alt="CodeSpace Logo" className="logo" />
                    <span className="site-name">CodeSpace</span>
                </div>
            </header>
            <main className="error-main-content">
                <h1>Welcome to your Profile, {userName}!</h1>
                {isAnonymous ? (
                    <p>You are currently Browse as an anonymous user.</p>
                ) : (
                    <p>This is your personalized profile page.</p>
                )}
                <button onClick={logout} className="home-link" style={{ marginTop: '20px' }}>Logout</button>
                <Link to="/" className="home-link" style={{ marginLeft: '10px' }}>Back to Home</Link>
            </main>
            <footer className="error-footer">
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