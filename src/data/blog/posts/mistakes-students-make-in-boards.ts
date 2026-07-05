import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'mistakes-students-make-in-boards',
  title: '10 Mistakes Students Make in Board Exams (and How to Avoid Them)',
  description: 'The most common board exam mistakes across Class 10 and Class 12 — and practical fixes from Rays Academy Bhopal faculty.',
  excerpt: 'Same 10 mistakes cost most board students 10–15% marks. Here is how to fix each one before your next paper.',
  category: 'study-tips',
  tags: ['boards', 'class 10', 'class 12', 'exam tips'],
  publishedAt: '2026-06-10',
  readingMinutes: 8,
  heroEmoji: '⚠️',
  keyTakeaways: [
    'Presentation, not knowledge, is the top mark-loser.',
    'Skipping the blueprint costs 10+ marks silently.',
    'Ignoring NCERT in favour of reference books hurts.',
    'Solving papers only mentally never builds writing speed.',
    'Cramming the night before disrupts memory consolidation.',
  ],
  toc: [
    { id: 'mistakes', label: 'The 10 mistakes' },
    { id: 'fixes', label: 'How to fix each' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Every year, we see brilliant students score 10–15% below their capability in boards — not because they did not know the material, but because they made the same avoidable mistakes. This post lists them and gives you the fix for each.' },

    { type: 'h2', id: 'mistakes', text: 'The 10 mistakes' },
    { type: 'ol', items: [
      'Ignoring the blueprint and studying chapters equally.',
      'Skipping NCERT for "advanced" reference books.',
      'Reading answers instead of writing them.',
      'Not solving last 5 years PYQs.',
      'Poor time management in the exam hall.',
      'Skipping diagrams and headings — bad presentation.',
      'Cramming new topics the night before.',
      'Insufficient sleep during exam week.',
      'Attempting questions out of order without a plan.',
      'Not double-checking OMR / roll number / details.',
    ]},

    { type: 'h2', id: 'fixes', text: 'How to fix each' },
    { type: 'ul', items: [
      'Blueprint: download the official blueprint per subject and prioritise chapters by weightage.',
      'NCERT-first: finish NCERT completely before any reference book.',
      'Writing practice: solve at least 20 full-length papers by hand.',
      'PYQ solving: minimum 5 years, ideally 10 years, per subject.',
      'Time strategy: allocate minutes per section before the exam starts.',
      'Presentation: diagrams, headings, underline keywords, neat handwriting.',
      'Night before: only quick revision — no new topic learning.',
      'Sleep: 7 hours minimum, non-negotiable during exam week.',
      'Question order: attempt sure-shot first, tough at the end.',
      'Details: spend 30 seconds re-checking name, roll number, subject code.',
    ]},

    { type: 'cta', title: 'Board coaching at Rays Academy Bhopal', text: 'Structured Class 10 and Class 12 board coaching with blueprint mapping, PYQ practice and weekly writing tests.', href: '/class-10-coaching-bhopal', label: 'Explore board coaching' },

    { type: 'callout', variant: 'warning', title: 'Presentation is not optional', text: 'Two students can write the same answer and score differently. Neat headings, diagrams and underlined keywords are worth 5–8 marks in every subject.' },
  ],
  faq: [
    { q: 'How many PYQs should I solve for boards?', a: 'At least last 5 years, ideally 10 years — under exam timing.' },
    { q: 'Should I sleep or study the night before?', a: 'Sleep. 7 hours of sleep beats 3 hours of last-minute cramming, every time.' },
    { q: 'How do I improve writing speed?', a: 'Practise writing full-length papers weekly from November onwards. Speed comes only from repeated writing.' },
    { q: 'Is NCERT alone enough?', a: 'For Class 10 boards, yes. For Class 12, NCERT + one supplementary book is ideal.' },
  ],
  relatedCourses: ['class-10', 'class-12'],
  relatedMaterials: [
    { label: 'Class 10 Study Material', href: '/study-material/class-10' },
    { label: 'Class 12 Study Material', href: '/study-material/class-12' },
    { label: 'Sample Papers', href: '/study-material/sample-papers' },
  ],
};

export default post;
