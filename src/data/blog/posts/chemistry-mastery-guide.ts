import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'chemistry-mastery-guide',
  title: 'Chemistry Mastery Guide: Physical, Organic and Inorganic Strategy',
  description: 'A complete Chemistry preparation guide for Class 11, 12, JEE and NEET — with clear approaches for Physical, Organic and Inorganic chemistry.',
  excerpt: 'Chemistry rewards a different approach for each branch — here is how to actually master Physical, Organic and Inorganic together.',
  category: 'study-tips',
  tags: ['chemistry', 'class 11', 'class 12', 'jee', 'neet'],
  publishedAt: '2026-06-22',
  readingMinutes: 9,
  heroEmoji: '🧪',
  keyTakeaways: [
    'Treat Physical, Organic and Inorganic as three different subjects.',
    'Physical Chemistry: formula + numerical practice like Physics.',
    'Organic Chemistry: mechanism-first, memorisation-last.',
    'Inorganic Chemistry: NCERT is the whole game.',
    'Revise reaction charts weekly — they fade fast.',
  ],
  toc: [
    { id: 'physical', label: 'Physical Chemistry' },
    { id: 'organic', label: 'Organic Chemistry' },
    { id: 'inorganic', label: 'Inorganic Chemistry' },
    { id: 'revision', label: 'Revision plan' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Chemistry is the most misunderstood subject in Class 11 and 12. Students treat it as one giant memorisation exercise — and then wonder why marks stall. The trick is to recognise that Physical, Organic and Inorganic are three genuinely different subjects, and each rewards a different approach.' },

    { type: 'h2', id: 'physical', text: 'Physical Chemistry' },
    { type: 'ul', items: [
      'Approach it like Physics — formulas + numerical practice.',
      'High-weightage: Mole Concept, Thermodynamics, Equilibrium, Electrochemistry, Kinetics.',
      'NCERT + P Bahadur or RC Mukherjee for numericals.',
      'Practice 10 numericals daily minimum.',
    ]},

    { type: 'h2', id: 'organic', text: 'Organic Chemistry' },
    { type: 'ul', items: [
      'Mechanism first, memorisation last. Understand why a reaction happens.',
      'Master GOC (General Organic Chemistry) before named reactions.',
      'Maintain a reaction map — one page per functional group.',
      'Solve conversions daily — 5 per day builds intuition fast.',
    ]},

    { type: 'cta', title: 'Chemistry-strong coaching at Rays Academy', text: 'Class 11, 12, JEE and NEET Chemistry taught with mechanism-first clarity — small batches, weekly tests.', href: '/iit-jee-coaching-bhopal', label: 'Explore coaching' },

    { type: 'h2', id: 'inorganic', text: 'Inorganic Chemistry' },
    { type: 'ul', items: [
      'NCERT is the whole game — read it 4 times minimum.',
      'Focus areas: Periodic Table, Chemical Bonding, Coordination Compounds, d and f block.',
      'Make colour + exception tables — inorganic is memory + exception heavy.',
      'Weekly self-test on reactions and colours.',
    ]},

    { type: 'h2', id: 'revision', text: 'Revision plan' },
    { type: 'ol', items: [
      'Daily: 30 min organic mechanism recap + 5 conversions.',
      'Alternate day: 10 physical chemistry numericals.',
      'Weekly: full inorganic chapter revision with self-test.',
      'Monthly: mixed 60-question timed MCQ set.',
    ]},
    { type: 'callout', variant: 'warning', title: 'Do not ignore Inorganic', text: 'Students obsess over Organic and Physical — but Inorganic quietly carries 30–40% of JEE / NEET Chemistry marks and is the easiest to score.' },
  ],
  faq: [
    { q: 'Which Chemistry branch is most scoring?', a: 'Inorganic — because it is direct NCERT recall. Followed by Physical for those comfortable with numericals.' },
    { q: 'Is NCERT enough for JEE Chemistry?', a: 'For Inorganic — yes, mostly. For Organic — NCERT + mechanisms book. For Physical — NCERT + a numerical book.' },
    { q: 'How do I remember organic reactions?', a: 'Do not memorise them — understand the mechanism. Once you see the electron flow, the product becomes obvious.' },
    { q: 'How often should I revise reactions?', a: 'Weekly, no exceptions. Reaction memory decays faster than any other Chemistry topic.' },
  ],
  relatedCourses: ['class-11', 'class-12', 'iit-jee', 'neet'],
  relatedMaterials: [
    { label: 'Class 11 Study Material', href: '/study-material/class-11' },
    { label: 'Class 12 Study Material', href: '/study-material/class-12' },
    { label: 'JEE Study Material', href: '/study-material/iit-jee' },
  ],
};

export default post;
