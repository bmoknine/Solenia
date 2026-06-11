import { useEffect, useState } from 'react';
import type { NavigablePoint } from '../../../api/map';
import type {
  AbilityKey,
  City,
  District,
  Kingdom,
  Place,
  PlayerCharacterDetail,
  PlayerCharacterEquipmentItem,
  PlayerCharacterSkill,
  PlayerCharacterSavingThrow,
  PlayerCharacterSpell,
} from '../../../api/entities';
import { listCities, listDistricts, listKingdoms, listPlaces } from '../../../api/entities';
import { SearchableSelect } from '../SearchableSelect';
import { ALIGNMENT_OPTIONS, BREED_OPTIONS, DND_CLASS_OPTIONS } from '../entityOptions';
import { formatAlignment, formatBreed, formatDnDClass } from '../entityFormatters';
import type { EditState, PlayerCharacterEditState } from '../detailModalTypes';
import { createMapPointFromRef } from '../createMapPointFromRef';
import { MapFilePicker } from '../MapFilePicker';
import { ImageLightbox } from '../ImageLightbox';

const ABILITY_LABELS: { key: AbilityKey; label: string }[] = [
  { key: 'STR', label: 'FOR' },
  { key: 'DEX', label: 'DEX' },
  { key: 'CON', label: 'CON' },
  { key: 'INT', label: 'INT' },
  { key: 'WIS', label: 'SAG' },
  { key: 'CHA', label: 'CHA' },
];

import { DND_SKILLS, proficiencyBonus, abilityMod, skillBonus, formatBonus } from '../dndConstants';

function StatInput({
  label,
  statKey,
  value,
  editMode,
  onChange,
}: {
  label: string;
  statKey: string;
  value: number | undefined;
  editMode: boolean;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <div className="stat-item">
      <span className="stat-label">{label}</span>
      {editMode ? (
        <input
          className="detail-input stat-input"
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(statKey, e.target.value === '' ? undefined : Number(e.target.value))}
        />
      ) : (
        <span className="stat-value">{value ?? '—'}</span>
      )}
    </div>
  );
}

function NumberInput({
  label,
  fieldKey,
  value,
  editMode,
  onChange,
  min,
}: {
  label: string;
  fieldKey: string;
  value: number | null | undefined;
  editMode: boolean;
  onChange: (key: string, value: unknown) => void;
  min?: number;
}) {
  return (
    <div className="stat-item">
      <span className="stat-label">{label}</span>
      {editMode ? (
        <input
          className="detail-input stat-input"
          type="number"
          min={min}
          value={value ?? ''}
          onChange={(e) => onChange(fieldKey, e.target.value === '' ? null : Number(e.target.value))}
          placeholder="—"
        />
      ) : (
        <span className="stat-value">{value ?? '—'}</span>
      )}
    </div>
  );
}

export function PlayerCharacterView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
}: {
  data: PlayerCharacterDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
}) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const pcEdit = editState as PlayerCharacterEditState;

  useEffect(() => {
    if (editMode) {
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const [k, c, d, p] = await Promise.all([listKingdoms(), listCities(), listDistricts(), listPlaces()]);
          setKingdoms(k);
          setCities(c);
          setDistricts(d);
          setPlaces(p);
        } catch {
          setKingdoms([]);
          setCities([]);
          setDistricts([]);
          setPlaces([]);
        } finally {
          setLoadingLists(false);
        }
      };
      void loadLists();
    }
  }, [editMode]);

  const skills: PlayerCharacterSkill[] = (editMode ? (pcEdit?.skills ?? []) : (data?.skills ?? []));
  const savingThrows: PlayerCharacterSavingThrow[] = (editMode ? (pcEdit?.savingThrows ?? []) : (data?.savingThrows ?? []));
  const equipment: PlayerCharacterEquipmentItem[] = (editMode ? (pcEdit?.equipment ?? []) : (data?.equipment ?? []));
  const spells: PlayerCharacterSpell[] = (editMode ? (pcEdit?.spells ?? []) : (data?.spells ?? []));

  const updateListItem = <T extends object>(listKey: string, list: T[], index: number, field: keyof T, value: unknown) => {
    const updated = list.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(listKey, updated);
  };

  const addListItem = <T extends object>(listKey: string, list: T[], newItem: T) => {
    onChange(listKey, [...list, newItem]);
  };

  const removeListItem = <T extends object>(listKey: string, list: T[], index: number) => {
    onChange(listKey, list.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="detail-item" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          {editMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                border: '2px solid #ff9800', overflow: 'hidden',
                background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {pcEdit?.imageUrl
                  ? <img src={pcEdit.imageUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 32 }}>🎮</span>}
              </div>
              <MapFilePicker
                value={pcEdit?.imageUrl ?? null}
                onChange={(url) => onChange('imageUrl', url)}
              />
            </div>
          ) : data?.imageUrl ? (
            <div
              style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid #ff9800', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setLightboxSrc(data.imageUrl!)}
              title="Agrandir l'avatar"
            >
              <img src={data.imageUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid #ff9800', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              🎮
            </div>
          )}
        </div>

        {/* Nom */}
        <div className="detail-item" style={{ flex: 1, margin: 0 }}>
          <span className="detail-label">Nom</span>
          {editMode ? (
            <input
              className="detail-input"
              value={pcEdit?.name ?? ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Nom du personnage"
            />
          ) : (
            <span className="detail-value">{valueOrDash(data?.name)}</span>
          )}
        </div>
      </div>

      {lightboxSrc && <ImageLightbox src={lightboxSrc} alt={`Avatar de ${data?.name ?? 'ce personnage'}`} onClose={() => setLightboxSrc(null)} />}

      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Classe</span>
          {editMode ? (
            <select
              className="detail-input"
              value={pcEdit?.class ?? ''}
              onChange={(e) => onChange('class', e.target.value === '' ? null : e.target.value)}
            >
              <option value="">—</option>
              {DND_CLASS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatDnDClass(opt)}
                </option>
              ))}
            </select>
          ) : (
            <span className="detail-value">{formatDnDClass(data?.class) ?? '—'}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Niveau</span>
          {editMode ? (
            <input
              className="detail-input stat-input"
              type="number"
              min={1}
              max={20}
              value={pcEdit?.level ?? 1}
              onChange={(e) => onChange('level', Number(e.target.value))}
            />
          ) : (
            <span className="detail-value">{data?.level ?? 1}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Race</span>
          {editMode ? (
            <select
              className="detail-input"
              value={pcEdit?.race ?? ''}
              onChange={(e) => onChange('race', e.target.value === '' ? null : e.target.value)}
            >
              <option value="">—</option>
              {BREED_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatBreed(opt)}
                </option>
              ))}
            </select>
          ) : (
            <span className="detail-value">{formatBreed(data?.race) ?? '—'}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Alignement</span>
          {editMode ? (
            <select
              className="detail-input"
              value={pcEdit?.alignment ?? ''}
              onChange={(e) => onChange('alignment', e.target.value === '' ? null : e.target.value)}
            >
              <option value="">—</option>
              {ALIGNMENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatAlignment(opt)}
                </option>
              ))}
            </select>
          ) : (
            <span className="detail-value">{formatAlignment(data?.alignment) ?? '—'}</span>
          )}
        </div>
        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
          <span className="detail-label">Background</span>
          {editMode ? (
            <input
              className="detail-input"
              value={pcEdit?.background ?? ''}
              onChange={(e) => onChange('background', e.target.value === '' ? null : e.target.value)}
              placeholder="Ex : Soldats, Noble, Sage..."
            />
          ) : (
            <span className="detail-value">{valueOrDash(data?.background)}</span>
          )}
        </div>
      </div>

      <div className="detail-item">
        <span className="detail-label">Description</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={pcEdit?.description ?? ''}
            onChange={(e) => onChange('description', e.target.value === '' ? null : e.target.value)}
            placeholder="Description du personnage"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.description)}</p>
        )}
      </div>

      <div className="detail-section">
        <h3>Combat</h3>
        <div className="stats-grid">
          <NumberInput label="PV" fieldKey="pv" value={editMode ? pcEdit?.pv : data?.pv} editMode={editMode} onChange={onChange} min={0} />
          <NumberInput label="PV max" fieldKey="pvMax" value={editMode ? pcEdit?.pvMax : data?.pvMax} editMode={editMode} onChange={onChange} min={0} />
          <NumberInput label="CA" fieldKey="ca" value={editMode ? pcEdit?.ca : data?.ca} editMode={editMode} onChange={onChange} min={0} />
          <NumberInput label="Init." fieldKey="initiative" value={editMode ? pcEdit?.initiative : data?.initiative} editMode={editMode} onChange={onChange} />
          <NumberInput label="Vitesse (m)" fieldKey="speed" value={editMode ? pcEdit?.speed : data?.speed} editMode={editMode} onChange={onChange} min={0} />
        </div>
      </div>

      <div className="detail-section">
        <h3>Caractéristiques</h3>
        <div className="stats-grid">
          {ABILITY_LABELS.map((s) => (
            <StatInput
              key={s.key}
              label={s.label}
              statKey={s.key}
              value={(editMode ? pcEdit : data)?.[s.key as keyof typeof data] as number | undefined}
              editMode={editMode}
              onChange={onChange}
            />
          ))}
        </div>
      </div>

      <div className="detail-item">
        <span className="detail-label">Afficher sur la carte</span>
        {editMode ? (
          <label className="detail-checkbox-label">
            <input
              type="checkbox"
              checked={pcEdit?.showOnMap ?? true}
              onChange={(e) => onChange('showOnMap', e.target.checked)}
            />
            Oui
          </label>
        ) : (
          <span className="detail-value">{(data?.showOnMap ?? true) ? 'Oui' : 'Non'}</span>
        )}
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Royaume</span>
          {editMode ? (
            loadingLists ? <span className="detail-value">Chargement...</span> : (
              <SearchableSelect items={kingdoms} selectedId={pcEdit?.kingdomId} onSelect={(id) => onChange('kingdomId', id)} placeholder="Sélectionner un royaume" />
            )
          ) : data?.kingdom ? (
            <span className="detail-value" style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
              onClick={() => onNavigate && data.kingdom && onNavigate(createMapPointFromRef(data.kingdom, 'kingdom'))}>
              {data.kingdom.name}
            </span>
          ) : <span className="detail-value">—</span>}
        </div>
        <div className="detail-item">
          <span className="detail-label">Ville</span>
          {editMode ? (
            loadingLists ? <span className="detail-value">Chargement...</span> : (
              <SearchableSelect items={cities} selectedId={pcEdit?.cityId} onSelect={(id) => onChange('cityId', id)} placeholder="Sélectionner une ville" />
            )
          ) : data?.city ? (
            <span className="detail-value" style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
              onClick={() => onNavigate && data.city && onNavigate(createMapPointFromRef(data.city, 'city'))}>
              {data.city.name}
            </span>
          ) : <span className="detail-value">—</span>}
        </div>
        <div className="detail-item">
          <span className="detail-label">Quartier</span>
          {editMode ? (
            loadingLists ? <span className="detail-value">Chargement...</span> : (
              <SearchableSelect items={districts} selectedId={pcEdit?.districtId} onSelect={(id) => onChange('districtId', id)} placeholder="Sélectionner un quartier" />
            )
          ) : data?.district ? (
            <span className="detail-value">{data.district.name}</span>
          ) : <span className="detail-value">—</span>}
        </div>
        <div className="detail-item">
          <span className="detail-label">Lieu</span>
          {editMode ? (
            loadingLists ? <span className="detail-value">Chargement...</span> : (
              <SearchableSelect items={places} selectedId={pcEdit?.placeId} onSelect={(id) => onChange('placeId', id)} placeholder="Sélectionner un lieu" />
            )
          ) : data?.place ? (
            <span className="detail-value" style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
              onClick={() => onNavigate && data.place && onNavigate(createMapPointFromRef(data.place, 'place'))}>
              {data.place.name}
            </span>
          ) : <span className="detail-value">—</span>}
        </div>
      </div>

      <div className="detail-section">
        <h3>
          Compétences
          <span style={{ fontSize: '0.72em', fontWeight: 400, color: '#94a3b8', marginLeft: 8 }}>
            BM = {formatBonus(proficiencyBonus(pcEdit?.level ?? data?.level ?? 1))}
          </span>
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                <th style={{ textAlign: 'left', padding: '4px 6px' }}>Compétence</th>
                <th style={{ textAlign: 'center', padding: '4px 6px' }}>Car.</th>
                <th style={{ textAlign: 'center', padding: '4px 6px', minWidth: 48 }}>Bonus</th>
                <th style={{ textAlign: 'center', padding: '4px 6px' }}>Maît.</th>
                <th style={{ textAlign: 'center', padding: '4px 6px' }}>Exp.</th>
                {editMode && <th />}
              </tr>
            </thead>
            <tbody>
              {skills.map((s, i) => {
                const pcLevel = pcEdit?.level ?? data?.level ?? 1;
                const pcStats = (editMode ? pcEdit : data) as Record<string, number>;
                const score = pcStats?.[s.ability] ?? 10;
                const bonus = skillBonus(score, pcLevel, s.proficient, s.expertise);
                const profTag = s.expertise ? '★★' : s.proficient ? '★' : '';
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <td style={{ padding: '4px 6px' }}>
                      {editMode ? (
                        <input className="detail-input" style={{ fontSize: '0.85em' }} value={s.name}
                          onChange={(e) => {
                            const found = DND_SKILLS.find((sk) => sk.name === e.target.value);
                            const updated = { ...s, name: e.target.value, ability: found ? found.ability : s.ability };
                            onChange('skills', skills.map((sk, idx) => idx === i ? updated : sk));
                          }}
                          placeholder="Compétence" list="dnd-skills-list" />
                      ) : (
                        <span style={{ fontWeight: s.proficient ? 600 : 400 }}>{s.name}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', padding: '4px 6px' }}>
                      {editMode ? (
                        <select className="detail-input" style={{ fontSize: '0.82em', padding: '2px 4px' }} value={s.ability}
                          onChange={(e) => updateListItem('skills', skills, i, 'ability', e.target.value as AbilityKey)}>
                          {ABILITY_LABELS.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
                        </select>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8em' }}>{s.ability}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', padding: '4px 6px', fontWeight: 700, color: bonus >= 0 ? '#4ade80' : '#f87171' }}>
                      {formatBonus(bonus)}
                    </td>
                    <td style={{ textAlign: 'center', padding: '4px 6px' }}>
                      {editMode ? (
                        <input type="checkbox" checked={s.proficient} onChange={(e) => updateListItem('skills', skills, i, 'proficient', e.target.checked)} />
                      ) : profTag ? <span style={{ color: '#facc15' }}>{profTag}</span> : '—'}
                    </td>
                    <td style={{ textAlign: 'center', padding: '4px 6px' }}>
                      {editMode ? (
                        <input type="checkbox" checked={s.expertise} onChange={(e) => updateListItem('skills', skills, i, 'expertise', e.target.checked)} />
                      ) : null}
                    </td>
                    {editMode && (
                      <td style={{ padding: '4px 6px' }}>
                        <button onClick={() => removeListItem('skills', skills, i)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.9em' }}>✕</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
      </div>

      <div className="detail-section">
        <h3>Jets de sauvegarde</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                <th style={{ textAlign: 'left', padding: '4px 6px' }}>Caractéristique</th>
                <th style={{ textAlign: 'center', padding: '4px 6px', minWidth: 48 }}>Bonus</th>
                <th style={{ textAlign: 'center', padding: '4px 6px' }}>Maît.</th>
                {editMode && <th />}
              </tr>
            </thead>
            <tbody>
              {savingThrows.map((s, i) => {
                const pcLevel = pcEdit?.level ?? data?.level ?? 1;
                const pcStats = (editMode ? pcEdit : data) as Record<string, number>;
                const score = pcStats?.[s.ability] ?? 10;
                const bonus = abilityMod(score) + (s.proficient ? proficiencyBonus(pcLevel) : 0);
                const abilityLabel = ABILITY_LABELS.find((a) => a.key === s.ability)?.label ?? s.ability;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <td style={{ padding: '4px 6px', fontWeight: s.proficient ? 600 : 400 }}>
                      {editMode ? (
                        <select className="detail-input" style={{ fontSize: '0.85em' }} value={s.ability} onChange={(e) => updateListItem('savingThrows', savingThrows, i, 'ability', e.target.value)}>
                          {ABILITY_LABELS.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
                        </select>
                      ) : abilityLabel}
                    </td>
                    <td style={{ textAlign: 'center', padding: '4px 6px', fontWeight: 700, color: bonus >= 0 ? '#4ade80' : '#f87171' }}>
                      {formatBonus(bonus)}
                    </td>
                    <td style={{ textAlign: 'center', padding: '4px 6px' }}>
                      {editMode ? (
                        <input type="checkbox" checked={s.proficient} onChange={(e) => updateListItem('savingThrows', savingThrows, i, 'proficient', e.target.checked)} />
                      ) : s.proficient ? <span style={{ color: '#facc15' }}>★</span> : '—'}
                    </td>
                    {editMode && (
                      <td style={{ padding: '4px 6px' }}>
                        <button onClick={() => removeListItem('savingThrows', savingThrows, i)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.9em' }}>✕</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
      </div>

      <div className="detail-section">
        <h3>Équipement</h3>
        {editMode && (
          <button className="detail-btn" style={{ marginBottom: 8 }} onClick={() =>
            addListItem('equipment', equipment, { name: '', quantity: 1, description: null, equipped: false })
          }>+ Ajouter</button>
        )}
        {equipment.length === 0 ? (
          <span className="detail-value">—</span>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                <th style={{ textAlign: 'left', padding: '4px 6px' }}>Objet</th>
                <th style={{ textAlign: 'center', padding: '4px 6px' }}>Qté</th>
                <th style={{ textAlign: 'center', padding: '4px 6px' }}>Équipé</th>
                {editMode && <th style={{ textAlign: 'left', padding: '4px 6px' }}>Description</th>}
                {editMode && <th />}
              </tr>
            </thead>
            <tbody>
              {equipment.map((e, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <td style={{ padding: '4px 6px' }}>
                    {editMode ? (
                      <input className="detail-input" style={{ fontSize: '0.85em' }} value={e.name} onChange={(ev) => updateListItem('equipment', equipment, i, 'name', ev.target.value)} placeholder="Objet" />
                    ) : e.name}
                  </td>
                  <td style={{ textAlign: 'center', padding: '4px 6px' }}>
                    {editMode ? (
                      <input className="detail-input stat-input" type="number" min={1} value={e.quantity} onChange={(ev) => updateListItem('equipment', equipment, i, 'quantity', Number(ev.target.value))} style={{ width: 50 }} />
                    ) : e.quantity}
                  </td>
                  <td style={{ textAlign: 'center', padding: '4px 6px' }}>
                    {editMode ? (
                      <input type="checkbox" checked={e.equipped} onChange={(ev) => updateListItem('equipment', equipment, i, 'equipped', ev.target.checked)} />
                    ) : e.equipped ? '✓' : '—'}
                  </td>
                  {editMode && (
                    <td style={{ padding: '4px 6px' }}>
                      <input className="detail-input" style={{ fontSize: '0.85em' }} value={e.description ?? ''} onChange={(ev) => updateListItem('equipment', equipment, i, 'description', ev.target.value === '' ? null : ev.target.value)} placeholder="Description" />
                    </td>
                  )}
                  {editMode && (
                    <td style={{ padding: '4px 6px' }}>
                      <button onClick={() => removeListItem('equipment', equipment, i)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.9em' }}>✕</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="detail-section">
        <h3>Sorts</h3>
        {editMode && (
          <button className="detail-btn" style={{ marginBottom: 8 }} onClick={() =>
            addListItem('spells', spells, { name: '', level: 0, school: null, description: null, prepared: false })
          }>+ Ajouter</button>
        )}
        {spells.length === 0 ? (
          <span className="detail-value">—</span>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                <th style={{ textAlign: 'left', padding: '4px 6px' }}>Sort</th>
                <th style={{ textAlign: 'center', padding: '4px 6px' }}>Niv.</th>
                <th style={{ textAlign: 'left', padding: '4px 6px' }}>École</th>
                <th style={{ textAlign: 'center', padding: '4px 6px' }}>Préparé</th>
                {editMode && <th />}
              </tr>
            </thead>
            <tbody>
              {spells.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <td style={{ padding: '4px 6px' }}>
                    {editMode ? (
                      <input className="detail-input" style={{ fontSize: '0.85em' }} value={s.name} onChange={(e) => updateListItem('spells', spells, i, 'name', e.target.value)} placeholder="Nom du sort" />
                    ) : s.name}
                  </td>
                  <td style={{ textAlign: 'center', padding: '4px 6px' }}>
                    {editMode ? (
                      <input className="detail-input stat-input" type="number" min={0} max={9} value={s.level} onChange={(e) => updateListItem('spells', spells, i, 'level', Number(e.target.value))} style={{ width: 50 }} />
                    ) : s.level === 0 ? 'Tour' : s.level}
                  </td>
                  <td style={{ padding: '4px 6px' }}>
                    {editMode ? (
                      <input className="detail-input" style={{ fontSize: '0.85em' }} value={s.school ?? ''} onChange={(e) => updateListItem('spells', spells, i, 'school', e.target.value === '' ? null : e.target.value)} placeholder="École" />
                    ) : s.school ?? '—'}
                  </td>
                  <td style={{ textAlign: 'center', padding: '4px 6px' }}>
                    {editMode ? (
                      <input type="checkbox" checked={s.prepared} onChange={(e) => updateListItem('spells', spells, i, 'prepared', e.target.checked)} />
                    ) : s.prepared ? '✓' : '—'}
                  </td>
                  {editMode && (
                    <td style={{ padding: '4px 6px' }}>
                      <button onClick={() => removeListItem('spells', spells, i)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.9em' }}>✕</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
