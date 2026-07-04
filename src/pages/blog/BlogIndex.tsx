import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Clock, Sparkles, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SEO from '@/components/shared/SEO';
import PostCard from '@/components/blog/PostCard';
import FeaturedHero from '@/components/blog/FeaturedHero';
import NewsletterCTA from '@/components/blog/NewsletterCTA';
import { POSTS, CATEGORIES, getFeaturedPost, getPopularPosts, getRecentlyUpdatedPosts, searchPosts } from '@/data/blog';
import type { CategorySlug } from '@/data/blog/categories';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 12;

const BlogIndex = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | CategorySlug>('all');
  const [page, setPage] = useState(1);

  const featured = getFeaturedPost();
  const popular = getPopularPosts(4);
  const recentlyUpdated = getRecentlyUpdatedPosts(4);

  const filtered = useMemo(() => {
    let list = searchPosts(query);
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory);
    return list;
  }, [query, activeCategory]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Rays Academy Blog',
      description: 'Educational blog by Rays Academy Bhopal — study strategies, board exam tips, JEE / NEET / NDA / CUET guides and local student resources.',
      url: 'https://www.raysacademybhopal.in/blog',
      publisher: {
        '@type': 'EducationalOrganization',
        name: 'Rays Academy',
        url: 'https://www.raysacademybhopal.in/',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.raysacademybhopal.in/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.raysacademybhopal.in/blog' },
      ],
    },
  ];

  return (
    <>
      <SEO
        title="Rays Academy Blog — Study Guides, Exam Tips & Educational Insights | Bhopal"
        description="Educational blog by Rays Academy Bhopal: study strategies, Class 10 & 12 board tips, IIT-JEE, NEET, NDA and CUET preparation guides, and local resources for Bhopal students."
        canonical="/blog"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-blue-800 to-primary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1.5px, transparent 1.5px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-bold uppercase tracking-wider mb-5">
              <BookOpen className="w-3.5 h-3.5" /> Rays Academy Knowledge Center
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Study smarter. <span className="text-accent">Score higher.</span>
            </h1>
            <p className="text-lg text-white/85 mb-8 max-w-2xl leading-relaxed">
              In-depth study guides, board exam strategies and preparation blueprints for JEE, NEET, NDA, CUET — written by the Rays Academy team in Bhopal.
            </p>
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search articles — 'NEET biology', 'class 10 timetable'…"
                className="pl-12 h-14 text-primary bg-white border-none text-base"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured */}
        {featured && activeCategory === 'all' && !query && page === 1 && (
          <FeaturedHero post={featured} />
        )}

        {/* Category filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Explore by category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveCategory('all'); setPage(1); }}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-primary hover:bg-primary/10',
              )}
            >
              All Posts ({POSTS.length})
            </button>
            {CATEGORIES.map((c) => {
              const count = POSTS.filter((p) => p.category === c.slug).length;
              if (!count) return null;
              const isActive = activeCategory === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => { setActiveCategory(c.slug); setPage(1); }}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-1.5',
                    isActive ? 'bg-accent text-accent-foreground' : 'bg-muted text-primary hover:bg-accent/10',
                  )}
                >
                  <span>{c.emoji}</span>
                  {c.label}
                  <span className="opacity-70 text-xs">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          <main>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-primary">
                {activeCategory === 'all' ? 'Latest Articles' : `${CATEGORIES.find((c) => c.slug === activeCategory)?.label} Articles`}
                <span className="ml-2 text-sm font-normal text-muted-foreground">({filtered.length})</span>
              </h2>
            </div>
            {paginated.length === 0 ? (
              <div className="p-10 text-center rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">No articles match "{query}". Try another search or reset filters.</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-5">
                  {paginated.map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
                {paginated.length < filtered.length && (
                  <div className="text-center mt-8">
                    <Button onClick={() => setPage((p) => p + 1)} size="lg" className="rounded-full bg-primary hover:bg-primary/90">
                      Load more articles
                    </Button>
                  </div>
                )}
              </>
            )}

            <NewsletterCTA />
          </main>

          <aside className="space-y-8">
            {popular.length > 0 && (
              <div className="p-5 rounded-2xl border border-border bg-white">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary mb-3">
                  <TrendingUp className="w-4 h-4 text-accent" /> Popular Articles
                </h3>
                <div className="space-y-1">
                  {popular.map((p) => <PostCard key={p.slug} post={p} variant="compact" />)}
                </div>
              </div>
            )}

            {recentlyUpdated.length > 0 && (
              <div className="p-5 rounded-2xl border border-border bg-white">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary mb-3">
                  <Clock className="w-4 h-4 text-accent" /> Recently Updated
                </h3>
                <div className="space-y-1">
                  {recentlyUpdated.map((p) => <PostCard key={p.slug} post={p} variant="compact" />)}
                </div>
              </div>
            )}

            <div className="p-5 rounded-2xl bg-gradient-to-br from-secondary to-blue-50 border border-primary/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Related Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/study-material" className="text-primary hover:text-accent font-semibold">All Study Material →</Link></li>
                <li><Link to="/study-material/previous-year-questions" className="text-primary hover:text-accent">Previous Year Questions →</Link></li>
                <li><Link to="/study-material/sample-papers" className="text-primary hover:text-accent">Sample Papers →</Link></li>
                <li><Link to="/study-material/formula-sheets" className="text-primary hover:text-accent">Formula Sheets →</Link></li>
                <li><Link to="/rsat" className="text-primary hover:text-accent">RSAT Scholarship Test →</Link></li>
                <li><Link to="/contact" className="text-primary hover:text-accent">Book Free Counselling →</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogIndex;
