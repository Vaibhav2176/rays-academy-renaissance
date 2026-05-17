import CoursePageTemplate from '@/components/courses/CoursePageTemplate';

const CUET = () => (
  <CoursePageTemplate
    title="Best CUET Coaching in Bhopal"
    seoTitle="Best CUET Coaching in Bhopal | University Entrance | Rays Academy"
    metaDescription="Top CUET coaching institute in Bhopal. Rays Academy offers expert CUET preparation for all streams with crash courses and comprehensive test series."
    heroDescription="Get into India's top central universities with Rays Academy's CUET coaching. Complete preparation for all streams with expert faculty and proven strategies."
    badge="University"
    defaultCourse="CUET"
    canonicalPath="/courses/cuet"
    gradientClass="from-purple-600 via-pink-600 to-purple-700"
    whyChoose={[
      'All streams covered – Science, Commerce, Arts',
      'Domain-specific subject preparation',
      'General Test and Language section coaching',
      'Crash courses and full-time batches available',
      'CUET pattern mock tests',
      'University selection guidance',
      'Current affairs and GK preparation',
      'Experienced faculty for all subjects',
    ]}
    subjects={['Domain Subjects', 'General Test', 'Language Section', 'Current Affairs']}
    duration="3 Months Crash / 6 Months Full"
    batchTimings="Flexible timings"
    mode="Offline (Classroom) in Bhopal"
    syllabus={[
      {
        heading: 'General Test',
        description: 'Sharpen your aptitude, logical reasoning, and general knowledge — the three pillars of the CUET General Test that determine university admissions.',
        topics: ['Quantitative Reasoning', 'Logical Reasoning', 'General Knowledge', 'Current Affairs', 'General Mental Ability'],
      },
      {
        heading: 'Language Section',
        description: 'Boost your English and Hindi proficiency with targeted grammar, comprehension, and vocabulary practice tailored for the CUET Language test.',
        topics: ['Reading Comprehension', 'Vocabulary', 'Grammar', 'Synonyms & Antonyms', 'Sentence Correction'],
      },
      {
        heading: 'Domain Subjects',
        description: 'All stream domain subjects covered — Science, Commerce, and Arts — aligned precisely with the CUET syllabus for maximum scoring potential.',
        topics: ['Physics / Chemistry / Biology', 'Mathematics', 'Accountancy / Economics', 'History / Geography / Political Science', 'English Literature'],
      },
    ]}
    facultySubjects={['general_ability', 'english', 'director']}
    achievements={[
      'Students in top central universities',
      'High scores in CUET General Test',
      'Comprehensive domain preparation',
    ]}
  />
);

export default CUET;
