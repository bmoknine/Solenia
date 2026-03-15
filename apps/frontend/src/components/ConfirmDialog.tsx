import './Panel.css';

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title = 'Confirmer', message, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="confirm-backdrop">
      <div className="confirm glass">
        <h3>{title}</h3>
        {message && <p>{message}</p>}
        <div className="confirm-actions">
          <button className="ghost" onClick={onCancel}>Annuler</button>
          <button className="danger glass" onClick={onConfirm}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}

