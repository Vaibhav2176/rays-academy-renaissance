import ResourcePageTemplate from '@/components/study-material/ResourcePageTemplate';

const SamplePapers = () => (
  <ResourcePageTemplate
    title="Sample Papers & Model Question Papers"
    metaTitle="Sample Papers | CBSE, JEE, NEET Model Papers | Rays Academy Bhopal"
    metaDescription="Download sample papers and model question papers for CBSE Board, IIT-JEE, NEET, NDA & CUET. Practice papers by Rays Academy Bhopal."
    heroDescription="Practice with expertly designed sample papers and model question papers to simulate real exam conditions and improve your time management skills."
    breadcrumbLabel="Sample Papers"
    sections={[
      { heading: 'Board Exam Sample Papers', description: 'CBSE pattern-based sample papers with marking schemes.', items: ['Class 10 Maths Sample Papers', 'Class 10 Science Sample Papers', 'Class 12 Physics Sample Papers', 'Class 12 Chemistry Sample Papers', 'Class 12 Maths Sample Papers', 'Class 12 Biology Sample Papers'] },
      { heading: 'Entrance Exam Model Papers', description: 'Full-length model papers matching actual exam patterns.', items: ['JEE Main Model Papers', 'NEET Model Papers', 'NDA Model Papers', 'CUET Model Papers'] },
    ]}
  />
);
export default SamplePapers;
