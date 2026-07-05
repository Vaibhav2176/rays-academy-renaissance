import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'board-vs-entrance-exam-balance',
  title: 'How to Balance Board Exams and Entrance Exams (JEE / NEET / CUET)',
  description: 'A practical plan for Class 12 students to balance board exams with JEE, NEET and CUET preparation — timetable, revision cycles and priority calls.',
  excerpt: 'Boards and entrances are not in competition — 85% of the syllabus overlaps. Here is how to prepare for both together.',
  category: 'study-tips',
  tags: ['boards', 'jee', 'neet', 'cuet', 'class 12'],
  publishedAt: '2026-06-07',
  readingMinutes: 9,
  heroEmoji: '⚖️',
  keyTakeaways: [
    'Boards and entrances share ~85% syllabus — study together.',
    'Split your day: mornings for boards, evenings for entrance MCQs.',
    'From December, tilt fully to boards until they end.',
    'Post-boards, restart entrance mocks immediately — no rest.',
    'Do not sacrifice one for the other — top rankers manage both.',
  ],
  toc: [
    { id: 'myth', label: 'The myth' },
    { id: 'overlap', label: 'Why the overlap helps' },
    { id: 'plan', label: 'The two-phase plan' },
    { id: 'schedule', label: 'A working daily schedule' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Every Class 12 student hears the same warning: "Boards and JEE / NEET cannot be prepared together." It is wrong. The two syllabi share about 85% of chapters, and top rankers routinely score above 95% in boards while cracking their entrance. What they get right is the balance. Here is how.' },

    { type: 'h2', id: 'myth', text: 'The myth' },
    { type: 'ul', items: [
      '"Focus on JEE, boards will follow" — wrong, boards need presentation practice.',
      '"Focus on boards, JEE later" — wrong, JEE-only prep post-boards is too little time.',
      '"They need different books" — mostly wrong, NCERT is the shared base.',
    ]},

    { type: 'h2', id: 'overlap', text: 'Why the overlap helps' },
    { type: 'ul', items: [
      'NCERT is the base for both boards and JEE / NEET / CUET.',
      'Concept understanding built for JEE makes board questions trivial.',
      'Board writing practice adds presentation skill for CUET as well.',
      'Every mock you take for entrances is a revision for boards.',
    ]},

    { type: 'h2', id: 'plan', text: 'The two-phase plan' },
    { type: 'ol', items: [
      'Aug–Nov: 60% entrance, 40% boards. NCERT + reference books + weekly MCQ tests.',
      'Dec–Feb: 80% boards, 20% entrance. PYQs, sample papers, writing practice.',
      'Post-boards: 100% entrance. Full mocks alternate days.',
      'Weekly review across all phases — adjust based on gaps.',
    ]},

    { type: 'cta', title: 'Class 12 + Entrance Coaching at Rays Academy', text: 'Integrated Class 12 board + JEE / NEET / CUET coaching — one plan, both outcomes.', href: '/class-12-coaching-bhopal', label: 'Explore Class 12 coaching' },

    { type: 'h2', id: 'schedule', text: 'A working daily schedule (Aug–Nov phase)' },
    { type: 'ul', items: [
      '6:00–8:00 AM — NCERT reading (board + entrance shared).',
      '8:00–2:30 PM — school.',
      '4:30–6:00 PM — entrance-focused problem solving.',
      '6:00–7:30 PM — coaching / self-study.',
      '9:00–10:30 PM — board writing practice + revision.',
      '11:00 PM — sleep.',
    ]},
    { type: 'callout', variant: 'tip', title: 'Never zero-out one side', text: 'Even in board-focus phase, do 20 entrance MCQs daily — it keeps the MCQ speed alive for post-board mocks.' },
  ],
  faq: [
    { q: 'Do boards really matter for JEE / NEET?', a: 'Directly, no — most entrances use only their own score. Indirectly, yes — top colleges, scholarships and confidence all depend on strong board scores.' },
    { q: 'How many hours daily in Class 12?', a: '8–10 focused hours during school terms, 12+ during vacations.' },
    { q: 'Should I take a drop year if boards clash?', a: 'Rarely necessary. With good planning, both can be managed. Consider a drop only after your first serious attempt.' },
    { q: 'How does Rays Academy manage the balance?', a: 'One integrated Class 12 syllabus with weekly tests structured to test both board writing and entrance MCQ speed.' },
  ],
  relatedCourses: ['class-12', 'iit-jee', 'neet', 'cuet'],
  relatedMaterials: [
    { label: 'Class 12 Study Material', href: '/study-material/class-12' },
    { label: 'JEE Study Material', href: '/study-material/iit-jee' },
    { label: 'NEET Study Material', href: '/study-material/neet' },
  ],
};

export default post;
