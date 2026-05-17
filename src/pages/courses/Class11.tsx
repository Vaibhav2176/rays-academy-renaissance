import CoursePageTemplate from '@/components/courses/CoursePageTemplate';

const Class11 = () => (
  <CoursePageTemplate
    title="Best Coaching for Class 11 in Bhopal"
    seoTitle="Best Class 11 Coaching in Bhopal | PCM & PCB | Rays Academy"
    metaDescription="Top coaching classes for Class 11 PCM and PCB in Bhopal. Rays Academy provides expert faculty, board + competitive exam integrated coaching. Enroll today!"
    heroDescription="Master Class 11 concepts with Rays Academy's expert coaching. Integrated preparation for boards and competitive exams like IIT-JEE and NEET from the very start."
    badge="Advanced"
    defaultCourse="Class 11"
    whyChoose={[
      'Integrated board + competitive exam preparation',
      'Stream-wise dedicated batches (PCM / PCB)',
      'Expert faculty with IIT/Medical teaching experience',
      'Comprehensive study material and DPPs',
      'Regular chapter-wise tests',
      'Practical session support',
      'Career guidance and mentoring',
      'Flexible batch timings',
    ]}
    subjects={['Physics', 'Chemistry', 'Mathematics', 'Biology']}
    duration="Full Academic Year"
    batchTimings="Morning & Evening batches"
    mode="Offline (Classroom) in Bhopal"
    syllabus={[
      {
        heading: 'Physics',
        description: 'Lay a strong physics foundation covering mechanics, gravitation, thermodynamics, and waves — essential for both Class 11 boards and future JEE/NEET prep.',
        topics: ['Units & Measurements', 'Motion in a Straight Line', 'Laws of Motion', 'Work, Energy & Power', 'Rotational Motion', 'Gravitation', 'Thermodynamics', 'Oscillations & Waves'],
      },
      {
        heading: 'Chemistry',
        description: 'Build a robust chemistry base with atomic structure, bonding, equilibrium, and organic fundamentals that form the backbone of higher-level chemistry.',
        topics: ['Some Basic Concepts', 'Atomic Structure', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry Basics'],
      },
      {
        heading: 'Mathematics',
        description: 'Develop problem-solving instincts in sets, trigonometry, algebra, and calculus introductions — the critical mathematical toolkit for Class 11 and beyond.',
        topics: ['Sets & Functions', 'Trigonometry', 'Complex Numbers', 'Permutations & Combinations', 'Binomial Theorem', 'Sequences & Series', 'Straight Lines', 'Conic Sections', 'Limits & Derivatives'],
      },
    ]}
    facultySubjects={['director', 'physics', 'chemistry', 'mathematics']}
    achievements={[
      'Consistent board exam toppers',
      'Strong foundation for JEE & NEET',
      'Multiple students in top engineering colleges',
    ]}
    canonicalPath="/courses/class-11"
  />
);

export default Class11;
