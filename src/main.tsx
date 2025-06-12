import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Code_Runner from './componentes/paginas/codeRunner.tsx';
import HomePage from './componentes/paginas/HomePage.tsx';
import ErrorPag from './componentes/paginas/PaginaErro.tsx';
import LoginPage from './componentes/paginas/LoginPage.tsx';
import RegisterPage from './componentes/paginas/RegisterPage.tsx';
import ProfilePage from './componentes/paginas/ProfilePage.tsx';
import App from './App.tsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // As Rotas vão muudar de acordo com o AuthProvider
    errorElement: <ErrorPag />,
    children: [
      
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: 'login',
        element: <LoginPage />,
      },

      {
        path: 'register',
        element: <RegisterPage />,
      },

      {
        path: 'profile',
        element: <ProfilePage />,
      },

      {
        path: 'Code_Runner',
        element: <Code_Runner />,
      },

    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);