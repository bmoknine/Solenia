import { describe, expect, test, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MapView } from './MapView';

const mockMap = { getZoom: () => -2 };
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: ReactNode }) => <div data-testid="map-container">{children}</div>,
  ImageOverlay: () => null,
  Marker: () => null,
  useMap: () => mockMap,
  useMapEvents: () => ({}),
}));

const points = [
  { id: '1', x: 0.1, y: 0.2, kind: 'kingdom' as const, targetId: 'k1', name: 'Solenia', description: 'Desc' },
  { id: '2', x: 0.3, y: 0.4, kind: 'city' as const, targetId: 'c1', name: 'Aster', description: null },
];

describe('MapView', () => {
  test('affiche le conteneur carte', () => {
    const { getByTestId } = render(<MapView points={points} />);
    expect(getByTestId('map-container')).toBeInTheDocument();
  });
});
