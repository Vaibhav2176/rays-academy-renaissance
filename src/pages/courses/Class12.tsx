import CoursePageTemplate from '@/components/courses/CoursePageTemplate';

const Class12 = () => (
  <CoursePageTemplate
    title="Best Coaching for Class 12 Board Exams in Bhopal"
    seoTitle="Best Class 12 Board Exam Coaching in Bhopal | Rays Academy"
    metaDescription="Score top marks in Class 12 boards with Rays Academy Bhopal. Expert coaching for PCM, PCB with integrated JEE/NEET preparation. Join the best coaching in Bhopal!"
    heroDescription="Excel in Class 12 board exams and competitive entrances simultaneously. Rays Academy's proven teaching methodology has helped hundreds of students achieve their dreams."
    badge="Board + Entrance"
    defaultCourse="Class 12"
    whyChoose={[
      'Dual focus: Board exams + Entrance exams',
      'Experienced faculty for Physics, Chemistry, Maths, Biology',
      'Daily Practice Problems (DPPs)',
      'Weekly full-length mock tests',
      'Previous year board paper practice',
      'Special revision batches before exams',
      'One-on-one mentoring sessions',
      'Proven track record of 100% results',
    ]}
    subjects={['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Applied Maths']}
    duration="Full Academic Year + Revision"
    batchTimings="Morning & Evening batches"
    mode="Offline (Classroom) in Bhopal"
    syllabus={[
      {
        heading: 'Physics',
        description: 'Complete Class 12 Physics from electrostatics to communication systems — taught with board exam precision and JEE-level depth.',
        topics: ['Electrostatics', 'Current Electricity', 'Magnetism', 'Electromagnetic Induction', 'Optics', 'Modern Physics', 'Semiconductors', 'Communication Systems'],
      },
      {
        heading: 'Chemistry',
        description: 'In-depth coverage of Class 12 Chemistry chapters crucial for both board marks and competitive exam performance, including solid state, kinetics, and organics.',
        topics: ['Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'p-Block Elements', 'Coordination Compounds', 'Organic Reactions'],
      },
      {
        heading: 'Mathematics',
        description: 'Thorough Class 12 Maths syllabus coverage — from calculus to probability — with board answer-writing skills and entrance-level problem practice.',
        topics: ['Relations & Functions', 'Inverse Trigonometry', 'Matrices & Determinants', 'Continuity & Differentiability', 'Integrals', 'Differential Equations', 'Vectors & 3D Geometry', 'Probability'],
      },
    ]}
    facultySubjects={['director', 'physics', 'chemistry', 'mathematics']}
    achievements={[
      '100% pass rate every year',
      'Multiple students scoring 95%+ in boards',
      'Selections in top engineering and medical colleges',
      '90% students score distinction',
    ]}
  />
);

export default Class12;
