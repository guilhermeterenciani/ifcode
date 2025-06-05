import './Paginas-CSS/errorpag.css';
import { Link } from 'react-router-dom';

export default function ErrorPag() {

  return (
    <div className="error-page-container">

      <header className="error-header">
        <div className="header-content">
          <img src="/TereZinho.svg" alt="CodeRunner Logo" className="logo" />
          <span className="site-name">CodeRunner</span>
        </div>
      </header>

      <main className="error-main-content">
        <h1>404 Not Found</h1>
        <Link to='/' className="home-link">Home</Link>
      </main>

      <footer className="error-footer">
        <p>Autores: Elitinho123456 / Guilherme Figueiredo Terenciani</p>
        <p>&copy; 2025 CodeRunner - Todos os direitos reservados.</p>
        <p>
          <a href="https://github.com/guilhermeterenciani/ifcode" target="_blank" rel="noopener noreferrer">
            Repositório do GitHub
          </a>
        </p>
      </footer>

    </div>
  );

}