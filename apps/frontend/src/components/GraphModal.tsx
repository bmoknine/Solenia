import { useEffect, useRef, useState, useCallback } from 'react';
import ForceGraph2D from 'force-graph';
import { fetchGraph, type GraphData, type GraphNode } from '../api/graph';
import './GraphModal.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onSelectPerson?: (id: string) => void;
  onSelectOrg?: (id: string) => void;
};

const membershipColors: Record<string, string> = {
  POLITIC:     '#60a5fa',
  RELIGEUX:    '#f59e0b',
  MARCHAND:    '#34d399',
  MILITAIRE:   '#f87171',
  CRIMINALITE: '#a78bfa',
  OTHER:       '#94a3b8',
};

const breedColors: Record<string, string> = {
  HUMAIN:    '#e2e8f0',
  ELFE:      '#86efac',
  DEMI_ELFE: '#6ee7b7',
  NAIN:      '#fbbf24',
  HALFELIN:  '#fb923c',
  DEMI_ORC:  '#a3e635',
  TIEFFELIN: '#f472b6',
  GNOME:     '#67e8f9',
};

function nodeColor(node: GraphNode): string {
  if (node.type === 'organisation') {
    return membershipColors[node.membership ?? 'OTHER'] ?? '#94a3b8';
  }
  return breedColors[node.breed ?? 'HUMAIN'] ?? '#e2e8f0';
}

type Filter = {
  showPersons: boolean;
  showOrgs: boolean;
  membership: string;
  search: string;
};

export function GraphModal({ open, onClose, onSelectPerson, onSelectOrg }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ReturnType<typeof ForceGraph2D> | null>(null);
  const [rawData, setRawData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>({
    showPersons: true,
    showOrgs: true,
    membership: 'ALL',
    search: '',
  });
  const [hovered, setHovered] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetchGraph()
      .then(setRawData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Erreur'))
      .finally(() => setLoading(false));
  }, [open]);

  const filteredData = useCallback((): GraphData => {
    if (!rawData) return { nodes: [], links: [] };

    const q = filter.search.toLowerCase().trim();

    const visibleNodes = rawData.nodes.filter((n) => {
      if (n.type === 'person' && !filter.showPersons) return false;
      if (n.type === 'organisation' && !filter.showOrgs) return false;
      if (filter.membership !== 'ALL' && n.type === 'organisation' && n.membership !== filter.membership) return false;
      if (q && !n.label.toLowerCase().includes(q)) return false;
      return true;
    });

    const visibleIds = new Set(visibleNodes.map((n) => n.id));

    const visibleLinks = rawData.links.filter(
      (l) => visibleIds.has(l.source as string) && visibleIds.has(l.target as string),
    );

    return { nodes: visibleNodes, links: visibleLinks };
  }, [rawData, filter]);

  useEffect(() => {
    if (!open || !containerRef.current || loading || error) return;

    const data = filteredData();
    const el = containerRef.current;
    const width = el.clientWidth;
    const height = el.clientHeight;

    if (!graphRef.current) {
      graphRef.current = ForceGraph2D()(el)
        .width(width)
        .height(height)
        .backgroundColor('transparent')
        .nodeLabel('label')
        .nodeColor((n) => nodeColor(n as GraphNode))
        .nodeRelSize(5)
        .linkColor((l) => (l as { type: string }).type === 'hierarchy' ? 'rgba(251,191,36,0.5)' : 'rgba(148,163,184,0.35)')
        .linkDirectionalArrowLength(4)
        .linkDirectionalArrowRelPos(1)
        .onNodeHover((n) => setHovered(n ? (n as GraphNode) : null))
        .onNodeClick((n) => {
          const node = n as GraphNode;
          if (node.type === 'person') onSelectPerson?.(node.targetId);
          else onSelectOrg?.(node.targetId);
        })
        .nodeCanvasObject((node, ctx, globalScale) => {
          const n = node as GraphNode & { x?: number; y?: number };
          const x = n.x ?? 0;
          const y = n.y ?? 0;
          const r = n.type === 'organisation' ? 7 : 5;
          ctx.beginPath();
          if (n.type === 'organisation') {
            const s = r * 1.3;
            ctx.moveTo(x, y - s);
            ctx.lineTo(x + s, y);
            ctx.lineTo(x, y + s);
            ctx.lineTo(x - s, y);
            ctx.closePath();
          } else {
            ctx.arc(x, y, r, 0, 2 * Math.PI);
          }
          ctx.fillStyle = nodeColor(n);
          ctx.fill();

          const label = n.label;
          const fontSize = Math.max(10 / globalScale, 3);
          ctx.font = `${fontSize}px sans-serif`;
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.textAlign = 'center';
          ctx.fillText(label, x, y + r + fontSize + 1);
        });
    }

    graphRef.current.graphData(data);
  }, [open, loading, error, filteredData, onSelectPerson, onSelectOrg]);

  useEffect(() => {
    if (!open && graphRef.current) {
      graphRef.current._destructor?.();
      graphRef.current = null;
    }
  }, [open]);

  if (!open) return null;

  const memberships = rawData
    ? ['ALL', ...new Set(rawData.nodes.filter((n) => n.type === 'organisation' && n.membership).map((n) => n.membership!))]
    : ['ALL'];

  const membershipLabels: Record<string, string> = {
    ALL: 'Toutes affiliations',
    POLITIC: 'Politique',
    RELIGEUX: 'Religieux',
    MARCHAND: 'Marchand',
    MILITAIRE: 'Militaire',
    CRIMINALITE: 'Criminalité',
    OTHER: 'Autre',
  };

  return (
    <div className="graph-overlay" onClick={onClose}>
      <div className="graph-modal glass" onClick={(e) => e.stopPropagation()}>
        <div className="graph-header">
          <h2 className="graph-title">Graphe de relations</h2>
          <button type="button" className="detail-close ghost" onClick={onClose}>×</button>
        </div>

        <div className="graph-toolbar">
          <input
            className="graph-search detail-input"
            placeholder="Filtrer par nom…"
            value={filter.search}
            onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
          />
          <label className="graph-toggle">
            <input
              type="checkbox"
              checked={filter.showPersons}
              onChange={(e) => setFilter((f) => ({ ...f, showPersons: e.target.checked }))}
            />
            Personnages
          </label>
          <label className="graph-toggle">
            <input
              type="checkbox"
              checked={filter.showOrgs}
              onChange={(e) => setFilter((f) => ({ ...f, showOrgs: e.target.checked }))}
            />
            Organisations
          </label>
          <select
            className="graph-select detail-input"
            value={filter.membership}
            onChange={(e) => setFilter((f) => ({ ...f, membership: e.target.value }))}
          >
            {memberships.map((m) => (
              <option key={m} value={m}>{membershipLabels[m] ?? m}</option>
            ))}
          </select>
        </div>

        <div className="graph-legend">
          <span className="graph-legend-item"><span className="graph-legend-circle" style={{ background: '#e2e8f0' }} />Humain</span>
          <span className="graph-legend-item"><span className="graph-legend-circle" style={{ background: '#86efac' }} />Elfe/Demi-elfe</span>
          <span className="graph-legend-item"><span className="graph-legend-circle" style={{ background: '#fbbf24' }} />Nain</span>
          <span className="graph-legend-item"><span className="graph-legend-circle" style={{ background: '#f472b6' }} />Tieffelin</span>
          <span className="graph-legend-item"><span className="graph-legend-diamond" style={{ background: '#60a5fa' }} />Politique</span>
          <span className="graph-legend-item"><span className="graph-legend-diamond" style={{ background: '#34d399' }} />Marchand</span>
          <span className="graph-legend-item"><span className="graph-legend-diamond" style={{ background: '#a78bfa' }} />Criminalité</span>
          <span className="graph-legend-item"><span className="graph-legend-diamond" style={{ background: '#f87171' }} />Militaire</span>
        </div>

        <div className="graph-container" ref={containerRef}>
          {loading && <div className="graph-loading">Chargement du graphe…</div>}
          {error && <div className="graph-error">{error}</div>}
        </div>

        {hovered && (
          <div className="graph-tooltip glass">
            <strong>{hovered.label}</strong>
            <span className="graph-tooltip-kind">
              {hovered.type === 'person' ? (hovered.breed ?? 'Personnage') : (hovered.membership ?? 'Organisation')}
            </span>
            {(onSelectPerson || onSelectOrg) && (
              <span className="graph-tooltip-hint">Cliquer pour ouvrir</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
