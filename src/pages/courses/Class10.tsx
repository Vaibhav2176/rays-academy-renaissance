import CoursePageTemplate from '@/components/courses/CoursePageTemplate';

const Class10 = () => (
  <CoursePageTemplate
    title="Best Coaching for Class 10 Board Exams in Bhopal"
    seoTitle="Best Class 10 Board Exam Coaching in Bhopal | Rays Academy"
    metaDescription="Score 90%+ in Class 10 boards with Rays Academy Bhopal. Expert teachers, practice papers, and proven results for CBSE, ICSE & MP Board students."
    heroDescription="Ace your Class 10 board exams with Bhopal's most trusted coaching institute. Rays Academy has produced 50+ school toppers with dedicated board exam preparation."
    badge="Board Exam"
    defaultCourse="Class 10"
    whyChoose={[
      '50+ school toppers in board examinations',
      'Students scoring 100/100 in Maths boards',
      'Complete board exam pattern practice',
      'Previous year paper solving sessions',
      'Special crash courses before boards',
      'Regular mock tests in exam conditions',
      'One-on-one doubt clearing support',
      'Career counseling for stream selection',
    ]}
    subjects={['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']}
    duration="Full Academic Year + Crash Course"
    batchTimings="Morning & Evening batches"
    mode="Offline (Classroom) in Bhopal"
    syllabus={[
      { heading: 'Mathematics', topics: ['Real Numbers', 'Polynomials', 'Quadratic Equations', 'Arithmetic Progressions', 'Trigonometry', 'Coordinate Geometry', 'Circles', 'Surface Area & Volume', 'Statistics & Probability'] },
      { heading: 'Science', topics: ['Chemical Reactions', 'Acids, Bases & Salts', 'Life Processes', 'Electricity & Magnetism', 'Light – Reflection & Refraction', 'Heredity & Evolution'] },
      { heading: 'Social Science', topics: ['History – Nationalism', 'Geography – Resources', 'Civics – Power Sharing', 'Economics – Development'] },
    ]}
    faculty={[
      { name: 'Expert Maths Faculty', subject: 'Mathematics', experience: '15+ years board exam expertise' },
      { name: 'Expert Science Faculty', subject: 'Science', experience: '12+ years experience' },
      { name: 'Expert English Faculty', subject: 'English & SST', experience: '10+ years experience' },
    ]}
    achievements={[
      '50+ school toppers in board exams',
      'Students scoring 100 in Maths (Ankit Singh, Samyak Jain)',
      '90% students score above 80% marks',
      '100% pass rate since 2006',
    ]}
  />
);

export default Class10;
