import React, { useState, useRef, useEffect } from 'react';
import { Download, Printer, Settings, Upload, RefreshCw, Edit3, Palette, FileText, Moon, Sun, Type } from 'lucide-react';
import Resume from './components/Resume';
import ContentEditor from './components/ContentEditor';
import { INITIAL_DATA } from './constants';
import { ResumeData } from './types';
import { parseResumeTxt } from './utils/resumeParser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  initDB, getAllResumes, saveResume, createNewResume, deleteResume, ResumeRecord 
} from './utils/db';
import { Plus, Trash2, FolderOpen, Copy, Save, Check } from 'lucide-react';

// Icono de usuario gris para imagen por defecto (SVG Data URL)
const DEFAULT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'%3E%3C/path%3E%3C/svg%3E";

const App: React.FC = () => {
  // Tabs: 'design' | 'content'
  const [activeTab, setActiveTab] = useState<'design' | 'content'>('design');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cv_builder_darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cv_builder_darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // IndexedDB Resumes State
  const [allResumes, setAllResumes] = useState<ResumeRecord[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(localStorage.getItem('cv_builder_currentId'));
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);

  // Customization State (Now bound to the active CV)
  const [primaryColor, setPrimaryColor] = useState<string>('#651d3b'); 
  const [accentColor, setAccentColor] = useState<string>('#b3b3b3'); 
  const [contactBarColor, setContactBarColor] = useState<string>('#30101d');
  const [textColor, setTextColor] = useState<string>('#374151'); 
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  const [isSaving, setIsSaving] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // Initialize DB and Load Data
  useEffect(() => {
    const loadData = async () => {
      await initDB();
      let resumes = await getAllResumes();
      
      // Migration from LocalStorage
      const legacyData = localStorage.getItem('cv_builder_resumeData');
      if (resumes.length === 0 && legacyData) {
        const migrated = await createNewResume('Mi Primer CV');
        migrated.data = JSON.parse(legacyData);
        await saveResume(migrated);
        resumes = [migrated];
        localStorage.removeItem('cv_builder_resumeData');
      }

      if (resumes.length === 0) {
        const first = await createNewResume('Nuevo CV');
        resumes = [first];
      }

      setAllResumes(resumes);
      
      const lastId = localStorage.getItem('cv_builder_currentId');
      const active = resumes.find(r => r.id === lastId) || resumes[0];
      
      setCurrentId(active.id);
      setResumeData(active.data);
      if (active.data.visualSettings) {
        setPrimaryColor(active.data.visualSettings.primaryColor);
        setAccentColor(active.data.visualSettings.accentColor);
        setContactBarColor(active.data.visualSettings.contactBarColor);
        setTextColor(active.data.visualSettings.textColor);
        setFontSize(active.data.visualSettings.fontSize);
      }
      localStorage.setItem('cv_builder_currentId', active.id);
    };

    loadData();
  }, []);

  // Manual save to IndexedDB
  const handleSave = async (dataToSave = resumeData) => {
    if (!currentId) return;
    setIsSaving(true);
    
    const active = allResumes.find(r => r.id === currentId);
    if (active) {
      const updatedData: ResumeData = {
        ...dataToSave,
        visualSettings: {
          primaryColor,
          accentColor,
          contactBarColor,
          textColor,
          fontSize
        }
      };
      const updatedRecord = { ...active, data: updatedData };
      await saveResume(updatedRecord);
      
      // Update local state to keep everything in sync
      setAllResumes(prev => prev.map(r => r.id === currentId ? updatedRecord : r));
      
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 2000);
    }
    setIsSaving(false);
  };

  const handleSwitchResume = async (id: string) => {
    // Save current before switching (ensuring visual settings are saved)
    if (currentId) {
      const active = allResumes.find(r => r.id === currentId);
      if (active) {
        await saveResume({ 
          ...active, 
          data: { 
            ...resumeData, 
            visualSettings: { primaryColor, accentColor, contactBarColor, textColor, fontSize } 
          } 
        });
      }
    }

    const selected = allResumes.find(r => r.id === id);
    if (selected) {
      setCurrentId(id);
      setResumeData(selected.data);
      if (selected.data.visualSettings) {
        setPrimaryColor(selected.data.visualSettings.primaryColor);
        setAccentColor(selected.data.visualSettings.accentColor);
        setContactBarColor(selected.data.visualSettings.contactBarColor);
        setTextColor(selected.data.visualSettings.textColor);
        setFontSize(selected.data.visualSettings.fontSize);
      }
      localStorage.setItem('cv_builder_currentId', id);
    }
  };

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
  const jsonInputRef = useRef<HTMLInputElement>(null);

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
      const now = new Date();
      const dateStr = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}`;
      pdf.save(`CV_${resumeData.name.replace(/\s+/g, '_')}_${dateStr}.pdf`);
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
        setResumeData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setResumeData(prev => ({ ...prev, profileImage: undefined }));
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

  const handleAddNewResume = async () => {
    const name = window.prompt('Nombre del nuevo CV:', `CV ${allResumes.length + 1}`);
    if (name) {
      const newRec = await createNewResume(name);
      setAllResumes(prev => [...prev, newRec]);
      setCurrentId(newRec.id);
      setResumeData(newRec.data);
      localStorage.setItem('cv_builder_currentId', newRec.id);
    }
  };

  const handleDeleteResume = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (allResumes.length <= 1) {
      alert('Debes tener al menos un CV.');
      return;
    }
    if (window.confirm('¿Eliminar este CV permanentemente?')) {
      await deleteResume(id);
      const remaining = allResumes.filter(r => r.id !== id);
      setAllResumes(remaining);
      if (currentId === id) {
        setCurrentId(remaining[0].id);
        setResumeData(remaining[0].data);
        localStorage.setItem('cv_builder_currentId', remaining[0].id);
      }
    }
  };

  const handleDuplicateResume = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const source = allResumes.find(r => r.id === id);
    if (source) {
      const dup = await createNewResume(`${source.name} (Copia)`);
      dup.data = JSON.parse(JSON.stringify(source.data));
      await saveResume(dup);
      setAllResumes(prev => [...prev, dup]);
    }
  };

  const handleExportJSON = () => {
    const backup = {
      version: '1.0',
      timestamp: Date.now(),
      resumes: allResumes
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_Builder_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          if (content && Array.isArray(content.resumes)) {
            if (window.confirm(`Se importarán ${content.resumes.length} CVs. ¿Deseas continuar?`)) {
              for (const resume of content.resumes) {
                // Ensure unique IDs for imported resumes if they collide, 
                // but usually backups are for restoration. 
                // We'll keep IDs but update updatedAt.
                await saveResume(resume);
              }
              const updated = await getAllResumes();
              setAllResumes(updated);
              alert('Importación completada con éxito.');
            }
          } else {
            alert('El archivo JSON no tiene un formato válido.');
          }
        } catch (err) {
          alert('Error al leer el archivo JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar TODOS tus datos? Se borrarán todos los CVs guardados.')) {
      indexedDB.deleteDatabase('cv-builder-db');
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${darkMode ? 'dark bg-black' : 'bg-gray-100'}`}>
      
      {/* Sidebar Controls */}
      <aside className="w-full md:w-96 bg-white dark:bg-zinc-950 shadow-xl z-20 print:hidden flex-shrink-0 h-screen sticky top-0 flex flex-col border-r border-gray-200 dark:border-zinc-800">
        
        {/* Sidebar Header */}
        <div className="flex-shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 border-b border-gray-100 dark:border-zinc-900/50">
          <div className="p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-teal-500/10 p-2 rounded-xl">
                <Settings className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-800 dark:text-white leading-none tracking-tight">
                  CV BUILDER
                </h2>
                <span className="text-[10px] font-bold text-teal-500 uppercase tracking-[0.2em] opacity-80">Workspace</span>
              </div>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:bg-teal-50 dark:hover:bg-zinc-800 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-sm border border-gray-100 dark:border-zinc-800"
              title={darkMode ? "Modo Claro" : "Modo Oscuro"}
            >
              {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-indigo-400" />}
            </button>
          </div>
          
          <div className="px-5 pb-4">
            <div className="flex p-1 bg-gray-100/50 dark:bg-zinc-900/50 rounded-xl border border-gray-100 dark:border-zinc-800">
              <button 
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-1.5 text-xs font-bold flex items-center justify-center gap-2 rounded-lg transition-all ${activeTab === 'design' ? 'bg-white dark:bg-zinc-800 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'}`}
              >
                <Palette size={14} />
                Diseño
              </button>
              <button 
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-1.5 text-xs font-bold flex items-center justify-center gap-2 rounded-lg transition-all ${activeTab === 'content' ? 'bg-white dark:bg-zinc-800 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'}`}
              >
                <Edit3 size={14} />
                Contenido
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-6 custom-scrollbar bg-gray-50/30 dark:bg-black/20">
          
          {activeTab === 'design' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
              {/* Color Controls */}
              <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-5">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
                  <Palette size={16} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Configuración Visual</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">Fondo Encabezado</label>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-900 p-2 rounded-xl border border-gray-100 dark:border-zinc-800">
                    <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent overflow-hidden"
                    />
                    <span className="text-xs font-mono text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm flex-1">{primaryColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">Títulos Secciones</label>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-900 p-2 rounded-xl border border-gray-100 dark:border-zinc-800">
                    <input 
                      type="color" 
                      value={accentColor} 
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent overflow-hidden"
                    />
                    <span className="text-xs font-mono text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm flex-1">{accentColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">Barra de Contacto</label>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-900 p-2 rounded-xl border border-gray-100 dark:border-zinc-800">
                    <input 
                      type="color" 
                      value={contactBarColor} 
                      onChange={(e) => setContactBarColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent overflow-hidden"
                    />
                    <span className="text-xs font-mono text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm flex-1">{contactBarColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">Texto Cuerpo</label>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-900 p-2 rounded-xl border border-gray-100 dark:border-zinc-800">
                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent overflow-hidden"
                    />
                    <span className="text-xs font-mono text-gray-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm flex-1">{textColor}</span>
                  </div>
                </div>
              </div>

              {/* Theme Presets */}
              <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
                  <Type size={16} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Temas Master</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((theme, i) => {
                    const isSelected = 
                      primaryColor.toLowerCase() === theme.primary.toLowerCase() && 
                      contactBarColor.toLowerCase() === theme.contact.toLowerCase() &&
                      accentColor.toLowerCase() === theme.accent.toLowerCase();

                    return (
                      <button
                        key={i}
                        onClick={() => applyTheme(theme)}
                        className={`group relative flex flex-col gap-2 p-2.5 rounded-xl border transition-all text-left shadow-sm active:scale-95 ${
                          isSelected 
                            ? 'bg-teal-500 border-teal-500 ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-zinc-950' 
                            : 'bg-white dark:bg-zinc-900/40 border-gray-100 dark:border-zinc-800/50 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 w-full rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-900">
                          <div className="w-full h-3" style={{ backgroundColor: theme.primary }}></div>
                          <div className="w-full h-1.5" style={{ backgroundColor: theme.contact }}></div>
                        </div>
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-gray-500 dark:text-zinc-400'} group-hover:text-teal-600 dark:group-hover:text-teal-400`}>
                          {theme.name}
                        </span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-white text-teal-500 rounded-full p-0.5 shadow-md">
                            <Check size={10} strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Profile Image Control */}
              <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
                  <Upload size={16} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Identidad Visual</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-xl transition text-xs font-black shadow-lg shadow-zinc-200 dark:shadow-none uppercase tracking-widest"
                  >
                    <Upload size={14} />
                    Subir Foto
                  </button>
                  <input 
                      type="file" 
                      ref={imageInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*"
                      className="hidden"
                    />
                    {resumeData.profileImage && (
                      <button 
                        onClick={resetImage}
                        className="flex items-center justify-center gap-2 w-full py-2 px-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition text-[10px] font-bold uppercase tracking-widest"
                      >
                        <RefreshCw size={10} />
                        Borrar Imagen
                      </button>
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
              {/* Resume Manager Card */}
              <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                    <FolderOpen size={18} />
                    <h3 className="font-bold text-sm uppercase tracking-wider">Mis Currículums</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleSave()}
                      disabled={isSaving}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${
                        showSavedFeedback 
                          ? 'bg-green-500 text-white' 
                          : 'bg-teal-500 hover:bg-teal-600 text-white active:scale-95'
                      }`}
                    >
                      {showSavedFeedback ? <Check size={12} /> : isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                      {showSavedFeedback ? 'Guardado' : 'Guardar'}
                    </button>
                    <button 
                      onClick={handleAddNewResume}
                      className="p-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-500/20 transition-all"
                      title="Nuevo CV"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-hide pr-1">
                  {allResumes.map(res => (
                    <div 
                      key={res.id}
                      onClick={() => handleSwitchResume(res.id)}
                      className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        currentId === res.id 
                          ? 'bg-teal-500/5 border-teal-500/30 ring-1 ring-teal-500/20' 
                          : 'bg-gray-50/50 dark:bg-zinc-950/50 border-gray-100 dark:border-zinc-800 hover:border-teal-500/20'
                      }`}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-bold ${currentId === res.id ? 'text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-zinc-300'}`}>
                          {res.name}
                        </span>
                        <span className="text-[9px] text-gray-400 dark:text-zinc-500 uppercase font-bold tracking-tighter">
                          Editado: {new Date(res.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => handleDuplicateResume(res.id, e)}
                          className="p-1.5 text-gray-400 hover:text-teal-500 hover:bg-white dark:hover:bg-zinc-800 rounded-lg shadow-sm"
                          title="Duplicar"
                        >
                          <Copy size={12} />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteResume(res.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-zinc-800 rounded-lg shadow-sm"
                          title="Eliminar"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Import TXT Container */}
              <div className="p-5 bg-gradient-to-br from-teal-500/10 to-transparent dark:from-teal-500/5 border border-teal-500/20 dark:border-teal-500/10 rounded-2xl space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <FileText size={64} className="text-teal-600" />
                </div>
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-black text-teal-700 dark:text-teal-400 uppercase tracking-[0.2em] mb-1">AI Import</h3>
                    <p className="text-[10px] text-teal-600/80 dark:text-zinc-400 leading-relaxed max-w-[80%]">
                      ¿Ya tienes un CV? Impórtalo en formato .txt para que lo analicemos por ti.
                    </p>
                  </div>
                  <button 
                    onClick={handleReset}
                    className="p-2 text-teal-600/50 hover:text-red-500 transition-colors"
                    title="Reiniciar todo"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
                <button 
                  onClick={() => txtInputRef.current?.click()}
                  className="w-auto bg-teal-500 hover:bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl transition-all shadow-md shadow-teal-500/20 active:scale-95 inline-flex items-center gap-2"
                >
                  <Upload size={12} />
                  Seleccionar Archivo
                </button>
                <input 
                  type="file" 
                  ref={txtInputRef} 
                  onChange={handleTxtImport}
                  accept=".txt" 
                  className="hidden"
                />
              </div>

              {/* Backup JSON */}
              <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Download size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Copia de Seguridad</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={handleExportJSON}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-teal-500 hover:text-white rounded-xl transition text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-zinc-700"
                  >
                    <Download size={14} />
                    Exportar JSON
                  </button>
                  <button 
                    onClick={() => jsonInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-teal-500 hover:text-white rounded-xl transition text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-zinc-700"
                  >
                    <Upload size={14} />
                    Importar JSON
                  </button>
                  <input 
                    type="file" 
                    ref={jsonInputRef} 
                    onChange={handleImportJSON}
                    accept=".json" 
                    className="hidden"
                  />
                </div>
              </div>

              <ContentEditor 
                data={resumeData} 
                onChange={setResumeData} 
                onMoveItem={moveItem}
              />
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 dark:border-zinc-900/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md mt-auto">
          <button 
            onClick={handlePrint}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-teal-600/20 transition-all flex flex-col items-center justify-center leading-none hover:scale-[1.02] active:scale-[0.98] uppercase tracking-[0.1em]"
          >
            <div className="flex items-center gap-2 text-sm">
              <Printer size={16} />
              <span>Guardar PDF</span>
            </div>
            <span className="text-[8px] opacity-60 font-bold mt-2 tracking-[0.2em]">Formato Profesional / ATS Ready</span>
          </button>
        </div>
        
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 flex justify-center p-4 md:p-10 overflow-auto bg-gray-200 dark:bg-black scrollbar-hide">
        <Resume 
          data={resumeData} 
          primaryColor={primaryColor}
          accentColor={accentColor}
          contactBarColor={contactBarColor}
          textColor={textColor}
          fontSize={fontSize}
          onChange={setResumeData}
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
