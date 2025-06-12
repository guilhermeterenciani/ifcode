import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './authUtils';

//interface para reutilização
export interface AuthContextType {
  isLoggedIn: boolean;
  isAnonymous: boolean;
  userName: string | null;
  login: (username: string) => void;
  logout: () => void;
  continueAnonymously: () => void;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => { //Usa o armazenamento local do navegador para manter o suposto "login"

    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    const storedAnonymous = localStorage.getItem('isAnonymous');
    const storedUserName = localStorage.getItem('userName');

    if (storedLoggedIn === 'true') {

      setIsLoggedIn(true);
      setUserName(storedUserName);

    } else if (storedAnonymous === 'true') {

      setIsAnonymous(true);

    }
  }, []);

  const login = (username: string) => {

    setIsLoggedIn(true);
    setIsAnonymous(false);
    setUserName(username);

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAnonymous', 'false');
    localStorage.setItem('userName', username);

  };

  const logout = () => {

    setIsLoggedIn(false);
    setIsAnonymous(false);
    setUserName(null);

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAnonymous');
    localStorage.removeItem('userName');

  };

  const continueAnonymously = () => {

    setIsLoggedIn(false);
    setIsAnonymous(true);
    setUserName(null);

    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('isAnonymous', 'true');
    localStorage.removeItem('userName');

  };

  return (

    <AuthContext.Provider value={{ isLoggedIn, isAnonymous, userName, login, logout, continueAnonymously }}>
      {children}
    </AuthContext.Provider>
  );
  
};