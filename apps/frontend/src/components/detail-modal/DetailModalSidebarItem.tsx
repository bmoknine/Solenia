import type { SearchableKind } from '../../search/types';

type DetailModalSidebarItemProps = {
  kind: SearchableKind;
  entityId: string;
  name: string;
  icon: React.ReactNode;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onNavigate: () => void;
  nested?: boolean;
  className?: string;
};

/** Ligne de la sidebar détail : navigation + étoile favori. */
export function DetailModalSidebarItem({
  kind: _kind,
  entityId: _entityId,
  name,
  icon,
  isFavorite,
  onToggleFavorite,
  onNavigate,
  nested,
  className,
}: DetailModalSidebarItemProps) {
  return (
    <div
      className={[
        'detail-sidebar-item-row',
        nested ? 'detail-sidebar-item-row-nested' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button type="button" className="detail-sidebar-item ghost" onClick={onNavigate}>
        <span className="detail-sidebar-icon">{icon}</span>
        <span className="detail-sidebar-name">{name}</span>
      </button>
      <button
        type="button"
        className={`detail-sidebar-fav-btn ghost${isFavorite ? ' active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        aria-label={isFavorite ? `Retirer ${name} des favoris` : `Ajouter ${name} aux favoris`}
        title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
}
