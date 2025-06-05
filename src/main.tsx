import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Code_Runner from './componentes/paginas/codeRunner.tsx'
import HomePage  from './componentes/paginas/HomePage.tsx'
import ErrorPag from './componentes/paginas/PaginaErro.tsx'

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement:<ErrorPag />
  },
  {
    path: '/Code_Runner',
    element: <Code_Runner />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
