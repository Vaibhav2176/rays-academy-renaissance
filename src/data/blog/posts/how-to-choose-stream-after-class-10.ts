import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'how-to-choose-stream-after-class-10',
  title: 'How to Choose a Stream After Class 10: Science, Commerce or Arts',
  description: 'A practical guide to choosing a stream after Class 10 — Science, Commerce or Arts — based on your interests, aptitude and career goals.',
  excerpt: 'Choosing a stream after Class 10 is the first real career decision. Here is a clear, honest framework for it.',
  category: 'career-guidance',
  tags: ['career', 'class 10', 'stream selection', 'class 11'],
  publishedAt: '2026-06-09',
  readingMinutes: 8,
  heroEmoji: '🧭',
  keyTakeaways: [
    'Choose based on interest and aptitude, not parental pressure.',
    'PCM opens engineering; PCB opens medical; both open general degrees.',
    'Commerce is not a fallback — it is a strong career track.',
    'Arts is diverse and undervalued — law, design, civils, journalism.',
    'You can switch, but early alignment saves years.',
  ],
  toc: [
    { id: 'framework', label: 'A decision framework' },
    { id: 'science', label: 'Science stream' },
    { id: 'commerce', label: 'Commerce stream' },
    { id: 'arts', label: 'Arts / Humanities stream' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Choosing a stream after Class 10 is the first real career-shaping decision most students make. Yet many pick based on peer pressure, parental preference or plain default. This guide gives you a clear, honest framework to make the choice that actually fits you.' },

    { type: 'h2', id: 'framework', text: 'A decision framework' },
    { type: 'ol', items: [
      'What subjects did you score consistently well in during Class 9 and 10?',
      'Which subjects did you enjoy studying, even without pressure?',
      'What career families interest you (technical, business, creative, service)?',
      'Do you have the appetite for the top exam of that stream (JEE / NEET / CA / UPSC)?',
      'Discuss with a mentor, not just family — outside perspective helps.',
    ]},

    { type: 'h2', id: 'science', text: 'Science stream' },
    { type: 'ul', items: [
      'PCM (Physics, Chemistry, Maths) — engineering, architecture, defence, pure sciences.',
      'PCB (Physics, Chemistry, Biology) — medical, dental, biotech, life sciences.',
      'PCMB — keeps both engineering and medical open, but heavy workload.',
      'Best if you enjoy problem-solving, experiments and analytical thinking.',
    ]},

    { type: 'h2', id: 'commerce', text: 'Commerce stream' },
    { type: 'ul', items: [
      'Careers: CA, CS, CMA, BBA, BCom, banking, finance, entrepreneurship.',
      'Requires strong numerical + analytical thinking (yes, still).',
      'Ideal for those interested in business, economics, markets.',
      'CUET UG unlocks top universities for Commerce students.',
    ]},

    { type: 'cta', title: 'Class 11 Coaching at Rays Academy', text: 'Integrated Class 11 coaching for PCM, PCB and Commerce — with board and entrance alignment.', href: '/class-11-coaching-bhopal', label: 'Explore Class 11 coaching' },

    { type: 'h2', id: 'arts', text: 'Arts / Humanities stream' },
    { type: 'ul', items: [
      'Careers: law (via CLAT), UPSC / civil services, journalism, design, psychology, education.',
      'Undervalued by peers, high-value in reality.',
      'CUET UG opens top humanities departments at DU, JNU, BHU.',
      'Ideal for those drawn to language, history, society, arts.',
    ]},
    { type: 'callout', variant: 'info', title: 'Interest beats trend', text: 'The best stream is the one where you can happily study for 2 years. Every stream has thriving careers if you commit.' },
  ],
  faq: [
    { q: 'Can I switch streams later?', a: 'Yes, but with cost — Science to Commerce/Arts is common; the reverse is nearly impossible after Class 11. Choose carefully upfront.' },
    { q: 'Is Maths mandatory in Commerce?', a: 'Not mandatory but strongly recommended if you want CA, CS or top universities via CUET.' },
    { q: 'Which stream has the highest scope?', a: 'All streams have strong careers. Match your aptitude and interest, not chase trends.' },
    { q: 'Should I take PCMB?', a: 'Only if you can handle heavy workload. Otherwise pick PCM or PCB clearly.' },
  ],
  relatedCourses: ['class-11', 'class-12'],
  relatedMaterials: [
    { label: 'Class 11 Study Material', href: '/study-material/class-11' },
  ],
};

export default post;
