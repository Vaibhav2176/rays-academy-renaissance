import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'how-to-score-95-percent-class-10-board-exams',
  title: 'How to Score 95%+ in Class 10 Board Exams: A Complete Strategy',
  description: 'A proven, subject-wise strategy to score 95%+ in Class 10 board exams — timetable, revision plan, NCERT-first approach, PYQ practice and exam-hall tips from Rays Academy.',
  excerpt: 'A subject-wise plan for Class 10 students who want to cross the 95% mark — NCERT-first, PYQ-driven, and built around the way boards actually mark answers.',
  category: 'class-10',
  tags: ['class 10', 'board exam', 'cbse', 'study tips'],
  publishedAt: '2026-06-01',
  updatedAt: '2026-07-01',
  readingMinutes: 11,
  featured: true,
  popular: true,
  heroEmoji: '📕',
  keyTakeaways: [
    'Master NCERT completely before touching reference books — boards test NCERT.',
    'Solve at least the last 10 years of PYQs subject by subject.',
    'Follow a fixed daily routine: 6–7 focused hours beats 12 unfocused hours.',
    'Write full-length mock papers in exam conditions once a week.',
    'Presentation, handwriting and clean diagrams add real marks in the board copy.',
  ],
  toc: [
    { id: 'why-95-is-realistic', label: 'Why 95%+ is realistic' },
    { id: 'foundation-ncert', label: 'Foundation: NCERT first' },
    { id: 'subject-plan', label: 'Subject-wise plan' },
    { id: 'timetable', label: 'A daily timetable that works' },
    { id: 'revision', label: 'The 3-layer revision system' },
    { id: 'pyq-mocks', label: 'PYQs and full-length mocks' },
    { id: 'exam-hall', label: 'Exam-hall strategy' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Scoring 95%+ in Class 10 boards is not a matter of being "born gifted". Every year hundreds of ordinary students at Rays Academy cross that mark by following the same repeatable process — clear the concepts, master NCERT, drill previous year questions, and present neatly in the answer copy. This guide walks you through the exact plan we give our own Class 10 students in Bhopal.' },

    { type: 'h2', id: 'why-95-is-realistic', text: 'Why 95%+ is realistic (and what actually stops most students)' },
    { type: 'p', text: 'CBSE, ICSE and MP Board Class 10 papers are entirely predictable. The syllabus is fixed, the marking scheme is public, and around 85–90% of questions come directly from NCERT concepts. Students who miss 95% almost never miss it because the paper was too hard — they miss it because of a small set of avoidable mistakes: last-minute reference-book binges, weak diagrams, silly calculation errors, and poor time management inside the three-hour exam.' },
    { type: 'p', text: 'Fixing those four things — plus a disciplined daily routine — is what puts a student on the 95+ track.' },

    { type: 'h2', id: 'foundation-ncert', text: 'Foundation: master NCERT first, everything else after' },
    { type: 'p', text: 'Your first job is to finish NCERT cover-to-cover for every subject — line by line, including examples, in-text questions and back exercises. Boards paraphrase directly from NCERT. If a line is in the textbook, treat it as testable.' },
    { type: 'ul', items: [
      'Read the chapter once for understanding, not for notes.',
      'On the second read, mark keywords, definitions and any diagram.',
      'Solve every NCERT exercise question in your own copy — not just check answers.',
      'Prepare a one-page summary per chapter with formulas, definitions and diagram labels.',
    ]},
    { type: 'callout', variant: 'tip', title: 'Reference books come after NCERT — never before', text: 'RD Sharma for Maths, All-in-One for Science are excellent, but only after the NCERT chapter is 100% done. Otherwise students learn "tricks" without concepts and lose stepwise marks in boards.' },

    { type: 'h2', id: 'subject-plan', text: 'Subject-wise plan for 95%+' },
    { type: 'h3', text: 'Mathematics — aim 98+' },
    { type: 'ul', items: [
      'Complete every NCERT exercise twice; second time within a time limit.',
      'Prepare a formula sheet per chapter — revise it daily for 5 minutes.',
      'Solve at least 15 PYQ papers with a stopwatch.',
      'Write clean stepwise solutions; boards award stepwise marks.',
    ]},
    { type: 'h3', text: 'Science — aim 96+' },
    { type: 'ul', items: [
      'Diagrams are marks: practise labeling with pencil, ruler and clean arrows.',
      'Learn definitions word-perfect — vague answers lose 1–2 marks each.',
      'Chemistry equations and Physics numericals are recurring — drill both.',
    ]},
    { type: 'h3', text: 'Social Science — aim 95+' },
    { type: 'ul', items: [
      'Read history chapters as stories, then compress to bullet points.',
      'Practise map work weekly — it is easy full marks.',
      'For 5-mark answers, use the pattern: intro → 4–5 bulleted points → 1-line conclusion.',
    ]},
    { type: 'h3', text: 'English & Second Language — aim 92+' },
    { type: 'ul', items: [
      'Practise letter, notice, article and analytical paragraph formats until they are automatic.',
      'Read grammar chapters from NCERT + one reference like Wren & Martin selectively.',
      'Write two full literature answers a week and get them checked.',
    ]},

    { type: 'cta', title: 'Get subject-wise Class 10 study material', text: 'Access chapter notes, PYQs, sample papers and revision packs prepared by our Class 10 faculty.', href: '/study-material/class-10', label: 'Open Class 10 material' },

    { type: 'h2', id: 'timetable', text: 'A daily timetable that actually works' },
    { type: 'p', text: 'You do not need to study 12 hours. You need to study 6–7 hours with focus. This is the timetable our top scorers follow through the final six months:' },
    { type: 'ul', items: [
      '5:30 – 6:00 AM — Wake up, light exercise, warm-up on formulas.',
      '6:00 – 8:00 AM — Hardest subject of the day (usually Maths or Science).',
      '8:00 – 2:30 PM — School.',
      '3:30 – 5:00 PM — Second subject focus block.',
      '5:00 – 6:00 PM — Snack + short walk + coaching (if applicable).',
      '6:00 – 8:30 PM — Third subject / doubt clearing.',
      '9:30 – 10:30 PM — Revision of what you learned today.',
      '10:30 – 11:00 PM — Plan tomorrow, sleep.',
    ]},

    { type: 'h2', id: 'revision', text: 'The 3-layer revision system' },
    { type: 'p', text: 'Most 95%+ scorers do not just study — they revise the same topic three times, in three different ways:' },
    { type: 'ol', items: [
      'Layer 1 — Same-day revision: 15 minutes at night, re-read what you learned today.',
      'Layer 2 — Weekend revision: solve 20–30 questions from the topics of that week.',
      'Layer 3 — Monthly revision: rewrite the one-page summary of every chapter completed.',
    ]},

    { type: 'h2', id: 'pyq-mocks', text: 'PYQs and full-length mocks — the mark-boosters' },
    { type: 'p', text: 'From January onwards, one full-length mock every Sunday under real exam conditions is non-negotiable. Time yourself for the exact 3 hours, use the same pen, and get someone (parent, teacher, coach) to evaluate honestly.' },
    { type: 'p', text: 'Solve the last 10 years of previous year questions subject by subject. Patterns repeat every 3–4 years. Rays Academy publishes chapter-wise PYQ packs and full sample papers for every board.' },
    { type: 'cta', title: 'Practise with real PYQ and sample papers', text: 'Class 10 previous year questions and CBSE / MP Board sample papers, updated for the latest pattern.', href: '/study-material/pyq/class-10', label: 'Open Class 10 PYQs' },

    { type: 'h2', id: 'exam-hall', text: 'Inside the exam hall — the last 3 hours that decide 15 marks' },
    { type: 'ul', items: [
      'Use the first 15-minute reading time to plan your order — attempt easiest questions first.',
      'Write clean, labeled diagrams and underline key terms with a pencil.',
      'Leave 10–12 minutes for revision at the end, no matter what.',
      'If stuck on a question, move on — do not lose 20 minutes chasing 3 marks.',
    ]},
    { type: 'callout', variant: 'info', title: 'Presentation is a silent 5–8 marks', text: 'Clean handwriting, ruled diagrams, headings underlined, and short paragraphs make examiners award full marks where they might otherwise cut half a mark.' },
  ],
  faq: [
    { q: 'How many hours a day should I study for Class 10 boards?', a: '6 to 7 focused hours a day, divided across 2–3 blocks, is what most 95%+ scorers do. Consistency matters more than long sessions.' },
    { q: 'Are reference books required to score 95%+?', a: 'No. NCERT + PYQs + one reliable sample-paper book is enough for 95%+. Reference books help only after NCERT is fully mastered.' },
    { q: 'When should full-length mock tests start?', a: 'One mock a week from January onwards, then two a week from February. Every mock must be attempted in strict 3-hour timed conditions.' },
    { q: 'Do coaching classes really help for Class 10?', a: 'Yes, when the coaching focuses on conceptual clarity plus regular tests. At Rays Academy, Class 10 students get weekly tests, doubt clearing, and personalised feedback — all of which are hard to replicate at home.' },
  ],
  relatedCourses: ['class-10'],
  relatedMaterials: [
    { label: 'Class 10 Study Material', href: '/study-material/class-10' },
    { label: 'Class 10 Previous Year Questions', href: '/study-material/pyq/class-10' },
    { label: 'Class 10 Sample Papers', href: '/study-material/sample-papers/class-10' },
  ],
  externalRefs: [
    { label: 'CBSE Official Website', url: 'https://www.cbse.gov.in/' },
    { label: 'NCERT Official Website', url: 'https://ncert.nic.in/' },
  ],
};

export default post;
