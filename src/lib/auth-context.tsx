'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, saveToken } from './auth';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getToken()
    console.log('Inicializando token do localStorage:', storedToken);
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      saveToken(token);
      console.log('Token salvo no localStorage:', token);
    } else {
      clearToken();
      console.log('Token removido do localStorage');
    }
  }, [token]);

  const clearToken = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}