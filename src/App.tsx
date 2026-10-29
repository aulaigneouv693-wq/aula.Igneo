import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { StudentDashboard } from './modules/student/StudentDashboard';
import { TeacherContentManager } from './modules/teacher/TeacherContentManager';
import { SenceAuditor } from './modules/admin/SenceAuditor';
import { B2BBatchEnrollment } from './modules/admin/B2BBatchEnrollment';
import { CertificateView } from './modules/verification/CertificateView';
import { VerifyHash } from './modules/verification/VerifyHash';
import { MOCK_COURSE, MOCK_STUDENTS } from './data/mockData';
import { Course, StudentProgress } from './types';

export const App: React.FC = () => {
  const [portalMode, setPortalMode] = useState<'student' | 'teacher'>('student');
  const [currentTab, setCurrentTab] = useState<string>('student');
  const [course, setCourse] = useState<Course>(MOCK_COURSE);
  const [student, setStudent] = useState<StudentProgress>(MOCK_STUDENTS[0]); // Claudio Valenzuela (ENAP)
  
  const [totalActiveSeconds, setTotalActiveSeconds] = useState<number>(142);
  const [completedHash, setCompletedHash] = useState<string | undefined>(undefined);
  const [verifyTargetHash, setVerifyTargetHash] = useState<string | undefined>(undefined);

  const handleActiveTimeTick = () => {
    setTotalActiveSeconds((prev) => prev + 1);
    setStudent((prev) => ({
      ...prev,
      totalTimeActiveSeconds: prev.totalTimeActiveSeconds + 1,
    }));
  };

  const handleCourseCompleted = (hash: string) => {
    setCompletedHash(hash);
    setStudent((prev) => ({
      ...prev,
      percentageCompleted: 100,
      status: 'completado',
      certificateHash: hash,
    }));
  };

  const handleOpenVerifier = (hash: string) => {
    setVerifyTargetHash(hash);
    setCurrentTab('verificar_hash');
  };

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100">
      
      {/* Header Institucional con Switcher de Portales (Alumno vs Docente/Admin) */}
      <Header
        portalMode={portalMode}
        onSelectPortalMode={(mode) => {
          setPortalMode(mode);
          setCurrentTab(mode === 'student' ? 'student' : 'teacher_content');
        }}
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        activeSeconds={totalActiveSeconds}
      />

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ===================== ENTRADA 1: PORTAL ALUMNO ===================== */}
        {portalMode === 'student' && (
          <>
            {currentTab === 'student' && (
              <StudentDashboard
                course={course}
                student={student}
                onActiveTimeTick={handleActiveTimeTick}
                onCourseCompleted={handleCourseCompleted}
                onViewDiploma={(hash) => {
                  setCompletedHash(hash);
                  setCurrentTab('diploma');
                }}
              />
            )}

            {currentTab === 'tutor' && (
              <div className="max-w-4xl mx-auto">
                <StudentDashboard
                  course={course}
                  student={student}
                  onActiveTimeTick={handleActiveTimeTick}
                  onCourseCompleted={handleCourseCompleted}
                  onViewDiploma={(hash) => {
                    setCompletedHash(hash);
                    setCurrentTab('diploma');
                  }}
                />
              </div>
            )}

            {currentTab === 'diploma' && (
              <CertificateView
                completedHash={completedHash || student.certificateHash}
                onOpenVerifier={handleOpenVerifier}
              />
            )}

            {currentTab === 'verificar_hash' && (
              <VerifyHash
                initialHash={verifyTargetHash}
                onBackToDiploma={() => setCurrentTab('student')}
              />
            )}
          </>
        )}

        {/* ===================== ENTRADA 2: PORTAL DOCENTE & ADMINISTRATIVO ===================== */}
        {portalMode === 'teacher' && (
          <>
            {currentTab === 'teacher_content' && (
              <TeacherContentManager
                course={course}
                onUpdateCourse={(updated) => setCourse(updated)}
              />
            )}

            {currentTab === 'admin' && (
              <SenceAuditor />
            )}

            {currentTab === 'b2b' && (
              <B2BBatchEnrollment />
            )}

            {currentTab === 'verificar_hash' && (
              <VerifyHash
                initialHash={verifyTargetHash}
                onBackToDiploma={() => setCurrentTab('teacher_content')}
              />
            )}
          </>
        )}

      </main>

      {/* Pie de Página Institucional */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-400">
          OTEC Ígneo — Organismo Técnico de Capacitación de la Fundación Cuerpo de Bomberos de Viña del Mar - Concón
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Infraestructura de Aprendizaje SENCE & IA desarrollada por <strong>UNIVERSO693 SpA</strong> (RUT: 78.521.951-1)
        </p>
      </footer>

    </div>
  );
};

export default App;
