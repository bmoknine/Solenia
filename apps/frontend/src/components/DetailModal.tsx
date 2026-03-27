import { useEffect, useRef } from 'react';
import { deleteLore, type KingdomDetail, type LoreDetail, type CityDetail, type DistrictDetail, type PlaceDetail, type PersonDetail, type OrganisationDetail } from '../api/entities';
import { LoreView } from './detail-modal/LoreView';
import type { LoreEditState } from './detail-modal/loreTypes';
import { useToast } from '../toast/ToastProvider';
import './DetailModal.css';
import type { DetailModalProps } from './detail-modal/detailModalTypes';
import {
  KingdomView,
  CityView,
  DistrictView,
  PlaceView,
  PersonView,
  OrganisationView,
} from './detail-modal/views';
import { useDetailModalEntity } from './detail-modal/useDetailModalEntity';
import { DetailModalSidebar } from './detail-modal/DetailModalSidebar';
import type { EntityData } from './detail-modal/detailModalTypes';

export default function DetailModal({ point, onClose, token, onUpdated, onDelete, onNavigate, onCreateDistrict, onOpenLore, loreId, createMode }: DetailModalProps) {
  const { push } = useToast();
  const {
    data,
    loading,
    error,
    editMode,
    setEditMode,
    saving,
    editState,
    updateField,
    handleSave,
    handleUpdated,
  } = useDetailModalEntity({ point, createMode, loreId, token, onUpdated, onClose, push });

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (point || createMode || loreId) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [point, createMode, loreId]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const valueOrDash = (v: unknown): string | number =>
    v === null || v === undefined || v === '' ? '' : (v as string | number);

  if (!point && !createMode && !loreId) return null;
  
  const currentKind = createMode ? createMode.kind : loreId ? 'lore' : point!.kind;
  const headerName =
    currentKind === 'lore'
      ? ((editState as LoreEditState | null)?.title ?? (data as LoreDetail | null)?.title ?? 'Lore')
      : ((editState as { name?: string } | null)?.name ??
        (data as { name?: string } | null)?.name ??
        (createMode ? `Nouveau ${createMode.kind}` : 'Détail'));
  const headerFlag =
    currentKind === 'kingdom'
      ? ((editState as KingdomDetail | null)?.flag ?? (data as KingdomDetail | null)?.flag ?? null)
      : currentKind === 'city'
      ? ((editState as CityDetail | null)?.flag ?? (data as CityDetail | null)?.flag ?? null)
      : currentKind === 'organisation'
      ? ((editState as OrganisationDetail | null)?.flag ?? (data as OrganisationDetail | null)?.flag ?? null)
      : null;
  const headerMap =
    currentKind === 'city'
      ? ((editState as CityDetail | null)?.map ?? (data as CityDetail | null)?.map ?? null)
      : currentKind === 'place'
      ? ((editState as PlaceDetail | null)?.map ?? (data as PlaceDetail | null)?.map ?? null)
      : null;

  return (
    <div className="detail-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className={`detail-modal-container ${currentKind === 'lore' ? 'detail-modal-container-lore' : ''}`}>
        <DetailModalSidebar
          point={point}
          data={data as EntityData}
          onNavigate={onNavigate}
          createMode={createMode}
        />
        <div className="detail-modal glass">
          <button className="detail-close ghost" onClick={onClose}>×</button>
          <div className="detail-actions">
            {token && (data || createMode) && (
              <>
                {!createMode && (
                  <button className="ghost" onClick={() => setEditMode((v) => !v)}>
                    {editMode ? 'Annuler édition' : 'Mode édition'}
                  </button>
                )}
                {editMode && (
                  <button className="primary glass" disabled={saving} onClick={handleSave}>
                    {saving ? (createMode ? 'Création…' : 'Enregistrement…') : (createMode ? 'Créer' : 'Enregistrer')}
                  </button>
                )}
                {onDelete && point && !createMode && (
                  <button
                    className="danger glass"
                    onClick={() => {
                      if (point && point.targetId) {
                        onDelete(point);
                      }
                    }}
                  >
                    Supprimer
                  </button>
                )}
                {token && loreId && !createMode && (
                  <button
                    className="danger glass"
                    onClick={async () => {
                      try {
                        await deleteLore(token, loreId);
                        push('Lore supprimée', 'success');
                        await handleUpdated();
                        onClose();
                      } catch (err) {
                        push(err instanceof Error ? err.message : 'Erreur', 'error');
                      }
                    }}
                  >
                    Supprimer
                  </button>
                )}
              </>
            )}
          </div>
          <div className="detail-modal-header-block">
            <h2 className="detail-title">
              {headerName}
              {headerFlag ? (
                <img
                  src={headerFlag}
                  alt=""
                  style={{ height: 56, width: 'auto', objectFit: 'contain', display: 'block' }}
                />
              ) : null}
            </h2>
            {headerMap ? (
              <div className="detail-header-map">
                <img
                  src={headerMap}
                  alt="Map"
                  style={{ width: '100%', maxHeight: 520, objectFit: 'contain', display: 'block' }}
                />
              </div>
            ) : null}
          </div>
          {loading && <div className="detail-loading">Chargement…</div>}
          {error && <div className="detail-error">{error}</div>}
          {!loading && !error && createMode && !editState && (
            <div className="detail-error">Erreur: editState n'est pas initialisé</div>
          )}
          {((data || createMode) && !loading && editState) && (
            <div className="detail-content">
            {currentKind === 'kingdom' && (
              <KingdomView
                data={data as KingdomDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
                onOpenLore={onOpenLore}
              />
            )}
            {currentKind === 'city' && (
              <CityView
                data={data as CityDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
                onCreateDistrict={onCreateDistrict}
                cityId={point?.targetId || (data as CityDetail)?.id}
                onOpenLore={onOpenLore}
              />
            )}
            {currentKind === 'district' && (
              <DistrictView
                data={data as DistrictDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
                onOpenLore={onOpenLore}
              />
            )}
            {currentKind === 'place' && (
              <PlaceView
                data={data as PlaceDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
                onOpenLore={onOpenLore}
              />
            )}
            {currentKind === 'person' && (
              <PersonView
                data={data as PersonDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
                onOpenLore={onOpenLore}
              />
            )}
            {currentKind === 'organisation' && (
              <OrganisationView
                data={data as OrganisationDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
                onOpenLore={onOpenLore}
              />
            )}
            {currentKind === 'lore' && (
              <LoreView
                data={data as LoreDetail | null}
                editMode={editMode}
                editState={editState as LoreEditState}
                onChange={updateField}
                valueOrDash={valueOrDash}
              />
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
