import RichResourcePageTemplate from '@/components/study-material/RichResourcePageTemplate';

const groups: { label: string; href: string }[] = [
  { label: 'Class 9 Sample Papers', href: '/study-material/sample-papers/class-9' },
  { label: 'Class 10 Sample Papers', href: '/study-material/sample-papers/class-10' },
  { label: 'Class 11 Sample Papers', href: '/study-material/sample-papers/class-11' },
  { label: 'Class 12 Sample Papers', href: '/study-material/sample-papers/class-12' },
  { label: 'NEET Sample Papers & Mocks', href: '/study-material/sample-papers/neet' },
  { label: 'IIT-JEE Sample Papers & Mocks', href: '/study-material/sample-papers/jee' },
  { label: 'NDA Sample Papers & Mocks', href: '/study-material/sample-papers/nda' },
];

const SamplePapers = () => (
  <RichResourcePageTemplate
    title="Sample Papers & Mock Tests — Boards & Entrance Exams"
    metaTitle="Sample Papers | Class 9–12, NEET, JEE, NDA Mock Tests | Rays Academy Bhopal"
    metaDescription="Latest pattern sample papers and mock tests for CBSE Class 9–12, NEET, IIT-JEE & NDA. Expert-curated by Rays Academy Bhopal."
    canonical="/study-material/sample-papers"
    breadcrumbLabel="Sample Papers"
    heroDescription="Latest pattern sample papers and full mock tests for boards and competitive exams — designed by Rays Academy Bhopal faculty to mirror the actual exam in difficulty and structure."
    introParagraphs={[
      'Sample papers are the closest you can get to the real exam without writing it. Built on the latest blueprint and marking scheme, they help you stress-test your preparation under real time pressure.',
      'On this hub you can jump straight to subject-wise sample papers and full mock tests for Class 9–12 boards and for NEET, IIT-JEE and NDA. Every paper comes with detailed solutions.',
      'Pair sample papers with our PYQs for the strongest possible exam-style practice cycle.',
    ]}
    sections={[
      {
        heading: 'Choose your exam',
        description: 'Tap any class or exam to open its dedicated sample paper page.',
        items: groups.map((g) => g.label),
        downloadable: false,
      },
    ]}
    related={groups.map((g) => ({ title: g.label, description: 'Open the dedicated sample paper page.', href: g.href }))}
    tips={[
      'Take at least one full mock per week in strict exam conditions.',
      'Track sectional accuracy — not just total marks.',
      'Review every wrong + skipped question after each mock.',
      'Save your latest 2 sample papers for the final 10 days before exam.',
    ]}
    faqs={[
      { question: 'How many sample papers should I solve?', answer: 'Target 8–10 full sample papers plus 5+ subject-wise papers for each major exam.' },
      { question: 'Are these papers based on the latest pattern?', answer: 'Yes — every paper is rebuilt against the latest CBSE / NTA / UPSC blueprint after each official update.' },
      { question: 'When will PDFs be downloadable?', answer: 'PDFs are uploaded continuously. Tap any download to instantly request it via WhatsApp.' },
    ]}
  />
);

export default SamplePapers;
