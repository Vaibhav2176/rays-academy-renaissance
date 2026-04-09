import CoursePageTemplate from '@/components/courses/CoursePageTemplate';

const NEET = () => (
  <CoursePageTemplate
    title="Best NEET Coaching in Bhopal"
    seoTitle="Best NEET Coaching in Bhopal | Medical Entrance | Rays Academy"
    metaDescription="Top NEET coaching institute in Bhopal. Rays Academy offers expert NEET preparation with Biology-focused approach, NCERT mastery, and comprehensive test series."
    heroDescription="Achieve your dream of becoming a doctor with Rays Academy's proven NEET coaching program. NCERT-based approach with extensive Biology focus and regular mock tests."
    badge="Medical"
    defaultCourse="NEET"
    gradientClass="from-green-600 via-emerald-600 to-green-700"
    whyChoose={[
      'NCERT-focused teaching methodology',
      'Strong Biology department with expert faculty',
      'Complete Physics, Chemistry, Biology coverage',
      'Regular NEET pattern mock tests',
      'Previous year NEET paper analysis',
      'Doubt clearing sessions after every topic',
      'Medical career guidance and counseling',
      'Proven track record of NEET selections',
    ]}
    subjects={['Physics', 'Chemistry', 'Biology (Botany & Zoology)']}
    duration="1 Year / 2 Year Program"
    batchTimings="Dedicated NEET batches"
    mode="Offline (Classroom) in Bhopal"
    syllabus={[
      {
        heading: 'Physics',
        description: 'Clear every Physics concept tested in NEET — from laws of motion to semiconductors — with a strong NCERT base and concise problem-solving techniques.',
        topics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electrostatics', 'Magnetism', 'Modern Physics', 'Semiconductors'],
      },
      {
        heading: 'Chemistry',
        description: 'Develop command over NCERT Chemistry including reactions, biomolecules, and everyday chemistry applications critical for NEET success.',
        topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life'],
      },
      {
        heading: 'Biology',
        description: 'The highest-weightage NEET subject — master cell biology, genetics, human & plant physiology, ecology, and biotechnology with diagram-based learning.',
        topics: ['Cell Biology', 'Genetics & Evolution', 'Human Physiology', 'Plant Physiology', 'Ecology & Environment', 'Biotechnology', 'Reproduction'],
      },
    ]}
    facultySubjects={['physics', 'chemistry', 'biology']}
    achievements={[
      'NEET selections every year',
      'Students in top medical colleges',
      'Strong Biology results',
      'Comprehensive NCERT mastery program',
    ]}
  />
);

export default NEET;
