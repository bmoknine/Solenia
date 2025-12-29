import './Panel.css';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch?: (v: string) => void;
};

export function SearchBox({ value, onChange, onSearch }: Props) {
  const submit = () => {
    onSearch?.(value.trim());
  };

  return (
    <div className="search-box glass">
      <input
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        placeholder="Rechercher..."
      />
    </div>
  );
}

