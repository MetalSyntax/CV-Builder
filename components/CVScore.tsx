import React, { useMemo } from 'react';
import { ResumeData } from '../types';
import { TrendingUp, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface CVScoreProps {
  data: ResumeData;
}

interface ScoreItem {
  label: string;
  tip: string;
  points: number;
  earned: boolean;
}

export const CVScore: React.FC<CVScoreProps> = ({ data }) => {
  const [expanded, setExpanded] = React.useState(false);

  const items = useMemo<ScoreItem[]>(() => [
    {
      label: 'Nombre completo',
      tip: 'Añade tu nombre completo al encabezado.',
      points: 5,
      earned: data.name.trim().split(' ').length >= 2
    },
    {
      label: 'Título profesional',
      tip: 'Un título profesional claro mejora el impacto inicial.',
      points: 5,
      earned: data.title.trim().length > 0
    },
    {
      label: 'Resumen profesional',
      tip: 'Un buen resumen capta la atención del reclutador (+10%).',
      points: 10,
      earned: data.summary.trim().length >= 80
    },
    {
      label: 'Email de contacto',
      tip: 'Añade tu correo electrónico de contacto.',
      points: 8,
      earned: data.contact.email.trim().length > 0
    },
    {
      label: 'Teléfono de contacto',
      tip: 'Incluye tu número de teléfono para contacto directo.',
      points: 5,
      earned: data.contact.phone.trim().length > 0
    },
    {
      label: 'LinkedIn',
      tip: 'Añade tu perfil de LinkedIn para aumentar la confianza del reclutador (+7%).',
      points: 7,
      earned: !!(data.contact.linkedin && data.contact.linkedin.trim().length > 0)
    },
    {
      label: 'Al menos 2 experiencias',
      tip: 'Incluye al menos 2 experiencias laborales visibles.',
      points: 15,
      earned: data.experience.filter(e => !e.hidden && e.role.trim()).length >= 2
    },
    {
      label: 'Tareas detalladas',
      tip: 'Añade al menos 3 tareas/logros a tu experiencia principal.',
      points: 10,
      earned: data.experience.some(e => !e.hidden && e.tasks.filter(t => t.trim()).length >= 3)
    },
    {
      label: 'Formación académica',
      tip: 'Incluye tu formación académica.',
      points: 10,
      earned: data.education.filter(e => !e.hidden && e.degree.trim()).length >= 1
    },
    {
      label: 'Habilidades (mín. 5)',
      tip: 'Lista al menos 5 habilidades relevantes.',
      points: 8,
      earned: data.skills.filter(s => s.trim()).length >= 5
    },
    {
      label: 'Idiomas',
      tip: 'Menciona los idiomas que dominas.',
      points: 7,
      earned: data.languages.filter(l => l.language.trim()).length >= 1
    },
    {
      label: 'Foto de perfil',
      tip: 'Una foto profesional puede mejorar el reconocimiento (+10%).',
      points: 10,
      earned: !!(data.profileImage && !data.hideProfileImage)
    },
  ], [data]);

  const totalPossible = items.reduce((acc, i) => acc + i.points, 0);
  const totalEarned = items.reduce((acc, i) => acc + (i.earned ? i.points : 0), 0);
  const score = Math.round((totalEarned / totalPossible) * 100);

  const color = score >= 80 ? 'text-emerald-500' : score >= 55 ? 'text-amber-500' : 'text-red-500';
  const bgColor = score >= 80 ? 'bg-emerald-500' : score >= 55 ? 'bg-amber-500' : 'bg-red-500';
  const borderColor = score >= 80 ? 'border-emerald-500/20' : score >= 55 ? 'border-amber-500/20' : 'border-red-500/20';

  const missing = items.filter(i => !i.earned);

  return (
    <div className={`bg-white dark:bg-zinc-900/40 rounded-2xl border ${borderColor} shadow-sm overflow-hidden`}>
      <button
        className="w-full p-5 flex items-center gap-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-100 dark:text-zinc-800" />
            <circle
              cx="28" cy="28" r="22" fill="none" strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - score / 100)}`}
              className={`${bgColor.replace('bg-', 'stroke-')} transition-all duration-700`}
              strokeLinecap="round"
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-sm font-black ${color}`}>{score}%</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <TrendingUp size={14} className={color} />
            <h3 className="font-black text-sm text-gray-800 dark:text-white uppercase tracking-wider">CV Score</h3>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
            {score >= 80 ? '¡Excelente! Tu CV está muy completo.' : score >= 55 ? 'Buen progreso, aún puedes mejorar.' : 'Tu CV necesita más información.'}
          </p>
          {missing.length > 0 && (
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">
              {missing.length} sugerencia{missing.length > 1 ? 's' : ''} pendiente{missing.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 dark:border-zinc-800 px-5 pb-4 pt-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {items.map((item, i) => (
            <div key={i} className={`flex items-start gap-2.5 py-1.5 px-2 rounded-lg ${item.earned ? 'opacity-50' : 'bg-gray-50 dark:bg-zinc-950/30'}`}>
              <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${item.earned ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                {item.earned ? <Check size={10} className="text-white" strokeWidth={3} /> : <AlertCircle size={10} className="text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-gray-700 dark:text-zinc-300">{item.label}</span>
                {!item.earned && <p className="text-[10px] text-gray-400 dark:text-zinc-500 leading-relaxed mt-0.5">{item.tip}</p>}
              </div>
              <span className={`text-[10px] font-black flex-shrink-0 ${item.earned ? 'text-emerald-500' : 'text-gray-300 dark:text-zinc-600'}`}>+{item.points}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
