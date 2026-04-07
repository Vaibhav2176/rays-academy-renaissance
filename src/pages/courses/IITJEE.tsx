import CoursePageTemplate from '@/components/courses/CoursePageTemplate';

const IITJEE = () => (
  <CoursePageTemplate
    title="Best IIT-JEE Coaching in Bhopal"
    seoTitle="Best IIT-JEE Coaching in Bhopal | JEE Main & Advanced | Rays Academy"
    metaDescription="Top IIT-JEE coaching institute in Bhopal. Rays Academy offers expert JEE Main & Advanced preparation with experienced faculty, test series, and proven results."
    heroDescription="Crack IIT-JEE with Bhopal's most trusted coaching institute. Rays Academy's structured program covers JEE Main and Advanced with expert problem-solving techniques."
    badge="Engineering"
    defaultCourse="IIT-JEE"
    gradientClass="from-orange-600 via-red-600 to-orange-700"
    whyChoose={[
      'Complete JEE Main + Advanced preparation',
      'Faculty with IIT teaching experience',
      'Daily Practice Problems (DPPs) and assignments',
      'Full-length mock tests in exam conditions',
      'Topic-wise and full syllabus test series',
      'Previous year JEE paper analysis',
      'Individual performance tracking',
      'Small batches for personalized attention',
    ]}
    subjects={['Physics', 'Chemistry', 'Mathematics']}
    duration="1 Year / 2 Year Program"
    batchTimings="Dedicated JEE batches – Morning & Evening"
    mode="Offline (Classroom) in Bhopal"
    syllabus={[
      { heading: 'Physics', topics: ['Mechanics', 'Electrodynamics', 'Optics & Waves', 'Thermodynamics', 'Modern Physics', 'Experimental Physics'] },
      { heading: 'Chemistry', topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Coordination Chemistry', 'Electrochemistry', 'Chemical Kinetics'] },
      { heading: 'Mathematics', topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Vectors & 3D', 'Probability & Statistics'] },
    ]}
    faculty={[
      { name: 'Expert Physics Faculty', subject: 'Physics (JEE)', experience: '15+ years JEE coaching' },
      { name: 'Expert Chemistry Faculty', subject: 'Chemistry (JEE)', experience: '12+ years JEE coaching' },
      { name: 'Expert Maths Faculty', subject: 'Mathematics (JEE)', experience: '15+ years JEE coaching' },
    ]}
    achievements={[
      '100+ IIT-JEE selections',
      'Students in top NITs and IITs',
      'Consistent JEE Main qualifiers every year',
      'Expert problem-solving methodology',
    ]}
  />
);

export default IITJEE;
