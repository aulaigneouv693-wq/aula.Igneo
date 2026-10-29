import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { CoursePlayer } from './modules/student/CoursePlayer';
import { TutorPanel } from './modules/tutor-ai/TutorPanel';
import { SenceAuditor } from './modules/admin/SenceAuditor';
import { B2BBatchEnrollment } from './modules/admin/B2BBatchEnrollment';
import { CertificateView } from './modules/verification/CertificateView';
import { VerifyHash } from './modules/verification/VerifyHash';
import { MOCK_COURSE } from './data/mockData';
import { ShieldAlert, BookOpen, Bot, FileSpreadsheet, Users, Award } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('student');
  const [totalActiveSeconds, setTotalActiveSeconds] = useState<number>(142);
  const [completedHash, setCompletedHash] = useState<string | undefined>(undefined);
  const [verifyTargetHash, setVerifyTargetHash] = useState<string | undefined>(undefined);

  const handleActiveTimeTick = () => {
    setTotalActiveSeconds((prev) => prev + 1);
  };

  const handleCourseCompleted = (hash: string) => {
    setCompletedHash(hash);
  };

  const handleOpenVerifier = (hash: string) => {
    setVerifyTargetHash(hash);
    setCurrentTab('verificar_hash');
  };

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100">
      
      {/* Header Institucional Unificado */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        activeSeconds={totalActiveSeconds}
      />

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'student' && (
          <CoursePlayer
            course={MOCK_COURSE}
            onActiveTimeTick={handleActiveTimeTick}
            onCourseCompleted={handleCourseCompleted}
          />
        )}

        {currentTab === 'tutor' && (
          <div className="max-w-4xl mx-auto">
            <TutorPanel />
          </div>
        )}

        {currentTab === 'admin' && (
          <SenceAuditor />
        )}

        {currentTab === 'b2b' && (
          <B2BBatchEnrollment />
        )}

        {currentTab === 'diploma' && (
          <CertificateView
            completedHash={completedHash}
            onOpenVerifier={handleOpenVerifier}
          />
        )}

        {currentTab === 'verificar_hash' && (
          <VerifyHash
            initialHash={verifyTargetHash}
            onBackToDiploma={() => setCurrentTab('diploma')}
          />
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

