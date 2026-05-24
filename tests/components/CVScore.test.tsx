import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CVScore } from '../../components/CVScore';
import { INITIAL_DATA } from '../../constants';

describe('CVScore component', () => {
  it('renders without crashing', () => {
    render(<CVScore data={INITIAL_DATA} />);
    expect(screen.getByText('CV Score')).toBeInTheDocument();
  });

  it('shows a percentage', () => {
    render(<CVScore data={INITIAL_DATA} />);
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });

  it('expands suggestions on click', async () => {
    const user = userEvent.setup();
    render(<CVScore data={INITIAL_DATA} />);
    const button = screen.getByRole('button');
    await user.click(button);
    // After expanding, should show criteria items
    expect(screen.getByText('Nombre completo')).toBeInTheDocument();
  });

  it('shows all criteria when expanded', async () => {
    const user = userEvent.setup();
    render(<CVScore data={INITIAL_DATA} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Email de contacto')).toBeInTheDocument();
    expect(screen.getByText('Habilidades (mín. 5)')).toBeInTheDocument();
  });
});
