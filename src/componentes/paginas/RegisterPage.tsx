import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Paginas-CSS/loginpag.css';

export default function RegisterPage() {

    const [username, setUsername] = useState(''); // Estado para armazenar o nome de usuário
    const [email, setEmail] = useState(''); // Estado para armazenar o email
    const [password, setPassword] = useState(''); // Estado para armazenar a senha
    const [confirmPassword, setConfirmPassword] = useState(''); // Estado para armazenar a confirmação de senha
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para controlar a visibilidade da confirmação de senha
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário

        if (password !== confirmPassword) { // Verifica se as senhas coincidem
            alert('As senhas não coincidem!');
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/auth/register', { // Envia os dados do usuário para o backend
                username,
                email,
                password,
            });
            alert('Conta criada com sucesso!');
            navigate('/login');

        } catch (error) {

            console.error('Erro no registro:', error);
            alert('Erro ao criar a conta. Tente novamente.');

        }
    };

    // Funções para alternar a visibilidade das senhas
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                    <h1>Registre-Se</h1>
                    <form onSubmit={handleRegister}>

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
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                        <img src="/eye-slash-solid.svg" alt="Hide password" className="eye-icon" />
                                    ) : (
                                        <img src="/eye-solid.svg" alt="Show password" className="eye-icon" />
                                    )}
                                </span>

                            </div>

                        </div>

                        <div className="input-group">

                            <label htmlFor="confirm-password">Confirme sua Senha:</label>
                            <div className="password-input-container"> {/* Container para o input e o ícone */}

                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />

                                <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                                    {showConfirmPassword ? (
                                        <img src="/eye-slash-solid.svg" alt="Hide password" className="eye-icon" />
                                    ) : (
                                        <img src="/eye-solid.svg" alt="Show password" className="eye-icon" />
                                    )}
                                </span>

                            </div>

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