import CoursePageTemplate from '@/components/courses/CoursePageTemplate';

const NDA = () => (
  <CoursePageTemplate
    title="Best NDA Coaching in Bhopal"
    seoTitle="Best NDA Coaching in Bhopal | Defence Exam Preparation | Rays Academy"
    metaDescription="Top NDA coaching institute in Bhopal. Rays Academy offers complete NDA written exam + SSB interview preparation with experienced defence coaching faculty."
    heroDescription="Serve the nation! Rays Academy's NDA coaching program prepares you for the written exam, SSB interview, and builds the personality needed for a defence career."
    badge="Defence"
    defaultCourse="NDA"
    gradientClass="from-blue-700 via-indigo-700 to-blue-800"
    whyChoose={[
      'Complete NDA written exam preparation',
      'SSB interview guidance and mock interviews',
      'Personality development program',
      'Physical fitness guidance',
      'Current affairs and GK sessions',
      'English language proficiency training',
      'Previous year paper practice',
      'Defence career counseling',
    ]}
    subjects={['Mathematics', 'General Ability Test (GAT)', 'English', 'General Knowledge']}
    duration="6 Months / 1 Year Program"
    batchTimings="Flexible batch timings"
    mode="Offline (Classroom) in Bhopal"
    syllabus={[
      { heading: 'Mathematics', topics: ['Algebra', 'Trigonometry', 'Matrices & Determinants', 'Analytical Geometry', 'Differential Calculus', 'Integral Calculus', 'Statistics & Probability'] },
      { heading: 'General Ability', topics: ['Physics', 'Chemistry', 'General Science', 'History', 'Geography', 'Current Affairs', 'Freedom Movement'] },
      { heading: 'English & GK', topics: ['Grammar & Vocabulary', 'Comprehension', 'Essay Writing', 'Current Events', 'Defence Knowledge', 'Indian Polity'] },
    ]}
    faculty={[
      { name: 'Expert Maths Faculty', subject: 'Mathematics', experience: '10+ years NDA coaching' },
      { name: 'Expert GK Faculty', subject: 'General Knowledge', experience: '8+ years experience' },
      { name: 'Expert English Faculty', subject: 'English & SSB', experience: '10+ years experience' },
    ]}
    achievements={[
      'NDA selections consistently',
      'Students in Army, Navy, and Air Force',
      'SSB interview success stories',
      'Complete defence career preparation',
    ]}
  />
);

export default NDA;
