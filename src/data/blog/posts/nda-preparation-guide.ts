import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'nda-preparation-guide',
  title: 'NDA Preparation Guide: Written + SSB Strategy for Class 11 & 12 Students',
  description: 'A complete NDA preparation guide — written exam syllabus, subject-wise plan, SSB interview strategy, physical fitness tips and career pathway from Rays Academy Bhopal.',
  excerpt: 'How to prepare for NDA from Class 11 — written syllabus, SSB interview roadmap, physical training and the career life it opens up.',
  category: 'nda',
  tags: ['nda', 'defence', 'ssb', 'career'],
  publishedAt: '2026-06-09',
  readingMinutes: 11,
  heroEmoji: '🎖️',
  keyTakeaways: [
    'NDA has two parts — written (Maths + GAT) and SSB interview.',
    'Class 11–12 syllabus covers 80%+ of NDA Maths; boards prep helps directly.',
    'GAT covers English, GK, Physics, Chemistry, History, Geography — read newspapers daily.',
    'SSB tests personality, not memory — start working on communication from Class 11.',
    'Physical fitness is essential; 30–45 minutes daily is enough to start.',
  ],
  toc: [
    { id: 'exam-structure', label: 'NDA exam structure' },
    { id: 'written-prep', label: 'Written exam preparation' },
    { id: 'ssb', label: 'SSB interview strategy' },
    { id: 'fitness', label: 'Physical fitness' },
    { id: 'career', label: 'The NDA career path' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'The National Defence Academy (NDA) is one of the most prestigious pathways for young Indians — a fully-paid career in the Army, Navy or Air Force with early responsibility, deep training and lifelong purpose. It is also one of the most balanced exams: half academic, half personality. This guide covers the complete NDA preparation strategy for Class 11 and 12 students.' },

    { type: 'h2', id: 'exam-structure', text: 'NDA exam structure' },
    { type: 'ul', items: [
      'Written Exam (UPSC): Mathematics (300 marks) + General Ability Test (600 marks).',
      'SSB Interview: 5-day personality assessment (900 marks).',
      'Total: 1800 marks.',
      'Conducted twice a year — NDA I (April) and NDA II (September).',
    ]},

    { type: 'h2', id: 'written-prep', text: 'Written exam preparation' },
    { type: 'h3', text: 'Mathematics (Class 11–12 level)' },
    { type: 'ul', items: [
      'Trigonometry, Algebra, Calculus, Vectors, Statistics, Coordinate Geometry.',
      'NCERT + RD Sharma / RS Aggarwal — daily 30 problems.',
      'PYQ practice from last 10 years is essential — patterns repeat.',
    ]},
    { type: 'h3', text: 'General Ability Test (GAT)' },
    { type: 'ul', items: [
      'English (200 marks): grammar, vocabulary, comprehension.',
      'General Knowledge (400 marks): Physics, Chemistry, Biology (Class 10 level), History, Geography, Polity, Economy, Current Affairs.',
      'Read The Hindu / Indian Express daily, plus Lucent GK.',
      'Practise 20 GK MCQs daily to build recall.',
    ]},

    { type: 'cta', title: 'NDA Coaching at Rays Academy Bhopal', text: 'Written exam coaching + SSB mentoring, tailored to Class 11–12 students in Bhopal.', href: '/nda-coaching-bhopal', label: 'Explore NDA coaching' },

    { type: 'h2', id: 'ssb', text: 'SSB interview strategy' },
    { type: 'p', text: 'The Services Selection Board interview is a 5-day residential process. Officer Like Qualities (OLQs) — courage, initiative, communication, decision-making — are what the board is looking for.' },
    { type: 'ul', items: [
      'Day 1: Screening — Officer Intelligence Rating + Picture Perception & Discussion.',
      'Day 2: Psychological tests (TAT, WAT, SRT, SDT).',
      'Day 3–4: Group Testing Officer tasks (GD, GPE, Lecturette, obstacle course).',
      'Day 5: Personal interview + conference.',
    ]},
    { type: 'p', text: 'Start early. In Class 11, begin reading newspapers, join a debating club, take responsibility in school projects, and practise expressing yourself clearly. The SSB rewards genuine, everyday personality — not a performance.' },

    { type: 'h2', id: 'fitness', text: 'Physical fitness — start light, stay consistent' },
    { type: 'ul', items: [
      '30–45 minutes daily: running, push-ups, pull-ups, planks.',
      'Aim to run 2.4 km in under 15 minutes.',
      'Swim if you can — Navy specifically values it.',
      'Fitness helps in SSB obstacle tasks and, more importantly, in NDA training.',
    ]},

    { type: 'h2', id: 'career', text: 'The NDA career path' },
    { type: 'p', text: 'After clearing NDA and SSB, cadets undergo 3 years of training at Khadakwasla + 1 year at IMA / Naval Academy / Air Force Academy. On commissioning, an officer earns a starting salary of around ₹56,000 + allowances, along with lifelong pension, healthcare, housing and travel benefits. But most officers will tell you the real reward is the life itself — purpose, adventure, camaraderie and service to the country.' },
  ],
  faq: [
    { q: 'Can girls apply for NDA?', a: 'Yes. Since 2022, women candidates are eligible for NDA on the same terms as men.' },
    { q: 'How long does NDA preparation take?', a: 'Serious preparation from Class 11 gives you two full attempts before you turn 19 — the sweet spot for entry.' },
    { q: 'Is Class 12 Maths compulsory for NDA?', a: 'For Army wing, PCM is not compulsory. For Navy and Air Force wings, Class 12 with Physics, Chemistry and Maths is required.' },
    { q: 'Does Rays Academy offer NDA coaching in Bhopal?', a: 'Yes — Rays Academy runs an integrated NDA programme with written exam coaching, SSB mentoring, GK sessions and physical fitness guidance.' },
  ],
  relatedCourses: ['nda', 'class-11', 'class-12'],
  relatedMaterials: [
    { label: 'NDA Study Material', href: '/study-material/nda' },
    { label: 'NDA Previous Year Questions', href: '/study-material/pyq/nda' },
    { label: 'NDA Sample Papers', href: '/study-material/sample-papers/nda' },
  ],
  externalRefs: [
    { label: 'UPSC Official Website', url: 'https://www.upsc.gov.in/' },
    { label: 'National Defence Academy', url: 'https://www.nda.nic.in/' },
  ],
};

export default post;
