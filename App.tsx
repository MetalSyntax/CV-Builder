import React, { useState, useRef } from 'react';
import { Download, Printer, Settings, Upload, RefreshCw, Edit3, Palette, FileText } from 'lucide-react';
import Resume from './components/Resume';
import ContentEditor from './components/ContentEditor';
import { INITIAL_DATA } from './constants';
import { ResumeData } from './types';
import { parseResumeTxt } from './utils/resumeParser';

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
  const [textColor, setTextColor] = useState<string>('#374151'); 
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_IMAGE);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const txtInputRef = useRef<HTMLInputElement>(null);

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
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
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
              />
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50 mt-auto">
          <button 
            onClick={handlePrint}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Guardar PDF
          </button>
        </div>
        
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 flex justify-center p-4 md:p-10 overflow-auto bg-gray-200">
        <Resume 
          data={resumeData} 
          primaryColor={primaryColor}
          accentColor={accentColor}
          textColor={textColor}
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
