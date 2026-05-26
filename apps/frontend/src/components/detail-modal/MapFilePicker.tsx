import { useRef, useState } from 'react';
import { getApiUrl } from '../../api/client';
import { useAuth } from '../../auth/AuthProvider';

export function MapFilePicker({
  value,
  onChange,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
}) {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${getApiUrl()}/upload/map`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? `Erreur ${res.status}`);
      }
      const data = (await res.json()) as { url: string };
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="map-file-picker">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => { void handleFileChange(e); }}
      />
      <div className="map-file-picker-row">
        <button
          type="button"
          className="ghost map-file-picker-btn"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Envoi en cours…' : '📂 Choisir une image'}
        </button>
        {value && (
          <button
            type="button"
            className="ghost map-file-picker-clear"
            onClick={() => onChange(null)}
            title="Supprimer la carte"
          >
            ✕
          </button>
        )}
      </div>
      {value && (
        <span className="map-file-picker-url" title={value}>
          {value.split('/').pop()}
        </span>
      )}
      {error && <span className="map-file-picker-error">{error}</span>}
    </div>
  );
}
