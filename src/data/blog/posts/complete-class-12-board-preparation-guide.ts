import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'complete-class-12-board-preparation-guide',
  title: 'Complete Class 12 Board Preparation Guide: Score High While Preparing for JEE / NEET',
  description: 'A complete Class 12 preparation guide — subject-wise study plan, timetable, dual JEE / NEET readiness, revision system and last-30-days strategy from Rays Academy Bhopal.',
  excerpt: 'How Class 12 students at Rays Academy balance boards with JEE or NEET prep — subject strategy, weekly plan, and the last 30 days that make or break the score.',
  category: 'class-12',
  tags: ['class 12', 'board exam', 'jee', 'neet', 'study tips'],
  publishedAt: '2026-06-03',
  readingMinutes: 12,
  popular: true,
  heroEmoji: '📚',
  keyTakeaways: [
    'Class 12 boards and JEE/NEET share ~70% of syllabus — study once, reuse everywhere.',
    'Split your day into deep-work blocks: 90 minutes on, 15 minutes off.',
    'PCB / PCM students should keep one weekend session for full-length practice.',
    'The last 30 days are pure revision + PYQs + full mocks — no new topics.',
    'Sleep, food and 30 minutes of movement daily are non-negotiable for stamina.',
  ],
  toc: [
    { id: 'mindset', label: 'The Class 12 mindset' },
    { id: 'dual-prep', label: 'Boards + JEE / NEET together' },
    { id: 'subject-plan', label: 'Subject-wise plan' },
    { id: 'weekly', label: 'A realistic weekly plan' },
    { id: 'last-30', label: 'The last 30 days' },
    { id: 'exam-day', label: 'Exam-day checklist' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Class 12 is the year that decides a lot: your board percentage, your JEE or NEET rank, and often the college you attend for the next four years. Yet most students spend the year in panic mode, switching between board syllabus and entrance material with no plan. The truth is simpler — if you plan the year in blocks, boards and entrances actually feed each other.' },

    { type: 'h2', id: 'mindset', text: 'The Class 12 mindset — long game, not sprints' },
    { type: 'p', text: 'Class 12 is a 10-month game. Students who peak in June and burn out by December score less than students who study 6 focused hours every single day. Pace matters more than intensity. Rays Academy Class 12 batches build the routine early so that January to March feels like revision, not survival.' },

    { type: 'h2', id: 'dual-prep', text: 'Boards + JEE / NEET together — the smart overlap' },
    { type: 'p', text: 'Around 70% of the Class 12 board syllabus for Physics, Chemistry, Biology and Maths appears — in some form — in JEE and NEET. If you study a chapter well once, you have covered both. The trick is knowing which layer to add:' },
    { type: 'ul', items: [
      'Boards need clean derivations, labelled diagrams, exact definitions.',
      'JEE / NEET need speed, MCQ pattern practice and application on tougher problems.',
      'Study the concept from NCERT + class notes, then attempt board questions, then attempt JEE / NEET MCQs on the same topic.',
    ]},
    { type: 'callout', variant: 'tip', title: 'Do not run two syllabi in parallel', text: 'Take one chapter at a time and finish it for both exams together. Parallel prep across two books usually leads to half-finished chapters everywhere.' },

    { type: 'h2', id: 'subject-plan', text: 'Subject-wise plan for Class 12' },
    { type: 'h3', text: 'Physics' },
    { type: 'ul', items: [
      'NCERT concepts + HC Verma / DC Pandey for JEE, or NCERT + MTG for NEET.',
      'Weekly derivation practice — boards ask them almost every year.',
      'One numerical sheet per chapter, timed.',
    ]},
    { type: 'h3', text: 'Chemistry' },
    { type: 'ul', items: [
      'NCERT is the Bible — every Chemistry NEET question is essentially NCERT.',
      'Organic: mechanism-first, then reactions, then problems.',
      'Inorganic: NCERT lines are direct MCQ material — memorise carefully.',
    ]},
    { type: 'h3', text: 'Mathematics (JEE / Boards)' },
    { type: 'ul', items: [
      'Finish NCERT exercises, then move to RD Sharma / Cengage.',
      'Weekly full-length calculus + algebra practice sets.',
      'Boards love proofs and cases — write them out cleanly.',
    ]},
    { type: 'h3', text: 'Biology (NEET / Boards)' },
    { type: 'ul', items: [
      'NCERT line-by-line — twice.',
      'Diagrams from NCERT are directly asked; label them yourself weekly.',
      'Create summary tables for taxonomy, plant / animal kingdom, human physiology.',
    ]},

    { type: 'cta', title: 'Get Class 12 chapter notes and PYQs', text: 'Curated Class 12 study material aligned to CBSE, ICSE, MP Board and JEE / NEET syllabus.', href: '/study-material/class-12', label: 'Open Class 12 material' },

    { type: 'h2', id: 'weekly', text: 'A realistic weekly plan' },
    { type: 'ol', items: [
      'Monday–Friday: 2 deep-work blocks of 90 minutes before school, 2 after school.',
      'One block per day is JEE / NEET style problems on a topic you finished that week.',
      'Saturday: 3 hours of doubts + one subject deep-dive.',
      'Sunday: 3-hour full-length mock (board or entrance, alternate weekly).',
    ]},

    { type: 'h2', id: 'last-30', text: 'The last 30 days before boards' },
    { type: 'p', text: 'The last month is not for learning new chapters. It is for cementing what you already know:' },
    { type: 'ul', items: [
      'Rotate all subjects every day — do not spend a whole day on one.',
      'Solve 1 full board paper every 3 days.',
      'Rewrite one-page summaries of every chapter from scratch.',
      'Sleep 7+ hours — you cannot recall from a tired brain.',
    ]},

    { type: 'h2', id: 'exam-day', text: 'Exam-day checklist' },
    { type: 'ul', items: [
      'Admit card, ID, transparent pouch, 2 blue + 1 black pen, pencil, ruler, eraser.',
      'Reach the centre 45 minutes early — no last-minute stress.',
      'Read the question paper fully in the 15-minute reading window.',
      'Start with the section you are strongest in — build confidence first.',
    ]},
  ],
  faq: [
    { q: 'Can I score 95%+ in Class 12 while preparing for JEE / NEET?', a: 'Yes. Nearly every top JEE / NEET rank holder also scores 90%+ in boards. The same NCERT-first, PYQ-heavy prep serves both.' },
    { q: 'When should I stop doing JEE / NEET material and only focus on boards?', a: 'Roughly 25–30 days before boards, shift to 90% board material + 10% MCQ practice to stay in touch with entrance patterns.' },
    { q: 'Are coaching institute test series worth it?', a: 'Absolutely. Weekly tests build stamina, expose weak areas early, and simulate exam conditions — all of which are hard to replicate at home. Rays Academy Class 12 batches include full test series.' },
    { q: 'How many hours a day are enough?', a: '6–7 focused hours daily during school, 9–10 hours during holidays. Beyond that returns diminish quickly.' },
  ],
  relatedCourses: ['class-12', 'iit-jee', 'neet'],
  relatedMaterials: [
    { label: 'Class 12 Study Material', href: '/study-material/class-12' },
    { label: 'JEE Study Material', href: '/study-material/iit-jee' },
    { label: 'NEET Study Material', href: '/study-material/neet' },
  ],
  externalRefs: [
    { label: 'CBSE Official Website', url: 'https://www.cbse.gov.in/' },
    { label: 'NTA (JEE / NEET)', url: 'https://nta.ac.in/' },
  ],
};

export default post;
