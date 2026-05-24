import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResumeToolbar } from '../../components/resume/ResumeToolbar';

const defaultProps = {
  show: true,
  top: 100,
  left: 200,
  onExecCommand: vi.fn(),
  onUpdateFontSize: vi.fn(),
  currentFontSize: 12,
  activeFormats: { bold: false, italic: false, underline: false, justifyFull: false },
};

describe('ResumeToolbar', () => {
  it('does not render when show is false', () => {
    const { container } = render(<ResumeToolbar {...defaultProps} show={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all format buttons when visible', () => {
    render(<ResumeToolbar {...defaultProps} />);
    expect(screen.getByTitle('Negrita (Ctrl+B)')).toBeInTheDocument();
    expect(screen.getByTitle('Cursiva (Ctrl+I)')).toBeInTheDocument();
    expect(screen.getByTitle('Subrayado (Ctrl+U)')).toBeInTheDocument();
    expect(screen.getByTitle('Alinear izquierda')).toBeInTheDocument();
    expect(screen.getByTitle('Justificar texto')).toBeInTheDocument();
  });

  it('displays current font size', () => {
    render(<ResumeToolbar {...defaultProps} currentFontSize={14} />);
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('calls onUpdateFontSize with -1 on A− click', () => {
    const onUpdateFontSize = vi.fn();
    render(<ResumeToolbar {...defaultProps} onUpdateFontSize={onUpdateFontSize} />);
    fireEvent.click(screen.getByTitle('Reducir tamaño de fuente'));
    expect(onUpdateFontSize).toHaveBeenCalledWith(-1);
  });

  it('calls onUpdateFontSize with +1 on A+ click', () => {
    const onUpdateFontSize = vi.fn();
    render(<ResumeToolbar {...defaultProps} onUpdateFontSize={onUpdateFontSize} />);
    fireEvent.click(screen.getByTitle('Aumentar tamaño de fuente'));
    expect(onUpdateFontSize).toHaveBeenCalledWith(1);
  });

  it('calls onExecCommand with bold', () => {
    const onExecCommand = vi.fn();
    render(<ResumeToolbar {...defaultProps} onExecCommand={onExecCommand} />);
    fireEvent.click(screen.getByTitle('Negrita (Ctrl+B)'));
    expect(onExecCommand).toHaveBeenCalledWith('bold');
  });

  it('highlights active format button', () => {
    render(<ResumeToolbar {...defaultProps} activeFormats={{ ...defaultProps.activeFormats, bold: true }} />);
    const boldBtn = screen.getByTitle('Negrita (Ctrl+B)');
    expect(boldBtn.className).toContain('bg-teal-500');
  });

  it('renders with default fontSize when currentFontSize is not provided', () => {
    const { onUpdateFontSize, currentFontSize, ...propsWithout } = defaultProps;
    render(<ResumeToolbar {...propsWithout} onUpdateFontSize={vi.fn()} />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
