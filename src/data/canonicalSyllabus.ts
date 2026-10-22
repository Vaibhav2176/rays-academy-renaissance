// Canonical syllabus configuration for Rays Academy Bhopal
// Unifies courses, subjects, chapters, sequence numbers, and pricing rules across the application.

export interface CanonicalChapter {
  sequence: number; // 1-based sequential ordering within the subject
  chapterNumber?: number; // Academic chapter number (if different)
  title: string; // Human-readable topic/chapter title
  section?: string; // Syllabus section/sub-discipline (e.g., 'Algebra', 'Trigonometry', 'Mechanics')
  isFree: boolean; // First 2 chapters of every subject are free
}

export interface CanonicalSubject {
  slug: string; // Canonical subject slug for URLs and database queries
  name: string; // Display name
  chapters: CanonicalChapter[];
}

export interface CanonicalCourse {
  slug: string; // Canonical course slug (e.g., 'nda', 'iit-jee', 'class-10')
  name: string; // Display title
  category: 'competitive' | 'high_school' | 'middle_school';
  classIdFallbackName?: string; // Maps to public.classes(name)
  subjects: CanonicalSubject[];
}

const buildChapters = (
  list: { title: string; section?: string }[]
): CanonicalChapter[] =>
  list.map((item, idx) => ({
    sequence: idx + 1,
    chapterNumber: idx + 1,
    title: item.title,
    section: item.section,
    isFree: idx < 2,
  }));

export const CANONICAL_COURSES: CanonicalCourse[] = [
  {
    slug: 'nda',
    name: 'NDA (National Defence Academy)',
    category: 'competitive',
    classIdFallbackName: 'NDA',
    subjects: [
      {
        slug: 'maths',
        name: 'Mathematics',
        chapters: buildChapters([
          { title: 'Algebra - Sets, Relations & Functions', section: 'Algebra' },
          { title: 'Algebra - Complex Numbers & Quadratic Equations', section: 'Algebra' },
          { title: 'Algebra - Sequences & Series (AP, GP, HP)', section: 'Algebra' },
          { title: 'Algebra - Permutations & Combinations', section: 'Algebra' },
          { title: 'Algebra - Binomial Theorem', section: 'Algebra' },
          { title: 'Algebra - Matrices & Determinants', section: 'Algebra' },
          { title: 'Trigonometry - Angles & Standard Identities', section: 'Trigonometry' },
          { title: 'Trigonometry - Inverse Trigonometric Functions', section: 'Trigonometry' },
          { title: 'Trigonometry - Heights & Distances', section: 'Trigonometry' },
          { title: 'Analytical Geometry - 2D Cartesian Coordinates & Straight Lines', section: 'Analytical Geometry' },
          { title: 'Analytical Geometry - Circles', section: 'Analytical Geometry' },
          { title: 'Analytical Geometry - Conic Sections (Parabola, Ellipse, Hyperbola)', section: 'Analytical Geometry' },
          { title: 'Analytical Geometry - 3D Geometry', section: 'Analytical Geometry' },
          { title: 'Differential Calculus - Limits, Continuity & Differentiability', section: 'Differential Calculus' },
          { title: 'Differential Calculus - Applications of Derivatives', section: 'Differential Calculus' },
          { title: 'Integral Calculus - Indefinite & Definite Integrals', section: 'Integral Calculus' },
          { title: 'Integral Calculus - Differential Equations', section: 'Integral Calculus' },
          { title: 'Vector Algebra - Vectors, Dot & Cross Products', section: 'Vector Algebra' },
          { title: 'Statistics - Measures of Central Tendency & Dispersion', section: 'Statistics & Probability' },
          { title: 'Probability - Events, Conditional Probability & Bayes Theorem', section: 'Statistics & Probability' },
        ]),
      },
      {
        slug: 'general-ability-physics',
        name: 'General Ability - Physics',
        chapters: buildChapters([
          { title: 'Mechanics & Properties of Matter', section: 'General Ability' },
          { title: 'Heat & Thermodynamics', section: 'General Ability' },
          { title: 'Optics & Wave Motion', section: 'General Ability' },
          { title: 'Electricity & Magnetism', section: 'General Ability' },
          { title: 'Modern Physics & Nuclear Energy', section: 'General Ability' },
        ]),
      },
      {
        slug: 'general-ability-chemistry',
        name: 'General Ability - Chemistry',
        chapters: buildChapters([
          { title: 'Physical & Chemical Changes, Elements & Mixtures', section: 'General Ability' },
          { title: 'Acids, Bases & Salts', section: 'General Ability' },
          { title: 'Carbon & Its Compounds', section: 'General Ability' },
          { title: 'Atomic Structure & Chemical Bonding', section: 'General Ability' },
          { title: 'Environmental Chemistry & Everyday Chemicals', section: 'General Ability' },
        ]),
      },
      {
        slug: 'general-ability-gk',
        name: 'General Ability - General Knowledge',
        chapters: buildChapters([
          { title: 'History of India & Freedom Movement', section: 'General Knowledge' },
          { title: 'Geography of India & the World', section: 'General Knowledge' },
          { title: 'Indian Polity & Constitution', section: 'General Knowledge' },
          { title: 'Defence, Security & Military History', section: 'General Knowledge' },
          { title: 'Current Affairs & International Events', section: 'General Knowledge' },
        ]),
      },
    ],
  },
  {
    slug: 'iit-jee',
    name: 'IIT-JEE (Main & Advanced)',
    category: 'competitive',
    classIdFallbackName: 'IIT-JEE',
    subjects: [
      {
        slug: 'physics',
        name: 'Physics',
        chapters: buildChapters([
          { title: 'Units, Dimensions & Kinematics', section: 'Mechanics' },
          { title: 'Laws of Motion & Friction', section: 'Mechanics' },
          { title: 'Work, Energy & Power', section: 'Mechanics' },
          { title: 'Rotational Dynamics & Gravitation', section: 'Mechanics' },
          { title: 'Fluid Mechanics & Thermal Physics', section: 'Thermal & Fluids' },
          { title: 'Thermodynamics & Kinetic Theory', section: 'Thermodynamics' },
          { title: 'Oscillations & Waves', section: 'Waves' },
          { title: 'Electrostatics & Capacitance', section: 'Electrodynamics' },
          { title: 'Current Electricity & Magnetic Effects', section: 'Electrodynamics' },
          { title: 'Electromagnetic Induction & Alternating Current', section: 'Electrodynamics' },
          { title: 'Ray & Wave Optics', section: 'Optics' },
          { title: 'Modern Physics & Semiconductors', section: 'Modern Physics' },
        ]),
      },
      {
        slug: 'chemistry',
        name: 'Chemistry',
        chapters: buildChapters([
          { title: 'Atomic Structure & Chemical Bonding', section: 'Inorganic Chemistry' },
          { title: 'Periodic Table & Periodic Properties', section: 'Inorganic Chemistry' },
          { title: 'Coordination Compounds & Qualitative Analysis', section: 'Inorganic Chemistry' },
          { title: 'States of Matter & Solutions', section: 'Physical Chemistry' },
          { title: 'Thermodynamics & Chemical Equilibrium', section: 'Physical Chemistry' },
          { title: 'Electrochemistry & Chemical Kinetics', section: 'Physical Chemistry' },
          { title: 'General Organic Chemistry (GOC)', section: 'Organic Chemistry' },
          { title: 'Hydrocarbons & Named Reactions', section: 'Organic Chemistry' },
          { title: 'Alcohols, Phenols, Ethers & Carbonyl Compounds', section: 'Organic Chemistry' },
          { title: 'Amines, Biomolecules & Polymers', section: 'Organic Chemistry' },
        ]),
      },
      {
        slug: 'maths',
        name: 'Mathematics',
        chapters: buildChapters([
          { title: 'Sets, Relations & Functions', section: 'Algebra' },
          { title: 'Complex Numbers & Quadratic Equations', section: 'Algebra' },
          { title: 'Matrices & Determinants', section: 'Algebra' },
          { title: 'Trigonometry & Inverse Trigonometric Functions', section: 'Trigonometry' },
          { title: 'Coordinate Geometry (Lines, Circles & Conics)', section: 'Coordinate Geometry' },
          { title: 'Limits, Continuity & Differentiability', section: 'Calculus' },
          { title: 'Applications of Derivatives', section: 'Calculus' },
          { title: 'Indefinite & Definite Integration', section: 'Calculus' },
          { title: 'Differential Equations', section: 'Calculus' },
          { title: 'Vectors & 3D Geometry', section: 'Vectors & 3D' },
          { title: 'Probability & Statistics', section: 'Probability' },
        ]),
      },
    ],
  },
  {
    slug: 'neet',
    name: 'NEET (Medical Entrance)',
    category: 'competitive',
    classIdFallbackName: 'NEET',
    subjects: [
      {
        slug: 'physics',
        name: 'Physics',
        chapters: buildChapters([
          { title: 'Physical World, Units & Kinematics', section: 'Mechanics' },
          { title: 'Laws of Motion & Work-Energy', section: 'Mechanics' },
          { title: 'System of Particles & Gravitation', section: 'Mechanics' },
          { title: 'Thermodynamics & Heat Transfer', section: 'Thermodynamics' },
          { title: 'Current Electricity & Magnetic Effects', section: 'Electrodynamics' },
          { title: 'Ray Optics & Wave Optics', section: 'Optics' },
          { title: 'Dual Nature of Radiation & Nuclear Physics', section: 'Modern Physics' },
          { title: 'Semiconductor Electronics', section: 'Electronics' },
        ]),
      },
      {
        slug: 'chemistry',
        name: 'Chemistry',
        chapters: buildChapters([
          { title: 'Structure of Atom & Chemical Bonding', section: 'Physical Chemistry' },
          { title: 'Chemical Thermodynamics & Equilibrium', section: 'Physical Chemistry' },
          { title: 'Solutions, Electrochemistry & Kinetics', section: 'Physical Chemistry' },
          { title: 'Classification of Elements & Periodic Trends', section: 'Inorganic Chemistry' },
          { title: 'Coordination Compounds & d/f-Block Elements', section: 'Inorganic Chemistry' },
          { title: 'Basic Principles of Organic Chemistry', section: 'Organic Chemistry' },
          { title: 'Hydrocarbons & Functional Groups', section: 'Organic Chemistry' },
          { title: 'Biomolecules & Polymers', section: 'Organic Chemistry' },
        ]),
      },
      {
        slug: 'biology',
        name: 'Biology',
        chapters: buildChapters([
          { title: 'The Living World & Biological Classification', section: 'Diversity of Life' },
          { title: 'Plant Kingdom & Animal Kingdom', section: 'Diversity of Life' },
          { title: 'Morphology & Anatomy of Flowering Plants', section: 'Structural Organisation' },
          { title: 'Cell - The Unit of Life & Cell Cycle', section: 'Cell Biology' },
          { title: 'Plant Physiology - Transport, Photosynthesis & Respiration', section: 'Plant Physiology' },
          { title: 'Human Physiology - Digestion, Circulation & Respiration', section: 'Human Physiology' },
          { title: 'Human Physiology - Neural & Chemical Coordination', section: 'Human Physiology' },
          { title: 'Reproduction in Plants and Animals', section: 'Reproduction' },
          { title: 'Genetics & Evolution (Mendelian & Molecular)', section: 'Genetics' },
          { title: 'Biotechnology - Principles and Applications', section: 'Biotechnology' },
          { title: 'Ecology & Environment', section: 'Ecology' },
        ]),
      },
    ],
  },
  {
    slug: 'class-12',
    name: 'Class 12 (Board & Competitive)',
    category: 'high_school',
    classIdFallbackName: 'Class 12',
    subjects: [
      {
        slug: 'physics',
        name: 'Physics',
        chapters: buildChapters([
          { title: 'Electric Charges and Fields', section: 'Electrostatics' },
          { title: 'Electrostatic Potential and Capacitance', section: 'Electrostatics' },
          { title: 'Current Electricity', section: 'Current Electricity' },
          { title: 'Moving Charges and Magnetism', section: 'Magnetism' },
          { title: 'Magnetism and Matter', section: 'Magnetism' },
          { title: 'Electromagnetic Induction', section: 'Electromagnetism' },
          { title: 'Alternating Current', section: 'Electromagnetism' },
          { title: 'Electromagnetic Waves', section: 'Optics & Waves' },
          { title: 'Ray Optics and Optical Instruments', section: 'Optics & Waves' },
          { title: 'Wave Optics', section: 'Optics & Waves' },
          { title: 'Dual Nature of Radiation and Matter', section: 'Modern Physics' },
          { title: 'Atoms and Nuclei', section: 'Modern Physics' },
          { title: 'Semiconductor Electronics', section: 'Electronics' },
        ]),
      },
      {
        slug: 'chemistry',
        name: 'Chemistry',
        chapters: buildChapters([
          { title: 'Solutions', section: 'Physical Chemistry' },
          { title: 'Electrochemistry', section: 'Physical Chemistry' },
          { title: 'Chemical Kinetics', section: 'Physical Chemistry' },
          { title: 'd and f Block Elements', section: 'Inorganic Chemistry' },
          { title: 'Coordination Compounds', section: 'Inorganic Chemistry' },
          { title: 'Haloalkanes and Haloarenes', section: 'Organic Chemistry' },
          { title: 'Alcohols, Phenols and Ethers', section: 'Organic Chemistry' },
          { title: 'Aldehydes, Ketones and Carboxylic Acids', section: 'Organic Chemistry' },
          { title: 'Amines', section: 'Organic Chemistry' },
          { title: 'Biomolecules', section: 'Organic Chemistry' },
        ]),
      },
      {
        slug: 'maths',
        name: 'Mathematics',
        chapters: buildChapters([
          { title: 'Relations and Functions', section: 'Relations & Functions' },
          { title: 'Inverse Trigonometric Functions', section: 'Relations & Functions' },
          { title: 'Matrices', section: 'Algebra' },
          { title: 'Determinants', section: 'Algebra' },
          { title: 'Continuity and Differentiability', section: 'Calculus' },
          { title: 'Applications of Derivatives', section: 'Calculus' },
          { title: 'Integrals', section: 'Calculus' },
          { title: 'Applications of Integrals', section: 'Calculus' },
          { title: 'Differential Equations', section: 'Calculus' },
          { title: 'Vector Algebra', section: 'Vectors & 3D' },
          { title: 'Three Dimensional Geometry', section: 'Vectors & 3D' },
          { title: 'Linear Programming', section: 'Applied Mathematics' },
          { title: 'Probability', section: 'Probability' },
        ]),
      },
      {
        slug: 'biology',
        name: 'Biology',
        chapters: buildChapters([
          { title: 'Sexual Reproduction in Flowering Plants', section: 'Reproduction' },
          { title: 'Human Reproduction', section: 'Reproduction' },
          { title: 'Reproductive Health', section: 'Reproduction' },
          { title: 'Principles of Inheritance and Variation', section: 'Genetics & Evolution' },
          { title: 'Molecular Basis of Inheritance', section: 'Genetics & Evolution' },
          { title: 'Evolution', section: 'Genetics & Evolution' },
          { title: 'Human Health and Disease', section: 'Biology in Human Welfare' },
          { title: 'Microbes in Human Welfare', section: 'Biology in Human Welfare' },
          { title: 'Biotechnology - Principles and Processes', section: 'Biotechnology' },
          { title: 'Biotechnology and its Applications', section: 'Biotechnology' },
          { title: 'Organisms and Populations', section: 'Ecology' },
          { title: 'Ecosystem', section: 'Ecology' },
          { title: 'Biodiversity and Conservation', section: 'Ecology' },
        ]),
      },
    ],
  },
  {
    slug: 'class-11',
    name: 'Class 11 (Foundations & Boards)',
    category: 'high_school',
    classIdFallbackName: 'Class 11',
    subjects: [
      {
        slug: 'physics',
        name: 'Physics',
        chapters: buildChapters([
          { title: 'Units and Measurements', section: 'Kinematics' },
          { title: 'Motion in a Straight Line', section: 'Kinematics' },
          { title: 'Motion in a Plane', section: 'Kinematics' },
          { title: 'Laws of Motion', section: 'Mechanics' },
          { title: 'Work, Energy and Power', section: 'Mechanics' },
          { title: 'System of Particles and Rotational Motion', section: 'Mechanics' },
          { title: 'Gravitation', section: 'Gravitation' },
          { title: 'Mechanical Properties of Solids and Fluids', section: 'Properties of Matter' },
          { title: 'Thermal Properties of Matter and Thermodynamics', section: 'Thermodynamics' },
          { title: 'Kinetic Theory of Gases', section: 'Thermodynamics' },
          { title: 'Oscillations and Waves', section: 'Oscillations' },
        ]),
      },
      {
        slug: 'chemistry',
        name: 'Chemistry',
        chapters: buildChapters([
          { title: 'Some Basic Concepts of Chemistry', section: 'Physical Chemistry' },
          { title: 'Structure of Atom', section: 'Physical Chemistry' },
          { title: 'Classification of Elements and Periodicity in Properties', section: 'Inorganic Chemistry' },
          { title: 'Chemical Bonding and Molecular Structure', section: 'Inorganic Chemistry' },
          { title: 'Chemical Thermodynamics', section: 'Physical Chemistry' },
          { title: 'Equilibrium (Chemical and Ionic)', section: 'Physical Chemistry' },
          { title: 'Redox Reactions', section: 'Physical Chemistry' },
          { title: 'Organic Chemistry - Basic Principles and Techniques', section: 'Organic Chemistry' },
          { title: 'Hydrocarbons', section: 'Organic Chemistry' },
        ]),
      },
      {
        slug: 'maths',
        name: 'Mathematics',
        chapters: buildChapters([
          { title: 'Sets and Relations', section: 'Sets & Functions' },
          { title: 'Trigonometric Functions', section: 'Sets & Functions' },
          { title: 'Complex Numbers and Quadratic Equations', section: 'Algebra' },
          { title: 'Linear Inequalities', section: 'Algebra' },
          { title: 'Permutations and Combinations', section: 'Algebra' },
          { title: 'Binomial Theorem', section: 'Algebra' },
          { title: 'Sequences and Series', section: 'Algebra' },
          { title: 'Straight Lines and Conic Sections', section: 'Coordinate Geometry' },
          { title: 'Introduction to Three Dimensional Geometry', section: 'Coordinate Geometry' },
          { title: 'Limits and Derivatives', section: 'Calculus' },
          { title: 'Statistics and Probability', section: 'Statistics' },
        ]),
      },
      {
        slug: 'biology',
        name: 'Biology',
        chapters: buildChapters([
          { title: 'The Living World and Biological Classification', section: 'Diversity' },
          { title: 'Plant Kingdom and Animal Kingdom', section: 'Diversity' },
          { title: 'Morphology and Anatomy of Flowering Plants', section: 'Structural Organisation' },
          { title: 'Cell - The Unit of Life and Biomolecules', section: 'Cell Biology' },
          { title: 'Cell Cycle and Cell Division', section: 'Cell Biology' },
          { title: 'Photosynthesis in Higher Plants', section: 'Plant Physiology' },
          { title: 'Respiration in Plants and Plant Growth', section: 'Plant Physiology' },
          { title: 'Breathing and Exchange of Gases', section: 'Human Physiology' },
          { title: 'Body Fluids and Circulation', section: 'Human Physiology' },
          { title: 'Excretory Products and Locomotion', section: 'Human Physiology' },
          { title: 'Neural Control and Chemical Coordination', section: 'Human Physiology' },
        ]),
      },
    ],
  },
  {
    slug: 'class-10',
    name: 'Class 10 (Board Exam Preparation)',
    category: 'high_school',
    classIdFallbackName: 'Class 10',
    subjects: [
      {
        slug: 'maths',
        name: 'Mathematics',
        chapters: buildChapters([
          { title: 'Real Numbers', section: 'Number Systems' },
          { title: 'Polynomials', section: 'Algebra' },
          { title: 'Pair of Linear Equations in Two Variables', section: 'Algebra' },
          { title: 'Quadratic Equations', section: 'Algebra' },
          { title: 'Arithmetic Progressions', section: 'Algebra' },
          { title: 'Triangles', section: 'Geometry' },
          { title: 'Coordinate Geometry', section: 'Coordinate Geometry' },
          { title: 'Introduction to Trigonometry and Applications', section: 'Trigonometry' },
          { title: 'Circles', section: 'Geometry' },
          { title: 'Areas Related to Circles', section: 'Mensuration' },
          { title: 'Surface Areas and Volumes', section: 'Mensuration' },
          { title: 'Statistics and Probability', section: 'Statistics' },
        ]),
      },
      {
        slug: 'science',
        name: 'Science',
        chapters: buildChapters([
          { title: 'Chemical Reactions and Equations', section: 'Chemistry' },
          { title: 'Acids, Bases and Salts', section: 'Chemistry' },
          { title: 'Metals and Non-metals', section: 'Chemistry' },
          { title: 'Carbon and its Compounds', section: 'Chemistry' },
          { title: 'Life Processes', section: 'Biology' },
          { title: 'Control and Coordination', section: 'Biology' },
          { title: 'How do Organisms Reproduce?', section: 'Biology' },
          { title: 'Heredity and Evolution', section: 'Biology' },
          { title: 'Light - Reflection and Refraction', section: 'Physics' },
          { title: 'Human Eye and Colourful World', section: 'Physics' },
          { title: 'Electricity', section: 'Physics' },
          { title: 'Magnetic Effects of Electric Current', section: 'Physics' },
          { title: 'Our Environment', section: 'Environmental Science' },
        ]),
      },
      {
        slug: 'english',
        name: 'English',
        chapters: buildChapters([
          { title: 'Grammar - Tenses, Modals and Reported Speech', section: 'Grammar' },
          { title: 'Writing Skills - Formal Letters & Analytical Paragraphs', section: 'Writing' },
          { title: 'First Flight - Prose & Poetry Analysis', section: 'Literature' },
          { title: 'Footprints Without Feet - Supplementary Reader', section: 'Literature' },
        ]),
      },
      {
        slug: 'social-science',
        name: 'Social Science',
        chapters: buildChapters([
          { title: 'History - The Rise of Nationalism in Europe & India', section: 'History' },
          { title: 'Geography - Resources, Agriculture & Manufacturing', section: 'Geography' },
          { title: 'Civics - Power Sharing, Federalism & Gender', section: 'Civics' },
          { title: 'Economics - Development & Sectors of the Indian Economy', section: 'Economics' },
        ]),
      },
    ],
  },
  {
    slug: 'class-9',
    name: 'Class 9 (CBSE / ICSE / MP Board)',
    category: 'middle_school',
    classIdFallbackName: 'Class 9',
    subjects: [
      {
        slug: 'maths',
        name: 'Mathematics',
        chapters: buildChapters([
          { title: 'Number Systems', section: 'Number Systems' },
          { title: 'Polynomials', section: 'Algebra' },
          { title: 'Coordinate Geometry & Linear Equations', section: 'Algebra' },
          { title: 'Lines, Angles & Triangles', section: 'Geometry' },
          { title: 'Quadrilaterals & Circles', section: 'Geometry' },
          { title: 'Heron\'s Formula', section: 'Mensuration' },
          { title: 'Surface Areas and Volumes', section: 'Mensuration' },
          { title: 'Statistics and Probability', section: 'Statistics' },
        ]),
      },
      {
        slug: 'science',
        name: 'Science',
        chapters: buildChapters([
          { title: 'Matter in Our Surroundings', section: 'Chemistry' },
          { title: 'Is Matter Around Us Pure?', section: 'Chemistry' },
          { title: 'Atoms, Molecules and Atomic Structure', section: 'Chemistry' },
          { title: 'The Fundamental Unit of Life (Cell)', section: 'Biology' },
          { title: 'Tissues in Plants and Animals', section: 'Biology' },
          { title: 'Motion, Force and Laws of Motion', section: 'Physics' },
          { title: 'Gravitation', section: 'Physics' },
          { title: 'Work, Energy and Sound', section: 'Physics' },
          { title: 'Improvement in Food Resources', section: 'Applied Science' },
        ]),
      },
      {
        slug: 'english',
        name: 'English',
        chapters: buildChapters([
          { title: 'Grammar and Sentence Composition', section: 'Grammar' },
          { title: 'Reading Comprehension and Critical Thinking', section: 'Reading' },
          { title: 'Literature Reader - Beehive Prose & Poetry', section: 'Literature' },
          { title: 'Supplementary Reader - Moments', section: 'Literature' },
        ]),
      },
      {
        slug: 'social-science',
        name: 'Social Science',
        chapters: buildChapters([
          { title: 'History - The French Revolution & Socialism in Europe', section: 'History' },
          { title: 'Geography - India: Size, Location & Physical Features', section: 'Geography' },
          { title: 'Civics - What is Democracy? Constitutional Design', section: 'Civics' },
          { title: 'Economics - The Story of Village Palampur & People as Resource', section: 'Economics' },
        ]),
      },
    ],
  },
  {
    slug: 'class-6-8',
    name: 'Classes 6–8 (Foundation)',
    category: 'middle_school',
    classIdFallbackName: 'Class 8',
    subjects: [
      {
        slug: 'maths',
        name: 'Mathematics',
        chapters: buildChapters([
          { title: 'Number Systems, Fractions and Decimals', section: 'Arithmetic' },
          { title: 'Introduction to Integers and Rational Numbers', section: 'Arithmetic' },
          { title: 'Basic Algebra and Algebraic Expressions', section: 'Algebra' },
          { title: 'Linear Equations in One Variable', section: 'Algebra' },
          { title: 'Geometry - Lines, Angles and Triangles', section: 'Geometry' },
          { title: 'Perimeter, Area and Volume (Mensuration)', section: 'Mensuration' },
          { title: 'Ratio, Proportion and Percentage', section: 'Commercial Maths' },
          { title: 'Data Handling and Probability Basics', section: 'Statistics' },
        ]),
      },
      {
        slug: 'science',
        name: 'Science',
        chapters: buildChapters([
          { title: 'Food, Nutrition and Digestion', section: 'Life Science' },
          { title: 'Fibre to Fabric and Materials in Daily Life', section: 'Material Science' },
          { title: 'Heat, Temperature and Changes around Us', section: 'Physical Science' },
          { title: 'Acids, Bases and Salts', section: 'Chemical Science' },
          { title: 'Living Organisms, Plants and Animals', section: 'Life Science' },
          { title: 'Motion, Time and Measurement', section: 'Physical Science' },
          { title: 'Light, Shadows and Reflections', section: 'Physical Science' },
          { title: 'Electricity, Circuits and Magnetism', section: 'Physical Science' },
        ]),
      },
      {
        slug: 'english',
        name: 'English',
        chapters: buildChapters([
          { title: 'Grammar Fundamentals - Parts of Speech & Tenses', section: 'Grammar' },
          { title: 'Sentence Structure & Active/Passive Voice', section: 'Grammar' },
          { title: 'Reading Comprehension & Vocabulary Development', section: 'Comprehension' },
          { title: 'Creative Writing - Letters, Paragraphs & Stories', section: 'Writing' },
        ]),
      },
      {
        slug: 'social-science',
        name: 'Social Science',
        chapters: buildChapters([
          { title: 'Our Past - Ancient, Medieval & Modern Eras', section: 'History' },
          { title: 'The Earth Our Habitat - Solar System & Landforms', section: 'Geography' },
          { title: 'Social & Political Life - Diversity & Government', section: 'Civics' },
          { title: 'Environment & Natural Resources', section: 'Geography' },
        ]),
      },
    ],
  },
  {
    slug: 'cuet',
    name: 'CUET (UG Entrance Exam)',
    category: 'competitive',
    classIdFallbackName: 'CUET',
    subjects: [
      {
        slug: 'english',
        name: 'English Language',
        chapters: buildChapters([
          { title: 'Reading Comprehension (Factual, Narrative, Literary)', section: 'Language' },
          { title: 'Verbal Ability & Para Jumbles', section: 'Language' },
          { title: 'Vocabulary, Synonyms, Antonyms & Idioms', section: 'Language' },
          { title: 'Grammar - Error Spotting & Sentence Correction', section: 'Language' },
        ]),
      },
      {
        slug: 'general-test',
        name: 'General Test',
        chapters: buildChapters([
          { title: 'General Knowledge & Current Affairs', section: 'General Awareness' },
          { title: 'General Mental Ability & Logical Reasoning', section: 'Reasoning' },
          { title: 'Numerical Ability & Quantitative Reasoning', section: 'Quantitative' },
          { title: 'Analytical Reasoning & Data Interpretation', section: 'Reasoning' },
        ]),
      },
      {
        slug: 'accountancy',
        name: 'Domain - Accountancy',
        chapters: buildChapters([
          { title: 'Accounting for Not-for-Profit Organisations', section: 'Domain' },
          { title: 'Accounting for Partnership - Fundamentals & Goodwill', section: 'Domain' },
          { title: 'Accounting for Share Capital and Debentures', section: 'Domain' },
          { title: 'Financial Statement Analysis & Cash Flow Statement', section: 'Domain' },
        ]),
      },
      {
        slug: 'economics',
        name: 'Domain - Economics',
        chapters: buildChapters([
          { title: 'Introduction to Microeconomics & Consumer Behaviour', section: 'Domain' },
          { title: 'National Income and Related Aggregates', section: 'Domain' },
          { title: 'Determination of Income and Employment', section: 'Domain' },
          { title: 'Money, Banking and Government Budget', section: 'Domain' },
          { title: 'Indian Economic Development (1947–Present)', section: 'Domain' },
        ]),
      },
    ],
  },
];

/** Lookup helpers */
export function getCanonicalCourse(slug: string): CanonicalCourse | undefined {
  const s = slug.toLowerCase().trim();
  return CANONICAL_COURSES.find((c) => c.slug === s);
}

export function getCanonicalSubject(
  courseSlug: string,
  subjectSlug: string
): CanonicalSubject | undefined {
  const course = getCanonicalCourse(courseSlug);
  if (!course) return undefined;
  const s = subjectSlug.toLowerCase().trim();
  return course.subjects.find((sub) => sub.slug === s);
}

export function getSubjectsForCourse(courseSlug: string): CanonicalSubject[] {
  const course = getCanonicalCourse(courseSlug);
  return course ? course.subjects : [];
}

export function getChaptersForSubject(
  courseSlug: string,
  subjectSlug: string
): CanonicalChapter[] {
  const subject = getCanonicalSubject(courseSlug, subjectSlug);
  return subject ? subject.chapters : [];
}

/** Map database public.classes(name) to canonical course slug */
export function classNameToCourseSlug(className?: string | null): string {
  if (!className) return 'all';
  const name = className.trim().toLowerCase();

  // Check competitive exams first to avoid digit conflicts with batch years (e.g. "NDA 2026")
  if (name.includes('nda')) return 'nda';
  if (name.includes('jee')) return 'iit-jee';
  if (name.includes('neet')) return 'neet';
  if (name.includes('cuet')) return 'cuet';

  // Check specific class levels
  if (name.includes('12')) return 'class-12';
  if (name.includes('11')) return 'class-11';
  if (name.includes('10')) return 'class-10';
  if (/\b9\b|class\s*9|9th/.test(name)) return 'class-9';
  if (/\b(6|7|8)\b|class\s*[678]|[678]th|6-8|6–8/.test(name)) return 'class-6-8';

  return 'all';
}

/** Map course slug to display class name */
export function courseSlugToClassName(slug?: string | null): string {
  if (!slug || slug === 'all') return 'All Courses';
  const course = getCanonicalCourse(slug);
  return course ? course.name : slug.toUpperCase();
}
