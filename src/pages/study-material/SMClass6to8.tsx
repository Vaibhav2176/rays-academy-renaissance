import StudyMaterialPageTemplate from '@/components/study-material/StudyMaterialPageTemplate';
import { class6to8Subjects, defaultFaqs, defaultLocalSeo } from '@/data/studyMaterialData';

const SMClass6to8 = () => (
  <StudyMaterialPageTemplate
    title="Study Material for Classes 6–8 – Foundation Course"
    metaTitle="Study Material for Class 6, 7, 8 | Free Notes & Chapter-wise Material | Rays Academy Bhopal"
    metaDescription="Download free and premium study material for Classes 6, 7, 8. Chapter-wise notes for Maths, Science, English & Social Science by Rays Academy Bhopal."
    heroDescription="Build a strong academic foundation with expert-prepared, chapter-wise study material for Classes 6, 7, and 8 covering Maths, Science, English & Social Science."
    syllabusOverview="Our Classes 6–8 study material covers the complete CBSE, ICSE & MP Board syllabus with detailed theory, solved examples, and practice exercises for Mathematics, Science, English, and Social Science."
    subjects={class6to8Subjects}
    importantTopics={['Fractions & Decimals operations', 'Algebraic expressions basics', 'Human body systems', 'Light and shadows', 'Grammar – Tenses mastery', 'Map reading and geography', 'Percentage and profit-loss', 'Chemical reactions basics', 'Essay and letter writing']}
    examTips={['Start with NCERT textbooks and complete all exercises', 'Make short notes for quick revision before exams', 'Practice mental math daily for faster calculations', 'Read English newspapers to improve vocabulary', 'Revise Science diagrams and labelled figures', 'Attempt previous year school exam papers']}
    faqs={defaultFaqs}
    localSeoKeywords={['Class 6 study material Bhopal', 'Class 7 notes Bhopal', 'Class 8 preparation Bhopal', 'Foundation course study material', 'Best coaching notes for Class 6-8', ...defaultLocalSeo]}
    breadcrumbLabel="Classes 6–8"
  />
);
export default SMClass6to8;
