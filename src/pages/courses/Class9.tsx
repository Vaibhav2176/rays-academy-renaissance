import CoursePageTemplate from '@/components/courses/CoursePageTemplate';

const Class9 = () => (
  <CoursePageTemplate
    title="Best Coaching for Class 9 in Bhopal"
    seoTitle="Best Coaching for Class 9 in Bhopal | Rays Academy"
    metaDescription="Top coaching classes for Class 9 in Bhopal. Rays Academy offers CBSE, ICSE & MP Board preparation with expert teachers, weekly tests, and proven results."
    heroDescription="Get ahead in your academic journey with Rays Academy's Class 9 coaching program. We prepare you for board-level thinking from day one."
    badge="Board Prep"
    defaultCourse="Class 9"
    whyChoose={[
      'Board-pattern question practice from Class 9 itself',
      'Concept clarity with real-life examples',
      'Regular tests in board exam format',
      'Special focus on Maths and Science',
      'Experienced faculty with 10+ years experience',
      'Personal mentoring and guidance',
      'Small batch sizes for individual attention',
      'Comprehensive study material provided',
    ]}
    subjects={['Mathematics', 'Science', 'English', 'Social Science']}
    duration="Full Academic Year"
    batchTimings="Morning & Evening batches"
    mode="Offline (Classroom) in Bhopal"
    syllabus={[
      {
        heading: 'Mathematics',
        description: 'Build a rock-solid maths foundation with number systems, algebra, and geometry — setting the stage for confident Class 10 board performance.',
        topics: ['Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations', 'Triangles', 'Statistics & Probability'],
      },
      {
        heading: 'Science',
        description: 'Develop scientific reasoning across Physics, Chemistry, and Biology with experiment-based understanding and clear concept notes.',
        topics: ['Matter & Its Properties', 'Motion & Force', 'Atoms & Molecules', 'Cell Biology', 'Diversity in Living Organisms'],
      },
      {
        heading: 'Social Science',
        description: 'Engage with History, Geography, Civics, and Economics through structured notes and exam-pattern questions for full marks.',
        topics: ['History – French Revolution', 'Geography – India', 'Civics – Democracy', 'Economics'],
      },
    ]}
    facultySubjects={['director', 'science', 'social_science']}
    achievements={[
      '100% pass rate consistently',
      'Students scoring 90%+ in board exams',
      'Strong foundation for competitive exams',
    ]}
  />
);

export default Class9;
