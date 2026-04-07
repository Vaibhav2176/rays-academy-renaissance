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
      { heading: 'Physics', topics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electrostatics', 'Magnetism', 'Modern Physics', 'Semiconductors'] },
      { heading: 'Chemistry', topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life'] },
      { heading: 'Biology', topics: ['Cell Biology', 'Genetics & Evolution', 'Human Physiology', 'Plant Physiology', 'Ecology & Environment', 'Biotechnology', 'Reproduction'] },
    ]}
    faculty={[
      { name: 'Expert Biology Faculty', subject: 'Biology (NEET)', experience: '12+ years NEET coaching' },
      { name: 'Expert Physics Faculty', subject: 'Physics (NEET)', experience: '10+ years experience' },
      { name: 'Expert Chemistry Faculty', subject: 'Chemistry (NEET)', experience: '10+ years experience' },
    ]}
    achievements={[
      'NEET selections every year',
      'Students in top medical colleges',
      'Strong Biology results',
      'Comprehensive NCERT mastery program',
    ]}
  />
);

export default NEET;
