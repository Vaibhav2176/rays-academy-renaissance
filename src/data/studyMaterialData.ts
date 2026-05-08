// Study material data for all classes and exams

export interface SubjectData {
  name: string;
  chapters: { name: string; isFree: boolean }[];
}

const markFreeChapters = (chapters: string[]): { name: string; isFree: boolean }[] =>
  chapters.map((name, idx) => ({ name, isFree: idx < 2 }));

export const class6to8Subjects: SubjectData[] = [
  { name: 'Mathematics', chapters: markFreeChapters(['Number System', 'Fractions & Decimals', 'Algebra', 'Geometry', 'Mensuration', 'Data Handling', 'Ratio & Proportion', 'Percentage']) },
  { name: 'Science', chapters: markFreeChapters(['Food & Nutrition', 'Fibre to Fabric', 'Heat & Temperature', 'Acids, Bases & Salts', 'Physical & Chemical Changes', 'Motion & Time', 'Light', 'Electric Current']) },
  { name: 'English', chapters: markFreeChapters(['Grammar Basics', 'Tenses', 'Active & Passive Voice', 'Direct & Indirect Speech', 'Comprehension', 'Essay Writing']) },
  { name: 'Social Science', chapters: markFreeChapters(['History - Medieval India', 'Geography - Our Environment', 'Civics - Democracy', 'Economics - Introduction']) },
];

export const class9Subjects: SubjectData[] = [
  { name: 'Mathematics', chapters: markFreeChapters(['Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations in Two Variables', 'Triangles', 'Quadrilaterals', 'Circles', 'Constructions', 'Heron\'s Formula', 'Surface Areas & Volumes', 'Statistics', 'Probability']) },
  { name: 'Science', chapters: markFreeChapters(['Matter in Our Surroundings', 'Is Matter Around Us Pure?', 'Atoms and Molecules', 'Structure of Atom', 'The Fundamental Unit of Life', 'Tissues', 'Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy', 'Sound', 'Improvement in Food Resources']) },
  { name: 'English', chapters: markFreeChapters(['Grammar - Tenses', 'Grammar - Modals', 'Writing Skills', 'Literature - Prose', 'Literature - Poetry', 'Comprehension']) },
  { name: 'Social Science', chapters: markFreeChapters(['History - French Revolution', 'Geography - India - Size & Location', 'Civics - Electoral Politics', 'Economics - People as Resource']) },
];

export const class10Subjects: SubjectData[] = [
  { name: 'Mathematics', chapters: markFreeChapters(['Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Trigonometry', 'Applications of Trigonometry', 'Circles', 'Constructions', 'Areas Related to Circles', 'Surface Areas & Volumes', 'Statistics', 'Probability']) },
  { name: 'Science', chapters: markFreeChapters(['Chemical Reactions & Equations', 'Acids, Bases & Salts', 'Metals & Non-Metals', 'Carbon & Its Compounds', 'Life Processes', 'Control & Coordination', 'Heredity & Evolution', 'Light - Reflection & Refraction', 'Human Eye & Colourful World', 'Electricity', 'Magnetic Effects of Electric Current', 'Sources of Energy', 'Our Environment']) },
  { name: 'English', chapters: markFreeChapters(['Grammar - Tenses & Modals', 'Writing - Letter & Essay', 'Literature - First Flight', 'Literature - Footprints Without Feet', 'Comprehension Passages']) },
  { name: 'Social Science', chapters: markFreeChapters(['History - Nationalism in India', 'Geography - Resources & Development', 'Civics - Power Sharing', 'Economics - Development', 'Geography - Manufacturing Industries']) },
];

export const class11Subjects: SubjectData[] = [
  { name: 'Physics', chapters: markFreeChapters(['Physical World', 'Units & Measurements', 'Motion in a Straight Line', 'Motion in a Plane', 'Laws of Motion', 'Work, Energy & Power', 'System of Particles & Rotational Motion', 'Gravitation', 'Mechanical Properties of Solids', 'Mechanical Properties of Fluids', 'Thermal Properties of Matter', 'Thermodynamics', 'Kinetic Theory', 'Oscillations', 'Waves']) },
  { name: 'Chemistry', chapters: markFreeChapters(['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Organic Chemistry - Basics', 'Hydrocarbons', 'States of Matter', 'Hydrogen', 's-Block Elements', 'p-Block Elements', 'Environmental Chemistry']) },
  { name: 'Mathematics', chapters: markFreeChapters(['Sets', 'Relations & Functions', 'Trigonometric Functions', 'Complex Numbers', 'Linear Inequalities', 'Permutations & Combinations', 'Binomial Theorem', 'Sequences & Series', 'Straight Lines', 'Conic Sections', 'Limits & Derivatives', 'Statistics', 'Probability']) },
  { name: 'Biology', chapters: markFreeChapters(['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology of Flowering Plants', 'Anatomy of Flowering Plants', 'Cell - The Unit of Life', 'Cell Division', 'Biomolecules', 'Digestion & Absorption', 'Breathing & Exchange of Gases', 'Body Fluids & Circulation', 'Locomotion & Movement', 'Neural Control', 'Chemical Coordination']) },
];

export const class12Subjects: SubjectData[] = [
  { name: 'Physics', chapters: markFreeChapters(['Electric Charges & Fields', 'Electrostatic Potential', 'Current Electricity', 'Moving Charges & Magnetism', 'Magnetism & Matter', 'Electromagnetic Induction', 'Alternating Current', 'Electromagnetic Waves', 'Ray Optics', 'Wave Optics', 'Dual Nature of Radiation', 'Atoms', 'Nuclei', 'Semiconductor Electronics']) },
  { name: 'Chemistry', chapters: markFreeChapters(['Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'd and f Block Elements', 'Coordination Compounds', 'Haloalkanes & Haloarenes', 'Alcohols, Phenols & Ethers', 'Aldehydes, Ketones & Acids', 'Amines', 'Biomolecules', 'Polymers']) },
  { name: 'Mathematics', chapters: markFreeChapters(['Relations & Functions', 'Inverse Trigonometric Functions', 'Matrices', 'Determinants', 'Continuity & Differentiability', 'Applications of Derivatives', 'Integrals', 'Applications of Integrals', 'Differential Equations', 'Vectors', 'Three Dimensional Geometry', 'Linear Programming', 'Probability']) },
  { name: 'Biology', chapters: markFreeChapters(['Reproduction in Organisms', 'Sexual Reproduction in Flowering Plants', 'Human Reproduction', 'Reproductive Health', 'Principles of Inheritance', 'Molecular Basis of Inheritance', 'Evolution', 'Human Health & Diseases', 'Microbes in Human Welfare', 'Biotechnology - Principles', 'Biotechnology Applications', 'Organisms & Populations', 'Ecosystem', 'Biodiversity & Conservation']) },
];

export const jeeSubjects: SubjectData[] = [
  { name: 'Physics (JEE)', chapters: markFreeChapters(['Mechanics', 'Thermodynamics', 'Electrodynamics', 'Optics', 'Modern Physics', 'Waves & Oscillations', 'Electromagnetic Induction', 'Rotational Motion', 'Fluid Mechanics', 'Semiconductors']) },
  { name: 'Chemistry (JEE)', chapters: markFreeChapters(['Physical Chemistry - Thermodynamics', 'Physical Chemistry - Electrochemistry', 'Organic Chemistry - Reactions', 'Organic Chemistry - Named Reactions', 'Inorganic Chemistry - Periodic Table', 'Inorganic Chemistry - Coordination', 'Chemical Bonding', 'Chemical Kinetics', 'Solutions & Colligative Properties', 'Atomic Structure']) },
  { name: 'Mathematics (JEE)', chapters: markFreeChapters(['Calculus - Limits & Derivatives', 'Calculus - Integration', 'Algebra - Matrices & Determinants', 'Algebra - Complex Numbers', 'Coordinate Geometry', 'Trigonometry', 'Probability & Statistics', 'Vectors & 3D Geometry', 'Differential Equations', 'Sequences & Series']) },
];

export const neetSubjects: SubjectData[] = [
  { name: 'Physics (NEET)', chapters: markFreeChapters(['Mechanics', 'Thermodynamics', 'Electrodynamics', 'Optics', 'Modern Physics', 'Waves & Sound', 'Current Electricity', 'Magnetic Effects', 'Ray Optics', 'Semiconductors']) },
  { name: 'Chemistry (NEET)', chapters: markFreeChapters(['Physical Chemistry', 'Organic Chemistry - Basics', 'Organic Chemistry - Reactions', 'Inorganic Chemistry - Elements', 'Inorganic Chemistry - Coordination', 'Biomolecules', 'Polymers', 'Environmental Chemistry', 'Chemical Bonding', 'Solutions']) },
  { name: 'Biology (NEET)', chapters: markFreeChapters(['Cell Biology', 'Genetics & Evolution', 'Human Physiology', 'Plant Physiology', 'Ecology & Environment', 'Reproduction', 'Biotechnology', 'Animal Kingdom', 'Plant Kingdom', 'Biomolecules', 'Microbes in Human Welfare', 'Human Health & Diseases']) },
];

export const ndaSubjects: SubjectData[] = [
  { name: 'Mathematics (NDA)', chapters: markFreeChapters(['Algebra', 'Trigonometry', 'Analytical Geometry (2D & 3D)', 'Differential Calculus', 'Integral Calculus', 'Vector Algebra', 'Statistics & Probability', 'Matrices & Determinants']) },
  { name: 'General Ability - Physics', chapters: markFreeChapters(['Mechanics', 'Heat & Thermodynamics', 'Optics', 'Electricity & Magnetism', 'Waves & Sound']) },
  { name: 'General Ability - Chemistry', chapters: markFreeChapters(['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Environmental Chemistry']) },
  { name: 'General Ability - General Knowledge', chapters: markFreeChapters(['History of India', 'Geography', 'Current Affairs', 'Defence & Security', 'Indian Polity', 'Economics']) },
];

export const cuetSubjects: SubjectData[] = [
  { name: 'English Language', chapters: markFreeChapters(['Reading Comprehension', 'Vocabulary', 'Grammar', 'Verbal Ability', 'Para Jumbles', 'Error Spotting']) },
  { name: 'General Test', chapters: markFreeChapters(['General Knowledge', 'Current Affairs', 'General Mental Ability', 'Numerical Ability', 'Quantitative Reasoning', 'Logical Reasoning']) },
  { name: 'Domain - Accountancy', chapters: markFreeChapters(['Partnership Accounts', 'Company Accounts', 'Financial Statements', 'Cash Flow Statement', 'Ratio Analysis']) },
  { name: 'Domain - Economics', chapters: markFreeChapters(['Microeconomics', 'Macroeconomics', 'Indian Economy', 'Statistics for Economics', 'Development Policies']) },
];

export const defaultFaqs = [
  { question: 'Where can I get the best study material in Bhopal?', answer: 'Rays Academy provides expert-prepared, chapter-wise study material for Classes 6-12 and competitive exams like IIT-JEE, NEET, NDA & CUET. Our material is designed by experienced faculty with 3-33+ years of teaching experience.' },
  { question: 'Are the study notes downloadable?', answer: 'PDF downloads will be available soon. Currently, you can access all study material online through our platform. Premium subscribers will get priority access to downloadable content.' },
  { question: 'Which chapters are free?', answer: 'The first 2 chapters of every subject are completely free. You can explore them without any registration. Premium chapters can be unlocked individually at ₹50 each or get full subject access at ₹500.' },
  { question: 'Is the study material exam-oriented?', answer: 'Yes, all our study material is prepared keeping board exams and competitive entrance exams in mind. It includes important questions, previous year patterns, and high-weightage topics.' },
  { question: 'How is Rays Academy study material different?', answer: 'Our material is prepared by experienced faculty who understand exam patterns deeply. It focuses on concept clarity, includes solved examples, and provides practice questions for thorough preparation.' },
];

export const defaultLocalSeo = [
  'Best study material in Bhopal',
  'Free study notes for Class 10 Bhopal',
  'NEET study material Bhopal',
  'IIT JEE preparation notes Bhopal',
  'Best coaching institute study material Bhopal',
  'Chapter-wise notes for board exams',
  'CBSE study material Bhopal',
  'MP Board study notes',
  'Free NCERT solutions Bhopal',
  'Rays Academy study material',
];
