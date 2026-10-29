import React, { useState, useEffect, useRef } from 'react';
import { Course, Lesson, QuizQuestion } from '../../types';
import { MOCK_QUIZ_QUESTIONS } from '../../data/mockData';
import { 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Clock, 
  ShieldCheck, 
  Award, 
  RotateCcw,
  BookOpen,
  HelpCircle,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoursePlayerProps {
  course: Course;
  onActiveTimeTick: () => void;
  onCourseCompleted: (hash: string) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  onActiveTimeTick,
  onCourseCompleted,
}) => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({
    'les-1-1': 0,
    'les-1-2': 0,
    'les-2-1': 0,
  });
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [bypassWarning, setBypassWarning] = useState<string | null>(null);
  const [isTabInactive, setIsTabInactive] = useState(false);
  
  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentModule = course.modules[currentModuleIndex];
  const currentLesson = currentModule.lessons[currentLessonIndex];
  const secondsWatched = lessonProgress[currentLesson.id] || 0;
  const isLessonFinished = completedLessons.includes(currentLesson.id);

  // Monitor Window Focus / Tab Inactivity for SENCE Compliance
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabInactive(true);
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        setIsTabInactive(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Timer Tick every 1 second when video is actively playing and tab is focused
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && !isTabInactive && !isLessonFinished) {
      interval = setInterval(() => {
        onActiveTimeTick();
        setLessonProgress((prev) => {
          const current = prev[currentLesson.id] || 0;
          const next = current + 1;
          
          // Auto complete lesson when required duration is achieved
          if (next >= currentLesson.durationSeconds && !completedLessons.includes(currentLesson.id)) {
            setCompletedLessons((prevCompleted) => [...prevCompleted, currentLesson.id]);
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 },
            });
          }
          return { ...prev, [currentLesson.id]: next };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, isTabInactive, currentLesson, isLessonFinished, completedLessons, onActiveTimeTick]);

  // Anti-Bypass: Prevent user from seeking forward
  const handleSeeking = () => {
    if (videoRef.current) {
      const allowedTime = lessonProgress[currentLesson.id] || 0;
      if (videoRef.current.currentTime > allowedTime + 2) {
        videoRef.current.currentTime = allowedTime;
        setBypassWarning('Candado SENCE Activo: Prohibido adelantar el video. Debe cumplir la permanencia efectiva de la lección.');
        setTimeout(() => setBypassWarning(null), 4500);
      }
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const selectLesson = (modIdx: number, lesIdx: number) => {
    const targetLesson = course.modules[modIdx].lessons[lesIdx];
    // Check if target lesson is unlocked
    const prevLessonNeeds = modIdx === 0 && lesIdx === 0 ? true : completedLessons.includes('les-1-1');
    if (!prevLessonNeeds && lesIdx > 0 && !completedLessons.includes(course.modules[modIdx].lessons[lesIdx - 1].id)) {
      setBypassWarning('Lección bloqueada: Debe completar la lección previa según la normativa curricular SENCE.');
      setTimeout(() => setBypassWarning(null), 3500);
      return;
    }

    setCurrentModuleIndex(modIdx);
    setCurrentLessonIndex(lesIdx);
    setIsPlaying(false);
  };

  const handleSelectQuizAnswer = (questionId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleGradeQuiz = () => {
    let correctCount = 0;
    MOCK_QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / MOCK_QUIZ_QUESTIONS.length) * 100);
    setQuizScore(percentage);
    setQuizSubmitted(true);

    if (percentage >= course.passingScorePercent) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
      const generatedHash = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
      onCourseCompleted(generatedHash);
    }
  };

  const totalLessonsCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalCompletedCount = completedLessons.length;
  const coursePercent = Math.round((totalCompletedCount / totalLessonsCount) * 100);
  const allLessonsCompleted = totalCompletedCount >= totalLessonsCount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Columna Principal: Reproductor y Contenido */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Banner de Advertencia SENCE / Anti-Bypass */}
        {bypassWarning && (
          <div className="flex items-center gap-3 p-3.5 bg-red-950/90 border border-red-600 rounded-xl text-red-200 text-sm shadow-lg animate-bounce">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="flex-1 font-medium">{bypassWarning}</div>
          </div>
        )}

        {/* Alerta de Pestaña Inactiva (Forense SENCE) */}
        {isTabInactive && (
          <div className="flex items-center gap-3 p-3.5 bg-amber-950/90 border border-amber-500 rounded-xl text-amber-200 text-sm shadow-lg">
            <EyeOff className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />
            <div>
              <span className="font-bold">Auditoría SENCE en Pausa:</span> Ha cambiado de pestaña o minimizado la ventana. La permanencia activa no se contabilizará hasta retomar la visualización.
            </div>
          </div>
        )}

        {/* Marco de Reproducción de Video */}
        <div className="relative bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-video flex items-center justify-center group">
          <video
            ref={videoRef}
            src={currentLesson.videoUrl}
            className="w-full h-full object-contain"
            onSeeking={handleSeeking}
            onEnded={() => {
              setIsPlaying(false);
            }}
            playsInline
          />

          {/* SENCE Watermark Overlay */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2 pointer-events-none">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Forense SENCE: <strong className="text-orange-400 font-mono">{course.codeSence}</strong></span>
          </div>

          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5 pointer-events-none">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>Exigido: <strong>{currentLesson.durationSeconds}s</strong> | Activo: <strong className="text-emerald-400 font-mono">{secondsWatched}s</strong></span>
          </div>

          {/* Controles Overlay Personalizados (Candado Anti-Bypass) */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col gap-2">
            
            {/* Barra de Progreso Bloqueada */}
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden relative cursor-not-allowed">
              <div 
                className="bg-orange-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (secondsWatched / currentLesson.durationSeconds) * 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="w-9 h-9 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center transition-transform active:scale-95 shadow-md"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <span className="font-mono text-slate-300">
                  {Math.floor(secondsWatched / 60)}:{(secondsWatched % 60).toString().padStart(2, '0')} / {Math.floor(currentLesson.durationSeconds / 60)}:{(currentLesson.durationSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                <Lock className="w-3 h-3 text-orange-400" />
                <span>Salto rápido inhabilitado por NCh 2728</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ficha de la Lección Actual */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800/50">
              {currentModule.title}
            </span>
            {isLessonFinished ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lección Validada por SENCE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800">
                <Clock className="w-3.5 h-3.5 animate-spin" /> En curso ({Math.round((secondsWatched / currentLesson.durationSeconds) * 100)}%)
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-100">{currentLesson.title}</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{currentLesson.description}</p>
        </div>

        {/* Módulo de Evaluación / Quiz Final */}
        {allLessonsCompleted && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-orange-900/40 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Evaluación Teórica Oficial SENCE</h3>
                  <p className="text-xs text-slate-400">Mínimo de aprobación: <strong>{course.passingScorePercent}%</strong> según NCh 2728</p>
                </div>
              </div>
              
              {quizSubmitted && quizScore !== null && (
                <div className={`px-4 py-1.5 rounded-xl text-sm font-bold border ${
                  quizScore >= course.passingScorePercent
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-red-950 text-red-300 border-red-700'
                }`}>
                  Calificación: {quizScore}% {quizScore >= course.passingScorePercent ? '— APROBADO' : '— REPROBADO'}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {MOCK_QUIZ_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-400 text-sm">{idx + 1}.</span>
                    <p className="text-sm font-medium text-slate-200">{q.question}</p>
                  </div>

                  <div className="space-y-2 pl-5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[q.id] === optIdx;
                      let optionStyle = 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700';
                      
                      if (quizSubmitted) {
                        if (optIdx === q.correctAnswer) {
                          optionStyle = 'border-emerald-600 bg-emerald-950/60 text-emerald-200 font-semibold';
                        } else if (isSelected && optIdx !== q.correctAnswer) {
                          optionStyle = 'border-red-600 bg-red-950/60 text-red-200';
                        }
                      } else if (isSelected) {
                        optionStyle = 'border-orange-500 bg-orange-950/40 text-orange-200 font-semibold shadow-inner';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correctAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-2 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="mt-2 pl-5 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                      <span className="font-semibold text-orange-400">{q.nfpaReference}:</span> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleGradeQuiz}
                disabled={Object.keys(quizAnswers).length < MOCK_QUIZ_QUESTIONS.length}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Enviar Evaluación y Cerrar Folio SENCE</span>
              </button>
            ) : (
              quizScore !== null && quizScore >= course.passingScorePercent && (
                <div className="p-4 bg-emerald-950/70 border border-emerald-600 rounded-xl text-center space-y-2">
                  <p className="text-sm font-bold text-emerald-300">¡Felicitaciones! Ha aprobado el curso bajo el estándar SENCE y NFPA 1001.</p>
                  <p className="text-xs text-slate-300">Su diploma con firma digital y hash SHA-256 ha sido emitido formalmente. Puede verificarlo en la pestaña <strong>Validador QR</strong>.</p>
                </div>
              )
            )}
          </div>
        )}

      </div>

      {/* Columna Lateral: Malla Curricular & Progreso */}
      <div className="space-y-4">
        
        {/* Tarjeta de Progreso General */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avance Global SENCE</span>
            <span className="font-bold text-orange-400 font-mono">{coursePercent}%</span>
          </div>

          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-orange-600 to-red-500 h-full transition-all duration-500"
              style={{ width: `${coursePercent}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 text-[10px] block">Horas Totales</span>
              <span className="font-bold text-slate-200">{course.hours} hrs cronológicas</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 text-[10px] block">Lecciones</span>
              <span className="font-bold text-slate-200">{totalCompletedCount} / {totalLessonsCount}</span>
            </div>
          </div>
        </div>

        {/* Lista de Módulos y Lecciones */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span>Contenido Programático</span>
          </h3>

          <div className="space-y-4">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {mod.title}
                </span>

                <div className="space-y-1.5">
                  {mod.lessons.map((les, lesIdx) => {
                    const isSelected = currentModuleIndex === modIdx && currentLessonIndex === lesIdx;
                    const isDone = completedLessons.includes(les.id);
                    const isAvailable = modIdx === 0 && lesIdx === 0 ? true : completedLessons.includes('les-1-1');

                    return (
                      <button
                        key={les.id}
                        onClick={() => selectLesson(modIdx, lesIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-orange-950/60 border-orange-500 text-orange-200 shadow-md'
                            : isDone
                            ? 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                            : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:border-slate-800'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isSelected ? (
                            <Play className="w-4 h-4 text-orange-400 fill-orange-400" />
                          ) : isAvailable ? (
                            <Clock className="w-4 h-4 text-slate-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{les.title}</p>
                          <span className="text-[10px] text-slate-500">
                            Duración: {les.durationSeconds}s
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
