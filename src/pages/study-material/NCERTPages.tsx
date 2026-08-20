import RichResourcePageTemplate from '@/components/study-material/RichResourcePageTemplate';

interface NCERTPageProps {
  classNum: string;
}

const ncertData: Record<string, { subjects: string[]; isBoard?: boolean; stream?: 'jr' | 'sr' }> = {
  '6': { subjects: ['Mathematics', 'Science', 'English (Honeysuckle)', 'Social Science (History, Geography, Civics)', 'Hindi (Vasant)', 'Sanskrit (Ruchira)'], stream: 'jr' },
  '7': { subjects: ['Mathematics', 'Science', 'English (Honeycomb)', 'Social Science (History, Geography, Civics)', 'Hindi (Vasant)'], stream: 'jr' },
  '8': { subjects: ['Mathematics', 'Science', 'English (Honeydew)', 'Social Science (History, Geography, Civics)', 'Hindi (Vasant)'], stream: 'jr' },
  '9': { subjects: ['Mathematics', 'Science', 'English (Beehive)', 'Social Science (History, Geography, Civics, Economics)', 'Hindi (Kshitij)'] },
  '10': { subjects: ['Mathematics', 'Science', 'English (First Flight)', 'Social Science (History, Geography, Civics, Economics)', 'Hindi (Kshitij)'], isBoard: true },
  '11': { subjects: ['Physics Part 1 & 2', 'Chemistry Part 1 & 2', 'Mathematics', 'Biology', 'English (Hornbill & Snapshots)', 'Accountancy', 'Economics', 'Business Studies'], stream: 'sr' },
  '12': { subjects: ['Physics Part 1 & 2', 'Chemistry Part 1 & 2', 'Mathematics Part 1 & 2', 'Biology', 'English (Flamingo & Vistas)', 'Accountancy', 'Economics', 'Business Studies'], stream: 'sr', isBoard: true },
};

const NCERTPage = ({ classNum }: NCERTPageProps) => {
  const data = ncertData[classNum] || ncertData['10'];
  const isSenior = data.stream === 'sr';
  return (
    <RichResourcePageTemplate
      title={`NCERT Books for Class ${classNum} — Free Download`}
      metaTitle={`NCERT Book Class ${classNum} PDF Free Download | All Subjects`}
      metaDescription={`Download free NCERT books for Class ${classNum} in PDF — Maths, Science, English, SST and more, chapter-wise. Shared by Rays Academy Bhopal faculty.`}
      canonical={`/study-material/ncert/class-${classNum}`}
      breadcrumbLabel={`NCERT Class ${classNum}`}
      heroDescription={`Free NCERT textbooks for Class ${classNum} organised subject-wise. Essential foundation for ${data.isBoard ? 'CBSE board exam preparation' : 'building strong concepts'}${isSenior ? ' and competitive entrance exams like JEE, NEET & CUET' : ''}.`}
      introParagraphs={[
        `NCERT books are the official textbooks recommended by CBSE and form the backbone of the Indian school curriculum. For Class ${classNum}${data.isBoard ? ' — a board exam year — ' : ', '}NCERT mastery is the single highest-impact step you can take.`,
        isSenior
          ? `For competitive exams, NCERT plays an even bigger role: NEET is approximately 95% NCERT-based, JEE Main draws roughly 60–70% of its concepts from NCERT, and CUET is built directly on NCERT chapters. Treat every NCERT line as exam-relevant.`
          : `Every chapter ends with NCERT exercises that mirror the kind of questions you will face in exams. Solve all in-text and back-exercise questions before moving to additional reference material.`,
        `Below you will find all Class ${classNum} NCERT textbooks. Pair them with our chapter-wise notes, sample papers and previous year questions for complete coverage.`,
      ]}
      sections={[
        {
          heading: `Class ${classNum} NCERT Textbooks`,
          description: `Tap any book to request the PDF. Our team will share the official NCERT PDF with you on WhatsApp until on-page downloads go live.`,
          items: data.subjects.map((s) => `NCERT ${s} — Class ${classNum}`),
          downloadable: true,
        },
      ]}
      preparationStrategy={[
        { title: 'Read NCERT line by line', desc: 'Highlight every definition, fact and formula. Don\'t skip diagrams or tables.' },
        { title: 'Solve all in-text + back exercises', desc: 'These are the most likely sources for exam questions.' },
        { title: 'Make short notes per chapter', desc: 'Compress each chapter into 1–2 pages of self-written notes.' },
        { title: 'Layer reference material on top', desc: 'Use our chapter notes, sample papers and PYQs only after the NCERT base is solid.' },
        { title: 'Revise before each test', desc: 'NCERT is for life — revisit it weekly until the exam.' },
      ]}
      tips={[
        'Never skip NCERT diagrams — many board questions are drawn directly from them.',
        'Solve every example problem before attempting back exercises.',
        isSenior ? 'For NEET Biology, memorise NCERT word for word — this alone can fetch 320+/360.' : 'NCERT exercises form 70–80% of board-pattern questions.',
        'Re-read each chapter at least 3 times across the year — first to learn, second to revise, third to master.',
      ]}
      related={[
        { title: `Class ${classNum} Study Material`, description: `Chapter-wise notes for Class ${classNum}.`, href: classNum === '10' ? '/study-material/class-10' : classNum === '12' ? '/study-material/class-12' : classNum === '9' ? '/study-material/class-9' : classNum === '11' ? '/study-material/class-11' : '/study-material/class-6-8' },
        { title: `Class ${classNum} PYQs`, description: 'Solved previous year question papers.', href: classNum === '10' ? '/study-material/pyq/class-10' : classNum === '12' ? '/study-material/pyq/class-12' : classNum === '9' ? '/study-material/pyq/class-9' : classNum === '11' ? '/study-material/pyq/class-11' : '/study-material/previous-year-questions' },
        { title: `Class ${classNum} Sample Papers`, description: 'Latest pattern model papers.', href: classNum === '10' ? '/study-material/sample-papers/class-10' : classNum === '12' ? '/study-material/sample-papers/class-12' : classNum === '9' ? '/study-material/sample-papers/class-9' : classNum === '11' ? '/study-material/sample-papers/class-11' : '/study-material/sample-papers' },
        { title: 'Formula Sheets', description: 'Quick revision for Maths/Physics/Chemistry.', href: '/study-material/formula-sheets' },
        { title: 'All Study Material', description: 'Browse the full hub.', href: '/study-material' },
      ]}
      officialLinks={[
        { name: 'NCERT Official', url: 'https://ncert.nic.in/textbook.php' },
        { name: 'CBSE Academic', url: 'https://cbseacademic.nic.in/' },
        { name: 'CBSE Official', url: 'https://www.cbse.gov.in/' },
      ]}
      faqs={[
        { question: 'Are NCERT books enough for board exams?', answer: 'NCERT covers approximately 80% of the board paper. For the remaining 20% (HOTS questions), pair NCERT with chapter notes, sample papers and PYQs.' },
        { question: 'Are NCERT books enough for NEET / JEE?', answer: 'For NEET — almost yes (around 95% of questions trace back to NCERT). For JEE Main — NCERT is the foundation but reference books and rigorous problem-solving are also needed.' },
        { question: 'How should I read NCERT effectively?', answer: 'Read each chapter line by line, highlight definitions, solve every in-text + back-exercise question, then make short self-notes per chapter.' },
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
