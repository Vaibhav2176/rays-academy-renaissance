import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'mp-board-class-10-preparation',
  title: 'MP Board Class 10 Preparation: Complete Subject-Wise Strategy',
  description: 'MP Board Class 10 preparation guide — subject-wise strategy, blueprint, sample papers and revision plan for Madhya Pradesh Board students.',
  excerpt: 'A focused MP Board Class 10 preparation plan built around the MPBSE blueprint, PYQs and smart revision.',
  category: 'bhopal-education',
  tags: ['mp board', 'class 10', 'mpbse', 'bhopal'],
  publishedAt: '2026-06-25',
  readingMinutes: 9,
  heroEmoji: '🏫',
  keyTakeaways: [
    'MP Board follows a fixed blueprint — study it before your books.',
    'MPBSE textbooks + NCERT together give 100% syllabus coverage.',
    'Solve last 5 years PYQs — MPBSE repeats question patterns heavily.',
    'Hindi and Sanskrit are score-boosters if practised weekly.',
    'Time-bound writing practice is more important than reading revision.',
  ],
  toc: [
    { id: 'blueprint', label: 'Understand the blueprint' },
    { id: 'subjects', label: 'Subject-wise strategy' },
    { id: 'pyq', label: 'PYQ practice plan' },
    { id: 'timeline', label: 'Month-by-month timeline' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'MP Board Class 10 is a high-stakes year — your marks decide stream eligibility, scholarships and admission preferences. The good news is MPBSE runs a very predictable exam: fixed blueprint, familiar question types and a syllabus that maps closely to NCERT. This guide gives you a subject-wise plan built around that predictability.' },

    { type: 'h2', id: 'blueprint', text: 'Understand the MPBSE blueprint first' },
    { type: 'ul', items: [
      'Download the latest MPBSE blueprint PDF for each subject.',
      'Note the mark distribution across units — this decides study time.',
      'Identify high-weightage chapters and prioritise them.',
      'Learn the question types: objective, VSA, SA, LA, case-based.',
    ]},

    { type: 'h2', id: 'subjects', text: 'Subject-wise strategy' },
    { type: 'ul', items: [
      'Hindi: focus on grammar, letter writing and essay — quick score boosters.',
      'English: reading comprehension + writing skills carry the paper.',
      'Mathematics: NCERT + MPBSE textbook exercises; practice geometry proofs.',
      'Science: NCERT is 90% of the paper — write derivations and diagrams neatly.',
      'Social Science: map work, dates and cause-effect chains — revise weekly.',
      'Sanskrit: memorise shlokas, translations and grammar rules.',
    ]},

    { type: 'cta', title: 'Class 10 Coaching at Rays Academy Bhopal', text: 'Board-aligned Class 10 coaching with weekly tests and PYQ practice — CBSE, ICSE and MP Board.', href: '/class-10-coaching-bhopal', label: 'Explore Class 10 coaching' },

    { type: 'h2', id: 'pyq', text: 'PYQ practice plan' },
    { type: 'ol', items: [
      'Solve last 5 years papers, one per week from December onwards.',
      'Time yourself — 3 hours, no breaks.',
      'Self-evaluate strictly using the marking scheme.',
      'List repeat-questions — memorise those answers verbatim.',
    ]},

    { type: 'h2', id: 'timeline', text: 'Month-by-month timeline' },
    { type: 'ul', items: [
      'August–October: full syllabus completion + chapter tests.',
      'November: first revision + weak chapter re-study.',
      'December: PYQ solving + writing practice.',
      'January: full-length mocks, alternate day.',
      'February: rapid revision + sample papers only.',
    ]},
    { type: 'callout', variant: 'tip', title: 'Neat handwriting is worth marks', text: 'MPBSE examiners reward clean, well-structured answers. Practise writing under time pressure — speed and neatness together.' },
  ],
  faq: [
    { q: 'Is NCERT enough for MP Board Class 10?', a: 'NCERT + MPBSE textbook together are enough. NCERT for concepts, MPBSE textbook for exam-style questions and PYQ patterns.' },
    { q: 'How many hours should I study daily?', a: '5–6 focused hours during school terms, 8–9 hours during winter and pre-board vacations.' },
    { q: 'When are MP Board exams held?', a: 'MPBSE Class 10 exams typically run from late February to March each year.' },
    { q: 'Does Rays Academy offer MP Board coaching?', a: 'Yes — our Class 10 programme covers CBSE, ICSE and MP Board syllabi with dedicated MPBSE PYQ practice.' },
  ],
  relatedCourses: ['class-10'],
  relatedMaterials: [
    { label: 'Class 10 Study Material', href: '/study-material/class-10' },
    { label: 'Class 10 PYQs', href: '/study-material/pyq/class-10' },
    { label: 'Sample Papers', href: '/study-material/sample-papers/class-10' },
  ],
  externalRefs: [
    { label: 'MPBSE Official Website', url: 'https://mpbse.nic.in/' },
  ],
};

export default post;
