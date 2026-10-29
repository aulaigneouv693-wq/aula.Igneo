import React, { useState } from 'react';
import { Course, Lesson, Module, PedagogicalMaterial, QuizQuestion } from '../../types';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Upload, 
  Video, 
  FileText, 
  Save, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  FolderPlus,
  ShieldCheck,
  Edit3,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';

interface TeacherContentManagerProps {
  course: Course;
  onUpdateCourse: (updated: Course) => void;
}

export const TeacherContentManager: React.FC<TeacherContentManagerProps> = ({
  course,
  onUpdateCourse,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(course.modules[0]?.id || '');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(course.modules[0]?.lessons[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'lessons' | 'materials' | 'quiz'>('lessons');
  const [savedAlert, setSavedAlert] = useState(false);

  // New Material form state
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialType, setNewMaterialType] = useState<'pdf' | 'normativa' | 'manual' | 'guia'>('pdf');
  const [newMaterialSize, setNewMaterialSize] = useState('2.5');

  // New Lesson form state
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('180');
  const [newLessonVideo, setNewLessonVideo] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [newLessonDesc, setNewLessonDesc] = useState('');

  const currentModule = course.modules.find((m) => m.id === selectedModuleId) || course.modules[0];
  const currentLesson = currentModule?.lessons.find((l) => l.id === selectedLessonId) || currentModule?.lessons[0];

  const handleSaveCourseNotification = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle.trim() || !currentLesson) return;

    const newMat: PedagogicalMaterial = {
      id: `mat-${Date.now()}`,
      title: newMaterialTitle.trim(),
      fileType: newMaterialType,
      sizeMb: parseFloat(newMaterialSize) || 1.5,
      downloadUrl: '#',
      uploadedAt: new Date().toLocaleDateString('es-CL'),
    };

    const updatedModules = course.modules.map((mod) => {
      if (mod.id !== currentModule.id) return mod;
      return {
        ...mod,
        lessons: mod.lessons.map((les) => {
          if (les.id !== currentLesson.id) return les;
          return {
            ...les,
            materials: [...(les.materials || []), newMat],
          };
        }),
      };
    });

    onUpdateCourse({ ...course, modules: updatedModules });
    setNewMaterialTitle('');
    handleSaveCourseNotification();
  };

  const handleDeleteMaterial = (materialId: string) => {
    if (!currentLesson) return;

    const updatedModules = course.modules.map((mod) => {
      if (mod.id !== currentModule.id) return mod;
      return {
        ...mod,
        lessons: mod.lessons.map((les) => {
          if (les.id !== currentLesson.id) return les;
          return {
            ...les,
            materials: (les.materials || []).filter((m) => m.id !== materialId),
          };
        }),
      };
    });

    onUpdateCourse({ ...course, modules: updatedModules });
    handleSaveCourseNotification();
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !currentModule) return;

    const createdLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: newLessonTitle.trim(),
      durationSeconds: parseInt(newLessonDuration, 10) || 180,
      videoUrl: newLessonVideo.trim(),
      completed: false,
      activeSecondsWatched: 0,
      description: newLessonDesc.trim() || 'Lección técnica impartida por instructores de OTEC Ígneo.',
      isLocked: true,
      materials: [],
    };

    const updatedModules = course.modules.map((mod) => {
      if (mod.id !== currentModule.id) return mod;
      return {
        ...mod,
        lessons: [...mod.lessons, createdLesson],
      };
    });

    onUpdateCourse({ ...course, modules: updatedModules });
    setIsAddingLesson(false);
    setNewLessonTitle('');
    setNewLessonDesc('');
    setSelectedLessonId(createdLesson.id);
    handleSaveCourseNotification();
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera del Portal Docente */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
            <Edit3 className="w-4 h-4 text-orange-500" />
            <span>Gestor de Contenidos & Cátedras — OTEC Ígneo</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Portal Docente: {course.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Código SENCE: <span className="font-mono text-slate-200">{course.codeSence}</span> | Horas Cronológicas: <span className="text-slate-200">{course.hours} hrs</span> | Instructor: <span className="text-orange-400 font-semibold">{course.instructor?.name || 'Cuerpo Docente'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedAlert && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cambios aplicados al Aula</span>
            </div>
          )}

          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500">Total Lecciones: </span>
            <span className="font-bold text-slate-200">
              {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs de Gestión Docente */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'lessons'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Estructura de Lecciones & Video</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'materials'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Carga de Materiales Pedagógicos (PDF / NFPA)</span>
          {currentLesson?.materials?.length ? (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-orange-400 border border-orange-500/30">
              {currentLesson.materials.length}
            </span>
          ) : null}
        </button>
      </div>

      {/* TAB 1: ESTRUCTURA DE LECCIONES */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Navegador de Módulos */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Módulos del Curso
              </h3>
              <button
                onClick={() => setIsAddingLesson(!isAddingLesson)}
                className="text-[11px] bg-orange-600 hover:bg-orange-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 font-semibold transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>Nueva Lección</span>
              </button>
            </div>

            <div className="space-y-3">
              {course.modules.map((mod) => (
                <div key={mod.id} className="space-y-1.5">
                  <div className="text-[11px] font-bold text-orange-400 px-2 flex items-center justify-between">
                    <span>{mod.title}</span>
                    <span className="text-[10px] text-slate-500">{mod.lessons.length} temas</span>
                  </div>

                  <div className="space-y-1">
                    {mod.lessons.map((les) => {
                      const isSelected = currentLesson?.id === les.id;
                      return (
                        <button
                          key={les.id}
                          onClick={() => {
                            setSelectedModuleId(mod.id);
                            setSelectedLessonId(les.id);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-orange-600/20 text-orange-200 border border-orange-500/40'
                              : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="font-semibold truncate">{les.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Exigencia SENCE: {Math.round(les.durationSeconds / 60)} min
                            </p>
                          </div>
                          <Video className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor de la Lección Seleccionada */}
          <div className="lg:col-span-2 space-y-4">
            {isAddingLesson ? (
              <form onSubmit={handleCreateLesson} className="bg-slate-900 border border-orange-500/40 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <FolderPlus className="w-4 h-4 text-orange-400" />
                    Crear Nueva Lección en: {currentModule?.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddingLesson(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Título de la Lección</label>
                  <input
                    type="text"
                    required
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="Ej. 2.2 Técnicas de Entrada Forzada y Ventilación Vertical"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Duración Requerida SENCE (Segundos)
                    </label>
                    <input
                      type="number"
                      required
                      value={newLessonDuration}
                      onChange={(e) => setNewLessonDuration(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Tiempo que el candado SENCE obligará a visualizar.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">URL de Video (MP4 o CDN)</label>
                    <input
                      type="url"
                      required
                      value={newLessonVideo}
                      onChange={(e) => setNewLessonVideo(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción Pedagógica / Objetivos</label>
                  <textarea
                    rows={3}
                    value={newLessonDesc}
                    onChange={(e) => setNewLessonDesc(e.target.value)}
                    placeholder="Detalla los conceptos clave que el alumno debe asimilar..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingLesson(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
                  >
                    Descartar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/30 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publicar Lección</span>
                  </button>
                </div>
              </form>
            ) : currentLesson ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                      Editando Lección Activa
                    </span>
                    <h3 className="text-base font-bold text-slate-100">{currentLesson.title}</h3>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Candado SENCE Activo ({Math.round(currentLesson.durationSeconds / 60)} min)
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Video enlazado</label>
                    <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <Video className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      <span className="text-xs text-slate-300 truncate font-mono">{currentLesson.videoUrl}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Descripción de la Cátedra</label>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      {currentLesson.description}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('materials')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-orange-400 hover:text-orange-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Cargar Materiales PDF a esta Lección ({currentLesson.materials?.length || 0})</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

        </div>
      )}

      {/* TAB 2: CARGA DE MATERIALES PEDAGÓGICOS (PDFs / MANUALES) */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Formulario de Subida de Insumos */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Upload className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-slate-100">Cargar Nuevo Documento</h3>
            </div>

            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del Documento / Guía
                </label>
                <input
                  type="text"
                  required
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  placeholder="Ej. Manual NFPA 1001: Módulo 1 (PDF)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Categoría Pedagógica
                </label>
                <select
                  value={newMaterialType}
                  onChange={(e) => setNewMaterialType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="pdf">Documento de Estudio (PDF)</option>
                  <option value="normativa">Normativa Internacional (NFPA)</option>
                  <option value="manual">Manual Operativo de Ígneo</option>
                  <option value="guia">Checklist / Guía de Faena</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Peso Estimado (MB)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newMaterialSize}
                  onChange={(e) => setNewMaterialSize(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition-all">
                <Upload className="w-6 h-6 text-orange-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-300">Arrastra tu archivo PDF o haz clic aquí</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Formatos admitidos: PDF, DOCX, PPTX (Máx. 50 MB)</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/30 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Asignar a Lección Activa</span>
              </button>
            </form>
          </div>

          {/* Inventario de Materiales Disponibles para el Alumno */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Materiales Descargables Asignados a la Lección
                </h3>
                <p className="text-xs text-slate-400">
                  Lección: <span className="text-orange-400 font-semibold">{currentLesson?.title}</span>
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {currentLesson?.materials?.length || 0} archivos activos
              </span>
            </div>

            {currentLesson?.materials && currentLesson.materials.length > 0 ? (
              <div className="space-y-2.5">
                {currentLesson.materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-950 text-orange-400 border border-orange-800/60 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{mat.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <span className="uppercase text-orange-400 font-semibold">{mat.fileType}</span>
                          <span>•</span>
                          <span>{mat.sizeMb} MB</span>
                          <span>•</span>
                          <span>Publicado: {mat.uploadedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteMaterial(mat.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
                        title="Eliminar documento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-slate-800/80 rounded-xl bg-slate-950/40">
                <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-400">No hay documentos adjuntos a esta lección todavía</p>
                <p className="text-[11px] text-slate-500 mt-1">Usa el formulario de la izquierda para subir manuales o PDFs.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
