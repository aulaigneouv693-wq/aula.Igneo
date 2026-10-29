import React, { useState } from 'react';
import { Bot, Send, Sparkles, BookCheck, ShieldAlert, Flame, Lightbulb, User } from 'lucide-react';
import { TutorMessage } from '../../types';

export const TutorPanel: React.FC = () => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: '¡Hola! Soy el Profesor Virtual de OTEC Ígneo (Fundación Bomberos Viña del Mar). Estoy entrenado con las normativas NFPA 1001, 1981, 472/1072 y los manuales operacionales de la institución. ¿En qué temática técnica o procedimental puedo orientarte hoy?',
      timestamp: 'Ahora',
      citations: ['Manual de Formación Bomberil Ígneo', 'NFPA 1001 Edición Vigente'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    '¿Cuál es la diferencia crítica entre Flashover y Backdraft?',
    '¿Qué presión y porcentaje de alarma exige NFPA 1981 para un ERA?',
    '¿Cómo se aplica la espuma AFFF en un estanque de hidrocarburos?',
    '¿Cuál es el caudal mínimo de línea de ataque según NFPA 1410?',
  ];

  const handleSend = (query?: string) => {
    const textToSend = query || inputText;
    if (!textToSend.trim()) return;

    const userMsg: TutorMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Ahora',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!query) setInputText('');
    setIsTyping(true);

    // Simulate RAG Knowledge Search & Technical Response
    setTimeout(() => {
      let botResponse = '';
      let citations: string[] = [];

      const lower = textToSend.toLowerCase();
      if (lower.includes('flashover') || lower.includes('backdraft')) {
        botResponse = `DIFERENCIA CRÍTICA SEGÚN NFPA 921 Y MANUALES ÍGNEO:
• Flashover (Inflamación Súbita Generalizada): Es un fenómeno inducido por temperatura (calor radiante superior a ~20 kW/m²). La totalidad de los combustibles de un recinto alcanzan su temperatura de autoignición al mismo tiempo, en presencia de suficiente oxígeno.
• Backdraft (Explosión de Humos): Es un fenómeno inducido por ventilación (déficit de oxígeno). La combustión está latente con gran acumulación de gases supercalentados e inquemados; al ingresar aire fresco bruscamente, se genera una deflagración explosiva.
Táctica: Si detectas ventanas oscuras pulsantes y succión de aire por rendijas, ¡NUNCA abras ventilación tradicional sin línea de ataque cargada!`;
        citations = ['NFPA 921 Guía de Investigación de Incendios Cap. 5', 'Manual de Operaciones OTEC Ígneo Módulo 1.2'];
      } else if (lower.includes('era') || lower.includes('1981') || lower.includes('presión')) {
        botResponse = `ESPECIFICACIONES NFPA 1981 (EQUIPOS DE RESPIRACIÓN AUTÓNOMA):
1. Alarma de Fin de Tiempo de Servicio (EOSTI): Debe activarse de forma redundante (auditiva y táctil/vibratoria) exactamente al 33% (un tercio) ± 2% de la presión nominal del cilindro.
2. Presiones usuales: Cilindros de composite a 4500 PSI (310 bar) o acero a 2216 PSI (150 bar).
3. Protocolo de Chequeo Pre-Uso: No se admite una discrepancia mayor a 100 PSI entre el manómetro del cilindro y el manómetro de la consola de control.`;
        citations = ['Norma NFPA 1981 Estándar de Equipos de Respiración de Circuito Abierto', 'Cartilla de Mantenimiento Cuarteles Bomberos Viña'];
      } else if (lower.includes('espuma') || lower.includes('afff') || lower.includes('hidrocarburo')) {
        botResponse = `APLICACIÓN DE ESPUMA MECÁNICA EN LÍQUIDOS INFLAMABLES (CLASE B):
1. Tipo de Espuma: Para hidrocarburos puros se usa AFFF al 3%. Para solventes polares (alcoholes, cetonas) es obligatorio AR-AFFF (resistente a alcoholes).
2. Método de aplicación: NUNCA lanzar el chorro directo sobre el líquido (produciría dispersión violenta y salpicadura). Se debe emplear la técnica de rebote contra la pared interna del estanque o caída en lluvia suave para permitir que la película acuosa selle los vapores inflamables.`;
        citations = ['NFPA 11 Estándar de Espuma de Baja, Media y Alta Expansión', 'Procedimiento Operativo de Emergencias Industriales ENAP / Ígneo'];
      } else {
        botResponse = `Estimado brigadista/bombero: Respecto a tu consulta sobre "${textToSend}", los procedimientos técnicos del OTEC Ígneo y el estándar NFPA 1001 establecen que toda maniobra de combate debe priorizar: 1) Rescate de vidas humanas, 2) Estabilización del incidente, y 3) Conservación de bienes y medio ambiente. Recomiendo repasar la lección 1.1 y verificar la presión de trabajo antes de cualquier penetración estructural.`;
        citations = ['NFPA 1001 Estándar para Calificaciones Profesionales de Bomberos', 'Doctrina de Seguridad OTEC Ígneo'];
      }

      const botMsg: TutorMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: botResponse,
        timestamp: 'Ahora',
        citations,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[750px] overflow-hidden">
      
      {/* Cabecera del Asistente */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Profesor Virtual con IA 24/7
              <span className="text-[10px] bg-orange-950 text-orange-400 border border-orange-800 px-1.5 py-0.2 rounded font-semibold">
                RAG NFPA
              </span>
            </h3>
            <p className="text-xs text-slate-400">Contextualizado con manuales de Ígneo y doctrina bomberil</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Modelo Activo</span>
        </div>
      </div>

      {/* Sugerencias Rápidas */}
      <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto scrollbar-none flex gap-2">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="flex-shrink-0 text-left text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Historial de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isTutor = m.sender === 'tutor';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isTutor ? 'justify-start' : 'justify-end'}`}
            >
              {isTutor && (
                <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  isTutor
                    ? 'bg-slate-950 border border-slate-800 text-slate-200'
                    : 'bg-orange-600 text-white shadow-md'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider block flex items-center gap-1">
                      <BookCheck className="w-3 h-3" /> Fuentes Citadas en Base de Conocimiento:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.citations.map((c, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {!isTutor && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <span className="animate-pulse">Consultando manuales NFPA y formulando respuesta pedagógica...</span>
          </div>
        )}
      </div>

      {/* Input de Chat */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregunta sobre procedimientos, cálculos de caudal, normativas NFPA..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </form>
      </div>

    </div>
  );
};
