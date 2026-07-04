import type { BlogPost } from '../types';

const post: BlogPost = {
  slug: 'exam-stress-management',
  title: 'Exam Stress Management: A Practical Guide for Students and Parents',
  description: 'A practical guide to managing exam stress — sleep, food, routines, breathing exercises, parental support and when to seek help.',
  excerpt: 'Board and entrance exams bring real stress. This is the practical, no-nonsense guide to managing it — for students and parents alike.',
  category: 'study-tips',
  tags: ['exam stress', 'mental health', 'productivity', 'wellbeing'],
  publishedAt: '2026-06-29',
  readingMinutes: 8,
  heroEmoji: '🧘',
  keyTakeaways: [
    'Stress is normal; unmanaged stress hurts performance.',
    'Sleep, food, movement and routine handle 80% of stress.',
    '4-7-8 breathing works in 60 seconds when panic hits.',
    'Parents help most by lowering expectations talk and offering steady support.',
    'If stress persists beyond two weeks, reach out to a counsellor.',
  ],
  toc: [
    { id: 'why', label: 'Why exam stress happens' },
    { id: 'daily', label: 'Daily anti-stress habits' },
    { id: 'panic', label: 'When panic hits' },
    { id: 'parents', label: 'For parents' },
    { id: 'help', label: 'When to seek help' },
    { id: 'faq', label: 'FAQs' },
  ],
  sections: [
    { type: 'p', text: 'Exam stress is not weakness. It is the natural response of a student who cares about the outcome. Managed well, mild stress even improves focus. Left unmanaged, it wrecks sleep, memory and confidence. Here is the practical guide Rays Academy shares with every student and parent during board season.' },

    { type: 'h2', id: 'why', text: 'Why exam stress happens' },
    { type: 'ul', items: [
      'Uncertainty about outcome.',
      'Comparison with peers.',
      'Parental / social pressure.',
      'Poor sleep, poor food, no movement.',
      'Cramming instead of steady prep.',
    ]},

    { type: 'h2', id: 'daily', text: 'Daily anti-stress habits' },
    { type: 'ul', items: [
      'Sleep 7+ hours. Fix a wake-up + sleep time.',
      'Move 20 minutes daily — walk, cycle, dance, anything.',
      'Eat home food. Avoid caffeine after 5 PM.',
      'Limit social media to a fixed window per day.',
      'Talk to family for 15 minutes a day — non-study conversation.',
    ]},

    { type: 'h2', id: 'panic', text: 'When panic hits — the 60-second reset' },
    { type: 'p', text: 'If you feel panic rising during study or in the exam hall, try the 4-7-8 breathing technique:' },
    { type: 'ol', items: [
      'Breathe in through your nose for 4 seconds.',
      'Hold your breath for 7 seconds.',
      'Breathe out through your mouth for 8 seconds.',
      'Repeat 4 times.',
    ]},
    { type: 'p', text: 'This activates the parasympathetic nervous system and physically calms the body. It is used by pilots, athletes and clinicians for a reason.' },

    { type: 'h2', id: 'parents', text: 'For parents — the most helpful things you can do' },
    { type: 'ul', items: [
      'Lower expectations talk. Speak more about effort than results.',
      'Do not compare your child to relatives or classmates.',
      'Cook their favourite meal on tough days.',
      'Handle small chores yourself to save their time.',
      'Sit with them for 10 minutes daily — no advice, just listen.',
    ]},

    { type: 'cta', title: 'Talk to Rays Academy counsellors', text: 'Free confidential counselling for students and parents around exam season.', href: '/contact', label: 'Book a counselling session' },

    { type: 'h2', id: 'help', text: 'When to seek professional help' },
    { type: 'ul', items: [
      'Sleep disturbed for more than 2 weeks.',
      'Constant crying, panic attacks or chest tightness.',
      'Loss of appetite for extended periods.',
      'Any self-harm thoughts.',
    ]},
    { type: 'p', text: 'Speaking to a school counsellor, a doctor, or a mental health helpline (iCall +91 9152987821 or Vandrevala Foundation 1860 2662 345) is a sign of strength, not weakness. Do not delay.' },
    { type: 'callout', variant: 'info', title: 'One exam does not define a life', text: 'Every path in India has multiple entry points — colleges, drop years, career pivots. A single result does not lock or unlock your life.' },
  ],
  faq: [
    { q: 'Is exam stress normal?', a: 'Yes. Mild stress is normal and even helpful. It only becomes a problem when it disrupts sleep, food or normal functioning.' },
    { q: 'What is the fastest way to calm down before an exam?', a: 'The 4-7-8 breathing technique — 4 seconds in, 7 seconds hold, 8 seconds out — physically calms the nervous system in under a minute.' },
    { q: 'Should I take a break during boards?', a: 'Yes. Short daily breaks (walking, eating with family, 20 minutes of hobby) are essential. Full off-days may be needed occasionally.' },
    { q: 'How can Rays Academy help?', a: 'We offer free counselling sessions for students and parents during exam season. Book via the contact page.' },
  ],
  relatedCourses: ['class-10', 'class-12'],
  relatedMaterials: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Study Material', href: '/study-material' },
  ],
};

export default post;
