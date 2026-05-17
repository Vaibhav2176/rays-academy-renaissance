import RichResourcePageTemplate from './RichResourcePageTemplate';

interface ResourcePageProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  sections: { heading: string; description: string; items: string[] }[];
  breadcrumbLabel: string;
  canonical?: string;
}

/**
 * Backwards-compatible wrapper around RichResourcePageTemplate so existing
 * resource pages get the upgraded layout automatically.
 */
const ResourcePageTemplate = ({ title, metaTitle, metaDescription, heroDescription, sections, breadcrumbLabel, canonical }: ResourcePageProps) => {
  const introParagraphs = [
    `${title} from Rays Academy Bhopal — curated chapter-wise by faculty with 3 to 33+ years of experience. Whether you are preparing for CBSE / MP Board exams or competitive exams like IIT-JEE, NEET, NDA and CUET, the right resources cut your preparation time in half.`,
    'Below you will find subject-wise downloadable resources, exam strategy and quick tips. PDFs are being prepared and uploaded continuously — tap any download to request the file directly on WhatsApp.',
  ];

  const tips = [
    'Revise immediately after solving — write down every formula, concept and mistake in a notebook.',
    'Solve at least one previous year paper every week in strict timed conditions.',
    'Mark high-weightage chapters and revise them at least 3 times before the exam.',
    'Use NCERT as the base, then layer on chapter notes, sample papers and PYQs.',
  ];

  const related = [
    { title: 'All Study Material', description: 'Class 6–12 and competitive exam material in one place.', href: '/study-material' },
    { title: 'Previous Year Questions', description: 'Solved PYQs across boards & competitive exams.', href: '/study-material/previous-year-questions' },
    { title: 'Sample Papers', description: 'Latest pattern sample papers for exam practice.', href: '/study-material/sample-papers' },
    { title: 'Formula Sheets', description: 'Quick revision formula sheets for Maths, Physics & Chemistry.', href: '/study-material/formula-sheets' },
    { title: 'NCERT Books', description: 'Free chapter-wise NCERT books for Classes 6 to 12.', href: '/study-material/ncert/class-10' },
    { title: 'Our Courses', description: 'Classroom & online coaching at Rays Academy Bhopal.', href: '/courses' },
  ];

  return (
    <RichResourcePageTemplate
      title={title}
      metaTitle={metaTitle}
      metaDescription={metaDescription}
      canonical={canonical}
      breadcrumbLabel={breadcrumbLabel}
      heroDescription={heroDescription}
      introParagraphs={introParagraphs}
      sections={sections.map((s) => ({ ...s, downloadable: true }))}
      tips={tips}
      related={related}
    />
  );
};

export default ResourcePageTemplate;
