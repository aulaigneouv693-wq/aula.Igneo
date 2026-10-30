import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ShieldCheck, ChevronRight, School, ArrowRight } from 'lucide-react';
import { MOCK_STUDENTS } from '../../data/mockData';
import { StudentProgress } from '../../types';

interface AuthPortalProps {
  onLoginSuccess: (role: 'student' | 'admin', studentData?: StudentProgress) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [rutOrUser, setRutOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (activeTab === 'student') {
      const cleanInput = rutOrUser.trim().toLowerCase();
      let matched = MOCK_STUDENTS[0];

      if (cleanInput) {
        const found = MOCK_STUDENTS.find(
          (s) =>
            s.studentRut.toLowerCase().replace(/[^0-9k]/gi, '').includes(cleanInput.replace(/[^0-9k]/gi, '')) ||
            s.studentName.toLowerCase().includes(cleanInput)
        );
        if (found) {
          matched = found;
        } else {
          matched = {
            ...MOCK_STUDENTS[0],
            studentRut: rutOrUser.trim(),
            studentName: 'Brigadista Registrado',
          };
        }
      }

      onLoginSuccess('student', matched);
    } else {
      onLoginSuccess('admin');
    }
  };

  const handleQuickDemoStudent = (idx: number) => {
    const student = MOCK_STUDENTS[idx];
    setRutOrUser(student.studentRut);
    setPassword('••••••••');
    onLoginSuccess('student', student);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-950 font-sans text-slate-100 selection:bg-orange-600 selection:text-white">
      
      {/* ===================== COLUMNA IZQUIERDA: FORMULARIO SOBRIO (IDÉNTICO A LA REFERENCIA) ===================== */}
      <div className="w-full md:w-[420px] lg:w-[450px] bg-[#0c1829] flex flex-col justify-between p-8 sm:p-12 z-10 shadow-2xl border-r border-slate-900/60">
        
        {/* Cabecera / Logos Institucionales */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/igneo/logo-igneo-light.webp"
              alt="OTEC Ígneo"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="h-6 w-[1px] bg-slate-700"></div>
            <img
              src="/assets/igneo/logo-bomberos-vina.webp"
              alt="Fundación Bomberos Viña del Mar"
              className="h-9 w-auto object-contain opacity-90"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Selector de Entrada sobrio (Estudiante / Administrativo) */}
          <div className="pt-2">
            <div className="flex border-b border-slate-700/60 text-sm font-medium">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('student');
                  setErrorMsg(null);
                  setRutOrUser('');
                }}
                className={`pb-2.5 px-1 transition-all relative ${
                  activeTab === 'student'
                    ? 'text-white font-bold border-b-2 border-orange-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Portal de Estudiantes
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setActiveTab('admin');
                  setErrorMsg(null);
                  setRutOrUser('');
                }}
                className={`ml-6 pb-2.5 px-1 transition-all relative ${
                  activeTab === 'admin'
                    ? 'text-white font-bold border-b-2 border-orange-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Portal Administrativo
              </button>
            </div>
          </div>
        </div>

        {/* Formulario de Login Sobrio */}
        <form onSubmit={handleLogin} className="space-y-7 my-8">
          
          {/* Input Usuario / RUT */}
          <div className="relative border-b border-slate-600 focus-within:border-orange-500 transition-colors pb-1">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={rutOrUser}
                onChange={(e) => setRutOrUser(e.target.value)}
                placeholder={activeTab === 'student' ? 'RUT (ej: 18.432.190-2)' : 'Usuario o Correo Institucional'}
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Input Contraseña */}
          <div className="relative border-b border-slate-600 focus-within:border-orange-500 transition-colors pb-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <Lock className="w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none tracking-wider"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 select-none py-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPassword ? 'Ocultar' : 'Ver'}</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
          )}

          {/* Botón Principal (Blanco sobrio como la imagen de referencia) */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 active:bg-slate-200 text-[#0c1829] font-bold text-sm rounded-none transition-all shadow-md uppercase tracking-wider"
            >
              Iniciar sesión
            </button>
          </div>

          {/* Enlace Olvidaste tu contraseña */}
          <div className="text-center pt-2">
            <a
              href="#recuperar"
              onClick={(e) => {
                e.preventDefault();
                alert('Para restablecer su clave, contacte al soporte de OTEC Ígneo: soporte@campus.igneo.cl');
              }}
              className="text-xs text-slate-400 hover:text-white hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Acceso Rápido Demo (Para agilizar la revisión) */}
          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 mb-2 font-medium">Accesos rápidos de prueba:</p>
            <div className="flex flex-col gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoStudent(0)}
                className="text-left text-[11px] text-slate-300 hover:text-orange-400 bg-slate-900/80 hover:bg-slate-900 p-2 rounded transition-colors flex items-center justify-between"
              >
                <span>👤 Entrar como <strong>Claudio Valenzuela (ENAP)</strong></span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </button>
              <button
                type="button"
                onClick={() => onLoginSuccess('admin')}
                className="text-left text-[11px] text-slate-300 hover:text-orange-400 bg-slate-900/80 hover:bg-slate-900 p-2 rounded transition-colors flex items-center justify-between"
              >
                <span>🛡️ Entrar como <strong>Docente / Administrador OTEC</strong></span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </button>
            </div>
          </div>
        </form>

        {/* Footer legal con marca tecnológica */}
        <div className="text-[11px] text-slate-400 space-y-1.5 pt-4 border-t border-slate-800/60">
          <p className="font-semibold text-slate-300">
            OTEC Ígneo — Bomberos Viña del Mar - Concón
          </p>
          <p className="text-[10px] text-orange-400/90 font-medium">
            Con tecnología de <strong className="text-orange-300">UniVerso693</strong>
          </p>
        </div>

      </div>

      {/* ===================== COLUMNA DERECHA: FONDO SOBRIO CON LISTA DE PROCESOS ===================== */}
      <div className="flex-1 relative bg-slate-900 flex items-center justify-center p-8 sm:p-16 overflow-hidden">
        
        {/* Imagen de Fondo desenfocada y tintada en blanco y negro suave (tal como en la imagen) */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter grayscale opacity-25 contrast-125"
          style={{
            backgroundImage: `url('/assets/igneo/_default.jpg')`,
          }}
        ></div>
        
        {/* Capa de contraste y gradiente */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/80 to-slate-950/70"></div>

        {/* Contenido Central */}
        <div className="relative z-10 max-w-xl w-full space-y-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-950/80 text-orange-400 border border-orange-800/80">
                <ShieldCheck className="w-3.5 h-3.5" /> Acreditación Oficial SENCE
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                • Con tecnología de <strong className="text-slate-200">UniVerso693</strong>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              {activeTab === 'student' ? 'Bienvenido al Portal de Estudiantes' : 'Bienvenido al Portal Administrativo'}
            </h1>
          </div>

          <div className="space-y-4 pt-2">
            <p className="text-sm font-semibold text-slate-300">
              {activeTab === 'student' ? 'Al ingresar podrás:' : 'En esta sección podrás:'}
            </p>

            <ul className="space-y-3.5 text-sm text-slate-300">
              {activeTab === 'student' ? (
                <>
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">&gt;</span>
                    <span>Acceder a tu curso asignado con validación de identidad SENCE</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">&gt;</span>
                    <span>Revisar tu progreso de permanencia activa y asistencia al segundo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">&gt;</span>
                    <span>Descargar materiales pedagógicos y normativas NFPA subidos por los docentes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">&gt;</span>
                    <span>Ingresar a tus clases en vivo y consultar con el Profesor Virtual IA 24/7</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">&gt;</span>
                    <span>Cargar cátedras, videos y material pedagógico PDF a los cursos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">&gt;</span>
                    <span>Exportar planillas oficiales Excel requeridas por fiscalizadores SENCE</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">&gt;</span>
                    <span>Matricular masivamente brigadas de empresas (ENAP, Codelco, Ventanas)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">&gt;</span>
                    <span>Validar diplomas criptográficos con código QR y SHA-256 en faena</span>
                  </li>
                </>
              )}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
