import { useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { FamilyMember, SubOrganisation } from '../../api/family';
import { layoutFamilyTree, layoutOrgChart, NODE_W, type LayoutResult } from './familyTreeLayout';
import './FamilyTree.css';

export type TreeMode = 'genealogy' | 'orgchart';

type Props = {
  members: FamilyMember[];
  /** `genealogy` : filiation et couples. `orgchart` : chaîne de commandement. */
  mode?: TreeMode;
  /** Organisation racine — requise en mode organigramme. */
  organisation?: { id: string; name: string };
  /** Sous-organisations affichées comme nœuds (mode organigramme). */
  subOrganisations?: SubOrganisation[];
  /** `full` : pan/zoom + édition. `preview` : miniature auto-ajustée, non interactive. */
  variant?: 'full' | 'preview';
  selectedId?: string | null;
  onSelect?: (member: FamilyMember) => void;
  /** Double-clic sur un nœud lié à un PNJ/PJ : ouvrir sa fiche. */
  onOpenEntity?: (member: FamilyMember) => void;
  /** Clic sur un nœud de sous-organisation : ouvrir sa fiche. */
  onOpenOrganisation?: (org: { id: string; name: string }) => void;
  /** Clic sur la miniature — mode `preview` uniquement. */
  onOpenFull?: () => void;
};

/** Tronque un libellé pour qu'il tienne dans la boîte. */
function fit(label: string, max: number) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

/** Contenu SVG partagé par les deux variantes et les deux modes. */
function TreeShapes({
  layout,
  interactive,
  selectedId,
  onSelect,
  onOpenEntity,
  onOpenOrganisation,
}: {
  layout: LayoutResult;
  interactive: boolean;
  selectedId?: string | null;
  onSelect?: (m: FamilyMember) => void;
  onOpenEntity?: (m: FamilyMember) => void;
  onOpenOrganisation?: (org: { id: string; name: string }) => void;
}) {
  return (
    <>
      {layout.links.map((d, i) => (
        <path key={i} className="ft-conn" d={d} />
      ))}

      {layout.nodes.map((n) => {
        const linked = n.member ? n.member.person ?? n.member.playerCharacter ?? null : null;
        const isOrgNode = !n.member && Boolean(n.organisationId);
        const classes = [
          'ft-node',
          `ft-${n.role}`,
          n.isSpouse ? 'ft-spouse' : '',
          selectedId === n.id ? 'ft-selected' : '',
          linked ? 'ft-linked' : '',
          interactive ? '' : 'ft-static',
        ]
          .filter(Boolean)
          .join(' ');

        const handleClick = () => {
          if (!interactive) return;
          if (isOrgNode) {
            if (n.role === 'suborg') onOpenOrganisation?.({ id: n.organisationId!, name: n.label });
            return;
          }
          if (n.member) onSelect?.(n.member);
        };

        const isRoot = n.role === 'org';
        return (
          <g
            key={n.id}
            className={classes}
            onClick={handleClick}
            onDoubleClick={interactive && n.member && linked ? () => onOpenEntity?.(n.member!) : undefined}
          >
            <rect className="ft-box" x={n.x} y={n.y} width={n.w} height={n.h} rx={6} />
            <text className="ft-name" x={n.x + n.w / 2} y={n.y + 24} textAnchor="middle">
              {fit(n.label, isRoot ? 28 : 17)}
            </text>
            {n.subtitle && (
              <text className="ft-title" x={n.x + n.w / 2} y={n.y + 44} textAnchor="middle">
                {fit(n.subtitle, isRoot ? 32 : 20)}
              </text>
            )}
            {linked && interactive && (
              <circle className="ft-link-dot" cx={n.x + n.w - 10} cy={n.y + 10} r={3.5}>
                <title>{`Lié à ${linked.name} — double-clic pour ouvrir`}</title>
              </circle>
            )}
          </g>
        );
      })}
    </>
  );
}

export function FamilyTree({
  members,
  mode = 'genealogy',
  organisation,
  subOrganisations = [],
  variant = 'full',
  selectedId,
  onSelect,
  onOpenEntity,
  onOpenOrganisation,
  onOpenFull,
}: Props) {
  const layout = useMemo(
    () =>
      mode === 'orgchart' && organisation
        ? layoutOrgChart(members, subOrganisations, organisation)
        : layoutFamilyTree(members),
    [members, mode, organisation, subOrganisations],
  );

  const isEmpty = layout.nodes.length === 0 || (mode === 'orgchart' && members.length === 0 && subOrganisations.length === 0);
  const noun = mode === 'orgchart' ? 'organigramme' : 'arbre';

  // ── Miniature : SVG auto-ajusté via viewBox, sans pan/zoom ──────────
  if (variant === 'preview') {
    if (isEmpty) return null;
    return (
      <button type="button" className="ft-preview" onClick={onOpenFull} title={`Ouvrir l’${noun}`}>
        <svg
          className="ft-svg"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          height="100%"
        >
          <TreeShapes layout={layout} interactive={false} />
        </svg>
        <span className="ft-preview-hint">
          {members.length} membre{members.length > 1 ? 's' : ''}
          {subOrganisations.length > 0 && ` · ${subOrganisations.length} sous-org.`} · cliquer pour ouvrir
        </span>
      </button>
    );
  }

  if (isEmpty) {
    return (
      <div className="ft-empty">
        Aucun membre dans cet {noun}. Utilisez « + Membre » pour commencer.
      </div>
    );
  }

  return (
    <div className="ft-canvas">
      <TransformWrapper minScale={0.2} maxScale={2} centerOnInit limitToBounds={false}>
        <TransformComponent wrapperClass="ft-transform-wrapper" contentClass="ft-transform-content">
          <svg
            className="ft-svg"
            width={layout.width}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
          >
            <TreeShapes
              layout={layout}
              interactive
              selectedId={selectedId}
              onSelect={onSelect}
              onOpenEntity={onOpenEntity}
              onOpenOrganisation={onOpenOrganisation}
            />
          </svg>
        </TransformComponent>
      </TransformWrapper>

      <div className="ft-legend">
        {mode === 'orgchart' ? (
          <>
            <span><i className="ft-dot ft-dot-org" /> Organisation</span>
            <span><i className="ft-dot ft-dot-suborg" /> Sous-organisation</span>
            <span><i className="ft-dot ft-dot-male" /> Hommes</span>
            <span><i className="ft-dot ft-dot-female" /> Femmes</span>
            <span><i className="ft-dot ft-dot-pj" /> Personnages joueurs</span>
            <span className="ft-legend-hint">Clic = éditer · double-clic sur un nœud lié = ouvrir la fiche</span>
          </>
        ) : (
          <>
            <span><i className="ft-dot ft-dot-founder" /> Fondateurs</span>
            <span><i className="ft-dot ft-dot-male" /> Hommes</span>
            <span><i className="ft-dot ft-dot-female" /> Femmes</span>
            <span><i className="ft-dot ft-dot-pj" /> Personnages joueurs</span>
            <span className="ft-legend-hint">Clic = éditer · double-clic sur un nœud lié = ouvrir la fiche</span>
          </>
        )}
      </div>
    </div>
  );
}

export { NODE_W };
