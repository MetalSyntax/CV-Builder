import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../App';
import html2canvas from 'html2canvas-pro';

// Setup basic mocks
vi.mock('html2canvas-pro', () => {
  return {
    default: vi.fn().mockResolvedValue({
      width: 816,
      height: 1056,
      getContext: vi.fn().mockReturnValue({
        fillStyle: '',
        fillRect: vi.fn(),
        drawImage: vi.fn(),
      }),
      toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,...')
    })
  };
});

vi.mock('jspdf', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      internal: { pageSize: { getWidth: () => 215.9, getHeight: () => 279.4 } },
      addPage: vi.fn(),
      addImage: vi.fn(),
      save: vi.fn()
    }))
  };
});

// Mock browser APIs
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

Object.defineProperty(window, 'crypto', {
  value: { randomUUID: vi.fn().mockReturnValue('123e4567-e89b-12d3-a456-426614174000') }
});

const indexedDBMock = {
  open: vi.fn().mockReturnValue({
    onerror: null,
    onsuccess: null,
    onupgradeneeded: null,
    result: {
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          index: vi.fn().mockReturnValue({
            getAll: vi.fn().mockReturnValue({
              onsuccess: null,
              onerror: null,
              result: []
            })
          })
        })
      })
    }
  })
};
Object.defineProperty(window, 'indexedDB', { value: indexedDBMock });

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'ResizeObserver', { value: ResizeObserverMock });

Object.defineProperty(window, 'print', { value: vi.fn(), writable: true });

describe('PDF Generation and Print Layout Analysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('VERDADERO ORIGEN: Verifica que html2canvas no utilice un scrollY negativo', async () => {
    // El "text cortado a la mitad" ocurría porque html2canvas recibe scrollY: -window.scrollY.
    // Simulemos que el usuario ha scrolleado 500px hacia abajo:
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    Object.defineProperty(window, 'scrollX', { value: 0, writable: true });

    render(<App />);
    
    // Forzamos un frame falso para que html2canvas.querySelector no devuelva null
    const dummyFrame = document.createElement('div');
    dummyFrame.className = 'resume-page-frame';
    document.body.appendChild(dummyFrame);
    
    // Buscamos el botón de descarga PDF usando SVG search o texto
    const btn = await screen.findByText('Descargar PDF Directo');
    fireEvent.click(btn);
    
    await waitFor(() => {
      expect(html2canvas).toHaveBeenCalled();
    });
    
    const options = vi.mocked(html2canvas).mock.calls[0][1];
    
    // Si options.scrollY es negativo, ese es el origen de que el PDF se "corte" a la mitad verticalmente.
    // El test verificará si ya está corregido (scrollY debe ser 0).
    expect(options).toBeDefined();
    expect(options?.scrollY).toBe(0);
    expect(options?.scrollX).toBe(0);
  });
  
  it('VERDADERO ORIGEN: Verifica clases de Tailwind exclusivas de impresión para eliminar las franjas negras/márgenes', () => {
    // Las franjas negras ocurrían porque el modo oscuro/fondos de los layouts contenedores se
    // imprimían también, añadiendo un margen o un padding extra en papel.
    const { container } = render(<App />);
    
    const mainElement = container.querySelector('main');
    expect(mainElement).not.toBeNull();
    
    // Para que el diseño "Imprimir / Diálogo" no rompa hojas, el main debe anular su padding y background
    const classNames = mainElement?.className || '';
    expect(classNames).toContain('print:p-0');
    expect(classNames).toContain('print:m-0');
    expect(classNames).toContain('print:bg-transparent');
    expect(classNames).toContain('print:overflow-visible');
    
    // El contenedor raíz de la App (min-h-screen) también debe ser transparente en la impresión
    const rootDiv = container.querySelector('.min-h-screen');
    expect(rootDiv).not.toBeNull();
    expect(rootDiv?.className).toContain('print:bg-transparent');
    expect(rootDiv?.className).toContain('print:min-h-0');
  });

  describe('VERDADERO ORIGEN: @page impreso debe coincidir con resumeData.pageFormat', () => {
    // El CSS de index.css fija @page { size: letter } de forma estática. Cada .resume-page-frame
    // mide su alto según pageFormat (A4 = 1122px, más alto que los 1056px de Letter), así que si
    // la hoja física impresa se queda en Letter mientras el CV es A4, cada "página" de contenido
    // sobra por encima del límite físico y arrastra el contenido de las páginas siguientes,
    // descuadrando la paginación (por eso el body terminaba cortado / desplazado).

    it('inyecta @page { size: letter } cuando el formato es Letter (default)', async () => {
      render(<App />);

      const btn = await screen.findByText('Guardar PDF');
      fireEvent.click(btn);

      await waitFor(() => {
        expect(window.print).toHaveBeenCalled();
      });

      const style = document.getElementById('dynamic-page-size');
      expect(style).not.toBeNull();
      expect(style?.textContent).toContain('size: letter');
    });

    it('inyecta @page { size: A4 } cuando el usuario cambia el Formato a A4', async () => {
      render(<App />);

      // Cambia el CustomSelect "Formato" de Letter a A4 desde el panel de Diseño
      const formatButton = await screen.findByText('Letter (EE.UU.)');
      fireEvent.click(formatButton);
      const a4Option = await screen.findByText('A4 (Internacional)');
      fireEvent.click(a4Option);

      const btn = await screen.findByText('Guardar PDF');
      fireEvent.click(btn);

      await waitFor(() => {
        expect(window.print).toHaveBeenCalled();
      });

      const style = document.getElementById('dynamic-page-size');
      expect(style).not.toBeNull();
      expect(style?.textContent).toContain('size: A4');
      expect(style?.textContent).not.toContain('size: letter');
    });

    it('reutiliza el mismo <style> en clics repetidos en vez de duplicarlo', async () => {
      render(<App />);

      const btn = await screen.findByText('Guardar PDF');
      fireEvent.click(btn);
      fireEvent.click(btn);

      await waitFor(() => {
        expect(window.print).toHaveBeenCalledTimes(2);
      });

      expect(document.querySelectorAll('#dynamic-page-size').length).toBe(1);
    });
  });
});
