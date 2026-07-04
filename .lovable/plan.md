# Rays Academy Blog System — Implementation Plan

## Architecture (build once, scales to hundreds)

A single data-driven blog engine. Adding a new post = one new `.mdx`-style entry in `src/data/blog/posts/`. No new route file per post.

```
src/
  data/blog/
    categories.ts          // 12 categories incl. "Bhopal Education"
    posts/                 // one file per post, default-exports BlogPost
      how-to-score-95-class-10.ts
      best-neet-study-plan.ts
      ...30 files
    index.ts               // aggregates + sorts + exports helpers
  pages/blog/
    BlogIndex.tsx          // /blog
    BlogPost.tsx           // /blog/:slug (single dynamic route)
    BlogCategory.tsx       // /blog/category/:slug
  components/blog/
    PostCard.tsx
    FeaturedHero.tsx
    CategoryFilter.tsx
    SearchBar.tsx
    TableOfContents.tsx    // sticky, scrollspy
    ReadingProgress.tsx    // top progress bar
    RelatedPosts.tsx
    ShareButtons.tsx
    NewsletterCTA.tsx
    PostBody.tsx           // renders structured content blocks
```

Each post is a typed object — not raw HTML — so structure stays consistent:
```ts
type BlogPost = {
  slug: string; title: string; description: string;
  category: CategorySlug; tags: string[];
  publishedAt: string; updatedAt?: string;
  readingMinutes: number; heroImage: string;
  toc: { id: string; label: string }[];
  sections: Section[];      // intro | h2 | h3 | list | quote | image | cta | faq | keyTakeaways
  faq: { q: string; a: string }[];
  keyTakeaways: string[];
  relatedCourses: string[]; // course slugs → auto-linked CTAs
  relatedMaterials: string[];
  externalRefs?: { label: string; url: string }[];
};
```

`PostBody` renders `sections[]`, auto-injects internal links to courses/study material based on `relatedCourses`/`relatedMaterials`, and emits proper `<h1>/<h2>/<h3>` hierarchy.

## Routes

Added to `src/App.tsx`:
- `/blog` → BlogIndex
- `/blog/category/:slug` → BlogCategory
- `/blog/:slug` → BlogPost

## Nav / Footer / Sitemap
- Add "Blog" to `Navbar.tsx` (desktop + mobile menu)
- Add to `Footer.tsx` quick links
- Add every post + category to `public/sitemap.xml`
- Add every post to `public/llms.txt`

## SEO per post (via existing `SEO` component + react-helmet-async)
- Unique title / description / canonical / OG / Twitter tags
- Article JSON-LD (headline, author "Rays Academy Team", datePublished, dateModified, image, publisher)
- BreadcrumbList JSON-LD
- Single H1, semantic `<article>`, `<nav>` for TOC, `<aside>` for related

## Post UX
- Sticky TOC (desktop) / collapsible (mobile) with scrollspy
- Top reading progress indicator
- Fade-in section animations (framer-motion, matches site language)
- Share buttons: WhatsApp, X, LinkedIn, Copy link
- "You may also like" — 3 posts from same category
- CTA card mid-article + end-of-article linking to matched course
- Lazy-loaded images with proper `alt`

## Blog Index UX
- Hero with search bar
- Category chips (filter)
- Featured post (top of list, editorially flagged)
- Latest / Popular / Recently Updated tabs (derived from data)
- Grid of responsive cards with hover lift
- Pagination (12 per page)
- Newsletter CTA (uses existing FormSubmit integration → notifies vaibhav2176a@gmail.com)

## Content — 30 original posts (1200–2500 words each)

**National (20):**
1. How to Score 95%+ in Class 10 Board Exams
2. Complete Class 12 Board Preparation Guide
3. Best Study Timetable for Students
4. Time Management for Board Exams
5. How to Prepare for IIT JEE
6. Complete NEET Preparation Strategy
7. NDA Preparation Guide
8. CUET Preparation Tips
9. Common Mistakes Students Make During Exams
10. Effective Revision Techniques
11. Importance of NCERT Books
12. Physics Preparation Tips
13. Chemistry Preparation Tips
14. Biology Preparation Tips
15. Mathematics Problem Solving Techniques
16. Last Month Board Exam Strategy
17. Why Previous Year Question Papers Matter
18. Benefits of Joining Coaching Classes
19. Exam Stress Management
20. Career Options After Class 12

**Bhopal / Local (10):**
21. Best Coaching Institute in Bhopal for Classes 6–12
22. How to Choose the Right Coaching Institute in Bhopal
23. Top Tips for MP Board Students
24. Best IIT-JEE Coaching in Bhopal — Student Guide
25. NEET Preparation in Bhopal — Complete Guide
26. NDA Coaching in Bhopal — Strategy & Career Guide
27. CUET Preparation in Bhopal — Complete Guide
28. Board Exam Preparation Tips for Students in Bhopal
29. Why Concept-Based Learning Helps Students Score Better
30. Common Mistakes Bhopal Students Make During Board Prep

Every post carries genuine educational depth, natural internal links to matching courses (`/iit-jee-coaching-bhopal`, `/neet-coaching-bhopal`, etc.) and study material (`/study-material/*`), and — where relevant — authoritative external links (NCERT, CBSE, NTA, official JEE/NEET/NDA/CUET portals) opened in new tabs with `rel="noopener"`.

## Internal linking network
- Every post auto-links to matched course + study material pages
- Course pages (`CoursePageTemplate`) get a new "From our blog" strip pulling 3 posts by category
- Study Material templates gain the same strip
- About / Faculty / Results already linked from post CTAs where relevant

## Images
- One hero image per post via `imagegen` (education-themed, matches navy/red brand) — 30 hero images total, generated in parallel batches
- Reused iconography (Lucide) for section headers to keep bundle small

## Sitemap / robots
- Extend `public/sitemap.xml` with `/blog`, each `/blog/category/*`, each `/blog/<slug>` (34 new URLs)
- No robots change (blog is public)

## Delivery order (single implementation pass)
1. Data model + categories + helpers
2. Components (cards, TOC, progress, share, related, newsletter)
3. Pages (index, category, post) + routes
4. Nav + Footer + Sitemap updates
5. Generate 30 hero images
6. Write all 30 posts as typed data files
7. Add "From our blog" strip to course + study material templates
8. Run SEO rescan and mark findings fixed

## Scope note
30 original 1200–2500-word articles = ~50–70k words of hand-written educational content. I will write all 30 in this pass; expect a long build. Deliverable is production-ready — no placeholders.
