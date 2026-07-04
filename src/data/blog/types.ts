import type { CategorySlug } from './categories';

export type Section =
  | { type: 'p'; text: string }
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'callout'; variant?: 'info' | 'tip' | 'warning'; title?: string; text: string }
  | { type: 'cta'; title: string; text: string; href: string; label: string };

export interface FAQ {
  q: string;
  a: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;      // meta description
  excerpt: string;          // shown on cards
  category: CategorySlug;
  tags: string[];
  publishedAt: string;      // ISO date
  updatedAt?: string;
  readingMinutes: number;
  featured?: boolean;
  popular?: boolean;
  heroEmoji: string;        // used in gradient hero card
  heroGradient?: string;    // tailwind classes override
  keyTakeaways: string[];
  toc: { id: string; label: string }[];
  sections: Section[];
  faq: FAQ[];
  relatedCourses?: string[];    // course slugs, mapped in courseLinks
  relatedMaterials?: { label: string; href: string }[];
  externalRefs?: { label: string; url: string }[];
}
