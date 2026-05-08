import StudyMaterialPageTemplate from '@/components/study-material/StudyMaterialPageTemplate';
import { class10Subjects, defaultFaqs, defaultLocalSeo } from '@/data/studyMaterialData';

const SMClass10 = () => (
  <StudyMaterialPageTemplate
    title="Study Material for Class 10 - Board Exam Preparation"
    metaTitle="Class 10 Study Material | Free Notes, PYQs & Board Prep | Rays Academy Bhopal"
    metaDescription="Best Class 10 study material with chapter-wise notes, PYQs, sample papers for CBSE, ICSE & MP Board. Free & premium content by Rays Academy Bhopal."
    heroDescription="Score high in your Class 10 board exams with expert-prepared study material, solved previous year questions, and chapter-wise revision notes."
    syllabusOverview="Comprehensive Class 10 board exam preparation covering Mathematics, Science, English, and Social Science with focus on high-scoring topics and exam patterns."
    subjects={class10Subjects}
    importantTopics={['Real Numbers - HCF & LCM using Euclid's algorithm', 'Quadratic Equations - Discriminant method', 'Trigonometric ratios & identities', 'Chemical Reactions & Equations', 'Life Processes - Nutrition & Respiration', 'Light - Reflection & Refraction', 'Electricity - Ohm's Law & circuits', 'Nationalism in India - key movements', 'Areas Related to Circles']}
    examTips={['Start revision 2 months before board exams', 'Solve last 10 years board papers for every subject', 'Focus on derivations and diagram-based questions', 'Practice map work for Geography regularly', 'Time yourself while solving sample papers', 'Write neatly - presentation matters in boards']}
    faqs={defaultFaqs}
    localSeoKeywords={['Class 10 study material Bhopal', 'Class 10 board exam notes', 'Best Class 10 coaching material Bhopal', 'CBSE Class 10 preparation', ...defaultLocalSeo]}
    breadcrumbLabel="Class 10"
  />
);
export default SMClass10;
