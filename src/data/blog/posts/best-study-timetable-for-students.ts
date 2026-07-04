import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'best-study-timetable-for-students',
  title: 'The Best Study Timetable for Students: Templates That Actually Work',
  description: 'Study timetable templates for Class 9, 10, 11 and 12 students — daily, weekly and exam-mode routines with focus blocks, breaks and revision cycles.',
  excerpt: 'Ready-to-use daily and weekly study timetables for school, entrance and board exam students — built around focus, sleep and consistency.',
  category: 'study-tips',
  tags: ['timetable', 'study tips', 'productivity'],
  publishedAt: '2026-06-13',
  readingMinutes: 9,
  heroEmoji: '⏰',
  keyTakeaways: [
    'A good timetable is realistic, not aspirational — build it around your school hours.',
    'Study in 90-minute focus blocks with 10–15 minute breaks.',
    'Rotate subjects daily; do not spend a whole day on one.',
    'Weekly review Sunday: what worked, what did not, adjust.',
    'Sleep is part of the timetable, not what happens after it.',
  ],
  toc: [
    { id: 'principles', label: 'Timetable principles' },
    { id: 'school-day', label: 'School-day template' },
    { id: 'exam-mode', label: 'Exam-mode template' },
    { id: 'weekly', label: 'A working weekly template' },
    { id: 'sticking', label: 'How to actually stick to it' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Everyone loves making a timetable. Almost nobody sticks to one. The problem is not motivation — it is that most timetables are built for the student we wish we were, not the student we actually are. This guide gives you realistic, tested templates that fit around school, coaching and normal human energy levels.' },

    { type: 'h2', id: 'principles', text: 'Principles of a working timetable' },
    { type: 'ul', items: [
      'Realistic: fits your actual school + coaching schedule.',
      'Focus blocks: 90 minutes deep work + 10–15 minute breaks.',
      'Variety: rotate 2–3 subjects a day, never all on one.',
      'Buffer: keep 1 flexible slot for backlogs.',
      'Sleep protected: 7 hours minimum, non-negotiable.',
    ]},

    { type: 'h2', id: 'school-day', text: 'School-day template (Class 9–12)' },
    { type: 'ul', items: [
      '5:45 AM — wake up, brush, light stretching.',
      '6:00–7:30 AM — focus block 1 (hardest subject, fresh brain).',
      '7:30–8:00 AM — breakfast + get ready.',
      '8:00–2:30 PM — school.',
      '3:30–4:30 PM — nap or rest (yes, really — cognitive reset).',
      '4:30–6:00 PM — focus block 2 (second subject).',
      '6:00–7:30 PM — coaching / self-study block 3.',
      '8:00–9:00 PM — dinner + family time.',
      '9:00–10:00 PM — revision of today\'s work.',
      '10:30 PM — sleep.',
    ]},

    { type: 'h2', id: 'exam-mode', text: 'Exam-mode template (last 60 days)' },
    { type: 'ul', items: [
      '5:30 AM — wake up.',
      '6:00–8:00 AM — subject 1 (heavy chapter).',
      '8:00–9:00 AM — breakfast + short walk.',
      '9:00–11:30 AM — subject 2.',
      '11:30–12:30 PM — MCQ / PYQ block.',
      '12:30–2:00 PM — lunch + rest.',
      '2:00–4:30 PM — subject 3.',
      '4:30–5:30 PM — physical movement + snack.',
      '5:30–8:00 PM — subject 4 / full-length practice (alternate).',
      '9:00–10:30 PM — revision of today.',
      '11:00 PM — sleep.',
    ]},

    { type: 'cta', title: 'Get Rays Academy planners and PYQs', text: 'Chapter-wise planners, PYQs and sample papers to structure your daily study — free for all classes.', href: '/study-material', label: 'Browse study material' },

    { type: 'h2', id: 'weekly', text: 'A working weekly template' },
    { type: 'ol', items: [
      'Monday–Friday: focused study, one subject rotating daily.',
      'Saturday: doubt clearing + one deep-dive chapter.',
      'Sunday: 1 full-length mock (morning) + analysis (afternoon) + rest (evening).',
      'One weekly review: what you finished, what slipped, what to fix.',
    ]},

    { type: 'h2', id: 'sticking', text: 'How to actually stick to it' },
    { type: 'ul', items: [
      'Print the timetable and stick it on your study wall.',
      'Use a simple habit tracker — tick each completed block.',
      'When you slip, do not restart the whole plan — resume the next block.',
      'Reward yourself weekly for keeping the routine, not for marks.',
    ]},
    { type: 'callout', variant: 'info', title: 'A "perfect" week is a myth', text: 'Even top scorers hit 70% adherence in a normal week. Consistency over months beats perfection over any one week.' },
  ],
  faq: [
    { q: 'How many hours a day should a Class 10 student study?', a: '6–7 focused hours daily during school terms; 9–10 hours during vacations. Beyond that, returns drop quickly.' },
    { q: 'Should I study one subject a day or rotate?', a: 'Rotate 2–3 subjects daily. Long same-subject blocks tire the brain quickly and hurt retention.' },
    { q: 'Is early morning study better?', a: 'For most students, the first two hours after wake-up are the most focused. Use them for your hardest subject.' },
    { q: 'How much sleep do I need during boards?', a: '7 hours minimum. Sleep is when the brain consolidates memory — cutting sleep for extra study is a bad trade.' },
  ],
  relatedCourses: ['class-10', 'class-12'],
  relatedMaterials: [
    { label: 'All Study Material', href: '/study-material' },
    { label: 'Revision Notes', href: '/study-material/revision-notes' },
  ],
};

export default post;
