import StudyMaterialPageTemplate from '@/components/study-material/StudyMaterialPageTemplate';
import { cuetSubjects, defaultFaqs, defaultLocalSeo } from '@/data/studyMaterialData';

const SMCUET = () => (
  <StudyMaterialPageTemplate
    title="CUET Study Material – Entrance Exam Preparation"
    metaTitle="CUET Study Material | Free Notes & Practice Sets | Rays Academy Bhopal"
    metaDescription="Best CUET study material with chapter-wise notes for English, General Test & Domain subjects. Free & premium content by Rays Academy Bhopal."
    heroDescription="Prepare for CUET with comprehensive study material covering English Language, General Test, and Domain-specific subjects with practice sets and mock tests."
    syllabusOverview="Complete CUET exam preparation material covering Section IA (Language), Section II (Domain), and Section III (General Test) with NTA exam pattern focus."
    subjects={cuetSubjects}
    importantTopics={['Reading Comprehension strategies', 'Vocabulary – Synonyms & Antonyms', 'General Knowledge – Static GK', 'Logical Reasoning – Patterns', 'Quantitative Aptitude – Percentages', 'Current Affairs – Monthly digest', 'Domain – Key concepts', 'Grammar – Error spotting', 'Para Jumbles – Sequencing']}
    examTips={['Understand CUET exam pattern and marking scheme', 'Practice reading comprehension passages daily', 'Stay updated with current affairs', 'Focus on domain subject NCERT textbooks', 'Take section-wise mock tests regularly', 'Work on time management – 45 min per section']}
    faqs={defaultFaqs}
    localSeoKeywords={['CUET study material Bhopal', 'CUET preparation notes', 'Best CUET coaching material Bhopal', 'CUET English notes', ...defaultLocalSeo]}
    breadcrumbLabel="CUET"
  />
);
export default SMCUET;
