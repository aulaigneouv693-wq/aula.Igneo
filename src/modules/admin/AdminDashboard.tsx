import React, { useState } from 'react';
import { TeacherContentManager } from '../teacher/TeacherContentManager';
import { SenceAuditor } from '../admin/SenceAuditor';
import { B2BBatchEnrollment } from '../admin/B2BBatchEnrollment';
import { VerifyHash } from '../verification/VerifyHash';
import { Course } from '../../types';
import { 
  Edit3, 
  FileSpreadsheet, 
  Users, 
  Award, 
  LogOut, 
  ShieldCheck, 
  Building2,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  course: Course;
  onUpdateCourse: (updated: Course) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  course,
  onUpdateCourse,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'sence' | 'b2b' | 'verify'>('content');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* BARRA SUPERIOR SOBRIA */}
      <header className="bg-[#0c1829] border-b border-slate-800/80 sticky top-0 z-50 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/assets/igneo/logo-igneo-light.webp"
            alt="OTEC Ígneo"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="h-5 w-[1px] bg-slate-700 hidden sm:block"></div>
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
            Portal Administrativo & Docente
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-tight">Coordinación OTEC Ígneo</p>
            <p className="text-[10px] text-orange-400 font-medium">Tecnología de UniVerso693</p>
          </div>

          <button
            onClick={onLogout}
            className="text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 border border-slate-700/60"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* MENÚ DE SECCIONES ADMINISTRATIVAS */}
      <div className="bg-[#0c1829]/60 border-b border-slate-800 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
          
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'content'
                ? 'border-orange-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-orange-400" />
            <span>Carga de Materiales & Cátedras</span>
          </button>

          <button
            onClick={() => setActiveTab('sence')}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'sence'
                ? 'border-orange-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-orange-400" />
            <span>Auditoría SENCE (Planillas Excel)</span>
          </button>

          <button
            onClick={() => setActiveTab('b2b')}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'b2b'
                ? 'border-orange-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-orange-400" />
            <span>Carga Masiva B2B Empresas</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'verify'
                ? 'border-orange-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-orange-400" />
            <span>Validador Criptográfico SHA-256</span>
          </button>

        </div>
      </div>

      {/* CONTENIDO ADMINISTRATIVO */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'content' && (
          <TeacherContentManager
            course={course}
            onUpdateCourse={onUpdateCourse}
          />
        )}

        {activeTab === 'sence' && (
          <SenceAuditor />
        )}

        {activeTab === 'b2b' && (
          <B2BBatchEnrollment />
        )}

        {activeTab === 'verify' && (
          <VerifyHash onBackToDiploma={() => setActiveTab('content')} />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400 space-y-1">
        <p className="font-medium text-slate-300">
          OTEC Ígneo — Organismo Técnico de Capacitación de la Fundación Cuerpo de Bomberos de Viña del Mar - Concón
        </p>
        <p className="text-[11px] text-slate-400">
          Infraestructura desarrollada con tecnología de <strong className="text-slate-200">UniVerso693 SpA</strong> (RUT: 78.521.951-1)
        </p>
      </footer>

    </div>
  );
};
