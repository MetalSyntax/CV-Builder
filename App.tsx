import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Printer, Settings, Upload, RefreshCw, Edit3, Palette, FileText, Moon, Sun, Type, Undo2, Redo2, User } from 'lucide-react';
import Resume from './components/Resume';
import ContentEditor from './components/ContentEditor';
import { SectionManager } from './components/editor/SectionManager';
import { AppearanceForm } from './components/editor/AppearanceForm';
import { INITIAL_DATA } from './constants';
import { ResumeData } from './types';
import { parseResumeTxt } from './utils/resumeParser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  initDB, getAllResumes, saveResume, createNewResume, deleteResume, ResumeRecord 
} from './utils/db';
import { Plus, Trash2, FolderOpen, Copy, Save, Check, XCircle } from 'lucide-react';
import { ToastContainer, ToastType } from './components/common/Toast';
import { Modal } from './components/common/Modal';

// Icono de usuario gris para imagen por defecto (SVG Data URL)
const DEFAULT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'%3E%3C/path%3E%3C/svg%3E";

const HexColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
  const [textValue, setTextValue] = useState(value);

  // Sync text value if external value changes
  useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setTextValue(newVal);
    // Only update actual color if valid hex
    if (/^#[0-9A-F]{6}$/i.test(newVal) || /^#[0-9A-F]{3}$/i.test(newVal)) {
      onChange(newVal);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setTextValue(newVal);
    onChange(newVal);
  };

  return (
    <div className="space-y-1.5 flex flex-col group">
      <label className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">{label}</label>
      <div className="flex items-center bg-gray-50 dark:bg-zinc-900/80 p-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 focus-within:border-teal-500 dark:focus-within:border-teal-500 transition-colors shadow-sm overflow-hidden h-10">
        <div className="relative w-7 h-7 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-inner group-hover:scale-105 transition-transform cursor-pointer">
          <input 
            type="color" 
            value={value} 
            onChange={handleColorChange}
            className="absolute inset-[-10px] w-[50px] h-[50px] cursor-pointer border-0 p-0 bg-transparent"
            title={`Seleccionar color para ${label}`}
          />
        </div>
        <input 
          type="text" 
          value={textValue}
          onChange={handleTextChange}
          placeholder="#000000"
          className="flex-1 min-w-0 bg-transparent border-0 outline-none text-xs font-mono text-gray-700 dark:text-zinc-300 px-2 uppercase"
          maxLength={7}
        />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Tabs: 'design' | 'content' | 'user'
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'user'>('design');
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

  // History State (Undo/Redo)
  const [history, setHistory] = useState<ResumeData[]>([INITIAL_DATA]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUpdatingHistory = useRef(false);

  // Customization State (Now bound to the active CV)
  const [primaryColor, setPrimaryColor] = useState<string>('#651d3b'); 
  const [accentColor, setAccentColor] = useState<string>('#b3b3b3'); 
  const [contactBarColor, setContactBarColor] = useState<string>('#30101d');
  const [textColor, setTextColor] = useState<string>('#374151'); 
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  const [isSaving, setIsSaving] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const lastSavedData = useRef<string>('');

  // Editing Resume Title State
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);
  const [editingResumeName, setEditingResumeName] = useState<string>("");

  // Toast State
  const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType }[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'prompt';
    defaultValue?: string;
    onConfirm: (value?: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    onConfirm: () => {}
  });

  const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => {
    setModalConfig({ ...config, isOpen: true });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

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
      
      // Clean existing &nbsp; or \u00A0 from old data
      const cleanDataStr = JSON.stringify(active.data).replace(/&nbsp;/g, ' ').replace(/\\u00A0/g, ' ');
      const cleanData = JSON.parse(cleanDataStr);
      
      setResumeData(cleanData);
      
      // Initialize history
      setHistory([cleanData]);
      setHistoryIndex(0);
      lastSavedData.current = JSON.stringify(cleanData);

      if (cleanData.visualSettings) {
        setPrimaryColor(cleanData.visualSettings.primaryColor);
        setAccentColor(cleanData.visualSettings.accentColor);
        setContactBarColor(cleanData.visualSettings.contactBarColor);
        setTextColor(cleanData.visualSettings.textColor);
        setFontSize(cleanData.visualSettings.fontSize);
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
      lastSavedData.current = JSON.stringify(updatedData);
      
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 2000);
    }
    setIsSaving(false);
  };

  // Autosave Effect
  useEffect(() => {
    if (!currentId) return;
    const currentDataStr = JSON.stringify(resumeData);
    
    if (currentDataStr === lastSavedData.current) return;

    const timeoutId = setTimeout(() => {
      handleSave(resumeData);
    }, 2000); // Autosave after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [resumeData, primaryColor, accentColor, contactBarColor, textColor, fontSize, currentId]);

  // History Recording Effect
  useEffect(() => {
    if (isUpdatingHistory.current) {
      isUpdatingHistory.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      setHistory(prev => {
        const currentHistory = prev.slice(0, historyIndex + 1);
        const lastState = currentHistory[currentHistory.length - 1];
        
        if (JSON.stringify(lastState) !== JSON.stringify(resumeData)) {
          const newHistory = [...currentHistory, resumeData];
          // Keep only last 50 states to prevent memory bloat
          if (newHistory.length > 50) {
            return newHistory.slice(newHistory.length - 50);
          }
          return newHistory;
        }
        return prev;
      });

      setHistoryIndex(prev => {
        const currentHistory = history.slice(0, prev + 1);
        const lastState = currentHistory[currentHistory.length - 1];
        
        if (JSON.stringify(lastState) !== JSON.stringify(resumeData)) {
          return Math.min(prev + 1, 49);
        }
        return prev;
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, [resumeData]);

  const undo = () => {
    if (historyIndex > 0) {
      isUpdatingHistory.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setResumeData(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isUpdatingHistory.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setResumeData(history[newIndex]);
    }
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
      
      const cleanDataStr = JSON.stringify(selected.data).replace(/&nbsp;/g, ' ').replace(/\\u00A0/g, ' ');
      const cleanData = JSON.parse(cleanDataStr);
      
      setResumeData(cleanData);
      
      // Reset history for new document
      setHistory([cleanData]);
      setHistoryIndex(0);
      lastSavedData.current = JSON.stringify(cleanData);

      if (cleanData.visualSettings) {
        setPrimaryColor(cleanData.visualSettings.primaryColor);
        setAccentColor(cleanData.visualSettings.accentColor);
        setContactBarColor(cleanData.visualSettings.contactBarColor);
        setTextColor(cleanData.visualSettings.textColor);
        setFontSize(cleanData.visualSettings.fontSize);
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

  const updateFontSize = (field: keyof ResumeData['fontSizes'], value: number) => {
    setResumeData(prev => ({
      ...prev,
      fontSizes: { ...prev.fontSizes, [field]: value }
    }));
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
    const firstFrame = document.querySelector<HTMLElement>('.resume-page-frame');
    if (!firstFrame) return;

    const PAGE_H = 1056;

    try {
      setIsExporting(true);

      // onclone runs inside html2canvas's own cloned document — React never touches it,
      // so these DOM changes are safe and won't be reverted by a re-render.
      const canvas = await html2canvas(firstFrame, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollY: 0,
        scrollX: 0,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        onclone: (clonedDoc: Document) => {
          // Force main wrappers to visible to avoid scroll cropping
          const mainElement = clonedDoc.querySelector('main');
          if (mainElement) {
            mainElement.style.overflow = 'visible';
            mainElement.style.height = 'auto';
            mainElement.style.position = 'static';
          }

          // Reset any scale transform on the wrapper
          const clonedWrapper = clonedDoc.getElementById('resume-wrapper');
          if (clonedWrapper) {
            clonedWrapper.style.transform = 'none';
            clonedWrapper.classList.remove('scale-90', 'scale-105', 'origin-top');
          }

          // Expand the first frame so its full content is captured (no clipping, no shadow)
          const clonedFrame = clonedDoc.querySelector<HTMLElement>('.resume-page-frame');
          if (clonedFrame) {
            clonedFrame.style.overflow = 'visible';
            clonedFrame.style.height = 'auto';
            clonedFrame.style.boxShadow = 'none';
            clonedFrame.style.outline = 'none';
            clonedFrame.classList.remove('shadow-2xl');

            // Put inner div back in normal flow so height is measured correctly
            const innerDiv = clonedFrame.firstElementChild as HTMLElement | null;
            if (innerDiv) {
              innerDiv.style.position = 'static';
              innerDiv.style.top = 'auto';
            }
          }

          // Hide every other frame and the page-separator labels
          let seen = false;
          clonedDoc.querySelectorAll<HTMLElement>('.resume-page-frame, .print\\:hidden').forEach(el => {
            if (el.classList.contains('resume-page-frame')) {
              if (!seen) { seen = true; }
              else { el.style.display = 'none'; }
            } else {
              el.style.display = 'none';
            }
          });
        }
      });

      const pdfPageHeightPx = PAGE_H * 2; // matches scale: 2
      const numPdfPages = Math.max(1, Math.ceil(canvas.height / pdfPageHeightPx));

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter', compress: true });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < numPdfPages; i++) {
        if (i > 0) pdf.addPage();
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = pdfPageHeightPx;
        const ctx = pageCanvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, -i * pdfPageHeightPx);
        pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      const now = new Date();
      const dateStr = `${now.getDate().toString().padStart(2, '0')}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getFullYear()}`;
      pdf.save(`CV_${resumeData.name.replace(/\s+/g, '_')}_${dateStr}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      showToast('Hubo un error al generar el PDF.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const dateStr = `${day}_${month}_${year}`;
    
    // Format name: Replace spaces with underscores and remove special characters
    const cleanName = resumeData.name
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/\s+/g, '_');
      
    document.title = `CV_${cleanName}_${dateStr}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
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
    openModal({
      title: 'Nuevo CV',
      message: 'Introduce el nombre para tu nuevo currículum:',
      type: 'prompt',
      defaultValue: `CV ${allResumes.length + 1}`,
      onConfirm: async (name) => {
        if (name) {
          const newRec = await createNewResume(name);
          setAllResumes(prev => [...prev, newRec]);
          setCurrentId(newRec.id);
          setResumeData(newRec.data);
          localStorage.setItem('cv_builder_currentId', newRec.id);
          showToast('Nuevo CV creado con éxito.', 'success');
        }
        closeModal();
      }
    });
  };

  const handleDeleteResume = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (allResumes.length <= 1) {
      showToast('Debes tener al menos un CV.', 'warning');
      return;
    }

    openModal({
      title: 'Eliminar CV',
      message: '¿Estás seguro de que quieres eliminar este CV permanentemente? Esta acción no se puede deshacer.',
      type: 'confirm',
      onConfirm: async () => {
        await deleteResume(id);
        const remaining = allResumes.filter(r => r.id !== id);
        setAllResumes(remaining);
        if (currentId === id) {
          setCurrentId(remaining[0].id);
          setResumeData(remaining[0].data);
          localStorage.setItem('cv_builder_currentId', remaining[0].id);
        }
        showToast('CV eliminado correctamente.', 'info');
        closeModal();
      }
    });
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

  const handleStartEditing = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingResumeId(id);
    setEditingResumeName(name);
  };

  const handleUpdateResumeName = async () => {
    if (!editingResumeId || !editingResumeName.trim()) {
      setEditingResumeId(null);
      return;
    }

    const resumeToUpdate = allResumes.find(r => r.id === editingResumeId);
    if (resumeToUpdate && resumeToUpdate.name !== editingResumeName) {
      const updatedRecord = { ...resumeToUpdate, name: editingResumeName };
      await saveResume(updatedRecord);
      setAllResumes(prev => prev.map(r => r.id === editingResumeId ? updatedRecord : r));
    }
    setEditingResumeId(null);
  };

  const handleKeyDownEditing = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdateResumeName();
    } else if (e.key === 'Escape') {
      setEditingResumeId(null);
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
            openModal({
              title: 'Importar JSON',
              message: `Se detectaron ${content.resumes.length} CVs en el archivo. ¿Deseas importarlos todos?`,
              type: 'confirm',
              onConfirm: async () => {
                for (const resume of content.resumes) {
                  await saveResume(resume);
                }
                const updated = await getAllResumes();
                setAllResumes(updated);
                showToast('Importación completada con éxito.', 'success');
                closeModal();
              }
            });
          } else {
            showToast('El archivo JSON no tiene un formato válido.', 'error');
          }
        } catch (err) {
          showToast('Error al leer el archivo JSON.', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    openModal({
      title: 'Reiniciar Todo',
      message: '¿Estás completamente seguro de que quieres borrar TODOS tus datos? Esta acción es irreversible.',
      type: 'confirm',
      onConfirm: () => {
        indexedDB.deleteDatabase('cv-builder-db');
        localStorage.clear();
        window.location.reload();
      }
    });
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${darkMode ? 'dark bg-black' : 'bg-gray-100'} print:bg-transparent print:min-h-0`}>

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
              <button 
                onClick={() => setActiveTab('user')}
                className={`flex-1 py-1.5 text-xs font-bold flex items-center justify-center gap-2 rounded-lg transition-all ${activeTab === 'user' ? 'bg-white dark:bg-zinc-800 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'}`}
              >
                <User size={14} />
                Usuario
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-6 custom-scrollbar bg-gray-50/30 dark:bg-black/20">
          
          {activeTab === 'design' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
              
              {/* Layout Manager */}
              <SectionManager data={resumeData} updateField={updateField} />

              {/* Appearance Form */}
              <AppearanceForm data={resumeData} updateField={updateField} updateFontSize={updateFontSize} />

              {/* Color Controls */}
              <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800/50 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
                  <Palette size={16} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Configuración Visual</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                  <HexColorPicker 
                    label="Encabezado" 
                    value={primaryColor} 
                    onChange={setPrimaryColor} 
                  />
                  <HexColorPicker 
                    label="Seccs / Título" 
                    value={accentColor} 
                    onChange={setAccentColor} 
                  />
                  <HexColorPicker 
                    label="Contacto" 
                    value={contactBarColor} 
                    onChange={setContactBarColor} 
                  />
                  <HexColorPicker 
                    label="Texto" 
                    value={textColor} 
                    onChange={setTextColor} 
                  />
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
          )}

          {activeTab === 'user' && (
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
                      <div className="flex flex-col min-w-0 flex-1">
                        {editingResumeId === res.id ? (
                          <div className="flex items-center gap-1 w-full mr-2">
                            <input
                              autoFocus
                              type="text"
                              value={editingResumeName}
                              onChange={(e) => setEditingResumeName(e.target.value)}
                              onBlur={handleUpdateResumeName}
                              onKeyDown={handleKeyDownEditing}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-bold bg-white dark:bg-zinc-800 border border-teal-500 rounded-lg px-2 py-1 outline-none w-full text-teal-600 dark:text-teal-400 shadow-sm"
                            />
                          </div>
                        ) : (
                          <span 
                            onClick={(e) => handleStartEditing(res.id, res.name, e)}
                            className={`text-xs font-bold truncate ${currentId === res.id ? 'text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-zinc-300'}`}
                          >
                            {res.name}
                          </span>
                        )}
                        <span className="text-[9px] text-gray-400 dark:text-zinc-500 uppercase font-bold tracking-tighter">
                          Editado: {new Date(res.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => handleStartEditing(res.id, res.name, e)}
                          className="p-1.5 text-gray-400 hover:text-teal-500 hover:bg-white dark:hover:bg-zinc-800 rounded-lg shadow-sm"
                          title="Renombrar"
                        >
                          <Edit3 size={12} />
                        </button>
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
            </div>
          )}

          {activeTab === 'content' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
              <ContentEditor 
                data={resumeData} 
                onChange={setResumeData} 
                onMoveItem={moveItem}
              />
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 dark:border-zinc-900/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md mt-auto space-y-2">
          <button
            onClick={handlePrint}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-teal-600/20 transition-all flex flex-col items-center justify-center leading-none hover:scale-[1.02] active:scale-[0.98] uppercase tracking-[0.1em]"
          >
            <div className="flex items-center gap-2 text-sm">
              <Printer size={16} />
              <span>Guardar PDF</span>
            </div>
            <span className="text-[8px] opacity-60 font-bold mt-2 tracking-[0.2em]">Imprimir / Diálogo del navegador</span>
          </button>
           {/*<button>
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black py-3 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-[0.1em] text-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            {isExporting
              ? <><RefreshCw size={14} className="animate-spin" /><span>Generando…</span></>
              : <><Download size={14} /><span>Descargar PDF directo</span></>
            }
          </button>*/}
        </div>
        
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 flex justify-center p-4 md:p-10 overflow-auto bg-gray-200 dark:bg-black scrollbar-hide print:p-0 print:m-0 print:bg-transparent print:overflow-visible">
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

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 print:hidden">
        <button 
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-3 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-full shadow-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          title="Deshacer"
        >
          <Undo2 size={20} className="group-active:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-3 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-full shadow-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          title="Rehacer"
        >
          <Redo2 size={20} className="group-active:translate-x-1 transition-transform" />
        </button>
        
        <button 
          onClick={() => handleSave()}
          disabled={isSaving || showSavedFeedback}
          className={`p-4 rounded-full shadow-2xl transition-all flex items-center justify-center ${
            showSavedFeedback 
              ? 'bg-green-500 text-white scale-110' 
              : 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95'
          }`}
          title="Guardar Cambios"
        >
          {showSavedFeedback ? <Check size={24} /> : isSaving ? <RefreshCw size={24} className="animate-spin" /> : <Save size={24} />}
        </button>

        {/* Mobile Print Fab */}
        <button 
          onClick={handlePrint}
          className="md:hidden p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all active:scale-95 flex items-center justify-center"
          title="Imprimir / PDF"
        >
          <Printer size={24} />
        </button>
      </div>

      {/* Modal Dialogs */}
      <Modal 
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        defaultValue={modalConfig.defaultValue}
        onConfirm={modalConfig.onConfirm}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

    </div>
  );
};

export default App;
