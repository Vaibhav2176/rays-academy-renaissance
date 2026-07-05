import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'cuet-coaching-in-bhopal',
  title: 'Best CUET Coaching in Bhopal: Guide for Class 12 Students',
  description: 'CUET UG coaching in Bhopal — domain subject prep, language and general test training, and how to unlock DU, JNU, BHU and top central universities.',
  excerpt: 'A complete guide to CUET coaching in Bhopal — what to look for and how Rays Academy prepares CUET UG aspirants.',
  category: 'bhopal-education',
  tags: ['bhopal', 'cuet', 'university admissions', 'coaching'],
  publishedAt: '2026-06-12',
  readingMinutes: 9,
  heroEmoji: '🏛️',
  keyTakeaways: [
    'CUET UG unlocks 45+ central universities including DU, JNU and BHU.',
    'Domain subjects are NCERT Class 12 — no external content needed.',
    'Language and General Test need dedicated practice.',
    'Coaching adds structure, MCQ drills and mocks.',
    'Bhopal is an excellent base for calm, focused CUET prep.',
  ],
  toc: [
    { id: 'about', label: 'What is CUET UG' },
    { id: 'why-coaching', label: 'Do you need coaching?' },
    { id: 'what-to-look', label: 'What to look for' },
    { id: 'programme', label: 'Programme structure' },
    { id: 'rays', label: 'CUET at Rays Academy' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'CUET UG has quickly become the single most important undergraduate admissions exam in India — replacing separate cut-offs across nearly 45 central universities. Bhopal has strong CUET coaching options that combine domain subject teaching with language and general test training. Here is how to pick well.' },

    { type: 'h2', id: 'about', text: 'What is CUET UG' },
    { type: 'ul', items: [
      'Conducted by NTA once a year (May–June).',
      'Three sections: Language Tests, Domain Subjects, General Test.',
      'MCQ-based, computer-based; +5 / −1 marking.',
      'Up to 6 domain subjects picked based on target course.',
    ]},

    { type: 'h2', id: 'why-coaching', text: 'Do you need coaching?' },
    { type: 'ul', items: [
      'Structure — coaching prevents drifting during the year.',
      'MCQ drills — daily practice, curated question banks.',
      'Mock analysis — where solo prep usually falls short.',
      'General Test guidance — the section students most underprepare.',
    ]},

    { type: 'h2', id: 'what-to-look', text: 'What to look for' },
    { type: 'ol', items: [
      'Class 12 board + CUET integrated coaching.',
      'Faculty familiar with the CUET pattern specifically.',
      'Weekly mocks with analysis.',
      'Language and GT drills, not just domain subjects.',
      'Small batches and mentoring.',
    ]},

    { type: 'cta', title: 'CUET Coaching at Rays Academy Bhopal', text: 'Structured CUET UG programme for Class 12 students — domain-wise coaching plus language and GT drills.', href: '/cuet-coaching-bhopal', label: 'Explore CUET coaching' },

    { type: 'h2', id: 'programme', text: 'Programme structure' },
    { type: 'ul', items: [
      'August–December: syllabus completion + weekly chapter tests.',
      'January–February: full-length mocks weekly.',
      'March–April: alternate day mocks + revision cycles.',
      'Language and GT sessions run through all months.',
    ]},

    { type: 'h2', id: 'rays', text: 'CUET at Rays Academy' },
    { type: 'ul', items: [
      'Integrated Class 12 boards + CUET preparation.',
      'Domain subject teaching by experienced NCERT-focused faculty.',
      'Language and General Test dedicated drills.',
      'Weekly full-length CUET mocks from January.',
      'Personalised mentoring and target-university guidance.',
    ]},
    { type: 'callout', variant: 'info', title: 'CUET is easier than most students think', text: 'CUET rewards NCERT depth + MCQ speed — both trainable in a year. Consistent practice beats last-minute panic.' },
  ],
  faq: [
    { q: 'When should I start CUET coaching?', a: 'From August of Class 12, alongside board preparation. Both share large overlap.' },
    { q: 'How many domain subjects should I take?', a: '3–4 aligned with your target course. More than that dilutes preparation quality.' },
    { q: 'Do I need coaching if I am strong in NCERT?', a: 'Structured mock practice and language / GT prep are hard to do alone. Coaching accelerates both.' },
    { q: 'Which universities accept CUET?', a: 'Delhi University, JNU, BHU, Allahabad, HCU, and 40+ other central universities and participating institutions.' },
  ],
  relatedCourses: ['cuet', 'class-12'],
  relatedMaterials: [
    { label: 'CUET Study Material', href: '/study-material/cuet' },
    { label: 'Sample Papers', href: '/study-material/sample-papers' },
  ],
  externalRefs: [
    { label: 'CUET UG Official Portal', url: 'https://cuet.samarth.ac.in/' },
  ],
};

export default post;
