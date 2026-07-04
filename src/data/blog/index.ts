import type { BlogPost } from './types';
import type { CategorySlug } from './categories';

// Auto-import every post file. Adding a new blog = drop a file in ./posts.
const modules = import.meta.glob<{ default: BlogPost }>('./posts/*.ts', { eager: true });

export const POSTS: BlogPost[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export const getPostBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

export const getPostsByCategory = (category: CategorySlug) =>
  POSTS.filter((p) => p.category === category);

export const getRelatedPosts = (post: BlogPost, limit = 3) =>
  POSTS.filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, limit);

export const getFeaturedPost = () => POSTS.find((p) => p.featured) ?? POSTS[0];

export const getPopularPosts = (limit = 5) =>
  POSTS.filter((p) => p.popular).slice(0, limit);

export const getRecentlyUpdatedPosts = (limit = 5) =>
  [...POSTS]
    .filter((p) => p.updatedAt)
    .sort((a, b) => ((a.updatedAt ?? a.publishedAt) < (b.updatedAt ?? b.publishedAt) ? 1 : -1))
    .slice(0, limit);

export const searchPosts = (query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return POSTS;
  return POSTS.filter((p) =>
    [p.title, p.description, p.excerpt, ...p.tags].join(' ').toLowerCase().includes(q),
  );
};

export * from './categories';
export * from './types';
