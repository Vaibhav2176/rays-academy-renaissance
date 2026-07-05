import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'mathematics-jee-tips',
  title: 'JEE Mathematics: Chapter Priority, Problem-Solving and Speed Tips',
  description: 'JEE Mathematics preparation — high-weightage chapters, problem-solving strategy, speed-building drills and top books.',
  excerpt: 'JEE Maths rewards clarity + speed. Here is the exact priority order, problem approach and drill plan.',
  category: 'iit-jee',
  tags: ['jee', 'mathematics', 'iit-jee', 'class 11', 'class 12'],
  publishedAt: '2026-06-20',
  readingMinutes: 9,
  heroEmoji: '📐',
  keyTakeaways: [
    'Calculus + Algebra + Coordinate Geometry = ~70% of JEE Maths.',
    'Master concepts before touching advanced problem books.',
    'Speed is trained separately — set daily 20-question timed sets.',
    'Attempt questions in order of confidence, not paper order.',
    'Track your error types weekly — patterns emerge fast.',
  ],
  toc: [
    { id: 'weightage', label: 'Chapter weightage' },
    { id: 'plan', label: 'Study plan' },
    { id: 'problem', label: 'Problem-solving approach' },
    { id: 'speed', label: 'Building speed' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'JEE Maths separates ranks. Not because it is impossibly hard, but because it demands both conceptual clarity and problem-solving speed — two skills that need different practice regimes. This guide gives you the priority order, approach and drills we use at Rays Academy.' },

    { type: 'h2', id: 'weightage', text: 'Chapter weightage' },
    { type: 'ul', items: [
      'Calculus: Differential + Integral Calculus, Application of Derivatives — ~30%.',
      'Algebra: Complex Numbers, Sequences, Quadratic Eqns, Matrices, Determinants — ~25%.',
      'Coordinate Geometry: Straight Lines, Circles, Conics — ~15%.',
      'Trigonometry + Vectors + 3D — ~15%.',
      'Probability + Statistics + Reasoning — ~15%.',
    ]},

    { type: 'h2', id: 'plan', text: 'Study plan' },
    { type: 'ol', items: [
      'Class 11: build Algebra, Trigonometry, Coordinate Geometry base.',
      'Class 12: dominate Calculus + Vectors + 3D.',
      'Weekly: 4 chapter-wise problem sets + 1 mixed set.',
      'Monthly: 1 full mock + one full analysis day.',
    ]},

    { type: 'cta', title: 'JEE coaching at Rays Academy Bhopal', text: 'Two-year JEE Main + Advanced programme with weekly Maths tests and personalised mentoring.', href: '/iit-jee-coaching-bhopal', label: 'Explore JEE coaching' },

    { type: 'h2', id: 'problem', text: 'Problem-solving approach' },
    { type: 'ul', items: [
      'Read the question twice — many errors are misreads.',
      'Identify the chapter first, then the concept, then the trick.',
      'Do not lookup the solution before spending 10 minutes.',
      'Maintain an error log — one line per mistake, category tag.',
      'Redo every mistake within 48 hours.',
    ]},

    { type: 'h2', id: 'speed', text: 'Building speed' },
    { type: 'ul', items: [
      'Daily: 20 timed MCQs — 25 minutes total.',
      'Weekly: 1 full 90-minute Maths section under exam conditions.',
      'Use short tricks only for verified time-savers — not everywhere.',
      'Skip strategically — a 4-minute question stops being worth it.',
    ]},
    { type: 'callout', variant: 'tip', title: 'Error log is a superpower', text: 'Toppers review their error log weekly. It shows you which chapters, which concepts and which question types keep costing marks — and that becomes your revision list.' },
  ],
  faq: [
    { q: 'Is NCERT enough for JEE Maths?', a: 'NCERT builds the base. For JEE, you need additional problem books like RD Sharma, Cengage or Arihant.' },
    { q: 'How many hours of Maths daily?', a: '2 hours daily during Class 11 / 12; 3 hours in the JEE-only phase.' },
    { q: 'Which chapter should I start with?', a: 'Sets, Relations, Functions in Class 11. Everything after depends on function fluency.' },
    { q: 'How do I improve accuracy?', a: 'Slow down for the first 10 questions — set up the ratio right, and the last 20 questions become fast and accurate.' },
  ],
  relatedCourses: ['iit-jee', 'class-11', 'class-12'],
  relatedMaterials: [
    { label: 'JEE Study Material', href: '/study-material/iit-jee' },
    { label: 'JEE PYQs', href: '/study-material/pyq/jee' },
    { label: 'Formula Sheets', href: '/study-material/formula-sheets' },
  ],
  externalRefs: [
    { label: 'NTA JEE Official Portal', url: 'https://jeemain.nta.nic.in/' },
  ],
};

export default post;
