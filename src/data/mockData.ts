import { Course, StudentProgress, QuizQuestion, CertificateData } from '../types';

export const MOCK_COURSE: Course = {
  id: 'curso-nfpa-1001',
  codeSence: '1238009231-IGNEO',
  title: 'Control y Extinción de Incendios Industriales & NFPA 1001',
  subtitle: 'Técnicas de primera intervención para brigadas industriales y cuarteles de emergencia',
  hours: 16,
  passingScorePercent: 80,
  modules: [
    {
      id: 'mod-1',
      title: 'Módulo 1: Dinámica del Fuego y Comportamiento Térmico',
      lessons: [
        {
          id: 'les-1-1',
          title: '1.1 Triángulo y Tetraedro del Fuego en Ambientes de Hidrocarburos',
          durationSeconds: 120, // 2 min para demo interactiva
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          completed: false,
          activeSecondsWatched: 0,
          description: 'Revisión físico-química de la pirólisis y mecanismos de transferencia de calor por radiación y convección.',
          isLocked: false,
        },
        {
          id: 'les-1-2',
          title: '1.2 Fenómenos Térmicos Extremos: Flashover y Backdraft',
          durationSeconds: 150,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          completed: false,
          activeSecondsWatched: 0,
          description: 'Identificación de signos precursores de inflamación súbita generalizada y ventilación táctica controlada.',
          isLocked: true,
        },
      ],
    },
    {
      id: 'mod-2',
      title: 'Módulo 2: Equipos de Protección Personal (EPP) y ERA (NFPA 1971 / 1981)',
      lessons: [
        {
          id: 'les-2-1',
          title: '2.1 Inspección Pre-Uso de Equipos de Respiración Autónoma (ERA)',
          durationSeconds: 180,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
          completed: false,
          activeSecondsWatched: 0,
          description: 'Protocolo de chequeo de alta y baja presión, alarma audible y prueba de sellado hermético.',
          isLocked: true,
        },
      ],
    },
  ],
};

export const MOCK_STUDENTS: StudentProgress[] = [
  {
    studentRut: '18.432.190-2',
    studentName: 'Claudio Valenzuela Tapia',
    companyName: 'Refinería Aconcagua ENAP',
    totalTimeActiveSeconds: 270,
    requiredTimeSeconds: 270,
    percentageCompleted: 100,
    lastAccess: 'Hace 12 min',
    status: 'completado',
    quizScore: 92,
    certificateHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  },
  {
    studentRut: '17.982.341-K',
    studentName: 'Mariana Gómez Soto',
    companyName: 'Terminal Portuario Ventanas S.A.',
    totalTimeActiveSeconds: 184,
    requiredTimeSeconds: 270,
    percentageCompleted: 68,
    lastAccess: 'Hace 2 horas',
    status: 'en_progreso',
  },
  {
    studentRut: '16.551.890-5',
    studentName: 'Héctor San Martín Morales',
    companyName: 'Codelco División Andina',
    totalTimeActiveSeconds: 270,
    requiredTimeSeconds: 270,
    percentageCompleted: 100,
    lastAccess: 'Ayer 18:30',
    status: 'pendiente_evaluacion',
  },
  {
    studentRut: '19.123.778-3',
    studentName: 'Gonzalo Pardo Echeverría',
    companyName: 'Oxiquim Quintero',
    totalTimeActiveSeconds: 45,
    requiredTimeSeconds: 270,
    percentageCompleted: 16,
    lastAccess: 'Hace 3 días',
    status: 'en_progreso',
  },
  {
    studentRut: '15.890.112-9',
    studentName: 'Patricia Carrasco Silva',
    companyName: 'Refinería Aconcagua ENAP',
    totalTimeActiveSeconds: 270,
    requiredTimeSeconds: 270,
    percentageCompleted: 100,
    lastAccess: 'Hoy 09:15',
    status: 'completado',
    quizScore: 88,
    certificateHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  },
];

export const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '¿Cuál es el factor determinante para que ocurra un fenómeno de Flashover en un recinto cerrado?',
    options: [
      'Entrada brusca de oxígeno ante una atmósfera rica en gases no quemados.',
      'Calentamiento por radiación de todas las superficies combustibles hasta alcanzar su temperatura de autoignición.',
      'Falla del sistema de rociadores automáticos bajo norma NFPA 13.',
      'Uso exclusivo de agentes extintores a base de agua pulverizada.',
    ],
    correctAnswer: 1,
    explanation: 'El flashover es la transición repentina a una combustión generalizada cuando la radiación térmica de la capa de humo supera los ~20 kW/m².',
    nfpaReference: 'NFPA 1001 / NFPA 921 Cap. 5',
  },
  {
    id: 2,
    question: 'Según la norma NFPA 1981, ¿a qué porcentaje de la capacidad del cilindro debe activarse la alarma de fin de tiempo de servicio (EOSTI) en un ERA?',
    options: [
      'Al 15% de la presión nominal de trabajo.',
      'Al 25% de la presión nominal de trabajo.',
      'Al 33% (un tercio) de la capacidad del cilindro.',
      'Al 50% de la capacidad de aire respirable.',
    ],
    correctAnswer: 2,
    explanation: 'Las ediciones vigentes de NFPA 1981 exigen que la alarma redundante (táctil/sonora) se active al 33% ± 2% de la presión para asegurar margen de evacuación.',
    nfpaReference: 'NFPA 1981 Ed. Vigente Art. 6.3',
  },
  {
    id: 3,
    question: 'Al enfrentar un fuego en tanques de almacenamiento de líquidos inflamables (Clase B), ¿cuál es el agente extintor idóneo?',
    options: [
      'Chorro directo de agua a alta presión.',
      'Espuma mecánica (AFFF / FFFP) aplicada contra la pared interna del estanque para generar película selladora.',
      'Dióxido de Carbono (CO2) portátil a distancia de 2 metros.',
      'Polvo químico seco lanzado contra el viento.',
    ],
    correctAnswer: 1,
    explanation: 'La espuma sintética filmógena sella los vapores de hidrocarburo suprimiendo el aporte de oxígeno sin alterar el combustible.',
    nfpaReference: 'Manual de Operaciones OTEC Ígneo / NFPA 11',
  },
];

export const MOCK_CERTIFICATE_SAMPLE: CertificateData = {
  hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  studentName: 'Claudio Valenzuela Tapia',
  studentRut: '18.432.190-2',
  courseTitle: 'Control y Extinción de Incendios Industriales & NFPA 1001',
  hours: 16,
  issueDate: '28 de Octubre de 2026',
  companyName: 'Refinería Aconcagua ENAP',
  instructorName: 'Instructor Mayor — Fundación Bomberos Viña del Mar',
  senceCode: '1238009231-IGNEO',
  qrUrl: 'https://campus.igneo.cl/verificar/9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
};
