import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'career-options-after-class-12',
  title: 'Career Options After Class 12: A Complete Guide for Science, Commerce and Arts',
  description: 'Explore top career options after Class 12 in India — engineering, medical, defence, humanities, commerce, law, design and emerging fields, with entrance exams and roadmap.',
  excerpt: 'A complete map of career options after Class 12 in India — Science, Commerce and Arts streams, entrance exams, colleges and long-term paths.',
  category: 'career-guidance',
  tags: ['career', 'class 12', 'college', 'entrance exams'],
  publishedAt: '2026-06-25',
  readingMinutes: 12,
  heroEmoji: '🧭',
  keyTakeaways: [
    'Every stream has multiple strong careers — pick based on aptitude, not peer pressure.',
    'Entrance exams open many doors that boards alone cannot.',
    'Emerging fields (data science, design, sustainability) are worth exploring seriously.',
    'A career decision is a 40-year decision — invest time in research.',
    'Talk to actual professionals in the field before finalising.',
  ],
  toc: [
    { id: 'science', label: 'After Class 12 Science' },
    { id: 'commerce', label: 'After Class 12 Commerce' },
    { id: 'arts', label: 'After Class 12 Arts / Humanities' },
    { id: 'emerging', label: 'Emerging & unconventional careers' },
    { id: 'decide', label: 'How to actually decide' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Class 12 is the first big career decision of your life. It shapes not just the next 3–5 years but often the entire arc of your professional journey. This guide lays out the major options after Class 12 in India — Science, Commerce and Arts — with realistic outlooks, entrance exams and long-term paths.' },

    { type: 'h2', id: 'science', text: 'After Class 12 Science' },
    { type: 'h3', text: 'Engineering' },
    { type: 'ul', items: [
      'Entrance: JEE Main + Advanced for IITs / NITs / IIITs, BITSAT for BITS, MHT-CET / KCET for state colleges.',
      'Popular branches: Computer Science, Electronics, Mechanical, Electrical, Chemical.',
      'Career: software, product, hardware, R&D, higher studies (MS / MBA).',
    ]},
    { type: 'h3', text: 'Medical' },
    { type: 'ul', items: [
      'Entrance: NEET UG for MBBS, BDS, BAMS, BHMS, veterinary.',
      'AIIMS, JIPMER, government medical colleges — top choices.',
      'Career: clinical practice, PG (NEET PG), research, hospital administration.',
    ]},
    { type: 'h3', text: 'Defence' },
    { type: 'ul', items: [
      'Entrance: NDA (UPSC) + SSB interview.',
      'Army / Navy / Air Force with early responsibility and lifelong benefits.',
    ]},
    { type: 'h3', text: 'Pure sciences + research' },
    { type: 'ul', items: [
      'Entrance: IISER Aptitude Test, ISI, CMI, KVPY-successor programmes.',
      'B.Sc → M.Sc → PhD path. Excellent for research-oriented students.',
    ]},

    { type: 'h2', id: 'commerce', text: 'After Class 12 Commerce' },
    { type: 'ul', items: [
      'CA (Chartered Accountancy) via ICAI Foundation.',
      'B.Com (H) at DU / SRCC / Xavier\'s — via CUET UG.',
      'BBA + MBA / Integrated MBA (IIM Indore IPM, NPAT for NMIMS).',
      'CS (Company Secretary), CMA, Actuarial Science.',
      'Economics (H) — strong for policy, banking, research careers.',
    ]},

    { type: 'h2', id: 'arts', text: 'After Class 12 Arts / Humanities' },
    { type: 'ul', items: [
      'CUET UG for BA (H) at DU, JNU, BHU — English, History, Political Science, Psychology.',
      'Law: CLAT for NLUs (5-year integrated BA LLB).',
      'Journalism & Mass Communication (IIMC, ACJ later).',
      'Design: NIFT, NID entrance exams.',
      'Hotel management: NCHMCT JEE.',
      'UPSC track: build the foundation early through political science, history, and current affairs.',
    ]},

    { type: 'cta', title: 'Get CUET, NDA and career counselling', text: 'Talk to Rays Academy counsellors about the right stream, entrance exams and long-term path.', href: '/contact', label: 'Book counselling' },

    { type: 'h2', id: 'emerging', text: 'Emerging & unconventional careers' },
    { type: 'ul', items: [
      'Data Science / AI — B.Tech in CS/AI, or B.Sc in Statistics, then a master\'s.',
      'UX / Product Design — NID / NIFT, then industry.',
      'Sustainability & climate careers — energy, policy, engineering.',
      'Entrepreneurship — start early, work part-time on real projects.',
      'Digital creators — writing, filmmaking, coding, music — increasingly viable.',
    ]},

    { type: 'h2', id: 'decide', text: 'How to actually decide' },
    { type: 'ol', items: [
      'List 5 careers that genuinely interest you.',
      'For each, research: entrance exams, top colleges, typical job, salary curve.',
      'Speak to at least 2 people currently in that field.',
      'Take an aptitude test — free ones exist online.',
      'Pick 2 back-up options along with your primary choice.',
      'Discuss with parents and a career counsellor.',
    ]},
    { type: 'callout', variant: 'tip', title: 'Do not decide by pay alone', text: 'The highest-paid career you hate is a bad decision. A career you enjoy with steady growth beats a "safe" career you dread.' },
  ],
  faq: [
    { q: 'Which is the best career after Class 12 Science?', a: 'It depends on aptitude: engineering, medical, defence, pure sciences, design and law are all excellent. What matters is genuine interest + entrance exam commitment.' },
    { q: 'Is CA better than B.Com after Class 12?', a: 'They serve different goals. CA is a professional qualification with excellent scope; B.Com opens academic + placement + MBA paths. Many students do both.' },
    { q: 'Can I switch streams after Class 12?', a: 'Yes, but with limits. Arts / Commerce students cannot easily enter engineering or medical, but many other paths (law, design, management, media) are open to all streams via CUET or specific entrances.' },
    { q: 'Does Rays Academy offer career counselling?', a: 'Yes. We help students choose the right stream, entrance exams and long-term path — book a free session via the contact page.' },
  ],
  relatedCourses: ['class-12', 'iit-jee', 'neet', 'nda', 'cuet'],
  relatedMaterials: [
    { label: 'All Courses', href: '/courses' },
    { label: 'CUET Study Material', href: '/study-material/cuet' },
    { label: 'JEE Study Material', href: '/study-material/iit-jee' },
    { label: 'NEET Study Material', href: '/study-material/neet' },
  ],
};

export default post;
