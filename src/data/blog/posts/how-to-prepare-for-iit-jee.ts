import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'how-to-prepare-for-iit-jee',
  title: 'How to Prepare for IIT-JEE: A Complete 2-Year Strategy',
  description: 'A complete 2-year IIT-JEE preparation strategy — syllabus map, subject plan, book list, test series, mental preparation and mistakes to avoid, from Rays Academy Bhopal.',
  excerpt: 'How Rays Academy students crack JEE Main and Advanced — the 2-year plan, subject-wise book list, mock strategy and the mindset shifts that separate ranks.',
  category: 'iit-jee',
  tags: ['iit-jee', 'jee main', 'jee advanced', 'engineering'],
  publishedAt: '2026-06-05',
  updatedAt: '2026-06-25',
  readingMinutes: 13,
  featured: false,
  popular: true,
  heroEmoji: '🎯',
  keyTakeaways: [
    'JEE is a 2-year game — Class 11 foundation decides your Advanced rank.',
    'Master NCERT + one standard book per subject; do not hoard resources.',
    'Weekly full-length mocks from Class 12 onwards are non-negotiable.',
    'JEE Advanced rewards depth; JEE Main rewards speed — practise both.',
    'Mental stamina, sleep and consistency beat 14-hour marathon days.',
  ],
  toc: [
    { id: 'exam-structure', label: 'JEE Main vs Advanced' },
    { id: 'two-year-plan', label: '2-year preparation roadmap' },
    { id: 'book-list', label: 'Book list (subject-wise)' },
    { id: 'daily', label: 'A realistic daily routine' },
    { id: 'mock-strategy', label: 'Mock test strategy' },
    { id: 'mistakes', label: 'Mistakes to avoid' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'JEE is not the hardest exam in India because the questions are impossibly difficult — it is hard because it rewards consistency over 24 months. Students who plan the two years properly, and stick to their plan, almost always reach a rank they are proud of. This is the roadmap Rays Academy IIT-JEE batches follow, refined across nearly two decades in Bhopal.' },

    { type: 'h2', id: 'exam-structure', text: 'JEE Main vs JEE Advanced — what is actually being tested' },
    { type: 'p', text: 'JEE Main is a speed exam — 90 MCQ / numeric answer questions in 3 hours, testing Class 11 + 12 PCM. Roughly 2.5 lakh top scorers qualify for JEE Advanced, which is a depth exam — multi-concept problems, longer thinking time, and a much harder pattern.' },
    { type: 'p', text: 'Prep for both simultaneously. Skip Advanced-level practice and you cap your Main rank around 5000. Skip Main-level speed practice and you fail to convert into IITs even after clearing Advanced.' },

    { type: 'h2', id: 'two-year-plan', text: 'A 2-year JEE preparation roadmap' },
    { type: 'h3', text: 'Class 11 (foundation year)' },
    { type: 'ul', items: [
      'Finish the Class 11 syllabus by December of Class 11.',
      'Focus on NCERT + standard reference books per subject.',
      'Solve 20–30 problems daily per subject; quality over quantity.',
      'Take chapter tests weekly; a full mock every 2 weeks from January.',
    ]},
    { type: 'h3', text: 'Class 12 (execution year)' },
    { type: 'ul', items: [
      'Finish Class 12 syllabus by December of Class 12.',
      'From October: at least 2 full-length mocks a week.',
      'From January: rotate revision + PYQs + mocks; no new chapters.',
      'February–April: peak performance zone. Sleep well. Study smart.',
    ]},

    { type: 'h2', id: 'book-list', text: 'The book list (short and useful)' },
    { type: 'h3', text: 'Physics' },
    { type: 'ul', items: [
      'NCERT — foundation and formulas.',
      'HC Verma Vol 1 & 2 — conceptual clarity.',
      'DC Pandey (Understanding Physics) or Cengage — advanced problem sets.',
    ]},
    { type: 'h3', text: 'Chemistry' },
    { type: 'ul', items: [
      'NCERT — read line by line, twice.',
      'MS Chauhan / Himanshu Pandey — Organic.',
      'JD Lee (selective chapters) — Inorganic.',
      'RC Mukherjee / Narendra Awasthi — Physical.',
    ]},
    { type: 'h3', text: 'Mathematics' },
    { type: 'ul', items: [
      'NCERT — clean, foundational.',
      'RD Sharma — practice bulk.',
      'Cengage / Arihant Skills in Mathematics — advanced.',
    ]},

    { type: 'cta', title: 'IIT-JEE Coaching at Rays Academy Bhopal', text: 'Two-year integrated JEE Main + Advanced programme with concept-first teaching, weekly tests and doubt clearing.', href: '/iit-jee-coaching-bhopal', label: 'Explore JEE coaching' },

    { type: 'h2', id: 'daily', text: 'A realistic daily routine' },
    { type: 'ul', items: [
      '5 AM wake-up, 30 minutes revision of formulas / reactions.',
      'School / coaching classes.',
      'Post-school: 2 blocks of 90-minute deep work per subject.',
      'Evening: solve 1 chapter test or 1 PYQ set.',
      'Night: 30 minutes revision of what you learned today.',
      'Sleep by 11 PM — 7 hours minimum.',
    ]},

    { type: 'h2', id: 'mock-strategy', text: 'Mock test strategy' },
    { type: 'ol', items: [
      'Attempt in strict 3-hour timed conditions.',
      'Analyse for 60–90 minutes after: every wrong answer, every skipped question.',
      'Maintain an "error diary" — patterns of your mistakes tell you what to revise.',
      'By April of Class 12, you should have attempted 30–40 full mocks.',
    ]},

    { type: 'h2', id: 'mistakes', text: 'The 5 mistakes that ruin JEE prep' },
    { type: 'ol', items: [
      'Hoarding 8 reference books and finishing none.',
      'Ignoring school and boards — you need both.',
      'Skipping mocks because "the syllabus is not complete".',
      'Studying 14 hours a day without sleep — brain stops absorbing.',
      'Not writing solutions clearly — losing partial credit in Advanced.',
    ]},
    { type: 'callout', variant: 'warning', title: 'Do not chase everyone else\'s plan', text: 'Every YouTuber has "the perfect strategy". Pick one that fits your school hours, coaching timings and personality — then execute it for 24 months without switching.' },
  ],
  faq: [
    { q: 'Can I crack JEE without coaching?', a: 'A small percentage do — usually students with strong self-discipline and prior olympiad exposure. For most students, structured coaching (with weekly tests, faculty doubts and peer group) increases the probability of a good rank sharply.' },
    { q: 'How many hours a day for JEE?', a: '7–9 focused hours during school, 10–12 during vacations. Focus quality matters more than raw hours.' },
    { q: 'Is dropping a year for JEE a good idea?', a: 'Only if you know exactly why the first attempt did not work and have a concrete plan to fix it. Drop years without a plan rarely improve rank.' },
    { q: 'How is Rays Academy JEE coaching structured?', a: 'Two-year integrated programme with school-aligned schedules, weekly tests, doubt sessions, one-on-one mentoring and Bhopal-based faculty who have taught JEE for over a decade.' },
  ],
  relatedCourses: ['iit-jee', 'class-11', 'class-12'],
  relatedMaterials: [
    { label: 'JEE Study Material', href: '/study-material/iit-jee' },
    { label: 'JEE Previous Year Questions', href: '/study-material/pyq/jee' },
    { label: 'JEE Sample Papers', href: '/study-material/sample-papers/jee' },
  ],
  externalRefs: [
    { label: 'NTA JEE Official Portal', url: 'https://jeemain.nta.nic.in/' },
    { label: 'JEE Advanced Official Website', url: 'https://jeeadv.ac.in/' },
    { label: 'NCERT Official Website', url: 'https://ncert.nic.in/' },
  ],
};

export default post;
