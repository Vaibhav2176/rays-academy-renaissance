export type CategorySlug =
  | 'class-6-8'
  | 'class-9'
  | 'class-10'
  | 'class-11'
  | 'class-12'
  | 'iit-jee'
  | 'neet'
  | 'nda'
  | 'cuet'
  | 'study-tips'
  | 'career-guidance'
  | 'bhopal-education';

export interface Category {
  slug: CategorySlug;
  label: string;
  short: string;
  description: string;
  gradient: string; // tailwind gradient classes
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { slug: 'class-6-8', label: 'Class 6–8', short: 'Foundation', description: 'Foundation years — concept building for CBSE, ICSE and MP Board.', gradient: 'from-sky-500 to-blue-600', emoji: '📘' },
  { slug: 'class-9', label: 'Class 9', short: 'Class 9', description: 'Class 9 preparation, concept mastery and habit building.', gradient: 'from-cyan-500 to-blue-600', emoji: '📗' },
  { slug: 'class-10', label: 'Class 10', short: 'Boards', description: 'Class 10 board strategy, high-scoring tips and revision plans.', gradient: 'from-indigo-500 to-blue-700', emoji: '📕' },
  { slug: 'class-11', label: 'Class 11', short: 'Class 11', description: 'Class 11 PCM / PCB conceptual roadmap and study techniques.', gradient: 'from-violet-500 to-indigo-700', emoji: '📙' },
  { slug: 'class-12', label: 'Class 12', short: 'Boards', description: 'Class 12 board preparation with dual JEE / NEET readiness.', gradient: 'from-purple-500 to-indigo-700', emoji: '📚' },
  { slug: 'iit-jee', label: 'IIT-JEE', short: 'JEE', description: 'JEE Main and JEE Advanced strategy, subject-wise tips and mock plans.', gradient: 'from-blue-600 to-red-500', emoji: '🎯' },
  { slug: 'neet', label: 'NEET', short: 'NEET', description: 'NEET UG preparation strategy, subject weightage and NCERT-first approach.', gradient: 'from-red-500 to-rose-600', emoji: '⚕️' },
  { slug: 'nda', label: 'NDA', short: 'NDA', description: 'NDA written + SSB roadmap, timetable and mental preparation.', gradient: 'from-emerald-600 to-teal-700', emoji: '🎖️' },
  { slug: 'cuet', label: 'CUET', short: 'CUET', description: 'CUET UG strategy, domain subject prep and university admissions.', gradient: 'from-amber-500 to-orange-600', emoji: '🏛️' },
  { slug: 'study-tips', label: 'Study Tips', short: 'Study Tips', description: 'Study habits, timetables, revision techniques and productivity.', gradient: 'from-teal-500 to-emerald-600', emoji: '💡' },
  { slug: 'career-guidance', label: 'Career Guidance', short: 'Career', description: 'Streams, exams, colleges and long-term career decisions.', gradient: 'from-fuchsia-500 to-pink-600', emoji: '🧭' },
  { slug: 'bhopal-education', label: 'Bhopal Education', short: 'Bhopal', description: 'Local coaching guidance, MP Board tips and Bhopal student community.', gradient: 'from-rose-500 to-red-600', emoji: '🏙️' },
];

export const CATEGORY_MAP: Record<CategorySlug, Category> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.slug]: c }),
  {} as Record<CategorySlug, Category>,
);

export const getCategory = (slug: CategorySlug) => CATEGORY_MAP[slug];
