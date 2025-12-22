import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapView } from './MapView';

type TWChildren = ({ zoomIn, zoomOut, resetTransform }: { zoomIn: () => void; zoomOut: () => void; resetTransform: () => void }) => JSX.Element;

vi.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: ({ children }: { children: TWChildren | JSX.Element }) => (
    <div>{typeof children === 'function' ? children({ zoomIn: () => {}, zoomOut: () => {}, resetTransform: () => {} }) : children}</div>
  ),
  TransformComponent: ({ children }: { children: JSX.Element }) => <div>{children}</div>,
}));

const points = [
  { id: '1', x: 0.1, y: 0.2, kind: 'kingdom' as const, targetId: 'k1', name: 'Solenia', description: 'Desc' },
  { id: '2', x: 0.3, y: 0.4, kind: 'city' as const, targetId: 'c1', name: 'Aster', description: null },
];

describe('MapView', () => {
  test('affiche le popover et déclenche la suppression', async () => {
    const onDelete = vi.fn();
    render(<MapView points={points as unknown as { id: string; x: number; y: number; kind: 'kingdom' | 'city'; targetId: string | null; name: string; description: string | null }[]} canEdit onDelete={onDelete} />);

    await userEvent.click(screen.getByTitle(/Solenia/));
    expect(screen.getByText('Solenia')).toBeInTheDocument();

    await userEvent.click(screen.getByText(/Supprimer/));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});

