import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <AuthProvider>
      <Outlet /> {/* outlet conversa com a função AuthProvider para fazer o direcionamento de acordo com o resultado da Função(logIn/singUp)👍*/}
    </AuthProvider>
  );
}

export default App;