import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'nda-coaching-in-bhopal',
  title: 'Best NDA Coaching in Bhopal: What to Look For and Why It Matters',
  description: 'A complete guide to NDA coaching in Bhopal — written exam prep, SSB interview training, physical readiness and how Rays Academy prepares NDA aspirants.',
  excerpt: 'Everything Bhopal students need to know about choosing NDA coaching — from written prep to SSB training.',
  category: 'bhopal-education',
  tags: ['bhopal', 'nda', 'defence', 'coaching'],
  publishedAt: '2026-06-14',
  readingMinutes: 9,
  heroEmoji: '🎖️',
  keyTakeaways: [
    'NDA prep needs three parallel tracks: written, SSB, physical.',
    'Class 11 is the ideal start point.',
    'Choose institutes with SSB-experienced mentors.',
    'Written prep = Maths (300) + GAT (600) — Maths decides selection.',
    'Bhopal has good coaching + peace to focus without Kota-style pressure.',
  ],
  toc: [
    { id: 'why-bhopal', label: 'Why NDA prep in Bhopal' },
    { id: 'what-to-look', label: 'What to look for' },
    { id: 'programme', label: 'A good NDA programme' },
    { id: 'ssb', label: 'SSB training' },
    { id: 'rays', label: 'NDA at Rays Academy' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'NDA is unlike any other entrance — it demands academic sharpness, personality strength and physical readiness together. Bhopal offers a calm, focused environment ideal for this preparation. But choosing the right coaching still matters. Here is what to look for.' },

    { type: 'h2', id: 'why-bhopal', text: 'Why NDA prep in Bhopal' },
    { type: 'ul', items: [
      'Peaceful city — no distraction-heavy hostel life.',
      'Strong local coaching options with SSB mentors.',
      'Affordable fees and no rent burden.',
      'Family support during a demanding two-year prep.',
    ]},

    { type: 'h2', id: 'what-to-look', text: 'What to look for in NDA coaching' },
    { type: 'ol', items: [
      'Structured written exam prep — Maths + GAT.',
      'SSB training by ex-defence officers or SSB-trained mentors.',
      'Physical fitness guidance — running, push-ups, sit-ups schedule.',
      'Current affairs + GK sessions built into weekly plan.',
      'Small batches with individual attention.',
      'Past results with names and course details.',
    ]},

    { type: 'h2', id: 'programme', text: 'A good NDA programme' },
    { type: 'ul', items: [
      'Maths: Class 11 + 12 topics with speed drills.',
      'English: Reading Comprehension, Grammar, Vocabulary.',
      'GK: History, Geography, Polity, Economy, Current Affairs.',
      'Weekly full-length tests from month 4.',
      'SSB workshops every quarter.',
    ]},

    { type: 'cta', title: 'NDA Coaching at Rays Academy Bhopal', text: 'Integrated NDA written + SSB coaching for Class 11 and 12 students. Small batches, experienced mentors.', href: '/nda-coaching-bhopal', label: 'Explore NDA coaching' },

    { type: 'h2', id: 'ssb', text: 'SSB training' },
    { type: 'ul', items: [
      'Personality development through structured group discussions.',
      'Psychological tests: TAT, WAT, SRT, SDT — weekly practice.',
      'GTO tasks familiarisation.',
      'Personal interview mock rounds.',
      'Physical fitness alongside — running, endurance, coordination.',
    ]},

    { type: 'h2', id: 'rays', text: 'NDA at Rays Academy' },
    { type: 'ul', items: [
      'Two-year integrated NDA programme with Class 11 + 12 syllabus.',
      'Experienced Maths, English and GK faculty.',
      'SSB workshops every quarter.',
      'Physical fitness guidance built into schedule.',
      'Central Bhopal campus with easy access.',
    ]},
    { type: 'callout', variant: 'tip', title: 'Start physical training early', text: 'SSB medicals disqualify many otherwise-brilliant aspirants. Begin structured running and strength training in Class 11 itself — do not wait.' },
  ],
  faq: [
    { q: 'When should I start NDA coaching in Bhopal?', a: 'Class 11 is ideal. This lets you cover the full syllabus, take multiple attempts, and get SSB-ready over two years.' },
    { q: 'Is Maths mandatory for NDA?', a: 'Yes for the Army, Navy and Air Force wings. Only NDA (Naval Academy) Naval wing PCB stream is different.' },
    { q: 'Does Rays Academy prepare for SSB?', a: 'Yes — quarterly SSB workshops covering psychology, GTO, group discussions and personal interviews.' },
    { q: 'How many NDA attempts are allowed?', a: 'You can appear multiple times as long as you meet the age criteria (typically 16.5–19.5 years).' },
  ],
  relatedCourses: ['nda', 'class-11', 'class-12'],
  relatedMaterials: [
    { label: 'NDA Study Material', href: '/study-material/nda' },
    { label: 'NDA PYQs', href: '/study-material/pyq/nda' },
    { label: 'Sample Papers', href: '/study-material/sample-papers/nda' },
  ],
  externalRefs: [
    { label: 'UPSC NDA Official Notification', url: 'https://upsc.gov.in/' },
  ],
};

export default post;
