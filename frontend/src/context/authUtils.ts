import { createContext, useContext } from 'react';
import type { AuthContextType } from './AuthContext'; // Importar o tipo AuthContextType

// Criar o contexto (constante)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Criar o hook customizado (função)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};