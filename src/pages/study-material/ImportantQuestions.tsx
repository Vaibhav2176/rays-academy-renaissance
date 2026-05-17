import ResourcePageTemplate from '@/components/study-material/ResourcePageTemplate';

const ImportantQuestions = () => (
  <ResourcePageTemplate
    title="Important Questions - High Weightage Topics"
    metaTitle="Important Questions | Board & Entrance Exam | Rays Academy Bhopal"
    metaDescription="Access important questions and high-weightage topics for board exams, IIT-JEE, NEET & NDA. Expert-curated by Rays Academy Bhopal."
    canonical="/study-material/important-questions"
    heroDescription="Focus your preparation on the most important questions and high-weightage topics curated by our expert faculty based on exam pattern analysis."
    breadcrumbLabel="Important Questions"
    sections={[
      { heading: 'Board Exam Important Questions', description: 'Most frequently asked questions in CBSE and MP Board exams.', items: ['Class 10 Maths Important Questions', 'Class 10 Science Important Questions', 'Class 12 Physics Important Questions', 'Class 12 Chemistry Important Questions', 'Class 12 Maths Important Questions', 'Class 12 Biology Important Questions'] },
      { heading: 'Competitive Exam Important Topics', description: 'High-weightage topics for JEE, NEET & NDA.', items: ['JEE Main High-Weightage Topics', 'NEET Most Important Topics', 'NDA Key Topics - Maths & GAT', 'CUET Important Questions'] },
    ]}
  />
);
export default ImportantQuestions;
