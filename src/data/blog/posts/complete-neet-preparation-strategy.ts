import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'complete-neet-preparation-strategy',
  title: 'Complete NEET Preparation Strategy: NCERT-First Roadmap',
  description: 'A complete NEET UG preparation strategy — Biology, Physics, Chemistry breakdown, NCERT-first approach, timetable, book list and mock strategy from Rays Academy Bhopal.',
  excerpt: 'The NCERT-first NEET UG plan we use at Rays Academy — Biology, Physics and Chemistry breakdown, timetable, mock strategy, and how to reach 650+.',
  category: 'neet',
  tags: ['neet', 'medical', 'biology', 'ncert'],
  publishedAt: '2026-06-07',
  readingMinutes: 12,
  popular: true,
  heroEmoji: '⚕️',
  keyTakeaways: [
    'NEET is 90% NCERT — start every chapter with the NCERT textbook.',
    'Biology alone can decide your rank — aim for 340+ out of 360.',
    'Physics is the differentiator — do not neglect numericals.',
    'One full mock per week from October is the minimum benchmark.',
    'Analysis matters more than attempts — study every wrong answer.',
  ],
  toc: [
    { id: 'exam-overview', label: 'NEET at a glance' },
    { id: 'subject-plan', label: 'Subject-wise plan' },
    { id: 'timetable', label: 'A working timetable' },
    { id: 'books', label: 'Books that actually help' },
    { id: 'mocks', label: 'Mock strategy' },
    { id: 'exam-day', label: 'Exam-day approach' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'NEET has become India\'s most competitive undergraduate entrance exam — 20 lakh+ aspirants, one 720-mark paper, and only around 1 lakh MBBS seats. The good news: unlike JEE, the syllabus is tightly defined by NCERT. A student who owns NCERT thoroughly, drills PYQs and attempts weekly mocks can genuinely reach a 650+ score. This is the NEET plan Rays Academy Bhopal follows across the two-year integrated programme.' },

    { type: 'h2', id: 'exam-overview', text: 'NEET at a glance' },
    { type: 'ul', items: [
      '180 questions in 3 hours 20 minutes, +4 / −1 marking.',
      'Biology (Botany + Zoology): 90 questions, 360 marks.',
      'Physics: 45 questions, 180 marks.',
      'Chemistry: 45 questions, 180 marks.',
      'Total: 720. Serious contenders target 650+.',
    ]},

    { type: 'h2', id: 'subject-plan', text: 'Subject-wise plan for NEET' },
    { type: 'h3', text: 'Biology — the game-decider' },
    { type: 'p', text: 'Every year, around 60 questions in NEET Biology are lifted almost verbatim from NCERT lines. Read NCERT twice — first for understanding, second with a pencil marking every fact.' },
    { type: 'ul', items: [
      'Create summary tables (classification, plant kingdom, human systems).',
      'Practise diagrams by hand — NCERT diagrams are directly asked.',
      'Solve at least 10 years of NEET PYQs subject-wise.',
    ]},
    { type: 'h3', text: 'Chemistry — 90% NCERT again' },
    { type: 'ul', items: [
      'Inorganic: NCERT line-by-line + Rays Academy short notes.',
      'Organic: mechanism-first, then named reactions, then problems.',
      'Physical: formula-based practice; NCERT questions daily.',
    ]},
    { type: 'h3', text: 'Physics — where ranks are made' },
    { type: 'ul', items: [
      'NCERT + HC Verma (selected chapters) + DC Pandey / NCERT Exemplar.',
      'One numerical sheet per chapter, timed.',
      'Focus on Modern Physics, Mechanics, Electromagnetism — high-weightage areas.',
    ]},

    { type: 'cta', title: 'NEET Coaching at Rays Academy Bhopal', text: 'Integrated NEET UG programme with Biology-first curriculum, weekly tests and doubt clearing.', href: '/neet-coaching-bhopal', label: 'Explore NEET coaching' },

    { type: 'h2', id: 'timetable', text: 'A working NEET timetable' },
    { type: 'ul', items: [
      '5:30 AM wake up, 30 minutes formula / reaction revision.',
      '6:00–8:00 AM: Physics (needs a fresh brain).',
      'School / coaching classes.',
      'Post-school 3:30–5:00 PM: Chemistry.',
      'Evening 6:00–8:30 PM: Biology (twice a week: NCERT reading; once a week: MCQs).',
      'Night 30 minutes: revise what you learned today.',
    ]},

    { type: 'h2', id: 'books', text: 'Books that actually help' },
    { type: 'ul', items: [
      'NCERT (Class 11 + 12) for every subject — non-negotiable.',
      'MTG NCERT at Your Fingertips — great NCERT-based MCQ compilation.',
      'HC Verma — Physics conceptual clarity.',
      'Rays Academy short notes — Bhopal-specific concise summaries.',
    ]},

    { type: 'h2', id: 'mocks', text: 'Mock strategy' },
    { type: 'ol', items: [
      'One full-length mock every week from October.',
      'Two full-length mocks a week from February.',
      'Analyse each mock for 60–90 minutes — this is where you actually learn.',
      'Keep an error diary; revisit it before the next mock.',
    ]},

    { type: 'h2', id: 'exam-day', text: 'Exam-day approach' },
    { type: 'ul', items: [
      'Start with Biology — fastest and highest scoring, builds confidence.',
      'Move to Chemistry next.',
      'Physics last — slower, calculation-heavy.',
      'Never guess-blind; skip if unsure. −1 hurts badly at this level.',
    ]},
    { type: 'callout', variant: 'tip', title: 'Health is a NEET topper habit', text: 'Sleep 7+ hours. Walk 20 minutes daily. Eat home food. Sick students lose 20–30 marks purely to low stamina in a 3h20m paper.' },
  ],
  faq: [
    { q: 'Can I score 650+ in NEET without coaching?', a: 'Some do, but they usually already have strong self-study habits and access to good test series. Structured coaching adds weekly tests, faculty mentorship and peer motivation — all of which raise the probability significantly.' },
    { q: 'Is NCERT alone enough for NEET Biology?', a: 'For Biology, yes — NCERT is the single most important book. Supplement with a good MCQ compilation for practice.' },
    { q: 'How many mocks are enough?', a: '30+ full-length NEET mocks by exam day is the benchmark for a 650+ score. Analysis matters more than attempts.' },
    { q: 'When should Class 11 students start NEET prep?', a: 'From the first month of Class 11. NEET rewards two full years of consistent effort more than any last-year sprint.' },
  ],
  relatedCourses: ['neet', 'class-11', 'class-12'],
  relatedMaterials: [
    { label: 'NEET Study Material', href: '/study-material/neet' },
    { label: 'NEET Previous Year Questions', href: '/study-material/pyq/neet' },
    { label: 'NEET Sample Papers', href: '/study-material/sample-papers/neet' },
  ],
  externalRefs: [
    { label: 'NTA NEET Official Portal', url: 'https://neet.nta.nic.in/' },
    { label: 'NCERT Official Website', url: 'https://ncert.nic.in/' },
  ],
};

export default post;
