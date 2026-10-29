import React, { useState } from 'react';
import { MOCK_STUDENTS, MOCK_COURSE } from '../../data/mockData';
import { StudentProgress } from '../../types';
import { 
  FileSpreadsheet, 
  Download, 
  ShieldCheck, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  FileCheck2,
  RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const SenceAuditor: React.FC = () => {
  const [students, setStudents] = useState<StudentProgress[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('todos');
  const [isExporting, setIsExporting] = useState(false);

  const companies = Array.from(new Set(students.map((s) => s.companyName)));

  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentRut.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany === 'todos' || s.companyName === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  // Generador 1-Clic de Planilla Oficial SENCE
  const handleExportSenceExcel = () => {
    setIsExporting(true);

    try {
      const reportRows = filteredStudents.map((s, index) => {
        const activeMinutes = (s.totalTimeActiveSeconds / 60).toFixed(1);
        const requiredMinutes = (s.requiredTimeSeconds / 60).toFixed(1);
        
        return {
          'N°': index + 1,
          'CÓDIGO SENCE': MOCK_COURSE.codeSence,
          'NOMBRE DEL CURSO': MOCK_COURSE.title,
          'RUT PARTICIPANTE': s.studentRut,
          'NOMBRE COMPLETO': s.studentName,
          'EMPRESA CONTRATANTE': s.companyName,
          'TIEMPO ACTIVO REGISTRADO (MIN)': activeMinutes,
          'TIEMPO EXIGIDO (MIN)': requiredMinutes,
          'PORCENTAJE AVANCE': `${s.percentageCompleted}%`,
          'NOTA EVALUACIÓN FINAL': s.quizScore ? `${s.quizScore}%` : 'Pendiente',
          'ESTADO SENCE': s.status === 'completado' ? 'APROBADO CONFORME' : 'EN EJECUCIÓN',
          'HASH DIGITAL FORENSE (SHA-256)': s.certificateHash || 'EN_PROCESO_AUDITORIA',
          'FECHA AUDITORÍA': new Date().toLocaleDateString('es-CL'),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(reportRows);
      
      // Auto dimensionar columnas
      worksheet['!cols'] = [
        { wch: 5 },  // N°
        { wch: 20 }, // CÓDIGO SENCE
        { wch: 45 }, // CURSO
        { wch: 16 }, // RUT
        { wch: 30 }, // NOMBRE
        { wch: 30 }, // EMPRESA
        { wch: 25 }, // TIEMPO ACTIVO
        { wch: 20 }, // TIEMPO EXIGIDO
        { wch: 18 }, // AVANCE
        { wch: 22 }, // EVALUACIÓN
        { wch: 20 }, // ESTADO SENCE
        { wch: 40 }, // HASH
        { wch: 15 }, // FECHA
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'PLANILLA_SENCE_OFICIAL');

      const fileName = `PLANILLA_SENCE_${MOCK_COURSE.codeSence}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error generando archivo Excel:', error);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Superior de Fiscalización */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Módulo de Auditoría Forense SENCE / NCh 2728</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Libro Digital de Clases & Trazabilidad de Asistencia
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registro al segundo de permanencia activa y verificación biométrica/digital para inspectores SENCE.
          </p>
        </div>

        {/* Botón 1-Clic de Descarga Excel */}
        <button
          onClick={handleExportSenceExcel}
          disabled={isExporting}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 text-xs flex items-center justify-center gap-2.5 transition-all flex-shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{isExporting ? 'Generando Planilla...' : 'Exportar Planilla SENCE Excel (1-Clic)'}</span>
        </button>
      </div>

      {/* Métricas Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Alumnos Matriculados</span>
          <p className="text-2xl font-bold text-slate-100 mt-1">{students.length}</p>
          <span className="text-[10px] text-slate-500">Distribuidos en {companies.length} empresas</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Horas Validadas por SENCE</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">100% Forense</p>
          <span className="text-[10px] text-slate-500">Candado anti-bypass activo</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Diplomas Emitidos con QR</span>
          <p className="text-2xl font-bold text-orange-400 mt-1">
            {students.filter((s) => s.status === 'completado').length}
          </p>
          <span className="text-[10px] text-slate-500">Con firma criptográfica SHA-256</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Código SENCE Vigente</span>
          <p className="text-sm font-mono font-bold text-slate-200 mt-2">{MOCK_COURSE.codeSence}</p>
          <span className="text-[10px] text-emerald-400">Resolución Activa</span>
        </div>
      </div>

      {/* Filtros de Búsqueda */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Nombre o RUT del participante..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          >
            <option value="todos">Todas las Empresas</option>
            {companies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Fiscalización SENCE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Participante</th>
                <th className="py-3 px-4">RUT</th>
                <th className="py-3 px-4">Empresa</th>
                <th className="py-3 px-4">Tiempo Activo Forense</th>
                <th className="py-3 px-4">Avance</th>
                <th className="py-3 px-4">Evaluación</th>
                <th className="py-3 px-4">Estado SENCE</th>
                <th className="py-3 px-4">Certificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.map((s, idx) => {
                const isComplete = s.status === 'completado';
                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-100 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-orange-400">
                        {s.studentName.charAt(0)}
                      </div>
                      <span>{s.studentName}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{s.studentRut}</td>
                    <td className="py-3 px-4 text-slate-400">{s.companyName}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className="text-emerald-400 font-bold">
                        {Math.floor(s.totalTimeActiveSeconds / 60)}m {s.totalTimeActiveSeconds % 60}s
                      </span>
                      <span className="text-slate-500 text-[10px] block">
                        Exigido: {Math.floor(s.requiredTimeSeconds / 60)}m
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            className="bg-orange-500 h-full"
                            style={{ width: `${s.percentageCompleted}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-[11px] text-slate-300">{s.percentageCompleted}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {s.quizScore ? (
                        <span className="font-mono font-bold text-emerald-400">{s.quizScore}%</span>
                      ) : (
                        <span className="text-slate-500 italic">Pendiente</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isComplete ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Aprobado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" /> En Curso
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px]">
                      {s.certificateHash ? (
                        <span className="text-orange-400 truncate max-w-[120px] block" title={s.certificateHash}>
                          {s.certificateHash.substring(0, 12)}...
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
