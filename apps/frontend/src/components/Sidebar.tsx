import { SearchBox } from './SearchBox';
import { FilterPanel } from './FilterPanel';
import { PointsList } from './PointsList';
import type { MapPoint } from '../api/map';
import type { NavigablePoint } from '../api/map';
import './Sidebar.css';

type Kind = 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'unknown';

type OrganisationSearchResult = {
  id: string;
  x: number;
  y: number;
  kind: 'organisation';
  targetId: string;
  name: string;
  description: string | null;
};

type SearchResult = MapPoint | OrganisationSearchResult;

type SidebarProps = {
  search: string;
  setSearch: (value: string) => void;
  showSearch: boolean;
  setShowSearch: (value: boolean | ((prev: boolean) => boolean)) => void;
  filters: Set<Kind>;
  toggleFilter: (kind: Kind) => void;
  creatingMode: boolean;
  setCreatingMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  createKind: 'kingdom' | 'city' | 'place' | 'person' | 'organisation' | 'lore';
  setCreateKind: (value: 'kingdom' | 'city' | 'place' | 'person' | 'organisation' | 'lore') => void;
  onOpenLoreModal?: () => void;
  onCancelCreate: () => void;
  searchResults: SearchResult[];
  onSelectResult: (point: SearchResult) => void;
};

export function Sidebar({
  search,
  setSearch,
  showSearch,
  setShowSearch,
  filters,
  toggleFilter,
  creatingMode,
  setCreatingMode,
  createKind,
  setCreateKind,
  onCancelCreate,
  searchResults,
  onSelectResult,
  onOpenLoreModal,
}: SidebarProps) {

  return (
    <div className="sidebar">
      {/* Recherche */}
      <button
        className="ghost sidebar-button"
        onClick={() => {
          if (showSearch) {
            setSearch('');
          }
          setShowSearch((v) => !v);
        }}
      >
        {showSearch ? 'Fermer' : 'Recherche'}
      </button>
      
      {showSearch && (
        <>
          <div className="sidebar-search-panel glass">
            <SearchBox
              value={search}
              onChange={setSearch}
              onSearch={setSearch}
            />
          </div>
          {search.trim() !== '' && searchResults.length > 0 && (
            <div className="sidebar-results-panel glass">
              <PointsList
                points={searchResults}
                onSelect={onSelectResult}
              />
            </div>
          )}
        </>
      )}

      {/* Filtre */}
      <FilterPanel active={filters} onToggle={toggleFilter} />

      {/* Créer */}
      <button
        className="ghost sidebar-button"
        onClick={() => {
          setCreatingMode((v) => !v);
          onCancelCreate();
        }}
      >
        {creatingMode ? 'Fermer' : 'Créer'}
      </button>
      
      {creatingMode && (
        <select
          className="ghost sidebar-select"
          value={createKind}
          onChange={(e) => setCreateKind(e.target.value as 'kingdom' | 'city' | 'place' | 'person' | 'organisation' | 'lore')}
        >
          <option value="kingdom">Royaume</option>
          <option value="city">Ville</option>
          <option value="place">Lieu</option>
          <option value="person">Personnage</option>
          <option value="organisation">Organisation</option>
          <option value="lore">Lore</option>
        </select>
      )}

      {/* Bouton Lore : ouvre la modal liste des Lore */}
      <button
        className="ghost sidebar-button"
        onClick={() => {
          onCancelCreate();
          onOpenLoreModal?.();
        }}
      >
        Lore
      </button>
    </div>
  );
}
