import { Candidate, JobOffer } from './types';

export const RICCARDO_PINNA: Candidate = {
  id: 'rp1',
  name: 'Riccardo Pinna',
  role: 'Product Designer',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
  skills: {
    'Design Thinking': 95,
    'UX Research': 90,
    'Prototyping': 85,
    'Collaboration': 98,
    'Problem Solving': 88
  },
  employabilityScore: 94,
  lastActive: '2025-11-26',
  assessmentProfile: {
    style: "Collaboratore",
    summary: "Fare un lavoro di qualità è una priorità indiscutibile per Riccardo Pinna. Rigoroso, preciso, strutturato, è molto attento a non commettere errori nell'esecuzione dei suoi compiti. Questo suo carattere diligente e coscienzioso è legato all'importanza che attribuisce al punto di vista altrui.",
    strengths: {
      relations: [
        "Considera le critiche come qualcosa di positivo.",
        "Dimostra umiltà, non cerca di imporsi.",
        "Aspira a coltivare relazioni autentiche."
      ],
      work: [
        "È riflessivo, affronta i problemi da un'angolazione concettuale.",
        "È meticoloso, ricontrolla il proprio lavoro.",
        "Preferisce la continuità al cambiamento."
      ],
      emotions: [
        "È reattivo, possiede una grande energia.",
        "Mostra capacità di discernimento, giudica sulla base dei fatti.",
        "Domina le proprie emozioni."
      ]
    },
    tags: ["#Umile", "#Empatico", "#Tollerante", "#Indipendente", "#Curioso", "#Cauto", "#Accurato", "#Realistico", "#Reattivo", "#Obiettivo"],
    areasOfImprovement: [
      "Sarebbe meglio se riuscisse a contenere le sue emozioni per evitare impulsività.",
      "Potrebbe mostrare maggiore coinvolgimento ed entusiasmo interagendo con gli altri.",
      "Farebbe meglio a mettere in discussione un po' di più le critiche che riceve."
    ],
    motivations: {
      top: ["Analizzare dati", "Preservare equilibrio personale", "Ottenere riconoscimento"],
      bottom: ["Incontrare nuove persone", "Guadagnare bene", "Lavorare solo in team"],
      managementStyle: [
        { label: "Empatico", score: 58, subtitle: "Collaboratori in primis", color: "#ec4899" }, // Pink
        { label: "Vincitore", score: 46, subtitle: "Osserva e fa come me", color: "#f97316" }, // Orange
        { label: "Coach", score: 50, subtitle: "Prova così", color: "#ec4899" }
      ],
      idealCulture: {
        collaboration: 40,
        innovation: 85, 
        competition: 30,
        organization: 50
      }
    },
    talentCloud: [
      {
        category: 'INFLUENZARE',
        title: 'Costruire relazioni',
        color: '#fb923c', // Orange
        items: ['Socializza in maniera spontanea', 'Si relaziona con calma ed equilibrio']
      },
      {
        category: 'COOPERARE',
        title: 'Comunicare con diplomazia',
        color: '#ec4899', // Pink
        items: ['Adatta il suo discorso', 'Considera le critiche positive']
      },
      {
        category: 'RIFLETTERE',
        title: 'Anticipare le sfide',
        color: '#fbbf24', // Yellow
        items: ['Considera impatto decisioni', 'Identifica fattori limitanti']
      },
      {
        category: 'AGIRE',
        title: 'Prendere l\'iniziativa',
        color: '#f97316', // Orange Darker
        items: ['Obiettivi realistici', 'Decide in autonomia']
      },
      {
        category: 'SENTIRE',
        title: 'Diffondere entusiasmo',
        color: '#38bdf8', // Blue
        items: ['Percezione realistica', 'Mantiene l\'autocontrollo']
      }
    ]
  }
};

export const MOCK_JOB: JobOffer = {
  id: 'j1',
  title: 'Lead Product Designer',
  department: 'Product',
  location: 'Milan (Hybrid)',
  requiredSkills: {
    'Design Thinking': 90,
    'UX Research': 85,
    'Collaboration': 90,
    'Leadership': 80
  }
};

export const CANDIDATES_POOL: Candidate[] = [
    RICCARDO_PINNA,
    {
        id: '2',
        name: 'Sara Baccelli',
        role: 'Business Developer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
        skills: { 'Sales': 95, 'Communication': 98, 'Negotiation': 90, 'CRM': 85 },
        employabilityScore: 98,
        lastActive: '2023-10-24'
    }
];