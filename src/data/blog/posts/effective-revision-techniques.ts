import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'effective-revision-techniques',
  title: 'Effective Revision Techniques: How Toppers Actually Revise',
  description: 'Revision techniques that actually work — active recall, spaced repetition, mind maps, PYQ drills and the weekly rotation system used by top scorers.',
  excerpt: 'Revision is a skill, not a chore. These are the exact techniques Rays Academy students use to lock what they have studied into long-term memory.',
  category: 'study-tips',
  tags: ['revision', 'study tips', 'memory'],
  publishedAt: '2026-06-27',
  readingMinutes: 9,
  heroEmoji: '🔁',
  keyTakeaways: [
    'Passive re-reading barely works. Active recall is the gold standard.',
    'Space out your revisions — day 1, day 3, day 7, day 21.',
    'One-page chapter summaries are the single most efficient revision tool.',
    'Teach the concept aloud to test true understanding.',
    'Weekly rotation: revisit every subject at least once a week.',
  ],
  toc: [
    { id: 'why', label: 'Why most revision does not work' },
    { id: 'techniques', label: 'The 5 techniques that do' },
    { id: 'schedule', label: 'A revision schedule that sticks' },
    { id: 'exam-mode', label: 'Revision in the last 30 days' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Everyone knows revision matters. Almost no one revises well. Most students re-read notes, feel familiar with the content, and mistake familiarity for understanding. Real revision is much more active — and it is what separates 75% students from 95% students.' },

    { type: 'h2', id: 'why', text: 'Why most revision does not work' },
    { type: 'ul', items: [
      'Passive re-reading feels comfortable but does not build recall.',
      'One long revision session, no follow-up — the "cramming" trap.',
      'Highlighting everything = highlighting nothing.',
      'No self-testing, so gaps remain hidden until the exam.',
    ]},

    { type: 'h2', id: 'techniques', text: 'The 5 techniques that do' },
    { type: 'h3', text: '1. Active recall' },
    { type: 'p', text: 'Close the book. Try to reproduce the chapter from memory — even in rough bullet points. Then compare with the book. This single habit doubles retention.' },
    { type: 'h3', text: '2. Spaced repetition' },
    { type: 'p', text: 'Revise the same chapter on day 1, day 3, day 7 and day 21. Each interval deepens the memory. Skipping the schedule collapses retention.' },
    { type: 'h3', text: '3. One-page chapter summaries' },
    { type: 'p', text: 'After finishing each chapter, compress it into one page — key concepts, formulas, diagrams, definitions. These become your only revision material in the final month.' },
    { type: 'h3', text: '4. Teach aloud' },
    { type: 'p', text: 'Explain the concept to an imaginary student or a real friend. If you cannot explain it, you do not understand it yet.' },
    { type: 'h3', text: '5. PYQ drills' },
    { type: 'p', text: 'Nothing tests recall like real past exam questions. Solve PYQs subject-wise, timed, and review honestly.' },

    { type: 'cta', title: 'Practise with Rays Academy PYQs and revision notes', text: 'Class-wise revision notes and previous year question packs — free downloads.', href: '/study-material/revision-notes', label: 'Get revision notes' },

    { type: 'h2', id: 'schedule', text: 'A revision schedule that sticks' },
    { type: 'ol', items: [
      'End of each day: 20 minutes recalling that day\'s new learning.',
      'Every Sunday: revise all subjects covered in the week (30 minutes each).',
      'End of each month: full-length mock + analysis.',
      'Two weeks before exam: only one-page summaries + PYQs.',
    ]},

    { type: 'h2', id: 'exam-mode', text: 'Revision in the last 30 days' },
    { type: 'ul', items: [
      'No new chapters, no new reference books.',
      'Rotate all subjects daily — do not spend a whole day on one.',
      'One full-length mock every 3 days.',
      'One-page summaries + your error diary + PYQs = the entire study material.',
    ]},
    { type: 'callout', variant: 'tip', title: 'Familiarity is not recall', text: 'If a topic feels familiar, that is not the same as knowing it. Only self-testing can reveal actual gaps.' },
  ],
  faq: [
    { q: 'How many times should I revise a chapter?', a: 'Minimum 3 times before boards — spaced across days 1, 3, 7 and 21. For entrances, 4–5 times over two years.' },
    { q: 'Is mind mapping effective for revision?', a: 'Yes — especially for chapters heavy on classification (Biology, History, Geography). A mind map forces active organisation.' },
    { q: 'Should I revise everything before the exam?', a: 'Yes — every subject should be revised at least once in the final month, ideally twice. Rotation matters more than depth in this window.' },
  ],
  relatedCourses: ['class-10', 'class-12'],
  relatedMaterials: [
    { label: 'Revision Notes', href: '/study-material/revision-notes' },
    { label: 'PYQs', href: '/study-material/previous-year-questions' },
    { label: 'Sample Papers', href: '/study-material/sample-papers' },
  ],
};

export default post;
