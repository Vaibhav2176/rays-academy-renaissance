import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'class-9-foundation-guide',
  title: 'Class 9 Foundation Guide: The Year That Decides Class 10',
  description: 'A complete Class 9 foundation guide — subject-wise strategy, habits to build, and how Class 9 prepares you for Class 10 boards.',
  excerpt: 'Class 9 is the quietest year — and the most important. Here is how to use it right.',
  category: 'class-9',
  tags: ['class 9', 'foundation', 'boards'],
  publishedAt: '2026-06-18',
  readingMinutes: 8,
  heroEmoji: '📗',
  keyTakeaways: [
    'Class 9 concepts appear across Class 10 boards, JEE and NEET foundations.',
    'Build habits, not marks — the marks come automatically.',
    'Master Mathematics fundamentals — polynomials, coordinate geometry, triangles.',
    'Science labs matter — hands-on understanding sticks longer.',
    'Start entrance foundation early if aiming JEE / NEET.',
  ],
  toc: [
    { id: 'why-matters', label: 'Why Class 9 matters' },
    { id: 'subjects', label: 'Subject-wise strategy' },
    { id: 'habits', label: 'Habits to build' },
    { id: 'foundation', label: 'Entrance foundation' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Class 9 is the year students underrate the most — and pay for in Class 10. Every major Class 10 chapter builds on Class 9 concepts. Every serious JEE / NEET aspirant needs a strong Class 9 base. Treat this year as a foundation year, not a "before-board" year, and Class 10 becomes far easier.' },

    { type: 'h2', id: 'why-matters', text: 'Why Class 9 matters' },
    { type: 'ul', items: [
      'Class 10 Maths and Science expand directly on Class 9 concepts.',
      'JEE / NEET foundation programmes assume Class 9 fluency.',
      'Habits built this year — writing, revision, timetable — carry through Class 12.',
      'Weak Class 9 concepts show up as Class 11 struggles later.',
    ]},

    { type: 'h2', id: 'subjects', text: 'Subject-wise strategy' },
    { type: 'ul', items: [
      'Maths: master Polynomials, Coordinate Geometry, Triangles, Circles.',
      'Science: Physics — Motion, Force, Gravitation. Chemistry — Atoms & Molecules. Biology — Cell.',
      'English: reading comprehension + creative writing weekly.',
      'Social Science: chronology and map work — start early.',
    ]},

    { type: 'cta', title: 'Class 9 coaching at Rays Academy Bhopal', text: 'Foundation-focused Class 9 coaching with concept mastery and habit building.', href: '/class-9-coaching-bhopal', label: 'Explore Class 9 coaching' },

    { type: 'h2', id: 'habits', text: 'Habits to build' },
    { type: 'ol', items: [
      'Fixed daily study slot — 2 hours after school, non-negotiable.',
      'Weekend revision of the week — 90 minutes.',
      'Write, do not just read. Notebook per subject.',
      'Weekly self-test — one chapter, closed book.',
    ]},

    { type: 'h2', id: 'foundation', text: 'Entrance foundation' },
    { type: 'ul', items: [
      'If aiming JEE / NEET, start foundation coaching from Class 9.',
      'Focus on NTSE, Olympiads — great for early exposure.',
      'Do not sacrifice school for coaching — both must run together.',
      'Read NCERT thoroughly — it stays your base till Class 12.',
    ]},
    { type: 'callout', variant: 'info', title: 'Slow year, big compounding', text: 'Class 9 gains look invisible in the short term. By Class 12, they show up as the difference between a top ranker and everyone else.' },
  ],
  faq: [
    { q: 'How many hours should a Class 9 student study daily?', a: '2–3 focused hours daily is enough — plus one review session on the weekend.' },
    { q: 'Should Class 9 students join JEE / NEET foundation?', a: 'Yes if you are certain of the goal — starting early gives a two-year headstart on concepts and exposure.' },
    { q: 'Is NCERT enough for Class 9?', a: 'For school and boards, yes. For Olympiads, supplement with dedicated Olympiad practice books.' },
    { q: 'How is Rays Academy Class 9 different?', a: 'We combine strong school-syllabus teaching with foundation concepts for future JEE / NEET aspirants — same programme, dual outcome.' },
  ],
  relatedCourses: ['class-9', 'class-10'],
  relatedMaterials: [
    { label: 'Class 9 Study Material', href: '/study-material/class-9' },
    { label: 'Class 9 PYQs', href: '/study-material/pyq/class-9' },
    { label: 'Sample Papers', href: '/study-material/sample-papers/class-9' },
  ],
};

export default post;
