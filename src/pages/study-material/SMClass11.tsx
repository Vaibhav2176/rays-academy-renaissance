import StudyMaterialPageTemplate from '@/components/study-material/StudyMaterialPageTemplate';
import { class11Subjects, defaultFaqs, defaultLocalSeo } from '@/data/studyMaterialData';

const SMClass11 = () => (
  <StudyMaterialPageTemplate
    title="Study Material for Class 11 - PCM / PCB"
    metaTitle="Class 11 Study Material | Physics, Chemistry, Maths, Biology Notes | Rays Academy Bhopal"
    metaDescription="Get Class 11 PCM/PCB study material with chapter-wise notes for Physics, Chemistry, Maths & Biology. Expert-prepared by Rays Academy Bhopal."
    heroDescription="Master Class 11 concepts with detailed, chapter-wise study material for Physics, Chemistry, Mathematics, and Biology prepared for board and competitive exam success."
    syllabusOverview="Complete Class 11 syllabus coverage for PCM and PCB streams with focus on building strong fundamentals for Class 12 boards and competitive exams like JEE & NEET."
    subjects={class11Subjects}
    importantTopics={["Laws of Motion - Newton's laws & applications", 'Chemical Bonding - VSEPR theory', 'Sets, Relations & Functions', 'Cell Division - Mitosis & Meiosis', 'Thermodynamics - First & Second law', 'Trigonometric Functions', 'Organic Chemistry - IUPAC naming', 'Permutations & Combinations', 'Human Physiology - Digestion']}
    examTips={["Don't skip Class 11 - it's the foundation for Class 12 & entrance exams", 'Practice numerical problems daily in Physics & Chemistry', 'Make formula sheets for quick revision', 'Understand organic chemistry reaction mechanisms thoroughly', 'Study Biology diagrams and label them accurately', 'Solve previous year competitive exam questions alongside board prep']}
    faqs={defaultFaqs}
    localSeoKeywords={['Class 11 study material Bhopal', 'Class 11 Physics notes', 'Class 11 Chemistry notes Bhopal', 'PCM study material', ...defaultLocalSeo]}
    breadcrumbLabel="Class 11"
  />
);
export default SMClass11;
