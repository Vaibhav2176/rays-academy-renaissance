import ResourcePageTemplate from '@/components/study-material/ResourcePageTemplate';

const PreviousYearQuestions = () => (
  <ResourcePageTemplate
    title="Previous Year Questions (PYQs)"
    metaTitle="Previous Year Questions | Board & Entrance Exam PYQs | Rays Academy Bhopal"
    metaDescription="Access solved previous year questions for CBSE Board, IIT-JEE, NEET, NDA & CUET. Chapter-wise PYQs by Rays Academy Bhopal."
    heroDescription="Practice with solved previous year questions from board exams and competitive entrance exams to understand exam patterns and boost your preparation."
    breadcrumbLabel="Previous Year Questions"
    sections={[
      { heading: 'Board Exam PYQs', description: 'Chapter-wise solved previous year questions from CBSE, ICSE & MP Board exams.', items: ['Class 10 Maths PYQs (2015-2025)', 'Class 10 Science PYQs', 'Class 12 Physics PYQs', 'Class 12 Chemistry PYQs', 'Class 12 Maths PYQs', 'Class 12 Biology PYQs'] },
      { heading: 'Competitive Exam PYQs', description: 'Topic-wise previous year questions from JEE, NEET, NDA & CUET.', items: ['JEE Main PYQs (Physics, Chemistry, Maths)', 'JEE Advanced PYQs', 'NEET PYQs (Physics, Chemistry, Biology)', 'NDA PYQs (Maths & GAT)', 'CUET PYQs (English & General Test)'] },
    ]}
  />
);
export default PreviousYearQuestions;
