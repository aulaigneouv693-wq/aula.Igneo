import React, { useState } from 'react';
import { MOCK_CERTIFICATE_SAMPLE } from '../../data/mockData';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  Building2, 
  Award,
  ArrowLeft
} from 'lucide-react';

interface VerifyHashProps {
  initialHash?: string;
  onBackToDiploma: () => void;
}

export const VerifyHash: React.FC<VerifyHashProps> = ({ 
  initialHash,
  onBackToDiploma 
}) => {
  const [hashInput, setHashInput] = useState(initialHash || MOCK_CERTIFICATE_SAMPLE.hash);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<typeof MOCK_CERTIFICATE_SAMPLE | null>(
    MOCK_CERTIFICATE_SAMPLE
  );
  const [hasSearched, setHasSearched] = useState(true);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!hashInput.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setHasSearched(true);
      if (
        hashInput.trim() === MOCK_CERTIFICATE_SAMPLE.hash ||
        hashInput.trim().toLowerCase().startsWith('9f86')
      ) {
        setVerifiedResult(MOCK_CERTIFICATE_SAMPLE);
      } else {
        setVerifiedResult(null);
      }
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <button
        onClick={onBackToDiploma}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al Diploma</span>
      </button>

      {/* Cabecera Validador */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-xl space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">
          Portal Público de Validación Criptográfica de Diplomas
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Sistema antifraude SHA-256 para supervisores de faena, prevencionistas de riesgos y fiscalizadores SENCE.
        </p>

        {/* Input Buscador de Hash */}
        <form onSubmit={handleVerify} className="mt-4 flex gap-2 max-w-lg mx-auto">
          <input
            type="text"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            placeholder="Pegue o escanee el código SHA-256 del diploma..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isVerifying}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isVerifying ? 'Verificando...' : 'Verificar'}</span>
          </button>
        </form>
      </div>

      {/* Resultado de la Verificación */}
      {hasSearched && (
        <div>
          {verifiedResult ? (
            <div className="bg-slate-900 border border-emerald-600/50 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-emerald-300">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">DOCUMENTO AUTÉNTICO & RESOLUCIÓN VIGENTE</p>
                  <p className="text-emerald-400/80 text-[11px]">
                    El hash criptográfico coincide exactamente con el registro emitido en la Bóveda SENCE de OTEC Ígneo.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Alumno Titulado:</span>
                  <span className="font-bold text-slate-100">{verifiedResult.studentName} (RUT: {verifiedResult.studentRut})</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Curso Acreditado:</span>
                  <span className="font-bold text-slate-100 text-right">{verifiedResult.courseTitle}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Empresa Patrocinante:</span>
                  <span className="font-semibold text-slate-300">{verifiedResult.companyName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Fecha de Emisión:</span>
                  <span className="font-mono text-slate-300">{verifiedResult.issueDate}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Código SENCE:</span>
                  <span className="font-mono font-bold text-orange-400">{verifiedResult.senceCode}</span>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Huella SHA-256 Confirmada:</span>
                  <p className="font-mono text-[10px] text-slate-400 break-all bg-slate-950 p-2 rounded-lg border border-slate-800 mt-1">
                    {verifiedResult.hash}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-red-600/50 rounded-2xl p-6 shadow-xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-950/80 border border-red-700 flex items-center justify-center text-red-400">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-red-300">Certificado No Encontrado o Inválido</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No existe ningún folio SENCE ni diploma emitido con ese hash criptográfico. Verifique que no falten caracteres.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

