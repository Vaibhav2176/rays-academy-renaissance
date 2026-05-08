import StudyMaterialPageTemplate from '@/components/study-material/StudyMaterialPageTemplate';
import { ndaSubjects, defaultFaqs, defaultLocalSeo } from '@/data/studyMaterialData';

const SMNDA = () => (
  <StudyMaterialPageTemplate
    title="NDA Study Material – Written Exam Preparation"
    metaTitle="NDA Study Material | Maths & GAT Notes | Rays Academy Bhopal"
    metaDescription="Best NDA study material for Mathematics and General Ability Test. Chapter-wise notes & practice sets by Rays Academy Bhopal."
    heroDescription="Prepare for NDA written exam with structured study material covering Mathematics and General Ability Test including Physics, Chemistry, and General Knowledge."
    syllabusOverview="Complete NDA written exam syllabus coverage for Mathematics and General Ability Test with focus on UPSC NDA exam pattern and previous year trends."
    subjects={ndaSubjects}
    importantTopics={['Algebra – Quadratic equations & matrices', 'Trigonometry – Heights & distances', 'Indian History – Freedom movement', 'Current Affairs – Defence updates', 'Mechanics – Newton's laws', 'General Science – Basic concepts', 'Geography – Indian geography', 'Analytical Geometry – 2D & 3D']}
    examTips={['Study Maths daily – it carries 300 marks', 'Read newspapers daily for current affairs', 'Practice previous year NDA papers', 'Focus on Indian History and Geography', 'Stay updated with defence-related news', 'Work on speed and accuracy in calculations']}
    faqs={defaultFaqs}
    localSeoKeywords={['NDA study material Bhopal', 'NDA preparation notes', 'Best NDA coaching material Bhopal', 'NDA Maths notes', ...defaultLocalSeo]}
    breadcrumbLabel="NDA"
  />
);
export default SMNDA;
