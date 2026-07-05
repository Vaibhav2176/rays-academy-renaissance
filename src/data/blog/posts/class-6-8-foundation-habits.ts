import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'class-6-8-foundation-habits',
  title: 'Class 6–8 Foundation: Habits and Concepts That Change Everything',
  description: 'Class 6 to 8 foundation guide — habits, concept building and early exposure to Olympiads and entrance foundations for future success.',
  excerpt: 'Class 6–8 is when curiosity is highest. The right habits here shape every board and entrance year that follows.',
  category: 'class-6-8',
  tags: ['class 6', 'class 7', 'class 8', 'foundation'],
  publishedAt: '2026-06-16',
  readingMinutes: 7,
  heroEmoji: '📘',
  keyTakeaways: [
    'Focus on understanding, not marks. Foundations compound.',
    'Reading habit at this age improves every subject later.',
    'Practise Maths daily — small doses, big returns.',
    'Olympiads add early exam exposure without pressure.',
    'Screen time discipline is a learning skill.',
  ],
  toc: [
    { id: 'why', label: 'Why these years matter' },
    { id: 'habits', label: 'Habits to build' },
    { id: 'subjects', label: 'Subject-wise focus' },
    { id: 'olympiads', label: 'Olympiad exposure' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Class 6, 7 and 8 are the quiet foundation years — no board pressure, but every concept from these years becomes assumed knowledge later. This is when the reading habit forms, when Mathematics fluency compounds, and when curiosity turns into discipline. Get these years right and the rest becomes far easier.' },

    { type: 'h2', id: 'why', text: 'Why these years matter' },
    { type: 'ul', items: [
      'Every Class 9 chapter assumes fluency in Class 6–8 concepts.',
      'Reading and writing habits formed now stay for life.',
      'Curiosity peaks here — feed it with variety, not just textbooks.',
      'Confidence with numbers built now removes math anxiety forever.',
    ]},

    { type: 'h2', id: 'habits', text: 'Habits to build' },
    { type: 'ol', items: [
      '30 minutes of daily reading — any book they enjoy.',
      '30 minutes of Maths practice daily — small but consistent.',
      'Write a short summary of what they learnt each day.',
      'One weekly hobby session — art, chess, music, sport.',
    ]},

    { type: 'cta', title: 'Class 6–8 Coaching at Rays Academy', text: 'Foundation coaching for Class 6, 7 and 8 — concept building, Olympiad exposure and habit formation.', href: '/class-6-8-coaching-bhopal', label: 'Explore Class 6–8 coaching' },

    { type: 'h2', id: 'subjects', text: 'Subject-wise focus' },
    { type: 'ul', items: [
      'Maths: mental arithmetic, fractions, algebra basics, geometry.',
      'Science: curiosity-led — observe, question, experiment.',
      'English: reading + writing daily — grammar follows naturally.',
      'Social Science: story-based learning — history is best learnt as narrative.',
    ]},

    { type: 'h2', id: 'olympiads', text: 'Olympiad exposure' },
    { type: 'ul', items: [
      'IMO, NSO, IEO, NTSE junior — great for early exam confidence.',
      'Do not chase medals — chase exposure and analytical thinking.',
      'Solve last 5 years Olympiad papers — pattern practice.',
      'Balance Olympiads with school — never replace one for the other.',
    ]},
    { type: 'callout', variant: 'info', title: 'Progress not perfection', text: 'A child who reads a little every day beats a child who studies frantically for exams. Foundation years reward consistency, not intensity.' },
  ],
  faq: [
    { q: 'How many hours should Class 6–8 students study daily?', a: '1.5–2 focused hours daily is more than enough. Overloading at this age causes burnout later.' },
    { q: 'Are Olympiads necessary?', a: 'Not necessary but strongly recommended — they teach exam skills early in a low-stakes environment.' },
    { q: 'Should I start JEE / NEET foundation this early?', a: 'Only exposure — not intensive prep. Focus on strong concepts and reading. Real entrance prep starts Class 9 or 11.' },
    { q: 'How is Rays Academy Class 6–8 different?', a: 'We combine school-syllabus mastery with Olympiad prep and reading habits — building thinkers, not test-takers.' },
  ],
  relatedCourses: ['class-6-8', 'class-9'],
  relatedMaterials: [
    { label: 'Class 6–8 Study Material', href: '/study-material/class-6-8' },
  ],
};

export default post;
