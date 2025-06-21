import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authUtils';
import './Paginas-CSS/homepag.css';
import './Paginas-CSS/errorpag.css';
import './Paginas-CSS/profilepage.css';

export default function ProfilePage() {
    const { isLoggedIn, logout } = useAuth();

    // Simulação de dados do usuário (em um ambiente real, viriam do backend)
    const userProfile = {
        displayedName: "Erichinyo",
        username: "elitinho123456",
        email: "***********@gmail.com", // Para simular o e-mail escondido
        phone: "***********2152",      // Para simular o telefone escondido
        password: "minhasenha", // Apenas para controle interno, não deve ser exibido
        userTag: "#0001", // Simula a tag do Discord
        profilePicture: "https://i.imgur.com/example.png" // URL de exemplo para a foto
    };

    if (!isLoggedIn) {
        return (
            <div className="error-page-container">

                <header className="error-header">
                    <div className="header-content">
                        <img src="/TereZinho.svg" alt="CodeSpace Logo" className="logo" />
                        <span className="site-name">CodeSpace</span>
                    </div>
                </header>

                <main className="error-main-content">
                    <h1>Acesso Negado</h1>
                    <p><b>Por favor</b> faça <Link to="/login" className="home-link">LOGIN</Link> para ver o perfil.</p>
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

        <div className="profile-page-container">

            <header className="home-header"> {/* Usando home-header para o estilo base */}
                <div className="header-content">
                    <img src="/TereZinho.svg" alt="CodeSpace Logo" className="logo" />
                    <span className="site-name">CodeSpace</span>
                </div>
            </header>

            <main className="profile-content-area">

                <div className="profile-card">
                    <div className="profile-header-banner">
                        <button className="profile-edit-button">Editar perfil de usuário</button>
                    </div>



                    <div className="profile-details-content">

                        <div className="profile-picture-wrapper">
                            <img
                                src={userProfile.profilePicture}
                                alt="Foto de Perfil"
                                className="profile-picture"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/90x90/8a2be2/ffffff?text=User'; }}
                            />
                        </div>

                        <div className="profile-user-name">{userProfile.displayedName}</div>
                        <div className="profile-user-tag">{userProfile.userTag}</div>

                        <div className="profile-section-title">Minha conta</div>

                        {/* Campo Nome Exibido */}
                        <div className="profile-input-group">
                            <label htmlFor="displayedName" className="profile-input-label">Nome Exibido</label>
                            <div className="profile-input-with-button">
                                <input
                                    type="text"
                                    id="displayedName"
                                    className="profile-input-field"
                                    value={userProfile.displayedName}
                                    readOnly // Desativado
                                />
                                <button className="profile-action-button" disabled>Editar</button> {/* Desativado */}
                            </div>

                        </div>

                        {/* Campo Nome de Usuário */}
                        <div className="profile-input-group">
                            <label htmlFor="username" className="profile-input-label">Nome de Usuário</label>
                            <div className="profile-input-with-button">
                                <input
                                    type="text"
                                    id="username"
                                    className="profile-input-field"
                                    value={userProfile.username}
                                    readOnly // Desativado
                                />
                                <button className="profile-action-button" disabled>Editar</button> {/* Desativado */}
                            </div>

                        </div>

                        {/* Campo Senha - Funcionalidade de 'Mostrar' ainda desativada */}
                        <div className="profile-input-group">
                            <label htmlFor="password" className="profile-input-label">Senha</label>
                            <div className="profile-input-with-button">
                                <input
                                    type="password"
                                    id="password"
                                    className="profile-input-field"
                                    value="***********" // Valor fixo para simular senha escondida
                                    readOnly // Desativado
                                />
                                <button className="profile-action-button" disabled>Mostrar</button> {/* Desativado */}
                            </div>

                        </div>

                        {/* Campo E-mail */}
                        <div className="profile-input-group">
                            <label htmlFor="email" className="profile-input-label">E-mail</label>
                            <div className="profile-input-with-button">
                                <input
                                    type="email" // Pode ser text para exibir as estrelas
                                    id="email"
                                    className="profile-input-field"
                                    value={userProfile.email}
                                    readOnly // Desativado
                                />
                                <button className="profile-action-button" disabled>Mostrar</button> {/* Desativado, pode ser "Mostrar" ou "Editar" */}
                            </div>

                        </div>

                        {/* Campo Telefone */}
                        <div className="profile-input-group">

                            <label htmlFor="phone" className="profile-input-label">Telefone</label>
                            <div className="profile-input-with-button">
                                <input
                                    type="text" // Pode ser text para exibir as estrelas
                                    id="phone"
                                    className="profile-input-field"
                                    value={userProfile.phone}
                                    readOnly // Desativado
                                />
                                <button className="profile-action-button" disabled>Mostrar</button> {/* Desativado, pode ser "Mostrar" ou "Editar" */}
                                <button className="profile-action-button remove ml-2" disabled>Remover</button> {/* Desativado */}
                            </div>

                        </div>

                        <div className="profile-navigation-buttons">
                            <button onClick={logout} className="home-link">Sair</button>
                            <Link to="/" className="home-link">Voltar para Home</Link>
                        </div>
                    </div>

                </div>

            </main>

            <footer className="home-footer"> {/* Usando home-footer para o estilo base */}
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