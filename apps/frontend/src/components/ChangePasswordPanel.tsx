import { FormEvent, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import './Panel.css';

export function ChangePasswordPanel() {
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValid = () => {
    if (newPassword.length < 8) return 'Nouveau mot de passe : 8 caractères minimum';
    if (oldPassword.length < 1) return 'Ancien mot de passe requis';
    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const validation = isValid();
    if (validation) {
      setError(validation);
      return;
    }
    try {
      await changePassword(oldPassword, newPassword);
      setMessage('Mot de passe changé.');
      setOldPassword('');
      setNewPassword('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors du changement';
      setError(message);
    }
  };

  return (
    <form className="panel glass" onSubmit={onSubmit}>
      <h3>Changer le mot de passe</h3>
      <label>
        Ancien mot de passe
        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
      </label>
      <label>
        Nouveau mot de passe
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </label>
      {message && <div className="panel-success">{message}</div>}
      {error && <div className="panel-error">{error}</div>}
      <button type="submit">Valider</button>
    </form>
  );
}

