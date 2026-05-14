# Rays Academy — Study Material Ecosystem Refinement Plan

## Phase 1 — Critical Fixes

**1.1 CTA buttons (Contact Us readability)**
- `StudyMaterial.tsx` and any remaining pages still use raw `Button` with `variant="outline"` on dark backgrounds. Replace with the shared `<ContactButton />` and `<WhatsAppButton />` from `src/components/shared/CTAButtons.tsx`.
- Audit: `StudyMaterial.tsx`, `CoursePageTemplate.tsx`, `ResourcePageTemplate.tsx`, `StudyMaterialPageTemplate.tsx`, `Index.tsx`, `Contact.tsx`, `About.tsx`, `Courses.tsx`, `Faculty.tsx`, `Results.tsx`. Solid fills, white text, shadow, no hover-only contrast.

**1.2 Navbar fixes**
- Make “Courses” and “Study Material” triggers themselves clickable links (route to `/courses` and `/study-material`) while still showing dropdown on hover/chevron click. Use a split: parent `<Link>` + chevron toggles dropdown.
- Tighten desktop spacing: reduce `gap-x` and link padding so all 8 items fit on one line at ≥1024px.
- Fix invisible navbar on new pages: root cause is `bg-background/text-foreground` resolving against a missing/white theme on routes that don't import `Layout`. Verify every new study-material/PYQ route is wrapped in `<Layout>` in `App.tsx`. Set explicit `bg-white text-primary` fallback on `<Navbar>` so it never goes invisible if theme variables fail.

**1.3 Footer cleanup**
- Switch the 5-col grid to `lg:grid-cols-12` with proportional spans (Brand 3 / Quick 2 / Courses 3 / Resources 2 / Contact 2) and add `min-w-0 break-words` to prevent overflow.
- Tighten link list spacing (`space-y-2`), wrap long contact strings, ensure `overflow-hidden` on the outer footer.

## Phase 2 — Reusable building blocks

Create:
- `src/components/shared/DownloadPlaceholderDialog.tsx` — modal saying *“PDF is currently unavailable. We will upload the study material very soon.”* Includes icon, “Back to Resources” link, and `<WhatsAppButton />`. Triggered by a new `<DownloadButton label="..." />` wrapper used everywhere a download appears.
- `src/components/shared/SectionHeader.tsx` — consistent animated section heading (eyebrow + h2 + lead).
- `src/components/shared/FAQAccordion.tsx` — wraps shadcn Accordion with motion fade-in and JSON-LD FAQPage schema injection.
- `src/components/shared/AnimatedCard.tsx` — hover-lift card with stagger support.
- `src/components/shared/PageJsonLd.tsx` — injects Course / Article / FAQPage / BreadcrumbList JSON-LD.

Install `react-helmet-async` (already noted in head-meta guide) and wrap `main.tsx` with `HelmetProvider` so per-route titles/meta/canonicals/JSON-LD work cleanly.

## Phase 3 — Rich educational content templates

Rebuild `ResourcePageTemplate.tsx` (and a new `RichResourcePageTemplate`) inspired by learncbse.in layout:

```text
[ Hero with gradient + breadcrumb ]
[ Intro paragraph block (2–3 paragraphs, SEO copy) ]
[ "Why solve these papers?" — 4-card benefits grid ]
[ Subject / chapter-wise download grid (DownloadButton cards) ]
[ Preparation strategy — numbered steps with icons ]
[ Exam weightage / difficulty highlights ]
[ Tips section — bullet list with check icons ]
[ Related resources cross-links (RelatedResources) ]
[ FAQ accordion (FAQAccordion + JSON-LD) ]
[ Final CTA band (Contact + WhatsApp) ]
```

A central `src/data/resourceContent.ts` will hold per-page content (intro, benefits, tips, FAQs, downloads) keyed by slug — keeps pages thin and editable.

## Phase 4 — Class-wise PYQ & Sample Paper pages

New pages, each rendered through `RichResourcePageTemplate` with unique data:

- `/study-material/pyq/class-9`, `class-10`, `class-11`, `class-12`
- `/study-material/pyq/neet`, `jee`, `nda`
- `/study-material/sample-papers/class-9`, `class-10`, `class-11`, `class-12`
- `/study-material/sample-papers/neet`, `jee`, `nda`

Existing index pages (`PreviousYearQuestions.tsx`, `SamplePapers.tsx`) become hubs that link out to these. `FormulaSheets`, `RevisionNotes`, `ImportantQuestions`, `NCERTPages` upgraded to the same rich layout.

Files: 14 new page files under `src/pages/study-material/pyq/` and `sample-papers/`, plus routes in `App.tsx`.

## Phase 5 — Internal linking + SEO

- Every chapter / subject mention links to the matching course or material page via `getStudyMaterialPath` / a new `getCoursePath` helper.
- Each rich page renders a “Related” section (Courses + Study Material + Resources) and contextual prose paragraphs with inline `<Link>`s.
- Per-route `<Helmet>` with unique title (<60c), meta description (<160c), canonical, og:*. Single `<h1>`. Add JSON-LD: `Course` for course pages, `Article` + `FAQPage` + `BreadcrumbList` for resource pages. Keep "Bhopal coaching" phrasing natural.

## Phase 6 — Animations & visuals

- Stagger-fade for card grids (Framer Motion variants).
- Hover scale on download cards, gradient borders on featured items.
- Floating decorative blobs in hero (`absolute blur-3xl`).
- Add 2–3 royalty-free Unsplash educational images per rich page (loaded lazily, descriptive alt).

## Phase 7 — QA

- Smoke-check each new route renders with Layout (navbar visible).
- Verify no console errors after `react-helmet-async` install.
- Visual check on 1119px viewport and mobile.

## Technical notes

- Routing: ~14 new lazy-loaded routes added to `App.tsx`.
- No DB/schema changes.
- New deps: `react-helmet-async`.
- All colors via semantic tokens (`bg-primary`, `text-accent-foreground`, etc.) — no raw hex outside the WhatsApp brand color.

## Out of scope

- Real PDF uploads (placeholder modal stands in).
- Payment / auth changes (existing system retained).
- Backend / Supabase changes.
