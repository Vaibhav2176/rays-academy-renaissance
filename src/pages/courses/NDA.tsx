import CoursePageTemplate from '@/components/courses/CoursePageTemplate';

const NDA = () => (
  <CoursePageTemplate
    title="Best NDA Coaching in Bhopal"
    seoTitle="Best NDA Coaching in Bhopal | Defence Exam Preparation | Rays Academy"
    metaDescription="Top NDA coaching institute in Bhopal. Rays Academy offers complete NDA written exam + SSB interview preparation with experienced defence coaching faculty."
    heroDescription="Serve the nation! Rays Academy's NDA coaching program prepares you for the written exam, SSB interview, and builds the personality needed for a defence career."
    badge="Defence"
    defaultCourse="NDA"
    canonicalPath="/courses/nda"
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
      {
        heading: 'Mathematics',
        description: 'NDA Maths is highly scoring — master algebra, trigonometry, calculus, matrices, and statistics with focused problem-solving and speed-building sessions.',
        topics: ['Algebra', 'Trigonometry', 'Matrices & Determinants', 'Analytical Geometry', 'Differential Calculus', 'Integral Calculus', 'Statistics & Probability'],
      },
      {
        heading: 'General Ability',
        description: 'The GAT tests your knowledge across Science, History, Geography, and Current Affairs — we cover every section systematically to maximize your score.',
        topics: ['Physics', 'Chemistry', 'General Science', 'History', 'Geography', 'Current Affairs', 'Freedom Movement'],
      },
      {
        heading: 'English & GK',
        description: 'Excellent English and up-to-date general knowledge are non-negotiable for NDA — our sessions on grammar, comprehension, and defence awareness give you the edge.',
        topics: ['Grammar & Vocabulary', 'Comprehension', 'Essay Writing', 'Current Events', 'Defence Knowledge', 'Indian Polity'],
      },
    ]}
    facultySubjects={['director', 'mathematics', 'general_ability', 'english']}
    achievements={[
      'NDA selections consistently',
      'Students in Army, Navy, and Air Force',
      'SSB interview success stories',
      'Complete defence career preparation',
    ]}
  />
);

export default NDA;
