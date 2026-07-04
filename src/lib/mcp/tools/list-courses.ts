import { defineTool } from "@lovable.dev/mcp-js";

const COURSES = [
  { slug: "class-6-8", name: "Classes 6-8 Foundation", url: "https://www.raysacademybhopal.in/courses/class-6-8" },
  { slug: "class-9", name: "Class 9", url: "https://www.raysacademybhopal.in/courses/class-9" },
  { slug: "class-10", name: "Class 10 (Board)", url: "https://www.raysacademybhopal.in/courses/class-10" },
  { slug: "class-11", name: "Class 11", url: "https://www.raysacademybhopal.in/courses/class-11" },
  { slug: "class-12", name: "Class 12 (Board)", url: "https://www.raysacademybhopal.in/courses/class-12" },
  { slug: "iit-jee", name: "IIT-JEE Coaching", url: "https://www.raysacademybhopal.in/iit-jee-coaching-bhopal" },
  { slug: "neet", name: "NEET Coaching", url: "https://www.raysacademybhopal.in/neet-coaching-bhopal" },
  { slug: "nda", name: "NDA Coaching", url: "https://www.raysacademybhopal.in/nda-coaching-bhopal" },
  { slug: "cuet", name: "CUET Coaching", url: "https://www.raysacademybhopal.in/cuet-coaching-bhopal" },
];

export default defineTool({
  name: "list_courses",
  title: "List courses",
  description: "List all courses offered by Rays Academy Bhopal with their dedicated page URLs.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(COURSES, null, 2) }],
    structuredContent: { courses: COURSES },
  }),
});
