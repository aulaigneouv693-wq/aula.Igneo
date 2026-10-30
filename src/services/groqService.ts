export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const GROQ_MODELS = [
  { id: 'openai/gpt-oss-120b', name: 'GPT-OSS 120B (Recomendado - Máximo Razonamiento NFPA & Táctica)' },
  { id: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B (Ultra Rápido - Gran Precisión Técnica)' },
  { id: 'qwen/qwen3.8-27b', name: 'Qwen 3.8 27B (Excelente Desempeño en Español)' },
];

export const SYSTEM_PROMPT_IGNEO = `Eres el Profesor Virtual y Tutor Pedagógico Especializado de OTEC Ígneo (Organismo Técnico de Capacitación de la Fundación Cuerpo de Bomberos de Viña del Mar - Concón), desarrollado por el equipo de ingeniería de UNIVERSO693 SpA.

Tu misión es capacitar y orientar a bomberos, prevencionistas de riesgos y brigadistas industriales de empresas críticas de la Región de Valparaíso y Chile (como Refinería Aconcagua ENAP, Terminal Ventanas, Codelco División Andina, Oxiquim Quintero y minería).

CONOCIMIENTO TÉCNICO VINCULANTE:
- Norma NFPA 1001: Calificaciones profesionales para bomberos estructurales.
- Norma NFPA 1981 / 1971: Equipos de Respiración Autónoma (ERA) y EPP de combate. Alarma EOSTI al 33% ± 2%, sellado de máscara, presiones a 4500 PSI / 2216 PSI.
- Norma NFPA 472 / 1072: Respuesta a incidentes con Materiales Peligrosos (HazMat) y armas de destrucción masiva.
- Norma NFPA 11: Espumas mecánicas (AFFF / AR-AFFF) de baja, media y alta expansión en hidrocarburos y solventes polares.
- Norma NFPA 921: Dinámica del fuego, pirólisis, signos precursores de Flashover (~20 kW/m²) y Backdraft (deficiencia de O2 con combustible supercalentado).
- Doctrina y Manuales Operacionales de OTEC Ígneo y Cuerpo de Bomberos de Viña del Mar.

REGLAS PEDAGÓGICAS ESTRICTAS:
1. Responde con lenguaje técnico, directo, didáctico y profesional en español latinoamericano/chileno.
2. Cita siempre la norma NFPA, capítulo o manual técnico institucional de Ígneo correspondiente al final o en el cuerpo de tu respuesta.
3. Si la pregunta involucra un riesgo inminente a la vida (atmósferas IDLH, colapso estructural, BLEVE, explosiones), antepón siempre la seguridad del operador y el uso obligatorio del ERA y EPP completo.
4. Mantén tus respuestas concisas pero exhaustivas, usando listas y viñetas para que un bombero en faena o cuartel pueda leer rápido en móvil.`;

export class GroqService {
  private static STORAGE_KEY = 'groq_api_key';
  private static MODEL_KEY = 'groq_selected_model';

  static getApiKey(): string {
    return localStorage.getItem(this.STORAGE_KEY) || import.meta.env.VITE_GROQ_API_KEY || '';
  }

  static setApiKey(key: string) {
    if (key.trim()) {
      localStorage.setItem(this.STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  static getModel(): string {
    const saved = localStorage.getItem(this.MODEL_KEY);
    if (!saved || saved.includes('llama')) {
      // Migrar automáticamente si estaba seleccionado el modelo antiguo
      return 'openai/gpt-oss-120b';
    }
    return saved;
  }

  static setModel(model: string) {
    localStorage.setItem(this.MODEL_KEY, model);
  }

  static async streamChat(
    history: { role: 'user' | 'assistant'; text: string }[],
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (err: any) => void
  ) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      onError(new Error('Falta la API Key de Groq'));
      return;
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT_IGNEO },
      ...history.map((h) => ({
        role: h.role,
        content: h.text,
      })),
    ];

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: this.getModel(),
          messages,
          temperature: 0.3,
          max_tokens: 1024,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en Groq API (${response.status}): ${errorText}`);
      }

      if (!response.body) {
        throw new Error('No se recibió cuerpo de respuesta desde Groq');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine.startsWith('data: ')) continue;
          const dataStr = cleanLine.replace('data: ', '').trim();
          if (dataStr === '[DONE]') {
            onDone();
            return;
          }

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta;
            // Manejar tanto content como modelos con canal reasoning
            if (delta?.content) {
              onChunk(delta.content);
            }
          } catch (e) {
            // Ignorar fragmentos parciales que se completarán en el siguiente chunk
          }
        }
      }

      onDone();
    } catch (err) {
      onError(err);
    }
  }
}
