import StudyMaterialPageTemplate from '@/components/study-material/StudyMaterialPageTemplate';
import { class12Subjects, defaultFaqs, defaultLocalSeo } from '@/data/studyMaterialData';

const SMClass12 = () => (
  <StudyMaterialPageTemplate
    title="Study Material for Class 12 - Board & Entrance Exam Prep"
    metaTitle="Class 12 Study Material | Board Exam Notes & PYQs | Rays Academy Bhopal"
    metaDescription="Best Class 12 study material for Physics, Chemistry, Maths & Biology. Chapter-wise notes, PYQs & sample papers by Rays Academy Bhopal."
    heroDescription="Excel in Class 12 board exams and entrance tests with comprehensive study material, solved examples, and previous year question analysis."
    syllabusOverview="Detailed Class 12 study material covering Physics, Chemistry, Mathematics, and Biology with dual focus on board exams and competitive entrance exams."
    subjects={class12Subjects}
    importantTopics={['Electrostatics - Coulomb's law & Electric field', 'Electrochemistry - Nernst equation', 'Continuity & Differentiability', 'Genetics - Mendel's laws', 'Current Electricity - Kirchhoff's laws', 'Organic Chemistry - Name reactions', 'Integration - By parts & substitution', 'Reproduction in Flowering Plants', 'Electromagnetic Induction - Faraday's law']}
    examTips={['Start board exam prep from Day 1 of Class 12', 'Solve CBSE sample papers and marking schemes', 'Focus on high-weightage chapters first', 'Practice derivations daily for Physics', 'Revise organic reactions using flashcards', 'Attempt full-length mock tests every weekend']}
    faqs={defaultFaqs}
    localSeoKeywords={['Class 12 study material Bhopal', 'Class 12 board exam preparation', 'Best Class 12 notes Bhopal', 'CBSE Class 12 Physics notes', ...defaultLocalSeo]}
    breadcrumbLabel="Class 12"
  />
);
export default SMClass12;
