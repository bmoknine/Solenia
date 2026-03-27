import { useEffect, useState, useRef } from 'react';

export function SearchableSelect<T extends { id: string; name: string }>({
  items,
  selectedId,
  onSelect,
  placeholder,
}: {
  items: T[];
  selectedId: string | null | undefined;
  onSelect: (id: string | null) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedItem = items.find((item) => item.id === selectedId);
  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  const displayText = selectedItem ? selectedItem.name : selectedId === null ? '—' : placeholder;

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button type="button" className="language-dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        <span>{displayText}</span>
        <span className="language-dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="language-dropdown-menu">
          <input
            type="text"
            className="detail-input"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{ marginBottom: '8px' }}
          />
          <button
            type="button"
            className="language-checkbox"
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
              setSearch('');
            }}
            style={{
              justifyContent: 'center',
              backgroundColor: selectedId === null ? 'rgba(99, 102, 241, 0.2)' : undefined,
            }}
          >
            <span>— (Aucun)</span>
          </button>
          {filteredItems.length === 0 ? (
            <div className="language-checkbox" style={{ justifyContent: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Aucun résultat</span>
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="language-checkbox"
                onClick={() => {
                  onSelect(item.id);
                  setIsOpen(false);
                  setSearch('');
                }}
                style={{
                  backgroundColor: item.id === selectedId ? 'rgba(99, 102, 241, 0.2)' : undefined,
                }}
              >
                <span>{item.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
