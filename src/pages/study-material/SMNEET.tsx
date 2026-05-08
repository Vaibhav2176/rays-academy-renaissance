import StudyMaterialPageTemplate from '@/components/study-material/StudyMaterialPageTemplate';
import { neetSubjects, defaultFaqs, defaultLocalSeo } from '@/data/studyMaterialData';

const SMNEET = () => (
  <StudyMaterialPageTemplate
    title="NEET Study Material – Medical Entrance Preparation"
    metaTitle="NEET Study Material | Free Notes, PYQs & Biology Notes | Rays Academy Bhopal"
    metaDescription="Best NEET study material with chapter-wise notes for Physics, Chemistry & Biology. Free & premium content by Rays Academy Bhopal."
    heroDescription="Prepare for NEET with comprehensive study material covering Physics, Chemistry, and Biology with NCERT-focused approach and previous year analysis."
    syllabusOverview="NEET-focused study material covering Class 11 and 12 Physics, Chemistry, and Biology with emphasis on NCERT concepts, diagrams, and high-frequency questions."
    subjects={neetSubjects}
    importantTopics={['Human Physiology – All systems', 'Genetics – Molecular basis of inheritance', 'Cell Biology – Structure & function', 'Plant Physiology – Photosynthesis', 'Organic Chemistry – Biomolecules', 'Ecology & Environment', 'Mechanics & Electrodynamics', 'Chemical Bonding', 'Reproduction – Human & Plant']}
    examTips={['NCERT is the Bible for NEET – read it line by line', 'Biology carries maximum weightage – give it maximum time', 'Practice MCQs daily from each chapter', 'Make mnemonics for Biology classifications', 'Solve previous 15 years NEET papers', 'Focus on diagram-based questions in Biology']}
    faqs={[...defaultFaqs, { question: 'Is NCERT enough for NEET preparation?', answer: 'NCERT is the primary source for NEET, especially for Biology. Our material supplements NCERT with additional practice problems and concept clarity notes.' }]}
    localSeoKeywords={['NEET study material Bhopal', 'NEET Biology notes', 'Best NEET coaching material Bhopal', 'Medical entrance preparation Bhopal', ...defaultLocalSeo]}
    breadcrumbLabel="NEET"
  />
);
export default SMNEET;
