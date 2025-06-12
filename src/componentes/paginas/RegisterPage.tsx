import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Paginas-CSS/loginpag.css';

export default function RegisterPage() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => { // Função de Registro falsa, ainda sem backend 

        e.preventDefault();

        if (password !== confirmPassword) { // Verificação de senha simples
            alert('As senhas não coincidem!');
            return;
        }

        alert('Conta Criada com Sucesso!'); // Mentira descarada, nem tem backend para isso :)
        navigate('/login'); // Redireciona para o login depois de criar a conta

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

                    <h1>Sign Up</h1>
                    <form onSubmit={handleRegister}>

                        <div className="input-group">
                            <label htmlFor="reg-username">Username:</label>
                            <input
                                type="text"
                                id="reg-username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="reg-email">Email:</label>
                            <input
                                type="email"
                                id="reg-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="reg-password">Senha:</label>
                            <input
                                type="password"
                                id="reg-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirm-password">Confirme sua Senha:</label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="login-button">Sign Up</button>

                    </form>

                    <p>Já possui uma conta? <Link to="/login">Login</Link></p>

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