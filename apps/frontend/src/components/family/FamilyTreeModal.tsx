import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createFamilyMember,
  deleteFamilyMember,
  fetchFamilyTree,
  updateFamilyMember,
  type FamilyMember,
  type FamilyMemberInput,
  type FamilySex,
  type SubOrganisation,
} from '../../api/family';
import { listPersons, listPlayerCharacters } from '../../api/entities';
import { SearchableSelect } from '../detail-modal/SearchableSelect';
import { useToast } from '../../toast/ToastProvider';
import { FamilyTree } from './FamilyTree';
import './FamilyTree.css';

type Props = {
  open: boolean;
  organisationId: string | null;
  organisationName: string;
  token: string | null;
  canEdit: boolean;
  onClose: () => void;
  /** Ouvrir la fiche du PNJ / PJ lié à un nœud. */
  onOpenEntity?: (member: FamilyMember) => void;
  /** Ouvrir la fiche d'une sous-organisation depuis l'organigramme. */
  onOpenOrganisation?: (org: { id: string; name: string }) => void;
};

const SEXES: { value: FamilySex; label: string }[] = [
  { value: 'MAN', label: 'Homme' },
  { value: 'WOMAN', label: 'Femme' },
  { value: 'OTHER', label: 'Autre' },
];

export function FamilyTreeModal({
  open,
  organisationId,
  organisationName,
  token,
  canEdit,
  onClose,
  onOpenEntity,
  onOpenOrganisation,
}: Props) {
  const { push } = useToast();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [subOrgs, setSubOrgs] = useState<SubOrganisation[]>([]);
  const [orgType, setOrgType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<FamilyMember | null>(null);
  const [persons, setPersons] = useState<{ id: string; name: string }[]>([]);
  const [pcs, setPcs] = useState<{ id: string; name: string }[]>([]);

  const reload = useCallback(async () => {
    if (!organisationId) return;
    setLoading(true);
    try {
      const tree = await fetchFamilyTree(organisationId);
      setMembers(tree.members);
      setSubOrgs(tree.subOrganisations ?? []);
      setOrgType(tree.organisation?.organisationType ?? null);
      // Prévient la fiche ouverte dessous pour qu'elle rafraîchisse son aperçu.
      window.dispatchEvent(new CustomEvent('family-tree-updated', { detail: { organisationId } }));
    } catch (e) {
      push(e instanceof Error ? e.message : 'Chargement de l’arbre échoué', 'error');
    } finally {
      setLoading(false);
    }
  }, [organisationId, push]);

  useEffect(() => {
    if (open) void reload();
  }, [open, reload]);

  useEffect(() => {
    if (!open) return;
    listPersons().then((l) => setPersons(l.map((p) => ({ id: p.id, name: p.name })))).catch(() => {});
    listPlayerCharacters().then((l) => setPcs(l.map((p) => ({ id: p.id, name: p.name })))).catch(() => {});
  }, [open]);

  // Synchronise le brouillon avec la sélection
  useEffect(() => {
    setDraft(members.find((m) => m.id === selectedId) ?? null);
  }, [selectedId, members]);

  const others = useMemo(
    () => members.filter((m) => m.id !== selectedId).map((m) => ({ id: m.id, name: m.name })),
    [members, selectedId],
  );

  if (!open || !organisationId) return null;

  const isFamily = orgType === 'FAMILLE';
  const mode = isFamily ? 'genealogy' : 'orgchart';
  const titreOutil = isFamily ? 'Arbre généalogique' : 'Organigramme';

  const patch = (p: Partial<FamilyMember>) => setDraft((d) => (d ? { ...d, ...p } : d));

  const handleAdd = async () => {
    try {
      const created = await createFamilyMember(token, organisationId, { name: 'Nouveau membre' });
      await reload();
      setSelectedId(created.id);
      push('Membre ajouté', 'success');
    } catch (e) {
      push(e instanceof Error ? e.message : 'Ajout échoué', 'error');
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    const data: FamilyMemberInput = {
      name: draft.name,
      title: draft.title ?? null,
      personId: draft.personId ?? null,
      playerCharacterId: draft.playerCharacterId ?? null,
      fatherId: draft.fatherId ?? null,
      motherId: draft.motherId ?? null,
      spouseId: draft.spouseId ?? null,
      superiorId: draft.superiorId ?? null,
      sex: draft.sex ?? null,
      isFounder: draft.isFounder,
      generation: draft.generation ?? null,
      order: draft.order,
      notes: draft.notes ?? null,
      isForDM: draft.isForDM,
    };
    try {
      await updateFamilyMember(token, draft.id, data);
      await reload();
      push('Membre enregistré', 'success');
    } catch (e) {
      push(e instanceof Error ? e.message : 'Enregistrement échoué', 'error');
    }
  };

  const handleDelete = async () => {
    if (!draft) return;
    try {
      await deleteFamilyMember(token, draft.id);
      setSelectedId(null);
      await reload();
      push('Membre supprimé', 'success');
    } catch (e) {
      push(e instanceof Error ? e.message : 'Suppression échouée', 'error');
    }
  };

  return (
    <div className="family-modal-backdrop" onClick={onClose}>
      <div className="family-modal glass" onClick={(e) => e.stopPropagation()}>
        <div className="family-modal-header">
          <span className="family-modal-title">{titreOutil} — {organisationName}</span>
          {loading && <span className="gm-hint">Chargement…</span>}
          {canEdit && (
            <button className="primary" onClick={handleAdd}>+ Membre</button>
          )}
          <button className="ghost" onClick={onClose}>Fermer</button>
        </div>

        <div className="family-modal-body">
          <FamilyTree
            members={members}
            mode={mode}
            organisation={{ id: organisationId, name: organisationName }}
            subOrganisations={subOrgs}
            selectedId={selectedId}
            onSelect={(m) => setSelectedId(m.id)}
            onOpenEntity={onOpenEntity}
            onOpenOrganisation={onOpenOrganisation}
          />

          {canEdit && (
            <div className="family-editor">
              {!draft ? (
                <>
                  <h4>Édition</h4>
                  <p className="family-editor-hint">
                    Cliquez un nœud pour le modifier, ou utilisez « + Membre » pour en ajouter un.
                    Un membre peut être un simple nom ou être lié à un PNJ / PJ existant.
                    {isFamily
                      ? ' Reliez-les par père, mère et conjoint.'
                      : ' Donnez-leur un supérieur pour dessiner la chaîne de commandement ; sans supérieur, ils dépendent directement de l’organisation.'}
                  </p>
                </>
              ) : (
                <>
                  <h4>{draft.name}</h4>

                  <label className="family-field">
                    <span>Nom</span>
                    <input type="text" value={draft.name} onChange={(e) => patch({ name: e.target.value })} />
                  </label>

                  <label className="family-field">
                    <span>Mention (sous le nom)</span>
                    <input
                      type="text"
                      value={draft.title ?? ''}
                      placeholder="Fondateur, Grand-père, ★ PJ…"
                      onChange={(e) => patch({ title: e.target.value || null })}
                    />
                  </label>

                  <label className="family-field">
                    <span>Sexe (couleur du nœud)</span>
                    <select
                      value={draft.sex ?? ''}
                      onChange={(e) => patch({ sex: (e.target.value || null) as FamilySex | null })}
                    >
                      <option value="">—</option>
                      {SEXES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </label>

                  {isFamily ? (
                    <>
                      <div className="family-field">
                        <span>Père</span>
                        <SearchableSelect items={others} selectedId={draft.fatherId ?? null} onSelect={(id) => patch({ fatherId: id })} placeholder="Aucun" />
                      </div>
                      <div className="family-field">
                        <span>Mère</span>
                        <SearchableSelect items={others} selectedId={draft.motherId ?? null} onSelect={(id) => patch({ motherId: id })} placeholder="Aucune" />
                      </div>
                      <div className="family-field">
                        <span>Conjoint</span>
                        <SearchableSelect items={others} selectedId={draft.spouseId ?? null} onSelect={(id) => patch({ spouseId: id })} placeholder="Aucun" />
                      </div>
                    </>
                  ) : (
                    <div className="family-field">
                      <span>Supérieur hiérarchique</span>
                      <SearchableSelect items={others} selectedId={draft.superiorId ?? null} onSelect={(id) => patch({ superiorId: id })} placeholder="Aucun (dépend directement de l’organisation)" />
                    </div>
                  )}

                  <div className="family-field">
                    <span>Lier à un PNJ</span>
                    <SearchableSelect items={persons} selectedId={draft.personId ?? null} onSelect={(id) => patch({ personId: id })} placeholder="Aucun" />
                  </div>
                  <div className="family-field">
                    <span>Lier à un PJ</span>
                    <SearchableSelect items={pcs} selectedId={draft.playerCharacterId ?? null} onSelect={(id) => patch({ playerCharacterId: id })} placeholder="Aucun" />
                  </div>

                  {isFamily && (
                    <label className="family-field">
                      <span>Génération forcée (vide = calculée)</span>
                      <input
                        type="number"
                        value={draft.generation ?? ''}
                        onChange={(e) => patch({ generation: e.target.value === '' ? null : Number(e.target.value) })}
                      />
                    </label>
                  )}

                  <label className="family-field">
                    <span>Ordre horizontal</span>
                    <input type="number" value={draft.order} onChange={(e) => patch({ order: Number(e.target.value) || 0 })} />
                  </label>

                  {isFamily && (
                    <label className="family-field-inline">
                      <input type="checkbox" checked={draft.isFounder} onChange={(e) => patch({ isFounder: e.target.checked })} />
                      Fondateur (nœud doré)
                    </label>
                  )}
                  <label className="family-field-inline">
                    <input type="checkbox" checked={draft.isForDM} onChange={(e) => patch({ isForDM: e.target.checked })} />
                    Réservé au MJ
                  </label>

                  <label className="family-field">
                    <span>Notes</span>
                    <textarea rows={3} value={draft.notes ?? ''} onChange={(e) => patch({ notes: e.target.value || null })} />
                  </label>

                  <div className="family-editor-actions">
                    <button className="primary" onClick={handleSave}>Enregistrer</button>
                    <button className="ghost" onClick={() => setSelectedId(null)}>Désélectionner</button>
                    <button className="ghost family-danger" onClick={handleDelete}>Supprimer</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
