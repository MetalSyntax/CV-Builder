import React, { useState, useRef } from 'react';
import { Download, Printer, Settings, Upload, RefreshCw, Edit3, Palette, FileText } from 'lucide-react';
import Resume from './components/Resume';
import ContentEditor from './components/ContentEditor';
import { INITIAL_DATA } from './constants';
import { ResumeData } from './types';
import { parseResumeTxt } from './utils/resumeParser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Placeholder image
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop";

const App: React.FC = () => {
  // Tabs: 'design' | 'content'
  const [activeTab, setActiveTab] = useState<'design' | 'content'>('design');

  // Resume Data State
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);

  // Customization State
  const [primaryColor, setPrimaryColor] = useState<string>('#651d3b'); 
  const [accentColor, setAccentColor] = useState<string>('#b3b3b3'); 
  const [contactBarColor, setContactBarColor] = useState<string>('#30101d');
  const [textColor, setTextColor] = useState<string>('#374151'); 
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_IMAGE);

  const THEMES = [
    { name: 'Classic Burgundy', primary: '#651d3b', accent: '#9ca3af', contact: '#30101d' },
    { name: 'Midnight Blue', primary: '#1e3a8a', accent: '#60a5fa', contact: '#1e1b4b' },
    { name: 'Forest Green', primary: '#064e3b', accent: '#34d399', contact: '#022c22' },
    { name: 'Elegant Slate', primary: '#334155', accent: '#94a3b8', contact: '#0f172a' },
    { name: 'Autumn Gold', primary: '#78350f', accent: '#fbbf24', contact: '#451a03' },
    { name: 'Deep Purple', primary: '#4c1d95', accent: '#a78bfa', contact: '#2e1065' },
    { name: 'Modern Teal', primary: '#134e4a', accent: '#2dd4bf', contact: '#042f2e' },
    { name: 'Rose Quartz', primary: '#831843', accent: '#f472b6', contact: '#500724' },
    { name: 'Minimalist Gray', primary: '#18181b', accent: '#71717a', contact: '#09090b' },
    { name: 'Royal Indigo', primary: '#312e81', accent: '#818cf8', contact: '#1e1b4b' },
  ];

  const applyTheme = (theme: typeof THEMES[0]) => {
    setPrimaryColor(theme.primary);
    setAccentColor(theme.accent);
    setContactBarColor(theme.contact);
  };

  const updateField = (field: keyof ResumeData, value: any) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const moveItem = (field: keyof ResumeData, index: number, direction: 'up' | 'down') => {
    const list = [...(resumeData[field] as any[])];
    if (direction === 'up' && index > 0) {
      [list[index], list[index - 1]] = [list[index - 1], list[index]];
    } else if (direction === 'down' && index < list.length - 1) {
      [list[index], list[index + 1]] = [list[index + 1], list[index]];
    }
    updateField(field, list);
  };
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const txtInputRef = useRef<HTMLInputElement>(null);

  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-content');
    if (!element) return;

    try {
      setIsExporting(true);
      
      // Optimizamos temporalmente el elemento para la captura
      const originalShadow = element.style.boxShadow;
      element.style.boxShadow = 'none';

      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        // Evitamos que el scroll actual del navegador desplace la captura
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('resume-content');
          if (el) {
            el.style.transform = 'none';
            el.style.margin = '0';
            el.style.boxShadow = 'none';
            el.style.position = 'fixed';
            el.style.top = '0';
            el.style.left = '0';
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Ajuste milimétrico para eliminar cualquier borde blanco residual
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`CV_${resumeData.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor intenta usando el botón de imprimir del navegador.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTxtImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          const parsedData = parseResumeTxt(text, resumeData);
          setResumeData(parsedData);
          setActiveTab('content'); // Switch to content to show imported data
        }
      };
      reader.readAsText(file);
    }
  };

  const resetImage = () => {
    setProfileImage(DEFAULT_IMAGE);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Sidebar Controls */}
      <aside className="w-full md:w-96 bg-white shadow-xl z-20 print:hidden flex-shrink-0 h-screen sticky top-0 flex flex-col">
        
        {/* Sidebar Header & Tabs */}
        <div className="flex-shrink-0 bg-white z-10">
          <div className="p-6 pb-2">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Editor CV
            </h2>
          </div>
          
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition ${activeTab === 'design' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Palette size={16} />
              Diseño
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition ${activeTab === 'content' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Edit3 size={16} />
              Contenido
            </button>
          </div>
        </div>

        {/* Sidebar Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-8">
          
          {activeTab === 'design' ? (
            <>
              {/* Color Controls */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Colores</h3>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Fondo Encabezado</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{primaryColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Títulos Secciones</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={accentColor} 
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{accentColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Barra de Contacto</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={contactBarColor} 
                      onChange={(e) => setContactBarColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{contactBarColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Texto Cuerpo</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{textColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Tamaño de Letra</label>
                  <div className="flex gap-2">
                    {(['sm', 'base', 'lg'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-1.5 rounded border text-xs font-medium capitalize transition ${
                          fontSize === size 
                            ? 'bg-blue-600 border-blue-600 text-white' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'
                        }`}
                      >
                        {size === 'sm' ? 'Pequeño' : size === 'base' ? 'Normal' : 'Grande'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Theme Presets */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Temas Preestablecidos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((theme, i) => (
                    <button
                      key={i}
                      onClick={() => applyTheme(theme)}
                      className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition text-left"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="w-4 h-2 rounded-t-sm" style={{ backgroundColor: theme.primary }}></div>
                        <div className="w-4 h-1" style={{ backgroundColor: theme.contact }}></div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-600 truncate">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Image Control */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Foto de Perfil</h3>
                <div className="flex flex-col gap-3">
                  <button 
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium border border-gray-300"
                  >
                    <Upload size={16} />
                    Subir Imagen
                  </button>
                  <input 
                      type="file" 
                      ref={imageInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*"
                      className="hidden"
                    />
                    {profileImage !== DEFAULT_IMAGE && (
                      <button 
                        onClick={resetImage}
                        className="flex items-center justify-center gap-2 w-full py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg transition text-xs"
                      >
                        <RefreshCw size={12} />
                        Restaurar Original
                      </button>
                    )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Import TXT */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  Importar Datos
                </h3>
                <p className="text-xs text-blue-600 mb-3">
                  Sube un archivo .txt para autocompletar campos básicos.
                </p>
                <button 
                  onClick={() => txtInputRef.current?.click()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded transition"
                >
                  Seleccionar Archivo .txt
                </button>
                <input 
                  type="file" 
                  ref={txtInputRef} 
                  onChange={handleTxtImport}
                  accept=".txt" 
                  className="hidden"
                />
              </div>

              <ContentEditor 
                data={resumeData} 
                onChange={setResumeData} 
                onMoveItem={moveItem}
              />
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50 mt-auto space-y-3">
          <button 
            onClick={handlePrint}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition flex flex-col items-center justify-center leading-tight"
          >
            <div className="flex items-center gap-2">
              <Printer size={18} />
              <span>Guardar PDF (Seleccionable)</span>
            </div>
            <span className="text-[9px] opacity-80 font-normal mt-0.5">Recomendado para ATS / Copiar texto</span>
          </button>
        </div>
        
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 flex justify-center p-4 md:p-10 overflow-auto bg-gray-200">
        <Resume 
          data={resumeData} 
          primaryColor={primaryColor}
          accentColor={accentColor}
          contactBarColor={contactBarColor}
          textColor={textColor}
          fontSize={fontSize}
          profileImage={profileImage}
        />
      </main>

      {/* Mobile Print Fab */}
      <button 
        onClick={handlePrint}
        className="md:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl z-50 print:hidden"
      >
        <Printer size={24} />
      </button>

    </div>
  );
};

export default App;
