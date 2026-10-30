import React, { useState } from 'react';
import { Course, StudentProgress, PedagogicalMaterial } from '../../types';
import { CoursePlayer } from './CoursePlayer';
import { TutorPanel } from '../tutor-ai/TutorPanel';
import { 
  User, 
  Building2, 
  BookOpen, 
  Clock, 
  FileText, 
  Download, 
  Video, 
  Bot, 
  ShieldCheck, 
  Radio, 
  Award, 
  LogOut,
  ChevronRight
} from 'lucide-react';

interface StudentDashboardProps {
  course: Course;
  student: StudentProgress;
  onActiveTimeTick: () => void;
  onCourseCompleted: (hash: string) => void;
  onViewDiploma: (hash: string) => void;
  onLogout: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  course,
  student,
  onActiveTimeTick,
  onCourseCompleted,
  onViewDiploma,
  onLogout,
}) => {
  // Las 3 ventanas esenciales requeridas:
  // 1. Clases en vivo & Aula
  // 2. Material cargado por docentes
  // 3. Profesor Virtual IA 24/7
  const [activeWindow, setActiveWindow] = useState<'clases' | 'materiales' | 'tutor'>('clases');
  const [completedHash, setCompletedHash] = useState<string | undefined>(student.certificateHash);

  // Recopilar todos los materiales pedagógicos subidos por los docentes
  const allMaterials: (PedagogicalMaterial & { lessonTitle: string })[] = [];
  course.modules.forEach((mod) => {
    mod.lessons.forEach((les) => {
      (les.materials || []).forEach((mat) => {
        allMaterials.push({ ...mat, lessonTitle: les.title });
      });
    });
  });

  const handleLessonCompleted = (hash: string) => {
    setCompletedHash(hash);
    onCourseCompleted(hash);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* ===================== BARRA SUPERIOR LIMPIA Y SOBRIA (SIN BOTONERA MOLESTA) ===================== */}
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
            Portal de Estudiantes
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-tight">{student.studentName}</p>
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

      {/* ===================== CONTENEDOR PRINCIPAL ===================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TARJETA PRINCIPAL: DATOS DEL ALUMNO, SU CURSO Y PROGRESO */}
        <div className="bg-[#0c1829] border border-slate-800/80 rounded-xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            
            {/* Identidad */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Alumno Validado SENCE
                </span>
                <span className="text-xs text-slate-400">{student.companyName}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {student.studentName}
              </h1>
            </div>

            {/* Curso Disponible */}
            <div className="text-left md:text-right space-y-0.5">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                Curso Disponible:
              </span>
              <p className="text-sm font-semibold text-slate-100">{course.title}</p>
              <p className="text-xs text-slate-400 font-mono">
                Código SENCE: {course.codeSence} | {course.hours} horas
              </p>
            </div>
          </div>

          {/* Barra de Progreso del Alumno */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Progreso general en el curso:</span>
              <span className="font-bold text-orange-400 font-mono text-sm">{student.percentageCompleted}%</span>
            </div>

            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-orange-500 h-full transition-all duration-500"
                style={{ width: `${student.percentageCompleted}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>Tiempo de permanencia activa registrado: <strong>{formatTimer(student.totalTimeActiveSeconds)}</strong></span>
              {completedHash && (
                <button
                  onClick={() => onViewDiploma(completedHash)}
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" /> Ver Diploma Acreditado
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===================== LAS 3 VENTANAS DEL ALUMNO (SOLO LO ESENCIAL) ===================== */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
          
          <button
            onClick={() => setActiveWindow('clases')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 flex-shrink-0 ${
              activeWindow === 'clases'
                ? 'border-orange-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-orange-400" />
            <span>Ventana de Clases en Vivo & Aula</span>
          </button>

          <button
            onClick={() => setActiveWindow('materiales')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 flex-shrink-0 ${
              activeWindow === 'materiales'
                ? 'border-orange-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-orange-400" />
            <span>Material Cargado por Docentes</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-orange-400 font-mono">
              {allMaterials.length}
            </span>
          </button>

          <button
            onClick={() => setActiveWindow('tutor')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 flex-shrink-0 ${
              activeWindow === 'tutor'
                ? 'border-orange-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-orange-400" />
            <span>Profesor Virtual IA 24/7</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </button>

        </div>

        {/* CONTENIDO DE LAS VENTANAS */}

        {/* 1. CLASES EN VIVO & AULA */}
        {activeWindow === 'clases' && (
          <div className="space-y-4">
            <CoursePlayer
              course={course}
              onActiveTimeTick={onActiveTimeTick}
              onCourseCompleted={handleLessonCompleted}
            />
          </div>
        )}

        {/* 2. MATERIAL CARGADO POR DOCENTES */}
        {activeWindow === 'materiales' && (
          <div className="bg-[#0c1829] border border-slate-800/80 rounded-xl p-6 shadow-xl space-y-5">
            <div className="border-b border-slate-800/80 pb-3">
              <h2 className="text-base font-bold text-white">
                Materiales Pedagógicos y Normativas Oficiales
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Archivos PDF, guías y manuales subidos por los docentes de OTEC Ígneo para este curso.
              </p>
            </div>

            {allMaterials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-lg flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-9 h-9 rounded bg-orange-950 text-orange-400 border border-orange-900/60 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>

                      <div className="truncate">
                        <h4 className="text-xs font-bold text-slate-200 truncate">{mat.title}</h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          Lección: {mat.lessonTitle}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="uppercase text-orange-400 font-semibold">{mat.fileType}</span>
                          <span>•</span>
                          <span>{mat.sizeMb} MB</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Descargando documento oficial: ${mat.title}`)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-orange-600 text-orange-400 hover:text-white border border-slate-800 hover:border-orange-500 rounded text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">
                No hay documentos adicionales cargados para este curso aún.
              </p>
            )}
          </div>
        )}

        {/* 3. PROFESOR VIRTUAL IA 24/7 */}
        {activeWindow === 'tutor' && (
          <div className="max-w-4xl mx-auto">
            <TutorPanel />
          </div>
        )}

      </main>

      {/* Footer Sobrio con marca de tecnología */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400 space-y-1">
        <p className="font-medium text-slate-300">
          OTEC Ígneo — Fundación Cuerpo de Bomberos de Viña del Mar - Concón
        </p>
        <p className="text-[11px] text-slate-400">
          Campus Virtual desarrollado con tecnología de <strong className="text-slate-200">UniVerso693 SpA</strong>
        </p>
      </footer>

    </div>
  );
};
