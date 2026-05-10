// Maps a course's `defaultCourse` string to its dedicated study material route.
// Used to wire the "Study Material" CTA on every course page to the right page.

export const courseToStudyMaterial: Record<string, string> = {
  'Class 6-8': '/study-material/class-6-8',
  'Class 6–8': '/study-material/class-6-8',
  'Class 9': '/study-material/class-9',
  'Class 10': '/study-material/class-10',
  'Class 11': '/study-material/class-11',
  'Class 12': '/study-material/class-12',
  'IIT-JEE': '/study-material/iit-jee',
  'NEET': '/study-material/neet',
  'NDA': '/study-material/nda',
  'CUET': '/study-material/cuet',
};

export const getStudyMaterialPath = (course: string): string =>
  courseToStudyMaterial[course] || '/study-material';
