import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Paginas-CSS/loginpag.css';

export default function LoginPage() {

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const { login, continueAnonymously } = useAuth();

    const handleLogin = (e: React.FormEvent) => { //Função de Falso login, integração com backend necessaria no futuro 👌

        e.preventDefault();
        if (username && password) {

            login(username);
            navigate('/');

        } else {

            alert('Please enter both username and password.');

        }
    };

    const handleContinueAnonymously = () => { // Como não há  como cadastrar Usuarios, e caso apenas seja um teste do site, tem como ficar no anonimato apenas para testar!

        continueAnonymously();
        navigate('/');

    };

    return (

        <div className="login-page-container">

            <header className="login-header">

                <div className="header-content">
                    <img src="/TereZinho.svg" alt="CodeSpace Logo" className="logo" />
                    <span className="site-name">CodeSpace</span>
                </div>

            </header>

            <main className="login-main-content">

                <div className="login-form-container">

                    <h1>Login</h1>

                    <form onSubmit={handleLogin}>

                        <div className="input-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Senha:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="login-button">Login</button>

                    </form>

                    <button onClick={handleContinueAnonymously} className="anonymous-button">
                        Continue como Anônimo
                    </button>

                    <p>Não Possue uma Conta? <Link to="/register">Sign up</Link></p>
                </div>

            </main>

            <footer className="login-footer">

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