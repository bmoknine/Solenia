import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { changePassword as apiChangePassword, fetchMe, login as apiLogin } from '../api/auth';
import { AUTH_ACCESS_KEY, AUTH_REFRESH_KEY } from './storageKeys';

type User = {
  id: string;
  email: string;
  username: string;
  type: string;
};

type AuthContextShape = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_ACCESS_KEY));
  const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem(AUTH_ACCESS_KEY));

  useEffect(() => {
    if (!token) {
      return;
    }
    let mounted = true;
    fetchMe(token)
      .then((res) => {
        if (mounted) setUser(res.user);
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem(AUTH_ACCESS_KEY);
          localStorage.removeItem(AUTH_REFRESH_KEY);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [token]);

  useEffect(() => {
    const handleTokenExpired = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem(AUTH_ACCESS_KEY);
      localStorage.removeItem(AUTH_REFRESH_KEY);
    };

    const handleTokenRefreshed = (e: Event) => {
      const d = (e as CustomEvent<{ accessToken: string; refreshToken: string }>).detail;
      if (d?.accessToken) {
        setToken(d.accessToken);
        localStorage.setItem(AUTH_ACCESS_KEY, d.accessToken);
        if (d.refreshToken) {
          localStorage.setItem(AUTH_REFRESH_KEY, d.refreshToken);
        }
      }
    };

    window.addEventListener('auth:token-expired', handleTokenExpired);
    window.addEventListener('auth:token-refreshed', handleTokenRefreshed);
    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
      window.removeEventListener('auth:token-refreshed', handleTokenRefreshed);
    };
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setToken(res.accessToken);
    localStorage.setItem(AUTH_ACCESS_KEY, res.accessToken);
    localStorage.setItem(AUTH_REFRESH_KEY, res.refreshToken);
    setUser(res.user);
  }, []);

  const handleLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_ACCESS_KEY);
    localStorage.removeItem(AUTH_REFRESH_KEY);
  }, []);

  const handleChangePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    if (!token) throw new Error('Non authentifié');
    await apiChangePassword(token, oldPassword, newPassword);
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login: handleLogin,
      logout: handleLogout,
      changePassword: handleChangePassword,
    }),
    [user, token, loading, handleLogin, handleLogout, handleChangePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

