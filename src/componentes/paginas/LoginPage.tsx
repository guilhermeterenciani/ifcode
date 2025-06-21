import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authUtils';
import axios from 'axios';
import './Paginas-CSS/loginpag.css';

export default function LoginPage() {
    const [username, setUsername] = useState(''); // Estado para armazenar o nome de usuário
    const [password, setPassword] = useState(''); // Estado para armazenar a senha
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
    const navigate = useNavigate();

    const { login } = useAuth(); // Obtém a função de login do contexto de autenticação

    // const handleLoginFake = async (e: React.FormEvent) => {
    // e.preventDefault();
    //     // Função para lidar com o envio do formulário de login falso
    //     if (username && password) { // Verifica se o nome de usuário e a senha foram preenchidos
    //         login(username); // Chama a função de login com o nome de usuário
    //         navigate('/'); // Redireciona para a página inicial
    //     } else {
    //         alert('Por favor, insira o nome de usuário e a senha.'); // Alerta se os campos não estiverem preenchidos
    //     }
    // }

    const handleLogin = async (e: React.FormEvent) => {
        // Função para lidar com o envio do formulário de login
        e.preventDefault(); // Previne o comportamento padrão do formulário

        if (username && password) { // Verifica se o nome de usuário e a senha foram preenchidos

            try { // Tenta fazer a requisição de login

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
                } else {
                    alert('Falha no login. Verifique suas credenciais.');
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

    // Função para alternar a visibilidade da senha
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                            <div className="password-input-container"> {/* Container para o input e o ícone */}
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <span className="password-toggle" onClick={togglePasswordVisibility}>
                                    {showPassword ? (
                                        <img src="/eye-slash-solid.svg" alt="Hide password" className="eye-icon" /> // Ícone de olho fechado
                                    ) : (
                                        <img src="/eye-solid.svg" alt="Show password" className="eye-icon" /> // Ícone de olho aberto
                                    )}
                                </span>
                            </div>

                        </div>

                        <button type="submit" className="login-button">Login</button>

                    </form>

                    {/* <button onClick={handleLoginFake} className="login falso">
                        Login Fake me apague
                    </button> */}

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