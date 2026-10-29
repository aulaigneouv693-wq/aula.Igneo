import React from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Bot, 
  FileSpreadsheet, 
  Users, 
  Award,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeSeconds: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, activeSeconds }) => {
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const navItems = [
    { id: 'student', label: 'Aula Alumno', icon: BookOpen, badge: 'SENCE' },
    { id: 'tutor', label: 'Tutor IA 24/7', icon: Bot, badge: 'RAG' },
    { id: 'admin', label: 'Auditoría SENCE', icon: FileSpreadsheet, badge: 'Fiscalización' },
    { id: 'b2b', label: 'Carga Masiva B2B', icon: Users, badge: 'Empresas' },
    { id: 'diploma', label: 'Validador QR', icon: Award, badge: 'SHA-256' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Institutional Logos */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img 
                src="/assets/igneo/logo-igneo-light.webp" 
                alt="OTEC Ígneo" 
                className="h-9 w-auto object-contain drop-shadow"
                onError={(e) => {
                  // Fallback visual si el asset tarda en cargar
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
              <span className="text-xs font-semibold tracking-wider text-orange-400 uppercase">
                Campus Virtual LMS
              </span>
              <span className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                OTEC Ígneo
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <ShieldCheck className="w-3 h-3 mr-0.5" /> SENCE Activo
                </span>
              </span>
            </div>
          </div>

          {/* SENCE Active Timer Indicator */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="text-xs">
              <span className="text-slate-400">Permanencia Forense: </span>
              <span className="font-mono font-bold text-orange-400">{formatTimer(activeSeconds)}</span>
            </div>
          </div>

          {/* Navigation Pill Menu (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1 py-0.2 rounded font-semibold uppercase ${
                      isActive 
                        ? 'bg-orange-800/80 text-orange-200' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-200">Claudio Valenzuela</p>
              <p className="text-[10px] text-slate-400">Refinería ENAP Aconcagua</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-red-600 flex items-center justify-center font-bold text-xs text-white shadow-inner">
              CV
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Subnav Strip */}
      <div className="md:hidden flex overflow-x-auto scrollbar-none px-3 py-2 bg-slate-950 border-t border-slate-800/80 gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${
                isActive
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
