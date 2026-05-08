import StudyMaterialPageTemplate from '@/components/study-material/StudyMaterialPageTemplate';
import { jeeSubjects, defaultFaqs, defaultLocalSeo } from '@/data/studyMaterialData';

const SMJEE = () => (
  <StudyMaterialPageTemplate
    title="IIT-JEE Study Material - Main & Advanced Preparation"
    metaTitle="IIT JEE Study Material | Free Notes & Practice Problems | Rays Academy Bhopal"
    metaDescription="Best IIT JEE study material for Main & Advanced. Chapter-wise notes, formula sheets & PYQs for Physics, Chemistry & Maths by Rays Academy Bhopal."
    heroDescription="Crack IIT-JEE with expert-prepared study material covering Physics, Chemistry, and Mathematics with focus on problem-solving techniques and exam strategies."
    syllabusOverview="Complete JEE Main & Advanced syllabus coverage with concept-based approach, solved JEE-level problems, and topic-wise practice sets designed by experienced IIT-JEE mentors."
    subjects={jeeSubjects}
    importantTopics={['Mechanics - Rotational motion & SHM', 'Electrochemistry & Chemical Kinetics', 'Calculus - Definite integrals & applications', 'Electromagnetic Induction', 'Organic Chemistry - Reaction mechanisms', 'Coordinate Geometry - Conics', 'Modern Physics - Photoelectric effect', 'Matrices & Determinants', 'Thermodynamics - First law applications']}
    examTips={['Focus on conceptual understanding over rote learning', 'Solve previous 20 years JEE papers topic-wise', 'Time management is crucial - practice with timer', 'Master NCERT first, then move to advanced problems', 'Revise formulas and shortcuts daily', 'Take full-length mock tests every week']}
    faqs={[...defaultFaqs, { question: 'Is this material sufficient for JEE Advanced?', answer: 'Our material covers both JEE Main and Advanced level concepts. For Advanced, we recommend supplementing with our problem-solving sessions and test series.' }]}
    localSeoKeywords={['IIT JEE study material Bhopal', 'JEE preparation notes', 'Best JEE coaching material Bhopal', 'JEE Main study material', 'JEE Advanced preparation Bhopal', ...defaultLocalSeo]}
    breadcrumbLabel="IIT-JEE"
  />
);
export default SMJEE;
