import React, { useState } from 'react';
import { MOCK_CERTIFICATE_SAMPLE } from '../../data/mockData';
import { CertificateData } from '../../types';
import { 
  Award, 
  QrCode, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Search, 
  ExternalLink,
  Flame
} from 'lucide-react';

interface CertificateViewProps {
  completedHash?: string;
  onOpenVerifier: (hash: string) => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ 
  completedHash,
  onOpenVerifier 
}) => {
  const [copied, setCopied] = useState(false);
  const cert: CertificateData = {
    ...MOCK_CERTIFICATE_SAMPLE,
    hash: completedHash || MOCK_CERTIFICATE_SAMPLE.hash,
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(cert.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Barra de Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-orange-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">Diploma Digital Oficial con Firma Criptográfica</h3>
            <p className="text-xs text-slate-400">Verificable por prevencionistas y supervisores mineros en terreno.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenVerifier(cert.hash)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-orange-400" />
            <span>Probar Escaneo QR</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-orange-600/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>
      </div>

      {/* Diploma Oficial Renderizado (Formato Imprimible) */}
      <div className="relative bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border-8 border-double border-slate-200 overflow-hidden print:m-0 print:border-none">
        
        {/* Marca de Agua de Fondo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Flame className="w-96 h-96 text-orange-600" />
        </div>

        {/* Encabezado Institucional del Diploma */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-900 pb-6 gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/igneo/logo-igneo.png" 
              alt="OTEC Ígneo" 
              className="h-12 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="h-8 w-[1px] bg-slate-300 hidden sm:block"></div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Organismo Técnico de Capacitación
              </p>
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                OTEC ÍGNEO
              </h1>
              <p className="text-[10px] text-slate-600">Fundación Cuerpo de Bomberos de Viña del Mar - Concón</p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className="inline-block px-3 py-1 bg-red-100 text-red-800 font-mono font-bold text-xs rounded border border-red-200">
              CÓDIGO SENCE: {cert.senceCode}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Resolución Exenta NCh 2728</p>
          </div>
        </div>

        {/* Cuerpo del Diploma */}
        <div className="text-center py-10 space-y-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
            Certifica formalmente que
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-wide underline decoration-orange-500 decoration-2 underline-offset-8">
            {cert.studentName}
          </h2>

          <p className="text-xs text-slate-700 font-mono font-medium">
            RUT: <strong>{cert.studentRut}</strong> | Empresa: <strong>{cert.companyName}</strong>
          </p>

          <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed pt-2">
            Ha cumplido satisfactoriamente con la totalidad de exigencias curriculares, horas de permanencia activa bajo fiscalización SENCE y evaluación teórica del programa de entrenamiento técnico:
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-lg mx-auto">
            <p className="text-base font-bold text-slate-900">
              {cert.courseTitle}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Carga horaria: <strong>{cert.hours} horas cronológicas</strong> | Estándar NFPA 1001 & 1981
            </p>
          </div>
        </div>

        {/* Pie de Firma y Validación Criptográfica */}
        <div className="grid grid-cols-1 sm:grid-cols-3 items-end pt-6 border-t-2 border-slate-200 gap-6 text-center sm:text-left">
          
          {/* QR de Validación Instantánea */}
          <div className="flex flex-col items-center sm:items-start space-y-1.5">
            <div className="p-2 bg-slate-900 rounded-lg text-white shadow-md inline-block">
              <QrCode className="w-16 h-16 text-orange-400" />
            </div>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
              Escanea para validar en terreno
            </span>
          </div>

          {/* Firma Instructor */}
          <div className="text-center space-y-1">
            <div className="w-40 mx-auto border-b border-slate-400 pb-1">
              <span className="font-serif italic text-base text-slate-800">M. Romero V.</span>
            </div>
            <p className="text-[10px] font-bold text-slate-800 uppercase">Director Ejecutivo</p>
            <p className="text-[9px] text-slate-500">OTEC Ígneo / Fundación Bomberos Viña</p>
          </div>

          {/* Sello Antifraude SHA-256 */}
          <div className="text-center sm:text-right space-y-1">
            <div className="flex items-center justify-center sm:justify-end gap-1 text-emerald-700 font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>FOLIO SENCE VALIDADO</span>
            </div>
            <p className="text-[10px] text-slate-500">Fecha de Emisión: {cert.issueDate}</p>
            <p className="text-[9px] font-mono text-slate-600 truncate max-w-[200px] ml-auto" title={cert.hash}>
              SHA-256: {cert.hash.substring(0, 16)}...
            </p>
          </div>

        </div>

      </div>

      {/* Caja de Información de Integridad Criptográfica */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="text-slate-400">Hash SHA-256 Registrado en Bóveda SENCE:</span>
          <p className="font-mono text-orange-400 text-[11px] break-all select-all">{cert.hash}</p>
        </div>

        <button
          onClick={handleCopyHash}
          className="flex-shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-all"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copiado' : 'Copiar Hash'}</span>
        </button>
      </div>

    </div>
  );
};

