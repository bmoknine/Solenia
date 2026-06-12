import { useEffect, useState } from 'react';
import type { NavigablePoint } from '../../../api/map';
import { listCities, type City, type DistrictDetail } from '../../../api/entities';
import { RichTextContent } from '../../rich-text/RichTextContent';
import { RichTextField } from '../../rich-text/RichTextField';
import { LoreSection } from '../LoreSection';
import { CommentsSection } from '../CommentsSection';
import { SearchableSelect } from '../SearchableSelect';
import type { DistrictEditState, EditState } from '../detailModalTypes';
import { createMapPointFromRef } from '../createMapPointFromRef';

export function DistrictView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
  onOpenLore,
}: {
  data: DistrictDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
}) {
  const [cities, setCities] = useState<City[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    if (editMode) {
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const citiesData = await listCities();
          setCities(citiesData);
        } catch {
          setCities([]);
        } finally {
          setLoadingLists(false);
        }
      };
      void loadLists();
    }
  }, [editMode]);

  return (
    <>
      <div className="detail-item">
        <span className="detail-label">Nom</span>
        {editMode ? (
          <input
            className="detail-input"
            value={(editState as DistrictEditState)?.name ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom du quartier"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.name)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Devise</span>
        {editMode ? (
          <input
            className="detail-input"
            value={((editState as DistrictDetail)?.motto as string) ?? ''}
            onChange={(e) => onChange('motto', e.target.value)}
            placeholder="Devise du quartier"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.motto)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Ambiance</span>
        {editMode ? (
          <RichTextField
            value={((editState as DistrictDetail)?.ambiance as string) ?? ''}
            onChange={(html) => onChange('ambiance', html)}
            placeholder="Ambiance et description"
          />
        ) : (
          <RichTextContent value={data?.ambiance} emptyLabel={String(valueOrDash(null))} />
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Contenu</span>
        {editMode ? (
          <RichTextField
            value={((editState as DistrictDetail)?.content as string) ?? ''}
            onChange={(html) => onChange('content', html)}
            placeholder="Contenu du quartier"
          />
        ) : (
          <RichTextContent value={data?.content} emptyLabel={String(valueOrDash(null))} />
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Rumeurs</span>
        {editMode ? (
          <RichTextField
            value={((editState as DistrictDetail)?.rumors as string) ?? ''}
            onChange={(html) => onChange('rumors', html)}
            placeholder="Rumeurs et murmures"
          />
        ) : (
          <RichTextContent value={data?.rumors} emptyLabel={String(valueOrDash(null))} />
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Secret</span>
        {editMode ? (
          <RichTextField
            value={((editState as DistrictDetail)?.secret as string) ?? ''}
            onChange={(html) => onChange('secret', html)}
            placeholder="Secret caché"
          />
        ) : (
          <RichTextContent value={data?.secret} emptyLabel={String(valueOrDash(null))} />
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Ville</span>
        {editMode ? (
          loadingLists ? (
            <span className="detail-value">Chargement...</span>
          ) : (
            <SearchableSelect
              items={cities}
              selectedId={
                (editState as DistrictDetail)?.cityId !== undefined ? (editState as DistrictDetail).cityId : data?.city?.id
              }
              onSelect={(id) => onChange('cityId', id ?? '')}
              placeholder="Sélectionner une ville"
            />
          )
        ) : data?.city ? (
          <span
            className="detail-value"
            style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
            onClick={() => {
              if (onNavigate && data?.city) {
                onNavigate(createMapPointFromRef(data.city, 'city'));
              }
            }}
          >
            {valueOrDash(data.city?.name)}
          </span>
        ) : (
          <span className="detail-value">{valueOrDash((data?.city as { name: string } | null | undefined)?.name)}</span>
        )}
      </div>
      {data?.places && data.places.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Lieux :</h3>
          <ul className="detail-list">
            {data?.places.map((p) => (
              <li
                key={p.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(p, 'place'))}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.persons && data.persons.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Personnages :</h3>
          <ul className="detail-list">
            {data?.persons.map((p) => (
              <li
                key={p.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(p, 'person'))}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <LoreSection lores={data?.lores} onOpenLore={onOpenLore} />
      <CommentsSection comments={data?.comments} />
    </>
  );
}
