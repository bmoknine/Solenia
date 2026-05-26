import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export function ImageLightbox({ src, alt, onClose }: { src: string; alt?: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return createPortal(
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Fermer"
      >
        ✕
      </button>
      <img
        className="lightbox-image"
        src={src}
        alt={alt ?? 'Carte'}
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body,
  );
}

export function MapThumbnail({ src, alt, onClick }: { src: string; alt?: string; onClick?: () => void }) {
  return (
    <img
      src={src}
      alt={alt ?? 'Carte'}
      className="map-thumbnail"
      onClick={onClick}
      title="Cliquer pour agrandir"
    />
  );
}
