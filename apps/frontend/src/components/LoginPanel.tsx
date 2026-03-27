import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../auth/AuthProvider';
import './Panel.css';

export function LoginPanel() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('admin@solenia.dev');
  const [password, setPassword] = useState('Admin!123');
  const [error, setError] = useState<string | null>(null);

  const isValid = () => {
    if (!email.includes('@')) return 'Email invalide';
    if (password.length < 1) return 'Mot de passe requis';
    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const validation = isValid();
    if (validation) {
      setError(validation);
      return;
    }
    try {
      await login(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(message);
    }
  };

  return (
    <form className="panel glass" onSubmit={onSubmit}>
      <h3>Connexion</h3>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Mot de passe
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <div className="panel-error">{error}</div>}
      <button type="submit" disabled={loading}>
        Se connecter
      </button>
    </form>
  );
}

