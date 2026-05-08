import ResourcePageTemplate from '@/components/study-material/ResourcePageTemplate';

interface NCERTPageProps {
  classNum: string;
}

const ncertData: Record<string, { subjects: string[] }> = {
  '6': { subjects: ['Mathematics', 'Science', 'English (Honeysuckle)', 'Social Science (History, Geography, Civics)'] },
  '7': { subjects: ['Mathematics', 'Science', 'English (Honeycomb)', 'Social Science (History, Geography, Civics)'] },
  '8': { subjects: ['Mathematics', 'Science', 'English (Honeydew)', 'Social Science (History, Geography, Civics)'] },
  '9': { subjects: ['Mathematics', 'Science', 'English (Beehive)', 'Social Science (History, Geography, Civics, Economics)'] },
  '10': { subjects: ['Mathematics', 'Science', 'English (First Flight)', 'Social Science (History, Geography, Civics, Economics)'] },
  '11': { subjects: ['Physics Part 1 & 2', 'Chemistry Part 1 & 2', 'Mathematics', 'Biology', 'English (Hornbill & Snapshots)'] },
  '12': { subjects: ['Physics Part 1 & 2', 'Chemistry Part 1 & 2', 'Mathematics Part 1 & 2', 'Biology', 'English (Flamingo & Vistas)'] },
};

const NCERTPage = ({ classNum }: NCERTPageProps) => {
  const data = ncertData[classNum] || ncertData['10'];
  return (
    <ResourcePageTemplate
      title={`NCERT Books for Class ${classNum} - Free Download`}
      metaTitle={`NCERT Books Class ${classNum} | Free PDF Download | Rays Academy Bhopal`}
      metaDescription={`Download free NCERT textbooks for Class ${classNum}. All subjects available with chapter-wise access. Rays Academy Bhopal.`}
      heroDescription={`Access all NCERT textbooks for Class ${classNum} organized subject-wise. Essential for board exam preparation and competitive entrance exams.`}
      breadcrumbLabel={`NCERT Class ${classNum}`}
      sections={[
        {
          heading: `Class ${classNum} NCERT Books`,
          description: `Complete list of NCERT textbooks available for Class ${classNum}. NCERT books are the foundation for CBSE board exams and competitive exams like JEE, NEET & CUET.`,
          items: data.subjects.map(s => `NCERT ${s} - Class ${classNum}`),
        },
        {
          heading: 'Why Study from NCERT?',
          description: 'NCERT textbooks are the most important resource for exam preparation.',
          items: ['Official CBSE curriculum - Questions come directly from NCERT', 'NEET exam is 95% NCERT-based', 'Clear and concise explanations', 'Foundation for competitive exam preparation', 'Free and accessible to all students'],
        },
      ]}
    />
  );
};

export const NCERTClass6 = () => <NCERTPage classNum="6" />;
export const NCERTClass7 = () => <NCERTPage classNum="7" />;
export const NCERTClass8 = () => <NCERTPage classNum="8" />;
export const NCERTClass9 = () => <NCERTPage classNum="9" />;
export const NCERTClass10 = () => <NCERTPage classNum="10" />;
export const NCERTClass11 = () => <NCERTPage classNum="11" />;
export const NCERTClass12 = () => <NCERTPage classNum="12" />;
