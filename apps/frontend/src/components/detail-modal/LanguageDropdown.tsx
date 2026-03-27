import { useEffect, useState, useRef } from 'react';
import type { Language } from '../../api/entities';
import { LANGUAGE_OPTIONS } from './entityOptions';
import { formatLanguage } from './entityFormatters';

export function LanguageDropdown({
  selectedLanguages,
  onLanguagesChange,
}: {
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleLanguage = (lang: Language) => {
    if (selectedLanguages.includes(lang)) {
      onLanguagesChange(selectedLanguages.filter((l) => l !== lang));
    } else {
      onLanguagesChange([...selectedLanguages, lang]);
    }
  };

  const displayText =
    selectedLanguages.length > 0 ? `${selectedLanguages.length} langue(s) sélectionnée(s)` : 'Sélectionner des langues';

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button type="button" className="language-dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        <span>{displayText}</span>
        <span className="language-dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="language-dropdown-menu">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = selectedLanguages.includes(lang);
            return (
              <label key={lang} className="language-checkbox">
                <input type="checkbox" checked={isSelected} onChange={() => toggleLanguage(lang)} />
                <span>{formatLanguage(lang)}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
