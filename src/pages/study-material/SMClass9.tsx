import StudyMaterialPageTemplate from '@/components/study-material/StudyMaterialPageTemplate';
import { class9Subjects, defaultFaqs, defaultLocalSeo } from '@/data/studyMaterialData';

const SMClass9 = () => (
  <StudyMaterialPageTemplate
    title="Study Material for Class 9 - All Subjects"
    metaTitle="Class 9 Study Material | Free Notes & Chapter-wise Content | Rays Academy Bhopal"
    metaDescription="Access free and premium Class 9 study material. Chapter-wise notes for Maths, Science, English & SST by Rays Academy Bhopal."
    heroDescription="Ace your Class 9 exams with comprehensive, chapter-wise study material covering Mathematics, Science, English, and Social Science prepared by experienced faculty."
    syllabusOverview="Complete Class 9 CBSE, ICSE & MP Board syllabus coverage with detailed explanations, solved NCERT exercises, and exam-oriented practice questions."
    subjects={class9Subjects}
    importantTopics={['Number Systems - Irrational numbers', 'Polynomials - Factor theorem', 'Motion - Equations of motion', 'Atoms and Molecules', 'Cell - The Fundamental Unit of Life', 'French Revolution - Key events', 'Coordinate Geometry basics', 'Work, Energy & Power', 'Sound - Characteristics & echo']}
    examTips={['Focus on NCERT exercises - most board questions come from here', 'Practice diagram-based questions in Science', 'Learn derivations step by step in Physics', 'Create timeline charts for History chapters', 'Solve at least 5 problems daily from each Maths chapter', 'Write short answers in bullet points for better marks']}
    faqs={defaultFaqs}
    localSeoKeywords={['Class 9 study material Bhopal', 'Class 9 Maths notes', 'Class 9 Science notes Bhopal', ...defaultLocalSeo]}
    canonical="/study-material/class-9"
    breadcrumbLabel="Class 9"
  />
);
export default SMClass9;
