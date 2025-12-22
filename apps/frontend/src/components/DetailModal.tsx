import './Panel.css';

type Props = {
  open: boolean;
  name: string;
  description?: string | null;
  kind: string;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function DetailModal({ open, name, description, kind, onClose, onEdit, onDelete }: Props) {
  if (!open) return null;
  return (
    <div className="confirm-backdrop">
      <div className="detail-modal glass">
        <div className="detail-header">
          <div className="detail-kind">{kind}</div>
          <button className="ghost" onClick={onClose}>Fermer</button>
        </div>
        <div className="detail-title">{name}</div>
        {description && <div className="detail-desc">{description}</div>}
        <div className="detail-actions">
          {onEdit && <button className="ghost" onClick={onEdit}>Éditer</button>}
          {onDelete && <button className="danger" onClick={onDelete}>Supprimer</button>}
        </div>
      </div>
    </div>
  );
}

