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
  ExternalLink,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  course: Course;
  student: StudentProgress;
  onActiveTimeTick: () => void;
  onCourseCompleted: (hash: string) => void;
  onViewDiploma: (hash: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  course,
  student,
  onActiveTimeTick,
  onCourseCompleted,
  onViewDiploma,
}) => {
  const [activeTab, setActiveTab] = useState<'clase' | 'materiales' | 'tutor'>('clase');
  const [completedHash, setCompletedHash] = useState<string | undefined>(student.certificateHash);

  // Recopilar todos los materiales pedagógicos subidos por los docentes en todas las lecciones
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
    <div className="space-y-6">
      
      {/* 1. TARJETA DE IDENTIFICACIÓN DEL ALUMNO Y CURSO VALIDADO */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Identidad del Alumno */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/30 flex-shrink-0">
              <User className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Alumno Validado SENCE
                </span>
                <span className="text-xs text-slate-400 font-mono">RUT: {student.studentRut}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                {student.studentName}
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-300 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-orange-400" /> {student.companyName}
                </span>
                <span>•</span>
                <span className="text-slate-400">Último acceso: {student.lastAccess}</span>
              </div>
            </div>
          </div>

          {/* Ficha del Curso Disponible y Barra de Progreso */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 lg:w-96 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                Curso Activo Asignado
              </span>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono text-slate-300">
                {course.codeSence}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-100 line-clamp-1">{course.title}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Carga horaria: {course.hours} horas cronológicas</p>
            </div>

            {/* Progreso del Alumno */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Avance Curricular:</span>
                <span className="font-bold text-orange-400 font-mono">{student.percentageCompleted}%</span>
              </div>

              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-500"
                  style={{ width: `${student.percentageCompleted}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                <span>Permanencia activa: <strong className="text-slate-300">{formatTimer(student.totalTimeActiveSeconds)}</strong></span>
                {completedHash && (
                  <button
                    onClick={() => onViewDiploma(completedHash)}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <Award className="w-3 h-3" /> Ver Diploma
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. SELECTOR DE VENTANAS DEL ALUMNO */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setActiveTab('clase')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'clase'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Radio className="w-4 h-4 text-white animate-pulse" />
            <span>Ventana 1: Clases en Vivo & Aula SENCE</span>
          </button>

          <button
            onClick={() => setActiveTab('materiales')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'materiales'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-orange-400" />
            <span>Ventana 2: Materiales Cargados por Docentes</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-orange-400 border border-orange-500/40">
              {allMaterials.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tutor')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tutor'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-orange-400" />
            <span>Ventana 3: Profesor Virtual IA 24/7</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </button>

        </div>

        {/* Indicador de Transmisión SENCE */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Plataforma Sincronizada con NCh 2728</span>
        </div>
      </div>

      {/* 3. VISTAS Y VENTANAS DEL ALUMNO */}

      {/* VENTANA 1: CLASES EN VIVO & AULA VIRTUAL SENCE */}
      {activeTab === 'clase' && (
        <div className="space-y-4">
          <CoursePlayer
            course={course}
            onActiveTimeTick={onActiveTimeTick}
            onCourseCompleted={handleLessonCompleted}
          />
        </div>
      )}

      {/* VENTANA 2: MATERIALES CARGADOS POR LOS DOCENTES */}
      {activeTab === 'materiales' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>Biblioteca Oficial del Curso</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                Materiales Pedagógicos Asignados por los Instructores
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Descarga las normativas NFPA, guías operativas y manuales técnicos para estudio en faena o cuartel.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500">Total documentos: </span>
              <span className="text-xs font-bold text-slate-200 font-mono">{allMaterials.length} archivos</span>
            </div>
          </div>

          {allMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="bg-slate-950 border border-slate-800 hover:border-orange-500/40 p-4 rounded-xl flex items-center justify-between gap-4 transition-all group"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-10 h-10 rounded-xl bg-orange-950 text-orange-400 border border-orange-800/60 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-orange-300 transition-colors">
                        {mat.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        Módulo / Lección: <span className="text-slate-400">{mat.lessonTitle}</span>
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                        <span className="uppercase text-orange-400 font-semibold px-1 py-0.2 rounded bg-orange-950/60 border border-orange-900/50">
                          {mat.fileType}
                        </span>
                        <span>•</span>
                        <span>{mat.sizeMb} MB</span>
                        <span>•</span>
                        <span>Subido: {mat.uploadedAt}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Descargando documento pedagógico oficial: ${mat.title}`)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-orange-600 text-orange-400 hover:text-white border border-slate-800 hover:border-orange-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0 shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No hay materiales cargados por los docentes todavía.
            </div>
          )}
        </div>
      )}

      {/* VENTANA 3: PROFESOR VIRTUAL IA 24/7 */}
      {activeTab === 'tutor' && (
        <div className="max-w-4xl mx-auto">
          <TutorPanel />
        </div>
      )}

    </div>
  );
};
