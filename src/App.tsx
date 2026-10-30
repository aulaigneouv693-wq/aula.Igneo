import React, { useState } from 'react';
import { AuthPortal } from './modules/auth/AuthPortal';
import { StudentDashboard } from './modules/student/StudentDashboard';
import { AdminDashboard } from './modules/admin/AdminDashboard';
import { CertificateView } from './modules/verification/CertificateView';
import { MOCK_COURSE, MOCK_STUDENTS } from './data/mockData';
import { Course, StudentProgress } from './types';

export const App: React.FC = () => {
  // Estado de Autenticación: 'login' | 'student' | 'admin' | 'diploma'
  const [currentUserRole, setCurrentUserRole] = useState<'login' | 'student' | 'admin'>('login');
  const [activeStudent, setActiveStudent] = useState<StudentProgress>(MOCK_STUDENTS[0]);
  const [course, setCourse] = useState<Course>(MOCK_COURSE);
  const [viewingDiplomaHash, setViewingDiplomaHash] = useState<string | null>(null);

  const handleLoginSuccess = (role: 'student' | 'admin', studentData?: StudentProgress) => {
    if (role === 'student' && studentData) {
      setActiveStudent(studentData);
    }
    setCurrentUserRole(role);
    setViewingDiplomaHash(null);
  };

  const handleLogout = () => {
    setCurrentUserRole('login');
    setViewingDiplomaHash(null);
  };

  const handleActiveTimeTick = () => {
    setActiveStudent((prev) => ({
      ...prev,
      totalTimeActiveSeconds: prev.totalTimeActiveSeconds + 1,
    }));
  };

  const handleCourseCompleted = (hash: string) => {
    setActiveStudent((prev) => ({
      ...prev,
      percentageCompleted: 100,
      status: 'completado',
      certificateHash: hash,
    }));
  };

  // 1. PANTALLA DE ACCESO (SOBRIA, IDÉNTICA A LA IMAGEN DE REFERENCIA)
  if (currentUserRole === 'login') {
    return <AuthPortal onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. VISTA ESPECIAL DIPLOMA (SI EL ALUMNO LO ABRE)
  if (viewingDiplomaHash) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex flex-col justify-between">
        <div className="max-w-4xl mx-auto w-full space-y-4">
          <button
            onClick={() => setViewingDiplomaHash(null)}
            className="text-xs text-orange-400 hover:text-orange-300 font-bold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded transition-colors"
          >
            ← Volver a mi curso
          </button>
          <CertificateView
            completedHash={viewingDiplomaHash}
            onOpenVerifier={() => {}}
          />
        </div>
      </div>
    );
  }

  // 3. ENTRADA ALUMNO: SOLO VE SU NOMBRE, SU CURSO, SU PROGRESO Y LAS 3 VENTANAS
  if (currentUserRole === 'student') {
    return (
      <StudentDashboard
        course={course}
        student={activeStudent}
        onActiveTimeTick={handleActiveTimeTick}
        onCourseCompleted={handleCourseCompleted}
        onViewDiploma={(hash) => setViewingDiplomaHash(hash)}
        onLogout={handleLogout}
      />
    );
  }

  // 4. ENTRADA ADMINISTRATIVA & DOCENTE
  return (
    <AdminDashboard
      course={course}
      onUpdateCourse={(updated) => setCourse(updated)}
      onLogout={handleLogout}
    />
  );
};

export default App;
