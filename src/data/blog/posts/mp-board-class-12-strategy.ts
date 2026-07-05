import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'mp-board-class-12-strategy',
  title: 'MP Board Class 12 Strategy: Score 90%+ with the Right Plan',
  description: 'A complete MP Board Class 12 strategy — subject prioritisation, PYQs, blueprint mapping, and integration with JEE / NEET preparation.',
  excerpt: 'Score 90%+ in MP Board Class 12 with a plan that balances boards, entrances and revision.',
  category: 'bhopal-education',
  tags: ['mp board', 'class 12', 'mpbse', 'boards'],
  publishedAt: '2026-06-24',
  readingMinutes: 10,
  heroEmoji: '🎓',
  keyTakeaways: [
    'Build your plan around the MPBSE blueprint, not just chapters.',
    'MP Board Class 12 aligns closely with NCERT — use both together.',
    'Integrate boards with JEE / NEET prep — 70% syllabus overlaps.',
    'Solve every PYQ from the last 5 years.',
    'Presentation matters — diagrams, headings and clean answers score better.',
  ],
  toc: [
    { id: 'plan', label: 'Building your plan' },
    { id: 'streams', label: 'Stream-wise strategy' },
    { id: 'entrance', label: 'Boards + entrance integration' },
    { id: 'revision', label: 'Revision cycles' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'MP Board Class 12 is the last board exam of your school life — and often the one that decides your college door. Scoring 90%+ is entirely realistic if you build your plan around the MPBSE blueprint, respect NCERT, and manage the boards + entrance overlap smartly.' },

    { type: 'h2', id: 'plan', text: 'Building your plan' },
    { type: 'ul', items: [
      'Download the current MPBSE Class 12 blueprint for each subject.',
      'Map chapters to marks — high-weightage chapters get double time.',
      'Fix a weekly rhythm: 4 subjects rotating, one deep chapter each week.',
      'Reserve Sunday for full-length paper practice.',
    ]},

    { type: 'h2', id: 'streams', text: 'Stream-wise strategy' },
    { type: 'ul', items: [
      'PCM: NCERT + MPBSE for Physics, Chemistry, Maths. Weekly numericals.',
      'PCB: Biology is memory-heavy — write, do not just read. Diagrams matter.',
      'Commerce: Accountancy needs daily practice; Business Studies is theory-heavy.',
      'Arts: History and Political Science — chronology + keyword-heavy answers.',
    ]},

    { type: 'cta', title: 'Class 12 Coaching at Rays Academy', text: 'Integrated Class 12 board + entrance coaching (JEE / NEET / CUET) with weekly tests.', href: '/class-12-coaching-bhopal', label: 'Explore Class 12 coaching' },

    { type: 'h2', id: 'entrance', text: 'Boards + entrance integration' },
    { type: 'ol', items: [
      'Use NCERT as the shared base for boards + JEE / NEET / CUET.',
      'Split day into 2 blocks: mornings for boards, evenings for entrance MCQs.',
      'From December, tilt fully towards boards until they end.',
      'Post boards, restart full entrance mock cycles immediately.',
    ]},

    { type: 'h2', id: 'revision', text: 'Revision cycles' },
    { type: 'ul', items: [
      'First revision: October — with your own compact notes.',
      'Second revision: December — using PYQs.',
      'Third revision: January — flashcards + formulas only.',
      'Final revision: February — sample papers under exam timing.',
    ]},
    { type: 'callout', variant: 'info', title: 'MPBSE loves case-based questions', text: 'Recent MP Board papers have added case studies and application questions. Practise 5–10 of these per subject.' },
  ],
  faq: [
    { q: 'Can MP Board students crack JEE / NEET?', a: 'Absolutely. Many top JEE / NEET rankers come from MP Board. The board syllabus overlaps significantly with NCERT-based entrances.' },
    { q: 'How many PYQs should I solve for MP Board Class 12?', a: 'At least 5 years, and 10 years for high-weightage subjects like Physics and Maths.' },
    { q: 'Should I skip school if I have coaching?', a: 'No. Attendance is mandatory and school teachers grade your practicals — a strong practical score materially boosts your total.' },
    { q: 'When do MP Board Class 12 exams start?', a: 'Typically late February each year. Check the official MPBSE date sheet closer to exams.' },
  ],
  relatedCourses: ['class-12', 'iit-jee', 'neet', 'cuet'],
  relatedMaterials: [
    { label: 'Class 12 Study Material', href: '/study-material/class-12' },
    { label: 'Class 12 PYQs', href: '/study-material/pyq/class-12' },
    { label: 'Sample Papers', href: '/study-material/sample-papers/class-12' },
  ],
  externalRefs: [
    { label: 'MPBSE Official Website', url: 'https://mpbse.nic.in/' },
  ],
};

export default post;
