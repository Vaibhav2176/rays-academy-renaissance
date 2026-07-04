import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'cuet-preparation-tips',
  title: 'CUET UG Preparation Tips: Complete Domain + Language Strategy',
  description: 'CUET UG preparation strategy — domain subjects, language tests, general test, mock plan and top-university admissions guidance from Rays Academy Bhopal.',
  excerpt: 'CUET UG rewards NCERT depth plus MCQ speed. This is the domain + language + general test plan we use at Rays Academy.',
  category: 'cuet',
  tags: ['cuet', 'university admissions', 'du', 'ncert'],
  publishedAt: '2026-06-11',
  readingMinutes: 10,
  heroEmoji: '🏛️',
  keyTakeaways: [
    'CUET UG is 100% NCERT-based for domain subjects — no external books needed.',
    'Language tests are speed + accuracy — daily comprehension practice.',
    'General Test needs current affairs + basic quantitative aptitude.',
    'One full mock every week from January is the minimum benchmark.',
    'A high CUET score opens Delhi University, JNU, BHU, Allahabad University and more.',
  ],
  toc: [
    { id: 'about-cuet', label: 'What is CUET UG' },
    { id: 'domain', label: 'Domain subject strategy' },
    { id: 'language', label: 'Language test strategy' },
    { id: 'general-test', label: 'General test strategy' },
    { id: 'mock-plan', label: 'Mock plan' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'CUET UG has quickly become the single most important undergraduate admissions exam in India, replacing separate cut-offs across nearly 45 central universities and 400+ participating institutions. Yet the exam itself is friendlier than most students realise — the syllabus is fixed to NCERT Class 12, and the questions are largely straightforward MCQs. Score well and you unlock DU, JNU, BHU, HCU and many more.' },

    { type: 'h2', id: 'about-cuet', text: 'What is CUET UG' },
    { type: 'ul', items: [
      'Conducted by NTA, once a year (May–June).',
      'Three sections: Language Tests, Domain Subjects, General Test.',
      'Computer-based MCQ format; +5 / −1 marking.',
      'Choose up to 6 domain subjects based on your target course.',
    ]},

    { type: 'h2', id: 'domain', text: 'Domain subject strategy' },
    { type: 'p', text: 'Domain subjects are pure Class 12 NCERT. If you have prepared well for your board exams, you are already halfway there.' },
    { type: 'ul', items: [
      'Re-read NCERT with a highlighter — CUET picks facts directly from lines.',
      'Solve topic-wise MCQs after each chapter.',
      'Attempt PYQs — CUET has three years of question banks now.',
      'Weekly full-length section tests to build stamina.',
    ]},

    { type: 'cta', title: 'CUET Coaching at Rays Academy Bhopal', text: 'Structured CUET UG programme for Class 12 students — domain-wise coaching plus language and GT drills.', href: '/cuet-coaching-bhopal', label: 'Explore CUET coaching' },

    { type: 'h2', id: 'language', text: 'Language test strategy' },
    { type: 'ul', items: [
      'Reading comprehension: practise 2 passages daily under 8 minutes each.',
      'Vocabulary: 20 new words weekly with usage.',
      'Grammar: NCERT + a compact grammar book — do not over-study.',
      'Verbal ability: analogies, synonyms, antonyms — practise PYQ style.',
    ]},

    { type: 'h2', id: 'general-test', text: 'General test strategy' },
    { type: 'ul', items: [
      'Current affairs: last 12 months from a good monthly compilation.',
      'Static GK: history, geography, polity, economy — Class 6–10 NCERTs are enough.',
      'Quantitative aptitude: Class 8–10 level. Focus on percentages, ratios, DI, algebra.',
      'Logical reasoning: R.S. Aggarwal or similar — 30 minutes daily.',
    ]},

    { type: 'h2', id: 'mock-plan', text: 'Mock plan' },
    { type: 'ol', items: [
      'From January: one full-length CUET mock per week.',
      'From March: two mocks per week.',
      'From April: alternate mock + full analysis day.',
      'Focus your revision on the sections that repeatedly cost you marks.',
    ]},
    { type: 'callout', variant: 'tip', title: 'Time each section separately', text: 'CUET is a section-timed exam — you cannot borrow time across sections. Practising with the exact section clocks trains speed correctly.' },
  ],
  faq: [
    { q: 'Do CUET scores replace board marks?', a: 'For most participating central universities, admission is entirely CUET-based. Some universities may use board marks as a tie-breaker, but the CUET score is the primary criterion.' },
    { q: 'How many domain subjects should I pick?', a: 'Pick the subjects you have studied in Class 12 plus one or two extras only if you can genuinely prepare them. Quality beats quantity.' },
    { q: 'Is NCERT alone enough for CUET UG?', a: 'For domain subjects, yes. For Language and General Test, supplement with dedicated MCQ practice.' },
    { q: 'When should I start CUET preparation?', a: 'From August of Class 12, alongside board preparation. Both share a large overlap.' },
  ],
  relatedCourses: ['cuet', 'class-12'],
  relatedMaterials: [
    { label: 'CUET Study Material', href: '/study-material/cuet' },
    { label: 'Sample Papers', href: '/study-material/sample-papers' },
  ],
  externalRefs: [
    { label: 'CUET UG Official Portal', url: 'https://cuet.samarth.ac.in/' },
    { label: 'NTA Official Website', url: 'https://nta.ac.in/' },
  ],
};

export default post;
