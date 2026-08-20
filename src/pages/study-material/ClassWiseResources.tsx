import RichResourcePageTemplate from '@/components/study-material/RichResourcePageTemplate';

type Variant = 'pyq' | 'sample';
type Group = 'class-9' | 'class-10' | 'class-11' | 'class-12' | 'neet' | 'jee' | 'nda';

interface Config {
  label: string;
  subjects: string[];
  years: number[];
  introExtra: string;
  weightageNote: string;
  courseHref: string;
  smHref: string;
}

const configs: Record<Group, Config> = {
  'class-9': {
    label: 'Class 9',
    subjects: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
    years: [2025, 2024, 2023, 2022, 2021, 2020],
    introExtra: 'Class 9 lays the foundation for the Class 10 board exam. Practising previous year and pre-board papers early builds the question-solving stamina you will need next year.',
    weightageNote: 'Maths and Science carry the heaviest conceptual load — start with these and use English / SST PYQs for revision sprints.',
    courseHref: '/courses/class-9',
    smHref: '/study-material/class-9',
  },
  'class-10': {
    label: 'Class 10',
    subjects: ['Mathematics (Standard & Basic)', 'Science', 'English', 'Social Science', 'Hindi', 'Sanskrit'],
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018],
    introExtra: 'Class 10 board exam questions repeat patterns year after year. Solving 8–10 years of CBSE PYQs is the single highest-impact preparation step.',
    weightageNote: 'In the CBSE 10 paper, 30–40% of questions are paraphrased from previous years — making PYQs non-negotiable.',
    courseHref: '/courses/class-10',
    smHref: '/study-material/class-10',
  },
  'class-11': {
    label: 'Class 11',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Accountancy', 'Economics', 'Business Studies'],
    years: [2025, 2024, 2023, 2022, 2021],
    introExtra: 'Class 11 is the year that decides JEE and NEET outcomes. Use unit test and pre-board PYQs to test concept depth alongside chapter notes.',
    weightageNote: 'Mechanics, Thermodynamics and Organic basics from Class 11 reappear in 30%+ of JEE/NEET questions — start PYQ practice early.',
    courseHref: '/courses/class-11',
    smHref: '/study-material/class-11',
  },
  'class-12': {
    label: 'Class 12',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Accountancy', 'Economics', 'Business Studies'],
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018],
    introExtra: 'Class 12 board PYQs are essential — not just for boards but because questions overlap with JEE Main, NEET and CUET papers.',
    weightageNote: 'Electrostatics, EMI, Optics, Coordination Compounds, Calculus and Genetics dominate the marks distribution every year.',
    courseHref: '/courses/class-12',
    smHref: '/study-material/class-12',
  },
  neet: {
    label: 'NEET',
    subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016],
    introExtra: 'NEET is 95% NCERT-driven, but the actual question framing changes year on year. Solving 10+ years of NEET PYQs is the fastest way to learn how NTA twists concepts.',
    weightageNote: 'Biology contributes 360/720 marks — making Botany and Zoology PYQs the highest ROI practice you can do.',
    courseHref: '/courses/neet',
    smHref: '/study-material/neet',
  },
  jee: {
    label: 'IIT-JEE',
    subjects: ['Physics (JEE Main)', 'Chemistry (JEE Main)', 'Mathematics (JEE Main)', 'Physics (JEE Advanced)', 'Chemistry (JEE Advanced)', 'Mathematics (JEE Advanced)'],
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016],
    introExtra: 'JEE Main runs in two attempts every year — solving past PYQs with shift-wise breakdown teaches you exactly which chapters NTA prioritises.',
    weightageNote: 'Calculus, Coordinate Geometry, Mechanics, Electrodynamics and Physical Chemistry together drive 60%+ of JEE Main marks.',
    courseHref: '/courses/iit-jee',
    smHref: '/study-material/iit-jee',
  },
  nda: {
    label: 'NDA',
    subjects: ['Mathematics', 'General Ability Test (GAT) - English', 'GAT - Physics', 'GAT - Chemistry', 'GAT - General Knowledge', 'GAT - History & Geography'],
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019],
    introExtra: 'NDA exam pattern is highly repetitive. Last 7 years of UPSC NDA PYQs cover the realistic scope of every section you need to master.',
    weightageNote: 'Maths (300 marks) and GAT (600 marks) — every PYQ you solve directly translates into expected marks on the next attempt.',
    courseHref: '/courses/nda',
    smHref: '/study-material/nda',
  },
};

export const buildPYQPage = (group: Group) => {
  const c = configs[group];
  const isCompetitive = group === 'neet' || group === 'jee' || group === 'nda';
  const sections = [
    {
      heading: `${c.label} — Subject-wise PYQs`,
      description: `Download chapter-wise solved previous year question papers for ${c.label}, organised by subject for focused practice.`,
      items: c.subjects.map((s) => `${c.label} ${s} — Previous Year Questions (Solved)`),
      downloadable: true,
    },
    {
      heading: `${c.label} — Year-wise Question Papers`,
      description: `Practice with the full original ${c.label} papers from the last several years to simulate exam conditions.`,
      items: c.years.map((y) => `${c.label} ${y} Question Paper with Solutions`),
      downloadable: true,
    },
  ];

  return (
    <RichResourcePageTemplate
      title={`${c.label} Previous Year Questions (PYQs) with Solutions`}
      metaTitle={`${c.label} PYQ PDF Free Download | Chapter-wise with Solutions`}
      metaDescription={`Free ${c.label} previous year question papers with full solutions — chapter-wise, subject-wise and year-wise PDFs. Curated by Rays Academy Bhopal faculty.`}
      canonical={`/study-material/pyq/${group}`}
      breadcrumbLabel={`${c.label} PYQs`}
      heroDescription={`Solved previous year question papers for ${c.label} — chapter-wise, subject-wise and year-wise. Curated by Rays Academy Bhopal faculty for focused, exam-pattern based practice.`}
      introParagraphs={[
        `${c.introExtra} ${c.weightageNote}`,
        `On this page you will find downloadable ${c.label} PYQs across all major subjects, plus year-wise full papers with detailed solutions. Every paper is mapped to the latest syllabus, marking scheme and difficulty level so you know exactly what to expect.`,
        `Pair these papers with our ${c.label} chapter notes, sample papers and revision material for a complete preparation cycle. If you are looking for live coaching support, explore our ${c.label} programme at Rays Academy Bhopal.`,
      ]}
      sections={sections}
      preparationStrategy={[
        { title: 'Finish syllabus first', desc: `Complete the official ${c.label} syllabus chapter by chapter using NCERT and our chapter-wise notes.` },
        { title: 'Solve subject-wise PYQs', desc: 'Pick one subject at a time. Solve 10 questions per chapter without looking at solutions.' },
        { title: 'Attempt full year papers in timed mode', desc: 'Once 70%+ syllabus is done, solve full PYQs in strict exam timing.' },
        { title: 'Analyse and mark weak chapters', desc: 'After each paper, list every concept you got wrong — revise those chapters before moving on.' },
        { title: 'Repeat with newer years closer to exam', desc: 'Reserve the latest 2–3 years for the final month — they best mirror the upcoming paper.' },
      ]}
      tips={[
        `Solve ${c.label} PYQs strictly in the exam time limit — accuracy matters more than speed early on.`,
        'Make a "mistake notebook" — every wrong answer goes in it for revision in the last week.',
        isCompetitive
          ? 'Track your sectional accuracy after every paper. Aim for 85%+ in your strongest section.'
          : 'Compare your answers with the official CBSE marking scheme to learn how marks are awarded step by step.',
        'Revise high-weightage chapters at least 3 times before attempting the next PYQ.',
        'Discuss tricky questions with peers or mentors — multiple approaches build deeper understanding.',
      ]}
      faqs={[
        { question: `Are ${c.label} PYQs enough for the exam?`, answer: `PYQs are essential but not sufficient on their own. Combine ${c.label} PYQs with NCERT, our chapter notes and sample papers for full coverage.` },
        { question: `How many years of PYQs should I solve?`, answer: isCompetitive ? `Solve at least the last 10 years of ${c.label} papers for competitive-level confidence.` : `Solve at least 5–8 years of ${c.label} papers, focusing on the most recent 3 years for current pattern.` },
        { question: 'When will the PDF downloads be available?', answer: 'PDFs are uploaded continuously. Click any download — our team will send the PDF directly via WhatsApp until the file goes live.' },
        { question: `Where can I get ${c.label} coaching in Bhopal?`, answer: `Rays Academy Bhopal offers focused ${c.label} coaching with chapter notes, PYQ practice, doubt sessions and mock tests — all under one roof.` },
      ]}
      related={[
        { title: `${c.label} Sample Papers`, description: `Latest pattern sample papers for ${c.label}.`, href: `/study-material/sample-papers/${group}` },
        { title: `${c.label} Study Material`, description: `Chapter-wise notes for ${c.label}.`, href: c.smHref },
        { title: `${c.label} Coaching`, description: `Classroom & online coaching for ${c.label}.`, href: c.courseHref },
        { title: 'Formula Sheets', description: 'Quick revision formula sheets.', href: '/study-material/formula-sheets' },
        { title: 'NCERT Books', description: 'Free chapter-wise NCERT books.', href: '/study-material/ncert/class-10' },
        { title: 'All Resources', description: 'Browse the full Study Material hub.', href: '/study-material' },
      ]}
      officialLinks={
        isCompetitive
          ? [
              { name: 'NTA Official', url: 'https://nta.ac.in/' },
              { name: group === 'jee' ? 'JEE Main' : group === 'neet' ? 'NEET UG' : 'UPSC NDA', url: group === 'jee' ? 'https://jeemain.nta.ac.in/' : group === 'neet' ? 'https://neet.nta.nic.in/' : 'https://upsc.gov.in/' },
              { name: 'NCERT Books', url: 'https://ncert.nic.in/textbook.php' },
            ]
          : [
              { name: 'CBSE Official', url: 'https://www.cbse.gov.in/' },
              { name: 'NCERT Books', url: 'https://ncert.nic.in/textbook.php' },
              { name: 'CBSE Academic', url: 'https://cbseacademic.nic.in/' },
            ]
      }
    />
  );
};

export const buildSamplePaperPage = (group: Group) => {
  const c = configs[group];
  const isCompetitive = group === 'neet' || group === 'jee' || group === 'nda';
  const sections = [
    {
      heading: `${c.label} — Subject-wise Sample Papers`,
      description: `Latest pattern sample papers for ${c.label}, prepared subject-wise with solutions and marking schemes.`,
      items: c.subjects.map((s) => `${c.label} ${s} — Sample Paper with Solutions`),
      downloadable: true,
    },
    {
      heading: `${c.label} — Full Mock Papers`,
      description: `Complete model papers built on the latest ${c.label} blueprint and marking scheme.`,
      items: [1, 2, 3, 4, 5].map((n) => `${c.label} Mock Paper ${n} (Latest Pattern)`),
      downloadable: true,
    },
  ];

  return (
    <RichResourcePageTemplate
      title={`${c.label} Sample Papers & Mock Tests`}
      metaTitle={`${c.label} Sample Papers 2026-27 PDF | Free Download`}
      metaDescription={`Free ${c.label} sample papers and full mock tests with solutions, built on the latest blueprint and marking scheme. Prepared by Rays Academy Bhopal.`}
      canonical={`/study-material/sample-papers/${group}`}
      breadcrumbLabel={`${c.label} Sample Papers`}
      heroDescription={`Latest pattern sample papers and full mock tests for ${c.label} — designed by Rays Academy Bhopal faculty to mirror the actual exam in difficulty and structure.`}
      introParagraphs={[
        `${c.label} sample papers are the closest thing to writing the actual exam. Each paper on this page follows the latest blueprint, marking scheme and difficulty distribution.`,
        `Use these papers to test your readiness, identify weak chapters, and refine your time management. Every sample paper includes a fully worked solution and an estimated marks-vs-time breakup.`,
        `For chapter-level depth, pair these mocks with our ${c.label} study material and previous year questions. To accelerate your prep, join our ${c.label} programme at Rays Academy Bhopal.`,
      ]}
      sections={sections}
      preparationStrategy={[
        { title: 'Cover the syllabus first', desc: `Don't attempt full mocks before completing 70%+ of the ${c.label} syllabus.` },
        { title: 'Start with subject-wise papers', desc: 'Build subject-level confidence before stitching everything together in a full mock.' },
        { title: 'Take full mocks in real conditions', desc: 'Pick a quiet 3-hour window, no breaks, no phone — exactly like the real exam.' },
        { title: 'Review every wrong + skipped question', desc: 'Skipped questions are as important as wrong ones — they reveal time / confidence gaps.' },
        { title: 'Track your scores weekly', desc: 'A simple sheet showing your weekly mock score builds awareness of progress.' },
      ]}
      tips={[
        'Always solve sample papers in strict time — un-timed practice gives a false sense of preparation.',
        'After each mock, calculate accuracy per section, not just total marks.',
        'Identify your "mark-leaking" topics and revise them before the next mock.',
        isCompetitive ? 'Practice OMR-style bubbling for at least 3 full mocks before the actual exam.' : 'Practice neat, structured presentation — board examiners reward clarity.',
        'Reserve the last 2 mocks for the final 10 days before exam.',
      ]}
      faqs={[
        { question: `How many ${c.label} sample papers should I solve?`, answer: `Aim for at least 8–10 full sample papers along with 5+ subject-wise papers for ${c.label}.` },
        { question: 'Are these papers based on the latest syllabus?', answer: 'Yes — every paper is rebuilt against the latest CBSE/NTA/UPSC blueprint after each official update.' },
        { question: 'Will solutions be provided?', answer: 'Yes, every sample paper comes with detailed step-by-step solutions and marking guidance.' },
        { question: 'When will PDFs be available for download?', answer: 'PDFs are being uploaded chapter by chapter. Click any download — our team will share the file via WhatsApp instantly.' },
      ]}
      related={[
        { title: `${c.label} PYQs`, description: `Previous year papers for ${c.label} with solutions.`, href: `/study-material/pyq/${group}` },
        { title: `${c.label} Study Material`, description: `Chapter-wise notes for ${c.label}.`, href: c.smHref },
        { title: `${c.label} Coaching`, description: `Live coaching at Rays Academy Bhopal.`, href: c.courseHref },
        { title: 'Formula Sheets', description: 'Quick revision formulas.', href: '/study-material/formula-sheets' },
        { title: 'Important Questions', description: 'Most-expected questions for exams.', href: '/study-material/important-questions' },
        { title: 'All Study Material', description: 'Full study material hub.', href: '/study-material' },
      ]}
    />
  );
};

// Page exports — PYQ
export const PYQClass9 = () => buildPYQPage('class-9');
export const PYQClass10 = () => buildPYQPage('class-10');
export const PYQClass11 = () => buildPYQPage('class-11');
export const PYQClass12 = () => buildPYQPage('class-12');
export const PYQNeet = () => buildPYQPage('neet');
export const PYQJee = () => buildPYQPage('jee');
export const PYQNda = () => buildPYQPage('nda');

// Page exports — Sample Papers
export const SPClass9 = () => buildSamplePaperPage('class-9');
export const SPClass10 = () => buildSamplePaperPage('class-10');
export const SPClass11 = () => buildSamplePaperPage('class-11');
export const SPClass12 = () => buildSamplePaperPage('class-12');
export const SPNeet = () => buildSamplePaperPage('neet');
export const SPJee = () => buildSamplePaperPage('jee');
export const SPNda = () => buildSamplePaperPage('nda');
