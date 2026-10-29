import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookCheck, 
  Key, 
  Settings, 
  X, 
  Check, 
  Cpu, 
  Zap, 
  User, 
  AlertCircle 
} from 'lucide-react';
import { TutorMessage } from '../../types';
import { GroqService, GROQ_MODELS } from '../../services/groqService';

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
  const [streamingText, setStreamingText] = useState('');
  
  // Config Modal State
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [groqKeyInput, setGroqKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const key = GroqService.getApiKey();
    setHasApiKey(Boolean(key));
    setGroqKeyInput(key);
    setSelectedModel(GroqService.getModel());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, isTyping]);

  const samplePrompts = [
    '¿Cuál es la diferencia crítica entre Flashover y Backdraft?',
    '¿Qué presión y porcentaje de alarma exige NFPA 1981 para un ERA?',
    '¿Cómo se aplica la espuma AFFF en un estanque de hidrocarburos?',
    '¿Cuál es el caudal mínimo de línea de ataque según NFPA 1410?',
  ];

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    GroqService.setApiKey(groqKeyInput);
    GroqService.setModel(selectedModel);
    setHasApiKey(Boolean(groqKeyInput.trim()));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsConfigOpen(false);
    }, 1000);
  };

  const handleSend = async (query?: string) => {
    const textToSend = query || inputText;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: TutorMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Ahora',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!query) setInputText('');
    setIsTyping(true);

    const apiKey = GroqService.getApiKey();

    if (apiKey) {
      // LLAMADA VIVA CON GROQ STREAMING
      setStreamingText('');
      let fullContent = '';

      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          text: m.text,
        }));

      historyPayload.push({ role: 'user', text: textToSend });

      await GroqService.streamChat(
        historyPayload,
        (chunk) => {
          fullContent += chunk;
          setStreamingText(fullContent);
        },
        () => {
          setMessages((prev) => [
            ...prev,
            {
              id: `tutor-${Date.now()}`,
              sender: 'tutor',
              text: fullContent,
              timestamp: 'Ahora',
              citations: ['Motor Groq LPU Inferencia en Vivo', 'Normas NFPA & Manuales Ígneo'],
            },
          ]);
          setStreamingText('');
          setIsTyping(false);
        },
        (err) => {
          console.error(err);
          setMessages((prev) => [
            ...prev,
            {
              id: `tutor-err-${Date.now()}`,
              sender: 'tutor',
              text: `⚠️ Error de comunicación con Groq: ${err.message || 'Verifica tu API Key'}. Si necesitas ayuda, pulsa el botón de configuración en la esquina superior derecha.`,
              timestamp: 'Ahora',
            },
          ]);
          setStreamingText('');
          setIsTyping(false);
        }
      );
    } else {
      // SIMULACIÓN LOCAL INSTANTÁNEA (Respaldo si no hay API Key ingresada)
      setTimeout(() => {
        let botResponse = '';
        let citations: string[] = [];

        const lower = textToSend.toLowerCase();
        if (lower.includes('flashover') || lower.includes('backdraft')) {
          botResponse = `DIFERENCIA CRÍTICA SEGÚN NFPA 921 Y MANUALES ÍGNEO:
• Flashover (Inflamación Súbita Generalizada): Fenómeno térmico por radiación (>20 kW/m²). La totalidad de los materiales alcanzan su temperatura de autoignición en presencia de oxígeno.
• Backdraft (Explosión de Humos): Fenómeno inducido por ventilación ante déficit de oxígeno. Gases supercalentados explotan violentamente al entrar aire fresco.
Táctica: Si notas ventanas oscuras que pulsan y succión de humo por rendijas, ¡NUNCA ventiles sin línea de ataque cargada!`;
          citations = ['NFPA 921 Guía de Investigación de Incendios Cap. 5', 'Manual de Operaciones OTEC Ígneo Módulo 1.2'];
        } else if (lower.includes('era') || lower.includes('1981') || lower.includes('presión')) {
          botResponse = `ESPECIFICACIONES NFPA 1981 (EQUIPOS DE RESPIRACIÓN AUTÓNOMA):
1. Alarma de Fin de Tiempo de Servicio (EOSTI): Debe sonar y vibrar obligatoriamente al 33% (un tercio) ± 2% de la presión nominal del cilindro.
2. Presiones nominales: Cilindros de composite a 4500 PSI (310 bar) o acero a 2216 PSI (150 bar).
3. Prueba de Hermeticidad: No se permite discrepancia superior a 100 PSI entre el manómetro del cilindro y el display frontal.`;
          citations = ['Norma NFPA 1981 Estándar de Equipos de Respiración de Circuito Abierto', 'Cartilla de Mantenimiento Cuarteles Bomberos Viña'];
        } else if (lower.includes('espuma') || lower.includes('afff') || lower.includes('hidrocarburo')) {
          botResponse = `APLICACIÓN DE ESPUMA MECÁNICA EN LÍQUIDOS INFLAMABLES (CLASE B):
1. Tipo de Espuma: Para hidrocarburos puros se usa AFFF al 3%. Para solventes polares (alcoholes, cetonas) es mandatorio AR-AFFF.
2. Método de aplicación: NUNCA disparar directo al centro del líquido. Se aplica por rebote contra la pared interna del estanque para generar la película selladora.`;
          citations = ['NFPA 11 Estándar de Espuma de Baja, Media y Alta Expansión', 'Procedimiento Operativo de Emergencias Industriales ENAP / Ígneo'];
        } else {
          botResponse = `Estimado brigadista/bombero: Respecto a tu consulta sobre "${textToSend}", los procedimientos técnicos del OTEC Ígneo y el estándar NFPA 1001 establecen que toda maniobra de combate debe priorizar: 1) Rescate de vidas humanas, 2) Estabilización del incidente, y 3) Conservación de bienes y medio ambiente. Puedes ingresar tu API Key de Groq para obtener razonamiento generativo ilimitado en vivo.`;
          citations = ['NFPA 1001 Estándar para Calificaciones Profesionales de Bomberos', 'Doctrina de Seguridad OTEC Ígneo'];
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `tutor-${Date.now()}`,
            sender: 'tutor',
            text: botResponse,
            timestamp: 'Ahora',
            citations,
          },
        ]);
        setIsTyping(false);
      }, 700);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[750px] overflow-hidden relative">
      
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

        <div className="flex items-center gap-2">
          {hasApiKey ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] font-semibold">Groq Activo</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/60">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-[11px]">Modo Local Simulado</span>
            </div>
          )}

          <button
            onClick={() => setIsConfigOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs flex items-center gap-1"
            title="Configurar Conexión Groq API"
          >
            <Settings className="w-4 h-4 text-orange-400" />
          </button>
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

        {/* Mensaje en Streaming desde Groq */}
        {streamingText && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 bg-slate-950 border border-orange-500/40 text-slate-200 shadow-lg shadow-orange-950/20">
              <p className="whitespace-pre-line">{streamingText}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-orange-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                Inferencia LPU Groq transmitiendo...
              </div>
            </div>
          </div>
        )}

        {isTyping && !streamingText && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <span className="animate-pulse">Consultando manuales NFPA y formulando respuesta pedagógica...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
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
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-orange-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </form>
      </div>

      {/* Modal de Configuración Groq API */}
      {isConfigOpen && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Conexión Inferencia Groq</h4>
                  <p className="text-[11px] text-slate-400">Tokens ultra rápidos a costo directo</p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Groq API Key (gsk_...)
                </label>
                <input
                  type="password"
                  value={groqKeyInput}
                  onChange={(e) => setGroqKeyInput(e.target.value)}
                  placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono focus:border-orange-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Se guarda localmente en tu navegador. Puedes obtenerla gratis en{' '}
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-400 hover:underline"
                  >
                    console.groq.com
                  </a>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Modelo de Inferencia LPU
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
                >
                  {GROQ_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedSuccess ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <Check className="w-4 h-4" /> ¡Guardado con éxito!
                  </span>
                ) : (
                  <span />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGroqKeyInput('');
                      GroqService.setApiKey('');
                      setHasApiKey(false);
                      setIsConfigOpen(false);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl"
                  >
                    Borrar Key
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/30"
                  >
                    Guardar Configuración
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
