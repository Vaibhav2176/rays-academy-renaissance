import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/shared/SEO';
import PostCard from '@/components/blog/PostCard';
import { getCategory } from '@/data/blog/categories';
import type { CategorySlug } from '@/data/blog/categories';
import { getPostsByCategory } from '@/data/blog';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

const SITE = 'https://www.raysacademybhopal.in';

const BlogCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategory(slug as CategorySlug) : undefined;
  if (!category) return <Navigate to="/blog" replace />;

  const posts = getPostsByCategory(category.slug);
  const canonical = `/blog/category/${category.slug}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.label} — Rays Academy Blog`,
      description: category.description,
      url: `${SITE}${canonical}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 3, name: category.label, item: `${SITE}${canonical}` },
      ],
    },
  ];

  return (
    <>
      <SEO
        title={`${category.label} Articles — Rays Academy Blog | Bhopal`}
        description={`${category.description} Expert study guides and articles from Rays Academy Bhopal.`}
        canonical={canonical}
        jsonLd={jsonLd}
      />
      <section className={cn('relative overflow-hidden text-white bg-gradient-to-br', category.gradient)}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
        <div className="container mx-auto px-4 py-14 md:py-20 relative">
          <nav className="flex items-center gap-1.5 text-xs text-white/80 mb-5 flex-wrap">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{category.label}</span>
          </nav>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="text-5xl mb-4" aria-hidden>{category.emoji}</div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{category.label} — Study Guides & Articles</h1>
            <p className="text-lg text-white/90 leading-relaxed">{category.description}</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No articles yet in this category. <Link to="/blog" className="text-accent font-semibold">Browse all articles →</Link></p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default BlogCategory;
