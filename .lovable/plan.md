# Rays Academy — Study Material Ecosystem Refinement Plan

This is a large, multi-area refinement. I'll group it into focused phases so each change is verifiable. All work stays within the existing Rays Academy theme (navy blue / white / academic red).

---

## Phase 1 — Critical Fixes (highest priority)

**1.1 Button visibility (Contact Us / WhatsApp Us)**
- Audit all CTA buttons across pages (course pages, study material pages, footer, hero CTAs).
- Standardize a `ContactCTA` and `WhatsAppCTA` pattern:
  - WhatsApp: solid `bg-[#25D366]` with white text, WhatsApp SVG icon (already in `/public/whatsapp.svg`), shadow, no opacity tricks.
  - Contact: solid `bg-accent` (red) with `text-accent-foreground`, strong contrast, shadow.
- Ensure text is visible **without** hover (current issue: some buttons rely on hover state for legibility).

**1.2 Breadcrumb overlapping navbar**
- Fix in `StudyMaterialPageTemplate.tsx` and `ResourcePageTemplate.tsx`: add `pt-20 md:pt-24` to the wrapper so breadcrumb sits below the fixed navbar.
- Verify on mobile viewport (375px) and desktop.

---

## Phase 2 — Navbar Study Material Dropdown

- Add a dropdown under "Study Material" in `Navbar.tsx` (desktop + mobile), mirroring the existing Courses dropdown pattern.
- Items: Classes 6–8, 9, 10, 11, 12, IIT-JEE, NEET, NDA, CUET, Sample Papers, PYQs, Formula Sheets, NCERT Books.
- Smooth Framer Motion fade/scale animation; responsive collapse on mobile.

---

## Phase 3 — Course → Study Material Linking

- On each course page (`Class10.tsx`, `NEET.tsx`, etc.), add a prominent "Related Study Material" CTA card linking to the matching study material page.
- Use a reusable `<RelatedStudyMaterial courseSlug="class-10" />` block inside `CoursePageTemplate.tsx`.

---

## Phase 4 — Study Material Page UI/UX Polish

- Add Framer Motion stagger + fade-in to subject accordion sections in `StudyMaterialPageTemplate.tsx`.
- Hover lift on chapter cards, gradient section dividers, Free/Paid badges with clearer color contrast (green for Free, amber for Paid).
- Animated download/resource cards in `ResourcePageTemplate.tsx`.
- Add subtle gradient backgrounds and section transitions.

---

## Phase 5 — FAQ Enhancement

- Expand `defaultFaqs` in `studyMaterialData.ts` and add subject-specific FAQ arrays (NEET Bio, JEE Physics, Class 10 Maths, NCERT sufficiency, free chapters).
- Render FAQs using shadcn `Accordion` with motion fade-in on each item.

---

## Phase 6 — Internal Linking & Related Resources

- Add a `RelatedResources` component (shows 3–4 contextual links) on:
  - Each course page → matching study material + PYQs + sample papers.
  - Each study material page → matching course + NCERT + formula sheets.
  - Resource pages → relevant class pages.
- Add contextual paragraphs with inline links (e.g., "Explore our [Class 10 Mathematics syllabus](/courses/class-10) and [Class 10 study material](/study-material/class-10)").
- Footer: ensure all new pages are reachable; add a "Resources" column.

---

## Phase 7 — External Educational Links

- Add a small "Official Resources" block on relevant study material pages linking (open in new tab, `rel="noopener noreferrer"`):
  - NCERT: https://ncert.nic.in
  - CBSE: https://www.cbse.gov.in
  - NTA (JEE/NEET/CUET): https://nta.ac.in
  - UPSC NDA: https://upsc.gov.in

---

## Phase 8 — Educational Imagery

- Add 3–4 royalty-free Unsplash hero/section images (students, books, classroom) to study material pages and the main hub.
- Use `loading="lazy"` and proper `alt` text.

---

## Phase 9 — SEO Polish

- Verify each new page has unique title, meta description, single H1, and natural keyword usage.
- Add JSON-LD `Course` / `EducationalOrganization` schema where appropriate.

---

## Technical Notes

- New shared components: `src/components/shared/WhatsAppButton.tsx`, `src/components/shared/ContactButton.tsx`, `src/components/shared/RelatedResources.tsx`, `src/components/shared/OfficialResources.tsx`.
- Edits: `Navbar.tsx`, `Footer.tsx`, `StudyMaterialPageTemplate.tsx`, `ResourcePageTemplate.tsx`, `CoursePageTemplate.tsx`, `studyMaterialData.ts`, all course + study material pages.
- No backend / DB changes required.
- All animations via existing `framer-motion` dep.

---

## Suggested Execution Order

Given the scope (~25+ files), I recommend executing in this order and pausing for your review after Phase 2:

1. **Now:** Phase 1 (buttons + breadcrumb fix) + Phase 2 (navbar dropdown) — most visible fixes.
2. **Next pass:** Phase 3 + 4 (course↔SM linking, UI polish).
3. **Final pass:** Phase 5–9 (FAQs, internal/external links, images, SEO).

Approve this plan and I'll start with Phase 1 + 2 immediately.