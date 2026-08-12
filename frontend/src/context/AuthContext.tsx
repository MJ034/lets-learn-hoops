import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, LoginPayload, RegisterPayload, AuthStatus, AuthContextValue } from '../types/auth';
import { login as loginRequest, register as registerRequest, logout as logoutRequest, getMe } from '../services/auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');

  useEffect(() => {
    async function checkSession() {
      setStatus('loading');
      try {
        const response = await getMe();
        setUser(response.user);
        setStatus('authenticated');
      } catch {
        setUser(null);
        setStatus('unauthenticated');
      }
    }
    checkSession();
  }, []);

  async function login(payload: LoginPayload) {
    const response = await loginRequest(payload);
    setUser(response.user);
    setStatus('authenticated');
  }

  async function register(payload: RegisterPayload) {
    const response = await registerRequest(payload);
    setUser(response.user);
    setStatus('authenticated');
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
    setStatus('unauthenticated');
  }

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}