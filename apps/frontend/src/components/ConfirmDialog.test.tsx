import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  test('affiche et déclenche les callbacks', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Confirmer"
        message="Test"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    await userEvent.click(screen.getByText(/Annuler/));
    expect(onCancel).toHaveBeenCalled();

    const [confirmBtn] = screen.getAllByText(/Confirmer/).filter((el) => el.tagName === 'BUTTON');
    await userEvent.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalled();
  });
});

