import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authUtils';
import './Paginas-CSS/homepag.css';
import './Paginas-CSS/errorpag.css';
import './Paginas-CSS/profilepage.css';
import { useState, useEffect, useRef, type ChangeEvent } from 'react'; // 1. Importar useRef e ChangeEvent
import { Pen } from 'lucide-react';

interface UserProfile {
    displayedName: string;
    username: string;
    email: string;
    phone: string;
    profilePictureUrl: string | null;
    userTag: string;
}

export default function ProfilePage() {

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    
    // 2. Criar uma referência para o input de tipo 'file'
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (isLoggedIn) {
            const fetchUserProfile = async () => {
                try {
                    const response = await fetch('http://localhost:5001/api/user/profile', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Erro ao buscar perfil do usuário');
                    }
                    const data = await response.json();
                    setUserProfile({
                        ...data, // Copia todos os dados recebidos
                        profilePictureUrl: data.profilePictureUrl // Atribui a URL da imagem
                    });
                } catch (error) {
                    console.error('Erro ao buscar perfil do usuário:', error);
                }
            }
            fetchUserProfile()
        }
    }, [isLoggedIn])

    // 4. Função para lidar com o upload da nova imagem
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return; // Não faz nada se nenhum arquivo foi selecionado
        }

        const formData = new FormData();
        formData.append('avatar', file); // 'avatar' deve corresponder ao nome esperado no backend

        try {
            const response = await fetch('http://localhost:5001/api/user/avatar', {
                method: 'PUT',
                headers: {
                    // NÃO adicione 'Content-Type'. O navegador fará isso automaticamente com o 'boundary' correto para FormData
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao fazer upload da imagem.');
            }

            const data = await response.json();

            // Atualiza o estado com a nova URL da imagem
            setUserProfile(prevProfile => {
                if (!prevProfile) return null;
                return { ...prevProfile, profilePictureUrl: data.profilePictureUrl };
            });

        } catch (error) {
            console.error('Erro no upload da imagem:', error);
            alert(error);
        }
    };
    
    // 5. Função para ativar o clique do input de arquivo
    const handleProfilePictureClick = () => {
        fileInputRef.current?.click();
    };


    if (!isLoggedIn) {
        // ... (sem alterações nesta seção)
        return (
            <div className="error-page-container">
                <header className="error-header"><div className="header-content"><img src="/TereZinho.svg" alt="CodeSpace Logo" className="logo" /><span className="site-name">CodeSpace</span></div></header>
                <main className="error-main-content"><h1>Acesso Negado</h1><p><b>Por favor</b> faça <Link to="/login" className="home-link">LOGIN</Link> para ver o perfil.</p></main>
                <footer className="error-footer"><p>Autores: Elitinho123456 / Guilherme Figueiredo Terenciani</p><p>&copy; 2025 CodeSpace - Todos os direitos reservados.</p><p><a href="https://github.com/guilhermeterenciani/ifcode" target="_blank" rel="noopener noreferrer">Repositório do GitHub</a></p></footer>
            </div>
        );
    }

    if (!userProfile) {
        // ... (sem alterações nesta seção)
        return (
            <div className="profile-page-container">
                <header className="home-header"><div className="header-content"><img src="/TereZinho.svg" alt="CodeSpace Logo" className="logo" /><span className="site-name">CodeSpace</span></div></header>
                <main className="profile-content-area"><div>Carregando perfil...</div></main>
                <footer className="home-footer"><p>Autores: Elitinho123456 / Guilherme Figueiredo Terenciani</p><p>&copy; 2025 CodeSpace - Todos os direitos reservados.</p><p><a href="https://github.com/guilhermeterenciani/ifcode" target="_blank" rel="noopener noreferrer">Repositório do GitHub</a></p></footer>
            </div>
        );
    }

    // 6. Construir a URL completa para a foto de perfil
    const fullProfilePictureUrl = userProfile.profilePictureUrl 
        ? `http://localhost:5001${userProfile.profilePictureUrl}` 
        : 'https://placehold.co/90x90/8a2be2/ffffff?text=User';


    return (
        <div className="profile-page-container">
            <header className="home-header">
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
                        {/* 7. Atualizar o container da foto de perfil */}
                        <div
                            className="profile-picture-wrapper"
                            onMouseEnter={() => setIsMouseOver(true)}
                            onMouseLeave={() => setIsMouseOver(false)}
                            onClick={handleProfilePictureClick} // <-- ADICIONADO: Ativa o input de arquivo
                            style={{ cursor: 'pointer' }}       // <-- ADICIONADO: Muda o cursor para indicar que é clicável
                        >

                            {isMouseOver && <Pen className='editar' />}

                            <img
                                src={fullProfilePictureUrl} // <-- ALTERADO: Usa a URL completa
                                alt="Foto de Perfil"
                                className="profile-picture"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://placehold.co/90x90/8a2be2/ffffff?text=User';
                                }}
                            />
                            {/* 8. Conectar o input com a referência e a função de mudança */}
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                style={{ display: 'none' }}
                                ref={fileInputRef}      // <-- ADICIONADO: Associa a referência
                                onChange={handleFileChange} // <-- ADICIONADO: Chama a função de upload
                            />
                        </div>

                        {/* ... O resto do seu JSX não precisa de alterações ... */}
                        <div className="profile-user-name">{userProfile.displayedName}</div>
                        <div className="profile-user-tag">{userProfile.userTag}</div>
                        <div className="profile-section-title">Minha Conta</div>
                        <div className="profile-input-group"><label htmlFor="displayedName" className="profile-input-label">Nome Exibido</label><div className="profile-input-with-button"><input type="text" id="displayedName" className="profile-input-field" value={userProfile.displayedName || 'Defina um nome de Exibição!'} readOnly /><button className="profile-action-button" disabled><Pen /></button></div></div>
                        <div className="profile-input-group"><label htmlFor="username" className="profile-input-label">Nome de Usuário</label><div className="profile-input-with-button"><input type="text" id="username" className="profile-input-field" value={userProfile.username} readOnly /><button className="profile-action-button" disabled><Pen /></button></div></div>
                        <div className="profile-input-group"><label htmlFor="password" className="profile-input-label">Senha</label><div className="profile-input-with-button"><input type="password" id="password" className="profile-input-field" value="***********" readOnly /><button className="profile-action-button" disabled>Mostrar</button></div></div>
                        <div className="profile-input-group"><label htmlFor="email" className="profile-input-label">E-mail</label><div className="profile-input-with-button"><input type="email" id="email" className="profile-input-field" value={userProfile.email} readOnly /><button className="profile-action-button" disabled>Mostrar</button></div></div>
                        <div className="profile-input-group"><label htmlFor="phone" className="profile-input-label">Telefone</label><div className="profile-input-with-button"><input type="text" id="phone" className="profile-input-field" value={userProfile.phone} readOnly /><button className="profile-action-button" disabled>Mostrar</button><button className="profile-action-button remove ml-2" disabled>Remover</button></div></div>
                        <div className="profile-navigation-buttons"><button onClick={logout} className="home-link">Sair</button><Link to="/" className="home-link">Voltar para Home</Link></div>
                    </div>
                </div>
            </main>

            <footer className="home-footer">
                <p>Autores: Elitinho123456 / Guilherme Figueiredo Terenciani</p>
                <p>&copy; 2025 CodeSpace - Todos os direitos reservados.</p>
                <p><a href="https://github.com/guilhermeterenciani/ifcode" target="_blank" rel="noopener noreferrer">Repositório do GitHub</a></p>
            </footer>
        </div>
    );
}