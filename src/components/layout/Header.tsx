import React from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Bot, 
  FileSpreadsheet, 
  Users, 
  Award,
  Edit3,
  UserCheck,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

interface HeaderProps {
  portalMode: 'student' | 'teacher';
  onSelectPortalMode: (mode: 'student' | 'teacher') => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeSeconds: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  portalMode,
  onSelectPortalMode,
  currentTab, 
  onSelectTab, 
  activeSeconds 
}) => {
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const studentNavItems = [
    { id: 'student', label: 'Mi Curso Validado', icon: BookOpen, badge: 'SENCE' },
    { id: 'tutor', label: 'Tutor IA 24/7', icon: Bot, badge: 'Groq LPU' },
    { id: 'diploma', label: 'Mi Diploma', icon: Award, badge: 'SHA-256' },
  ];

  const teacherNavItems = [
    { id: 'teacher_content', label: 'Carga de Materiales', icon: Edit3, badge: 'Docente' },
    { id: 'admin', label: 'Auditoría SENCE', icon: FileSpreadsheet, badge: 'Excel' },
    { id: 'b2b', label: 'Carga Masiva B2B', icon: Users, badge: 'Empresas' },
    { id: 'verificar_hash', label: 'Validador Faena', icon: Award, badge: 'QR' },
  ];

  const currentNavItems = portalMode === 'student' ? studentNavItems : teacherNavItems;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Institutional Logos & Branding */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/igneo/logo-igneo-light.webp" 
                alt="OTEC Ígneo" 
                className="h-9 w-auto object-contain drop-shadow"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="h-6 w-[1px] bg-slate-700 hidden sm:block"></div>
              <img 
                src="/assets/igneo/logo-bomberos-vina.webp" 
                alt="Fundación Bomberos Viña del Mar" 
                className="h-8 w-auto object-contain hidden sm:block opacity-90"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-wider text-orange-400 uppercase">
                Campus Virtual LMS
              </span>
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                OTEC Ígneo
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <ShieldCheck className="w-2.5 h-2.5 mr-0.5" /> SENCE Activo
                </span>
              </span>
            </div>
          </div>

          {/* DUAL PORTAL SWITCHER: ALUMNO vs DOCENTE */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                onSelectPortalMode('student');
                onSelectTab('student');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                portalMode === 'student'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Portal Alumno</span>
            </button>

            <button
              onClick={() => {
                onSelectPortalMode('teacher');
                onSelectTab('teacher_content');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                portalMode === 'teacher'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Portal Docente & Admin</span>
            </button>
          </div>

          {/* SENCE Active Timer Indicator (en modo alumno) */}
          {portalMode === 'student' ? (
            <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="text-xs">
                <span className="text-slate-500 text-[11px]">Permanencia SENCE: </span>
                <span className="font-mono font-bold text-orange-400">{formatTimer(activeSeconds)}</span>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-900/60 text-xs text-blue-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-[11px]">Modo Administración OTEC</span>
            </div>
          )}

          {/* Navigation Items (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? portalMode === 'student'
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 font-semibold'
                        : 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-slate-300 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>
      </div>

      {/* Sub-bar Mobile Menu */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 border-t border-slate-800 py-2 px-2">
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium p-1 rounded-lg ${
                isActive ? 'text-orange-400' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
