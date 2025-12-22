import './Panel.css';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch?: (v: string) => void;
  onClose?: () => void;
};

export function SearchBox({ value, onChange, onSearch, onClose }: Props) {
  const submit = () => {
    onSearch?.(value.trim());
  };

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <input
        style={{ flex: 1 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        placeholder="Rechercher..."
      />
      <button type="button" className="ghost" onClick={submit}>Rechercher</button>
      <button
        type="button"
        className="ghost"
        onClick={() => {
          onChange('');
          onSearch?.('');
          onClose?.();
        }}
      >
        ×
      </button>
    </div>
  );
}

