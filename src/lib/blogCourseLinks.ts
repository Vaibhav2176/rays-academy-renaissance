// Central lookup for course URLs used by blog CTAs / internal links.
export const COURSE_URLS: Record<string, { label: string; href: string }> = {
  'class-6-8': { label: 'Class 6–8 Foundation', href: '/courses/class-6-8' },
  'class-9': { label: 'Class 9 Programme', href: '/courses/class-9' },
  'class-10': { label: 'Class 10 Board Programme', href: '/courses/class-10' },
  'class-11': { label: 'Class 11 PCM / PCB', href: '/courses/class-11' },
  'class-12': { label: 'Class 12 Board Programme', href: '/courses/class-12' },
  'iit-jee': { label: 'IIT-JEE Coaching', href: '/iit-jee-coaching-bhopal' },
  'neet': { label: 'NEET Coaching', href: '/neet-coaching-bhopal' },
  'nda': { label: 'NDA Coaching', href: '/nda-coaching-bhopal' },
  'cuet': { label: 'CUET Coaching', href: '/cuet-coaching-bhopal' },
};

export const getCourseLink = (slug: string) => COURSE_URLS[slug];
