import directorImage from '@/assets/shankaramulani1.jpeg';
import faculty1 from '@/assets/rajeshsahu.jpeg';
import faculty2 from '@/assets/ankityadav.jpeg';
import faculty3 from '@/assets/mgali.jpeg';
import faculty4 from '@/assets/sachinpawar.jpeg';
import faculty5 from '@/assets/manishmeena.jpeg';

export type SubjectKey =
  | 'mathematics'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'physics_chemistry'
  /** General integrated Science (for school classes 6–10). Only maps to the Head of Science. */
  | 'science'
  | 'social_science'
  | 'english'
  | 'general_ability'
  | 'director';

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  subject: string;
  experience: string;
  /** Absolute import path. Leave as empty string for placeholder / coming-soon entries. */
  image: string;
  description: string;
  subjectKeys: SubjectKey[];
  isFounder?: boolean;
  /** When true, a "Coming Soon" placeholder card is rendered instead of a photo card. */
  comingSoon?: boolean;
}

/**
 * Single source of truth for all Rays Academy faculty.
 * Reused across the Faculty page AND all course pages.
 *
 * SubjectKey mappings:
 *   'science'           → Rajesh Sahu only (Head of Science, school classes 6-10)
 *   'physics'           → Rajesh Sahu + Ankit Yadav (JEE / NEET / competitive)
 *   'chemistry'         → Rajesh Sahu + Dr MG Ali (JEE / NEET / competitive)
 *   'physics_chemistry' → Rajesh Sahu + Dr MG Ali (combined shorthand)
 *   'biology'           → Sachin Pawar (NEET)
 *   'social_science'    → Placeholder (teacher to be added)
 *   'mathematics'       → Director (Shankar Amulani)
 *   'director'          → Director (always shown when requested)
 */
export const ALL_FACULTY: FacultyMember[] = [
  {
    id: 'shankar-amulani',
    name: 'Mr. Shankar Lal Amulani',
    role: 'Founder & Director',
    subject: 'Mathematics',
    experience: '30+ Years',
    image: directorImage,
    description:
      'The visionary behind Rays Academy, Mr. Amulani is a renowned expert in Mathematics. His guidance and passion for teaching have inspired thousands of students to achieve their academic goals.',
    subjectKeys: ['director', 'mathematics'],
    isFounder: true,
  },
  {
    id: 'rajesh-sahu',
    name: 'Rajesh Sahu',
    role: 'Head of Science Department',
    subject: 'Physics & Chemistry',
    experience: '15+ Years',
    image: faculty1,
    description:
      "Known for making complex scientific concepts simple, Rajesh Sir's dynamic teaching style inspires students to excel in Science.",
    // 'science' key is intentionally ONLY on Rajesh — it targets school classes (6–10)
    // 'physics' and 'chemistry' target competitive exam courses (JEE, NEET, etc.)
    subjectKeys: ['physics', 'chemistry', 'physics_chemistry', 'science'],
  },
  {
    id: 'ankit-yadav',
    name: 'Ankit Yadav',
    role: 'Senior Faculty',
    subject: 'Physics',
    experience: '10+ Years',
    image: faculty2,
    description:
      'Ankit Sir is passionate about physics, using real-world examples to help students understand intricate topics and solve challenging problems.',
    // NOTE: 'physics' only — NOT 'science', so he does NOT appear on school class pages
    subjectKeys: ['physics', 'general_ability'],
  },
  {
    id: 'dr-mg-ali',
    name: 'Dr. MG Ali',
    role: 'Senior Faculty',
    subject: 'Chemistry',
    experience: '20+ Years',
    image: faculty3,
    description:
      'With a doctorate in Chemistry, Dr. Ali brings deep academic knowledge and proven teaching methods to guide students to top scores.',
    // NOTE: 'chemistry' only — NOT 'science', so he does NOT appear on school class pages
    subjectKeys: ['chemistry', 'physics_chemistry'],
  },
  {
    id: 'sachin-pawar',
    name: 'Sachin Pawar',
    role: 'Faculty',
    subject: 'Biology',
    experience: '8+ Years',
    image: faculty4,
    description:
      "Sachin Sir's engaging classes make biology come alive, ensuring students not only learn but also develop a love for the subject.",
    // NOTE: 'biology' only — NOT 'science', so he does NOT appear on school class pages
    subjectKeys: ['biology'],
  },
  // ── Placeholder entries — teachers to be added ──────────────────────────────
  {
    id: 'manish-meena',
    name: 'Manish Meena',
    role: 'Faculty',
    subject: 'Social Science',
    experience: '7+ Years',
    image: faculty5,
    description:
      'Manish Sir brings history, civics, geography and economics to life with clear explanations, real-world context and exam-focused strategies that help students score high in Social Science.',
    subjectKeys: ['social_science'],
  },
];

/**
 * Returns faculty members whose subjectKeys intersect with the requested keys.
 * Preserves insertion order from ALL_FACULTY (so Director always appears first).
 */
export const getFacultyForSubjects = (keys: SubjectKey[]): FacultyMember[] => {
  const keySet = new Set(keys);
  return ALL_FACULTY.filter((f) => f.subjectKeys.some((k) => keySet.has(k)));
};
