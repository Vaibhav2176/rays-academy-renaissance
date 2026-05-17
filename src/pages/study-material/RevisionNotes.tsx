import ResourcePageTemplate from '@/components/study-material/ResourcePageTemplate';

const RevisionNotes = () => (
  <ResourcePageTemplate
    title="Revision Notes - Concise Chapter-wise Notes"
    metaTitle="Revision Notes | Chapter-wise Quick Notes | Rays Academy Bhopal"
    metaDescription="Download concise chapter-wise revision notes for all subjects. Quick revision material for board exams and entrance exams by Rays Academy Bhopal."
    heroDescription="Concise, chapter-wise revision notes designed for quick revision before exams. Cover all key concepts, formulas, and important points in minimal time."
    canonical="/study-material/revision-notes"
    breadcrumbLabel="Revision Notes"
    sections={[
      { heading: 'Class 10 Revision Notes', description: 'Quick revision notes for all Class 10 subjects.', items: ['Maths Revision Notes', 'Science Revision Notes', 'English Revision Notes', 'Social Science Revision Notes'] },
      { heading: 'Class 12 Revision Notes', description: 'Concise notes for Class 12 board exam preparation.', items: ['Physics Revision Notes', 'Chemistry Revision Notes', 'Maths Revision Notes', 'Biology Revision Notes'] },
      { heading: 'Entrance Exam Quick Notes', description: 'Last-minute revision notes for competitive exams.', items: ['JEE Main Quick Revision', 'NEET Quick Revision', 'NDA Quick Revision', 'CUET Quick Revision'] },
    ]}
  />
);
export default RevisionNotes;
