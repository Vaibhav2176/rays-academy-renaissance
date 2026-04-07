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
      { heading: 'Physics', topics: ['Electrostatics', 'Current Electricity', 'Magnetism', 'Electromagnetic Induction', 'Optics', 'Modern Physics', 'Semiconductors', 'Communication Systems'] },
      { heading: 'Chemistry', topics: ['Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'p-Block Elements', 'Coordination Compounds', 'Organic Reactions'] },
      { heading: 'Mathematics', topics: ['Relations & Functions', 'Inverse Trigonometry', 'Matrices & Determinants', 'Continuity & Differentiability', 'Integrals', 'Differential Equations', 'Vectors & 3D Geometry', 'Probability'] },
    ]}
    faculty={[
      { name: 'Expert Physics Faculty', subject: 'Physics', experience: '15+ years experience' },
      { name: 'Expert Chemistry Faculty', subject: 'Chemistry', experience: '12+ years experience' },
      { name: 'Expert Maths Faculty', subject: 'Mathematics', experience: '15+ years experience' },
    ]}
    achievements={[
      '100% pass rate every year',
      'Multiple students scoring 95%+ in boards',
      'Selections in top engineering and medical colleges',
      '90% students score distinction',
    ]}
  />
);

export default Class12;
