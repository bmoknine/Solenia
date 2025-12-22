import { useMemo, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import type { MapPoint } from '../api/map';
import './MapView.css';

type Props = {
  points: MapPoint[];
  backgroundUrl?: string;
  canEdit?: boolean;
  onDelete?: (point: MapPoint) => Promise<void>;
  onMove?: (point: MapPoint, x: number, y: number) => Promise<void>;
  onEdit?: (point: MapPoint) => void;
};

const kindColor: Record<MapPoint['kind'], string> = {
  kingdom: '#f4b400',
  city: '#1a73e8',
  place: '#34a853',
  person: '#d93025',
  unknown: '#9aa0a6',
};

export function MapView({
  points,
  backgroundUrl = '/map.jpg',
  canEdit = false,
  onDelete,
  onMove,
  onEdit,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const selected = useMemo(
    () => points.find((p) => p.id === selectedId) ?? null,
    [points, selectedId],
  );

  return (
    <div className="map-shell">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={2.5}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="map-toolbar">
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>Reset</button>
            </div>
            <TransformComponent wrapperClass="map-wrapper" contentClass="map-content">
              <div
                className="map-canvas"
              >
                <img src={backgroundUrl} alt="Carte" className="map-image" />
                {points.map((p) => (
                  <button
                    key={p.id}
                    className="map-pin"
                    style={{
                      left: `${p.x * 100}%`,
                      top: `${p.y * 100}%`,
                      background: kindColor[p.kind],
                    }}
                    title={`${p.name} (${p.kind})`}
                    onClick={() => setSelectedId(p.id)}
                    draggable={canEdit && Boolean(onMove)}
                    onDragStart={(e) => {
                      if (!canEdit || !onMove) return;
                      setDraggingId(p.id);
                      e.dataTransfer.setData('text/plain', p.id);
                    }}
                    onDragEnd={() => {
                      if (!canEdit || !onMove) return;
                      setDraggingId(null);
                    }}
                  />
                ))}
                {canEdit && onMove && draggingId && (
                  <div
                    className="map-dropzone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const id = draggingId;
                      if (!id) return;
                      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                      const x = (e.clientX - rect.left) / rect.width;
                      const y = (e.clientY - rect.top) / rect.height;
                      const point = points.find((pt) => pt.id === id);
                      if (!point) return;
                      setBusy(true);
                      setError(null);
                      try {
                        await onMove(point, x, y);
                        setSelectedId(point.id);
                      } catch (err) {
                        const message = err instanceof Error ? err.message : 'Erreur';
                        setError(message);
                      } finally {
                        setBusy(false);
                        setDraggingId(null);
                      }
                    }}
                  />
                )}
                {selected && (
                  <div
                    className="map-popover glass"
                    style={{ left: `${selected.x * 100}%`, top: `${selected.y * 100}%` }}
                  >
                    <div className="popover-header">
                      <div className="popover-kind">{selected.kind}</div>
                      <button className="popover-close" onClick={() => setSelectedId(null)}>
                        ×
                      </button>
                    </div>
                    <div className="popover-title">{selected.name}</div>
                    {selected.description && (
                      <div className="popover-desc">{selected.description}</div>
                    )}
                    {error && <div className="popover-error">{error}</div>}
                    {canEdit && onDelete && (
                      <div className="popover-actions">
                        {onEdit && (
                          <button
                            className="ghost"
                            disabled={busy}
                            onClick={() => {
                              if (selected) onEdit(selected);
                            }}
                          >
                            Éditer
                          </button>
                        )}
                        <button
                          className="danger"
                          disabled={busy}
                          onClick={async () => {
                            if (!selected) return;
                            setBusy(true);
                            setError(null);
                            try {
                              await onDelete(selected);
                              setSelectedId(null);
                            } catch (err) {
                              const message = err instanceof Error ? err.message : 'Erreur';
                              setError(message);
                            } finally {
                              setBusy(false);
                            }
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

