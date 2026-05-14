import RichResourcePageTemplate from '@/components/study-material/RichResourcePageTemplate';

const groups: { label: string; href: string }[] = [
  { label: 'Class 9 PYQs', href: '/study-material/pyq/class-9' },
  { label: 'Class 10 PYQs (CBSE Boards)', href: '/study-material/pyq/class-10' },
  { label: 'Class 11 PYQs', href: '/study-material/pyq/class-11' },
  { label: 'Class 12 PYQs (CBSE Boards)', href: '/study-material/pyq/class-12' },
  { label: 'NEET PYQs (Last 10 Years)', href: '/study-material/pyq/neet' },
  { label: 'IIT-JEE PYQs (Main + Advanced)', href: '/study-material/pyq/jee' },
  { label: 'NDA PYQs (Maths + GAT)', href: '/study-material/pyq/nda' },
];

const PreviousYearQuestions = () => (
  <RichResourcePageTemplate
    title="Previous Year Questions (PYQs) — Boards & Competitive Exams"
    metaTitle="Previous Year Questions | Class 9–12, NEET, JEE, NDA PYQs | Rays Academy Bhopal"
    metaDescription="Solved previous year question papers for CBSE Class 9–12, NEET, IIT-JEE & NDA. Subject-wise & year-wise PYQs by Rays Academy Bhopal."
    canonical="/study-material/previous-year-questions"
    breadcrumbLabel="Previous Year Questions"
    heroDescription="Solved previous year question papers across CBSE boards and competitive entrance exams — all curated by Rays Academy Bhopal faculty for focused, exam-pattern based practice."
    introParagraphs={[
      'Previous Year Questions (PYQs) are the most reliable predictor of what the next exam will look like. Question patterns repeat, high-weightage chapters stay consistent, and difficulty curves rarely change overnight — which is exactly why solving PYQs is non-negotiable.',
      'On this hub you can jump to subject-wise and year-wise PYQs for every major board class and every major competitive exam — Class 9, 10, 11, 12, NEET, IIT-JEE and NDA. Every paper is paired with detailed solutions and a marking guide.',
      'For chapter notes, pair PYQs with our subject-wise study material. To accelerate learning with mentor-led practice, explore our Rays Academy Bhopal courses.',
    ]}
    sections={[
      {
        heading: 'Choose your exam',
        description: 'Tap any class or exam to open its dedicated PYQ page with subject-wise and year-wise downloads.',
        items: groups.map((g) => g.label),
        downloadable: false,
      },
    ]}
    related={groups.map((g) => ({ title: g.label, description: 'Open the dedicated PYQ page with downloads.', href: g.href }))}
    tips={[
      'Solve at least 5–8 years of PYQs for boards, 10+ years for NEET/JEE/NDA.',
      'Keep a "mistake notebook" — every wrong question goes here for final-week revision.',
      'Solve full PYQs in strict timed mode at least once a week.',
      'Cross-reference questions with the official marking scheme to learn how marks are awarded.',
    ]}
    faqs={[
      { question: 'Are PYQs alone enough to crack boards or NEET/JEE?', answer: 'No — PYQs are essential but should be combined with NCERT, chapter notes, sample papers and revision notes for full coverage.' },
      { question: 'Where can I get the PDFs?', answer: 'PDFs are being uploaded continuously. Tap any download to instantly request the PDF over WhatsApp.' },
      { question: 'How do I use these PYQs effectively?', answer: 'First finish the syllabus, then attempt subject-wise PYQs, then full year papers in strict exam timing, and finally revise mistakes from your notebook.' },
    ]}
  />
);

export default PreviousYearQuestions;
