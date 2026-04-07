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
      { heading: 'Physics', topics: ['Units & Measurements', 'Motion in a Straight Line', 'Laws of Motion', 'Work, Energy & Power', 'Rotational Motion', 'Gravitation', 'Thermodynamics', 'Oscillations & Waves'] },
      { heading: 'Chemistry', topics: ['Some Basic Concepts', 'Atomic Structure', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry Basics'] },
      { heading: 'Mathematics', topics: ['Sets & Functions', 'Trigonometry', 'Complex Numbers', 'Permutations & Combinations', 'Binomial Theorem', 'Sequences & Series', 'Straight Lines', 'Conic Sections', 'Limits & Derivatives'] },
    ]}
    faculty={[
      { name: 'Expert Physics Faculty', subject: 'Physics', experience: '12+ years experience' },
      { name: 'Expert Chemistry Faculty', subject: 'Chemistry', experience: '10+ years experience' },
      { name: 'Expert Maths Faculty', subject: 'Mathematics', experience: '15+ years experience' },
    ]}
    achievements={[
      'Consistent board exam toppers',
      'Strong foundation for JEE & NEET',
      'Multiple students in top engineering colleges',
    ]}
  />
);

export default Class11;
