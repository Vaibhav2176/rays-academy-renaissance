import CoursePageTemplate from '@/components/courses/CoursePageTemplate';

const Class6to8 = () => (
  <CoursePageTemplate
    title="Best Coaching for Class 6–8 in Bhopal"
    seoTitle="Best Coaching for Class 6-8 in Bhopal | Rays Academy"
    metaDescription="Join the best coaching institute in Bhopal for Class 6 to 8. Rays Academy offers foundation courses in Maths, Science, English with expert faculty. Enroll now!"
    heroDescription="Build a rock-solid academic foundation with Rays Academy's expert-guided coaching for Class 6, 7, and 8 students in Bhopal. CBSE, ICSE & MP Board supported."
    badge="Foundation"
    defaultCourse="Class 6-8"
    whyChoose={[
      'Experienced teachers who simplify complex concepts',
      'Regular weekly tests and assessments',
      'Activity-based and interactive learning methods',
      'Individual attention with small batch sizes',
      'Strong focus on Maths and Science fundamentals',
      'Olympiad and scholarship test preparation included',
      'CBSE, ICSE, and MP Board syllabus covered',
      'Doubt-clearing sessions after every class',
    ]}
    subjects={['Mathematics', 'Science', 'English', 'Social Science']}
    duration="Full Academic Year (July – March)"
    batchTimings="Morning & Evening batches available"
    mode="Offline (Classroom) in Bhopal"
    syllabus={[
      {
        heading: 'Mathematics',
        description: 'Build mathematical confidence with number systems, basic algebra, geometry, and data handling — all explained through activity-based and visual methods.',
        topics: ['Number System', 'Algebra Basics', 'Geometry', 'Mensuration', 'Data Handling', 'Ratio & Proportion'],
      },
      {
        heading: 'Science',
        description: 'Explore the wonders of Physics, Chemistry, and Biology through interactive experiments and real-world examples that ignite genuine curiosity.',
        topics: ['Physics Basics', 'Chemistry Fundamentals', 'Biology & Life Sciences', 'Practical Experiments', 'Environmental Science'],
      },
      {
        heading: 'English',
        description: 'Strengthen English language skills through grammar, reading comprehension, and creative writing to develop clear communication from an early age.',
        topics: ['Grammar & Composition', 'Reading Comprehension', 'Creative Writing', 'Literature & Poetry'],
      },
    ]}
    facultySubjects={['director', 'science', 'social_science']}
    achievements={[
      '100% pass rate every year since 2006',
      'Multiple school toppers from our batches',
      'Olympiad qualifiers every year',
    ]}
  />
);

export default Class6to8;
