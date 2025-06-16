import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authUtils';
import axios from 'axios';
import './Paginas-CSS/loginpag.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            try {
                interface LoginResponse {
                    token: string;
                }
                const response = await axios.post<LoginResponse>('http://localhost:5001/api/auth/login', {
                    username,
                    password,
                });
                const token = response.data.token;

                if (token) {
                    login(username);// Armazena o token aqui também
                    navigate('/');
                }
            } catch (error) {
                console.error('Erro no login:', error);
                alert('Falha no login. Verifique suas credenciais.');
            }
        } else {
            alert('Por favor, insira o nome de usuário e a senha.');
        }
    };

    const handleContinueAnonymously = () => {
        // A lógica de continuar como anônimo
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
                            <label htmlFor="username">Usuário:</label>
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
                        Continuar como Anônimo
                    </button>
                    <p>Não Possui uma Conta? <Link to="/register">Sign up</Link></p>
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