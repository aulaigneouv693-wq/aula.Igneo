import React, { useState } from 'react';
import { 
  Users, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  Mail, 
  Key, 
  Building2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface BatchWorker {
  id: number;
  rut: string;
  nombre: string;
  email: string;
  cargo: string;
  faena: string;
}

export const B2BBatchEnrollment: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState('Refinería Aconcagua ENAP');
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchUploaded, setBatchUploaded] = useState(false);
  const [dispatchedCount, setDispatchedCount] = useState<number | null>(null);

  const sampleWorkers: BatchWorker[] = [
    { id: 1, rut: '18.432.190-2', nombre: 'Claudio Valenzuela Tapia', email: 'c.valenzuela@enap.cl', cargo: 'Operador de Planta Térmica', faena: 'Concón' },
    { id: 2, rut: '15.890.112-9', nombre: 'Patricia Carrasco Silva', email: 'p.carrasco@enap.cl', cargo: 'Jefa de Brigada Emergencias', faena: 'Concón' },
    { id: 3, rut: '17.341.229-4', nombre: 'Mauricio Lagos Bustos', email: 'm.lagos@enap.cl', cargo: 'Técnico en Combustibles', faena: 'Quintero' },
    { id: 4, rut: '16.782.901-1', nombre: 'Fabiola Fuentes Riquelme', email: 'f.fuentes@enap.cl', cargo: 'Supervisora HSEC', faena: 'Concón' },
    { id: 5, rut: '19.450.312-K', nombre: 'Cristián Arancibia Vera', email: 'c.arancibia@enap.cl', cargo: 'Brigadista Industrial', faena: 'Terminal Marino' },
  ];

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBatchUploaded(true);
    }, 1200);
  };

  const handleDispatchCredentials = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setDispatchedCount(sampleWorkers.length);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera B2B */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 text-orange-500" />
            <span>Gestor Corporativo B2B — Presupuesto 2 (Plan Profesional)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Matrícula Masiva de Trabajadores por Excel
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Permite a empresas mineras, refinerías y puertos enrolar hasta 500 trabajadores en segundos con despacho automático de claves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-orange-500"
          >
            <option value="Refinería Aconcagua ENAP">Refinería Aconcagua ENAP</option>
            <option value="Codelco División Andina">Codelco División Andina</option>
            <option value="Terminal Portuario Ventanas">Terminal Portuario Ventanas</option>
            <option value="Oxiquim Quintero">Oxiquim Quintero</option>
          </select>
        </div>
      </div>

      {/* Zona de Arrastre de Archivo Excel */}
      <div className="bg-slate-900 border-2 border-dashed border-slate-800 hover:border-orange-500/50 rounded-2xl p-8 text-center transition-all group">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform mb-3">
          <Upload className="w-7 h-7" />
        </div>
        
        <h3 className="text-sm font-bold text-slate-200">
          Arrastra la nómina de trabajadores (.xlsx o .csv)
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          El motor valida automáticamente formato de RUT chileno, duplicados en SENCE y genera accesos seguros.
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={handleSimulateUpload}
            disabled={isProcessing || batchUploaded}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isProcessing ? 'Procesando Planilla...' : batchUploaded ? 'Nómina Cargada' : 'Cargar Planilla Demo (500 cupos)'}</span>
          </button>

          <a
            href="#plantilla"
            onClick={(e) => { e.preventDefault(); alert('Descargando plantilla modelo SENCE_MATRICULA_B2B.xlsx'); }}
            className="text-xs text-slate-400 hover:text-orange-400 underline font-medium"
          >
            Descargar plantilla Excel
          </a>
        </div>
      </div>

      {/* Vista Previa de la Nómina Cargada */}
      {batchUploaded && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Nómina validada: 5 trabajadores listos para {selectedCompany}
              </span>
              <p className="text-xs text-slate-400 mt-0.5">RUTs verificados contra el Registro Civil y algoritmo Módulo 11.</p>
            </div>

            {dispatchedCount === null ? (
              <button
                onClick={handleDispatchCredentials}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
              >
                <Mail className="w-4 h-4" />
                <span>{isProcessing ? 'Despachando...' : 'Despachar Credenciales por Email'}</span>
              </button>
            ) : (
              <div className="px-4 py-2 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡{dispatchedCount} Correos institucionales despachados con éxito!</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">RUT</th>
                  <th className="py-2.5 px-3">Trabajador</th>
                  <th className="py-2.5 px-3">Email Institucional</th>
                  <th className="py-2.5 px-3">Cargo</th>
                  <th className="py-2.5 px-3">Faena</th>
                  <th className="py-2.5 px-3">Clave Generada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sampleWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{w.id}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-200">{w.rut}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-100">{w.nombre}</td>
                    <td className="py-2.5 px-3 text-slate-400">{w.email}</td>
                    <td className="py-2.5 px-3 text-slate-300">{w.cargo}</td>
                    <td className="py-2.5 px-3 text-slate-400">{w.faena}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-orange-400">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        Igneo{w.rut.slice(0, 4)}*
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

