import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'biology-neet-mastery',
  title: 'NEET Biology Mastery: The NCERT-First 360-Question Strategy',
  description: 'A complete NEET Biology mastery plan — NCERT-first reading strategy, high-yield chapters, MCQ drills and revision cycles.',
  excerpt: 'NEET Biology is 90% NCERT — this is exactly how to extract every mark from those pages.',
  category: 'neet',
  tags: ['neet', 'biology', 'ncert', 'medical'],
  publishedAt: '2026-06-21',
  readingMinutes: 9,
  heroEmoji: '🧬',
  keyTakeaways: [
    'NEET Biology is 90%+ direct NCERT — mastering it decides your rank.',
    'Read Class 11 + 12 NCERT Biology 4 times minimum.',
    'Underline every fact, diagram caption and table.',
    'Solve 60 MCQs daily — Biology alone.',
    'Weekly full revision of one Class 11 + one Class 12 chapter.',
  ],
  toc: [
    { id: 'why-ncert', label: 'Why NCERT decides NEET' },
    { id: 'high-yield', label: 'High-yield chapters' },
    { id: 'reading', label: 'Reading strategy' },
    { id: 'mcq', label: 'MCQ practice plan' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Every NEET topper says the same thing about Biology: NCERT decides your fate. Not fancy modules, not thick reference books — the two plain NCERT Biology textbooks. Class 11 and Class 12. Read cover to cover, four times. This post breaks down how to do it right.' },

    { type: 'h2', id: 'why-ncert', text: 'Why NCERT decides NEET' },
    { type: 'ul', items: [
      '90–95% of NEET Biology questions come directly from NCERT lines.',
      'NTA officially recommends NCERT as the primary source.',
      'Even diagram captions and small text boxes appear as questions.',
      'Reference books add depth but do not replace NCERT.',
    ]},

    { type: 'h2', id: 'high-yield', text: 'High-yield chapters' },
    { type: 'ul', items: [
      'Class 11: Plant Kingdom, Animal Kingdom, Biomolecules, Cell Cycle, Photosynthesis, Respiration, Human Physiology.',
      'Class 12: Genetics, Molecular Basis of Inheritance, Reproduction, Evolution, Biotechnology, Ecology.',
      'Ecology + Human Physiology + Genetics together = ~40% of NEET Biology.',
      'Never skip small chapters — a 2-mark chapter is 8 NEET marks.',
    ]},

    { type: 'cta', title: 'NEET Coaching at Rays Academy Bhopal', text: 'Two-year integrated NEET programme with NCERT-first Biology, weekly Biology tests and detailed analysis.', href: '/neet-coaching-bhopal', label: 'Explore NEET coaching' },

    { type: 'h2', id: 'reading', text: 'Reading strategy' },
    { type: 'ol', items: [
      'First read: understand — no highlighter.',
      'Second read: highlight every fact, name and definition.',
      'Third read: read only highlighted lines + summarise in your own words.',
      'Fourth read (revision): recite the chapter aloud.',
    ]},

    { type: 'h2', id: 'mcq', text: 'MCQ practice plan' },
    { type: 'ul', items: [
      '60 Biology MCQs daily — 30 Class 11 + 30 Class 12.',
      'Chapter-wise for first pass, mixed for second pass.',
      'Solve NCERT-exemplar MCQs — huge NEET overlap.',
      'Weekly full-length Biology-only test (90 questions, 45 minutes).',
    ]},
    { type: 'callout', variant: 'tip', title: 'Diagrams score marks', text: 'Practise labelling 5 diagrams a day. NEET repeatedly asks captions and structural questions straight from NCERT diagrams.' },
  ],
  faq: [
    { q: 'Is NCERT alone enough for NEET Biology?', a: 'NCERT + a good MCQ book (like MTG Objective NCERT) is enough for 340+ in Biology.' },
    { q: 'How many times should I read NCERT Biology?', a: '4 times minimum across two years, plus 2 more focused revisions in the last 60 days.' },
    { q: 'Should I make notes for NEET Biology?', a: 'Short concept flashcards yes, long notes no — NCERT itself is your best notes.' },
    { q: 'How many hours of Biology daily?', a: '3 hours daily during Class 12; 4 hours in the final NEET-only phase.' },
  ],
  relatedCourses: ['neet', 'class-11', 'class-12'],
  relatedMaterials: [
    { label: 'NEET Study Material', href: '/study-material/neet' },
    { label: 'NEET PYQs', href: '/study-material/pyq/neet' },
    { label: 'Sample Papers', href: '/study-material/sample-papers/neet' },
  ],
  externalRefs: [
    { label: 'NTA NEET Official Portal', url: 'https://neet.nta.nic.in/' },
  ],
};

export default post;
