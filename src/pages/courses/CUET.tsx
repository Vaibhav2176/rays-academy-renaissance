import CoursePageTemplate from '@/components/courses/CoursePageTemplate';

const CUET = () => (
  <CoursePageTemplate
    title="Best CUET Coaching in Bhopal"
    seoTitle="Best CUET Coaching in Bhopal | University Entrance | Rays Academy"
    metaDescription="Top CUET coaching institute in Bhopal. Rays Academy offers expert CUET preparation for all streams with crash courses and comprehensive test series."
    heroDescription="Get into India's top central universities with Rays Academy's CUET coaching. Complete preparation for all streams with expert faculty and proven strategies."
    badge="University"
    defaultCourse="CUET"
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
      { heading: 'General Test', topics: ['Quantitative Reasoning', 'Logical Reasoning', 'General Knowledge', 'Current Affairs', 'General Mental Ability'] },
      { heading: 'Language Section', topics: ['Reading Comprehension', 'Vocabulary', 'Grammar', 'Synonyms & Antonyms', 'Sentence Correction'] },
      { heading: 'Domain Subjects', topics: ['Physics / Chemistry / Biology', 'Mathematics', 'Accountancy / Economics', 'History / Geography / Political Science', 'English Literature'] },
    ]}
    faculty={[
      { name: 'Expert GK Faculty', subject: 'General Test', experience: '8+ years experience' },
      { name: 'Expert Language Faculty', subject: 'English & Hindi', experience: '10+ years experience' },
      { name: 'Expert Domain Faculty', subject: 'Domain Subjects', experience: '12+ years experience' },
    ]}
    achievements={[
      'Students in top central universities',
      'High scores in CUET General Test',
      'Comprehensive domain preparation',
    ]}
  />
);

export default CUET;
