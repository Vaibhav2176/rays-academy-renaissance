import { defineMcp } from "@lovable.dev/mcp-js";
import getContactInfo from "./tools/get-contact-info";
import listCourses from "./tools/list-courses";
import getAnnouncements from "./tools/get-announcements";

export default defineMcp({
  name: "rays-academy-mcp",
  title: "Rays Academy Bhopal",
  version: "0.1.0",
  instructions:
    "Tools to look up information about Rays Academy Bhopal — contact details, courses offered (Classes 6-12, IIT-JEE, NEET, NDA, CUET), and active announcements.",
  tools: [getContactInfo, listCourses, getAnnouncements],
});
