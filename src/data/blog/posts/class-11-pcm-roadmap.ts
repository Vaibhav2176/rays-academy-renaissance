import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'class-11-pcm-roadmap',
  title: 'Class 11 PCM Roadmap: Boards + JEE in Two Years',
  description: 'A Class 11 PCM (Physics, Chemistry, Maths) roadmap — chapter priority, weekly plan and how to balance boards with JEE preparation.',
  excerpt: 'Class 11 PCM is the launchpad for JEE and Class 12 boards. Here is a two-year roadmap that keeps both goals aligned.',
  category: 'class-11',
  tags: ['class 11', 'pcm', 'jee', 'boards'],
  publishedAt: '2026-06-17',
  readingMinutes: 10,
  heroEmoji: '📙',
  keyTakeaways: [
    'Class 11 is where JEE ranks are actually built.',
    'PCM in Class 11 = ~50% of your JEE Main paper.',
    'Follow NCERT + one reference book per subject.',
    'Weekly tests are non-negotiable.',
    'Board syllabus + JEE syllabus overlap ~85% — study together.',
  ],
  toc: [
    { id: 'why-11', label: 'Why Class 11 is critical' },
    { id: 'physics', label: 'Physics roadmap' },
    { id: 'chemistry', label: 'Chemistry roadmap' },
    { id: 'maths', label: 'Maths roadmap' },
    { id: 'weekly', label: 'Weekly rhythm' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Class 11 PCM is the make-or-break year for future JEE aspirants. Roughly half of your JEE Main paper comes from Class 11 topics — miss the base here and Class 12 becomes damage control. This roadmap gives you a two-year alignment plan for boards and JEE together.' },

    { type: 'h2', id: 'why-11', text: 'Why Class 11 is critical' },
    { type: 'ul', items: [
      'Class 11 topics = 40–50% of JEE Main + a large chunk of NEET.',
      'Class 12 topics build directly on Class 11 concepts.',
      'A weak Class 11 forces re-learning in Class 12 — no time available.',
      'Board + entrance overlap is highest here — one effort, two outcomes.',
    ]},

    { type: 'h2', id: 'physics', text: 'Physics roadmap' },
    { type: 'ul', items: [
      'Priority order: Units → Kinematics → Laws of Motion → Work-Energy → Rotational Motion → Gravitation → SHM → Thermodynamics.',
      'NCERT + HC Verma daily.',
      'Weekly numerical test — 20 questions, timed.',
      'Draw diagrams for every problem.',
    ]},

    { type: 'h2', id: 'chemistry', text: 'Chemistry roadmap' },
    { type: 'ul', items: [
      'Physical: Mole Concept → Atomic Structure → Chemical Bonding → Thermodynamics → Equilibrium.',
      'Organic: GOC → Hydrocarbons.',
      'Inorganic: Periodic Table → s-block → p-block.',
      'Weekly mixed 30-question MCQ set.',
    ]},

    { type: 'cta', title: 'Class 11 PCM Coaching at Rays Academy', text: 'Two-year integrated Class 11 + 12 programme for JEE with board alignment, weekly tests and personalised mentoring.', href: '/class-11-coaching-bhopal', label: 'Explore Class 11 coaching' },

    { type: 'h2', id: 'maths', text: 'Maths roadmap' },
    { type: 'ul', items: [
      'Priority: Sets → Functions → Trigonometry → Complex Numbers → Sequences → Straight Lines → Circles → Limits → Derivatives.',
      'NCERT + Cengage or RD Sharma for problems.',
      'Daily 15-question timed set.',
      'Track error types weekly.',
    ]},

    { type: 'h2', id: 'weekly', text: 'Weekly rhythm' },
    { type: 'ol', items: [
      'Mon–Fri: theory + problem solving, 3 subjects per day rotating.',
      'Saturday: doubt clearing + one full-length chapter test.',
      'Sunday: revision of week + one mini mock.',
      'Weekly review: what worked, what did not, adjust.',
    ]},
    { type: 'callout', variant: 'tip', title: 'Do not delay JEE syllabus for boards', text: 'Waiting for boards to finish before starting JEE topics loses months. Study both together from day one of Class 11 — the overlap makes it easier, not harder.' },
  ],
  faq: [
    { q: 'Should I start JEE prep in Class 11 or Class 12?', a: 'Class 11. Two years lets you cover the full syllabus twice and take dozens of full mocks. One year forces trade-offs.' },
    { q: 'How many hours daily for Class 11 PCM?', a: '6–7 focused hours daily during school terms, 9–10 hours during vacations.' },
    { q: 'Can I self-study Class 11 for JEE?', a: 'Possible but very tough — the level jump from Class 10 is steep and doubt clearing is critical. Coaching accelerates it significantly.' },
    { q: 'How do I balance school and coaching?', a: 'Follow one integrated syllabus plan — do not run two parallel study lists. Coaching should reinforce school, not replace it.' },
  ],
  relatedCourses: ['class-11', 'iit-jee', 'class-12'],
  relatedMaterials: [
    { label: 'Class 11 Study Material', href: '/study-material/class-11' },
    { label: 'JEE Study Material', href: '/study-material/iit-jee' },
    { label: 'Sample Papers', href: '/study-material/sample-papers/class-11' },
  ],
};

export default post;
