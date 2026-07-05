import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'physics-preparation-tips-class-11-12',
  title: 'Physics Preparation Tips for Class 11 and 12 (Boards + JEE + NEET)',
  description: 'A concept-first Physics preparation plan for Class 11 and 12 students — chapter priority, problem-solving strategy, and derivation practice.',
  excerpt: 'Physics rewards conceptual clarity and daily problem-solving — here is the exact plan we recommend for Class 11 and 12 students.',
  category: 'study-tips',
  tags: ['physics', 'class 11', 'class 12', 'jee', 'neet'],
  publishedAt: '2026-06-23',
  readingMinutes: 9,
  heroEmoji: '⚛️',
  keyTakeaways: [
    'Physics is 30% theory, 70% problem-solving — practice > reading.',
    'Master units, dimensions and vectors before anything else in Class 11.',
    'Derive every formula once — do not just memorise.',
    'Solve 10 numericals daily; increase to 20 in the last 3 months.',
    'Draw a diagram for every problem — solutions become obvious.',
  ],
  toc: [
    { id: 'mindset', label: 'Physics mindset' },
    { id: 'chapters', label: 'Chapter priority' },
    { id: 'problem-solving', label: 'Problem-solving strategy' },
    { id: 'books', label: 'Books that work' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Physics scares most students — but only until they realise it is a game of concepts and consistent practice, not memorisation. Whether you are aiming for boards, JEE or NEET, the same core plan works. Understand concepts, derive formulas, then drill problems every single day.' },

    { type: 'h2', id: 'mindset', text: 'Physics mindset' },
    { type: 'ul', items: [
      'Never memorise formulas without deriving them once.',
      'Every problem starts with a labelled diagram.',
      'Track units through every calculation — catches half of all errors.',
      'When stuck, revisit the base concept — do not lookup the solution.',
    ]},

    { type: 'h2', id: 'chapters', text: 'Chapter priority' },
    { type: 'ul', items: [
      'Class 11 must-master: Kinematics, Laws of Motion, Work-Energy, Rotational Motion, Thermodynamics.',
      'Class 12 must-master: Electrostatics, Current Electricity, Magnetism, EMI, Optics, Modern Physics.',
      'High-weightage in JEE: Mechanics, Electrodynamics, Modern Physics.',
      'High-weightage in NEET: Mechanics, Thermodynamics, Optics, Modern Physics.',
    ]},

    { type: 'cta', title: 'Class 11 and 12 coaching at Rays Academy', text: 'Physics-strong Class 11 and 12 coaching with weekly numerical tests and derivation drills.', href: '/class-11-coaching-bhopal', label: 'Explore Class 11 coaching' },

    { type: 'h2', id: 'problem-solving', text: 'Problem-solving strategy' },
    { type: 'ol', items: [
      'Read the problem twice — underline given quantities and target.',
      'Draw a labelled free-body diagram or setup diagram.',
      'Write the governing equation — do not plug in numbers yet.',
      'Solve symbolically first; substitute values in the last step.',
      'Check units and order of magnitude before circling the answer.',
    ]},

    { type: 'h2', id: 'books', text: 'Books that work' },
    { type: 'ul', items: [
      'NCERT — non-negotiable base.',
      'H.C. Verma — concept building + intermediate problems.',
      'D.C. Pandey — chapter-wise for JEE / NEET.',
      'Irodov — only if you are aiming JEE Advanced top ranks.',
    ]},
    { type: 'callout', variant: 'tip', title: 'One good book beats five average ones', text: 'Finish HC Verma completely before touching Irodov. Depth in one book > shallow tourism across many.' },
  ],
  faq: [
    { q: 'How many hours of Physics daily?', a: '1.5–2 hours daily during Class 11 and 12. During entrance-only phase, push to 3 hours.' },
    { q: 'Is NCERT enough for JEE Physics?', a: 'For concepts, yes. But you need HC Verma or DC Pandey for numerical depth.' },
    { q: 'How do I improve Physics numerical speed?', a: 'Timed practice. Take 10 numericals, set a 30-minute timer, solve. Analyse errors, repeat next day.' },
    { q: 'Which chapter should I start with in Class 11?', a: 'Units, Dimensions and Vectors — everything else assumes fluency in these.' },
  ],
  relatedCourses: ['class-11', 'class-12', 'iit-jee', 'neet'],
  relatedMaterials: [
    { label: 'Class 11 Study Material', href: '/study-material/class-11' },
    { label: 'Class 12 Study Material', href: '/study-material/class-12' },
    { label: 'Formula Sheets', href: '/study-material/formula-sheets' },
  ],
};

export default post;
