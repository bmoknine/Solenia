import { useEffect, useState, useRef } from 'react';

export function SearchableMultiSelect<T extends { id: string; name: string }>({
  items,
  selectedIds,
  onChange,
  placeholder,
}: {
  items: T[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedItems = items.filter((i) => selectedIds.includes(i.id));
  const availableItems = items.filter(
    (i) => !selectedIds.includes(i.id) && i.name.toLowerCase().includes(search.toLowerCase()),
  );

  function add(id: string) {
    onChange([...selectedIds, id]);
    setSearch('');
    setIsOpen(false);
  }

  function remove(id: string) {
    onChange(selectedIds.filter((sid) => sid !== id));
  }

  return (
    <div className="multi-select" ref={dropdownRef}>
      {selectedItems.length > 0 && (
        <div className="multi-select-chips">
          {selectedItems.map((item) => (
            <span key={item.id} className="multi-select-chip">
              {item.name}
              <button
                type="button"
                className="multi-select-chip-remove"
                onClick={() => remove(item.id)}
                aria-label={`Retirer ${item.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="language-dropdown">
        <button type="button" className="language-dropdown-button" onClick={() => setIsOpen(!isOpen)}>
          <span style={{ color: '#94a3b8' }}>{placeholder}</span>
          <span className="language-dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && (
          <div className="language-dropdown-menu">
            <input
              ref={inputRef}
              type="text"
              className="detail-input"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ marginBottom: '8px' }}
            />
            {availableItems.length === 0 ? (
              <div className="language-checkbox" style={{ justifyContent: 'center' }}>
                <span style={{ color: '#94a3b8' }}>
                  {items.length === selectedIds.length ? 'Tout sélectionné' : 'Aucun résultat'}
                </span>
              </div>
            ) : (
              availableItems.map((item) => (
                <button key={item.id} type="button" className="language-checkbox" onClick={() => add(item.id)}>
                  <span>{item.name}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
