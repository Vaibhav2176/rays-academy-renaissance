import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'time-management-for-board-exams',
  title: 'Time Management for Board Exams: The 3-Layer System That Works',
  description: 'A practical time management system for board exam students — daily blocks, weekly review, exam-hall pacing and how to protect your sleep and health.',
  excerpt: 'A simple, proven time-management system for board exam students — daily blocks, weekly review, and how to pace three-hour papers.',
  category: 'study-tips',
  tags: ['time management', 'board exam', 'productivity'],
  publishedAt: '2026-06-23',
  readingMinutes: 8,
  heroEmoji: '⌛',
  keyTakeaways: [
    'Focus in 90-minute blocks; break for 10–15 minutes.',
    'Do the hardest subject first, when your brain is fresh.',
    'Weekly review every Sunday — adjust based on what actually happened.',
    'In the exam hall, allocate time per section before you start writing.',
    'Sleep is a productivity tool, not a reward.',
  ],
  toc: [
    { id: 'why-fail', label: 'Why most timetables fail' },
    { id: 'daily', label: 'Daily time management' },
    { id: 'weekly', label: 'Weekly review' },
    { id: 'exam-hall', label: 'Exam-hall pacing' },
    { id: 'protect', label: 'Protect sleep + health' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Time management is not about "studying more hours". It is about making sure the hours you do study actually produce results. A student who studies 5 focused hours a day beats a student who studies 10 unfocused hours — every single time. This post shares the simple 3-layer system Rays Academy students use for boards.' },

    { type: 'h2', id: 'why-fail', text: 'Why most timetables fail' },
    { type: 'ul', items: [
      'Too ambitious — 14-hour schedules nobody can hold for a week.',
      'No buffer time for missed sessions or bad days.',
      'One subject a day — the brain tires quickly.',
      'No weekly review, so no correction when things slip.',
    ]},

    { type: 'h2', id: 'daily', text: 'Daily time management' },
    { type: 'ul', items: [
      'Fixed wake-up + sleep time (both matter).',
      '3–4 blocks of 90 minutes each, separated by 15-minute breaks.',
      'Hardest subject first in the morning.',
      'Last 30 minutes at night: revise what you learned that day.',
    ]},

    { type: 'h2', id: 'weekly', text: 'Weekly review — the missing habit' },
    { type: 'ol', items: [
      'Every Sunday evening, review what you finished vs planned.',
      'List 3 things that worked, 3 that did not.',
      'Adjust next week\'s plan accordingly.',
      'Do not fake it — honest reviews are what actually change habits.',
    ]},

    { type: 'cta', title: 'Access ready-made study planners', text: 'Chapter-wise planners, PYQs and sample papers from Rays Academy — free.', href: '/study-material', label: 'Browse study material' },

    { type: 'h2', id: 'exam-hall', text: 'Exam-hall pacing — the last 3 hours' },
    { type: 'ul', items: [
      'Use the 15-minute reading window to plan your order.',
      'Allocate time per section before writing.',
      'Attempt easy questions first — build confidence.',
      'If stuck, mark and move on. Return later.',
      'Reserve 10–12 minutes for revision at the end.',
    ]},

    { type: 'h2', id: 'protect', text: 'Protect sleep + health' },
    { type: 'ul', items: [
      '7 hours of sleep minimum — brain consolidates memory during sleep.',
      '20 minutes of walking / stretching daily — improves focus.',
      'Home food. Water. Fewer screens after 9 PM.',
    ]},
    { type: 'callout', variant: 'info', title: 'Sleep is study', text: 'A tired brain cannot recall. Sacrificing sleep for extra study is a bad trade — you lose more in recall than you gain in hours.' },
  ],
  faq: [
    { q: 'How many hours should I study for boards?', a: '6–7 focused hours daily during school, 9–10 during vacations. Consistency matters more than raw hours.' },
    { q: 'How do I avoid getting bored studying same subjects?', a: 'Rotate 2–3 subjects per day; alternate reading with problem solving; use short 10-minute breaks between blocks.' },
    { q: 'What is the best way to manage time in the exam?', a: 'Allocate time per section before starting. Attempt easy questions first, mark hard ones for return, and always leave 10 minutes for revision.' },
  ],
  relatedCourses: ['class-10', 'class-12'],
  relatedMaterials: [
    { label: 'All Study Material', href: '/study-material' },
    { label: 'Sample Papers', href: '/study-material/sample-papers' },
    { label: 'PYQs', href: '/study-material/previous-year-questions' },
  ],
};

export default post;
