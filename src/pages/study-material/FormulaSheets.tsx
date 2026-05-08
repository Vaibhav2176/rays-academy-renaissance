import ResourcePageTemplate from '@/components/study-material/ResourcePageTemplate';

const FormulaSheets = () => (
  <ResourcePageTemplate
    title="Formula Sheets - Quick Revision"
    metaTitle="Formula Sheets | Maths, Physics, Chemistry Formulas | Rays Academy Bhopal"
    metaDescription="Download quick revision formula sheets for Maths, Physics & Chemistry. All important formulas organized chapter-wise by Rays Academy Bhopal."
    heroDescription="Quick revision formula sheets covering all important formulas for Mathematics, Physics, and Chemistry organized chapter-wise for efficient last-minute revision."
    breadcrumbLabel="Formula Sheets"
    sections={[
      { heading: 'Mathematics Formulas', description: 'All important Maths formulas from Class 9 to 12 and competitive exams.', items: ['Algebra Formulas', 'Trigonometry Formulas', 'Calculus Formulas', 'Coordinate Geometry Formulas', 'Statistics & Probability Formulas', 'Mensuration Formulas'] },
      { heading: 'Physics Formulas', description: 'Essential Physics formulas for boards and entrance exams.', items: ['Mechanics Formulas', 'Electrodynamics Formulas', 'Optics Formulas', 'Thermodynamics Formulas', 'Modern Physics Formulas', 'Waves & Oscillations Formulas'] },
      { heading: 'Chemistry Formulas', description: 'Important Chemistry equations and formulas.', items: ['Physical Chemistry Formulas', 'Organic Chemistry Reactions', 'Inorganic Chemistry - Periodic Trends', 'Electrochemistry Formulas', 'Chemical Kinetics Formulas'] },
    ]}
  />
);
export default FormulaSheets;
