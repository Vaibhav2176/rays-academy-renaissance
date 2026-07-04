import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import SEO from '@/components/shared/SEO';
import PostBody from '@/components/blog/PostBody';
import TableOfContents from '@/components/blog/TableOfContents';
import ReadingProgress from '@/components/blog/ReadingProgress';
import ShareButtons from '@/components/blog/ShareButtons';
import KeyTakeaways from '@/components/blog/KeyTakeaways';
import FaqSection from '@/components/blog/FaqSection';
import RelatedPosts from '@/components/blog/RelatedPosts';
import NewsletterCTA from '@/components/blog/NewsletterCTA';
import { getPostBySlug, getRelatedPosts } from '@/data/blog';
import { getCategory } from '@/data/blog/categories';
import { getCourseLink } from '@/lib/blogCourseLinks';
import { cn } from '@/lib/utils';

const SITE = 'https://www.raysacademybhopal.in';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const category = getCategory(post.category);
  const gradient = post.heroGradient ?? category.gradient;
  const canonical = `/blog/${post.slug}`;
  const url = `${SITE}${canonical}`;
  const related = getRelatedPosts(post, 3);

  const publishedIso = new Date(post.publishedAt).toISOString();
  const updatedIso = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedIso;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      author: { '@type': 'Organization', name: 'Rays Academy Team', url: `${SITE}/about` },
      publisher: {
        '@type': 'EducationalOrganization',
        name: 'Rays Academy',
        url: SITE,
        logo: { '@type': 'ImageObject', url: `${SITE}/favicon.ico` },
      },
      datePublished: publishedIso,
      dateModified: updatedIso,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      articleSection: category.label,
      keywords: post.tags.join(', '),
      inLanguage: 'en-IN',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 3, name: category.label, item: `${SITE}/blog/category/${category.slug}` },
        { '@type': 'ListItem', position: 4, name: post.title, item: url },
      ],
    },
    ...(post.faq.length
      ? [{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }]
      : []),
  ];

  return (
    <>
      <SEO title={`${post.title} | Rays Academy Blog`} description={post.description} canonical={canonical} jsonLd={jsonLd} />
      <ReadingProgress />

      <article>
        {/* Hero */}
        <header className={cn('relative overflow-hidden text-white', 'bg-gradient-to-br', gradient)}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
          <div className="container mx-auto px-4 py-14 md:py-20 relative">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/80 mb-5 flex-wrap">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/blog" className="hover:text-white">Blog</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to={`/blog/category/${category.slug}`} className="hover:text-white">{category.label}</Link>
            </nav>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-wider mb-4">
                <span>{post.heroEmoji}</span> {category.label}
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                {post.title}
              </h1>
              <p className="text-lg text-white/90 leading-relaxed mb-6 max-w-3xl">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Rays Academy Team</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readingMinutes} min read</span>
                {post.updatedAt && (
                  <span className="px-2 py-0.5 rounded-full bg-white/15 text-xs">Updated {new Date(post.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                )}
              </div>
            </motion.div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-10 lg:py-14">
          <div className="grid lg:grid-cols-[280px_1fr] gap-10">
            <TableOfContents items={post.toc} />

            <div className="min-w-0 max-w-3xl">
              <ShareButtons url={url} title={post.title} />
              <hr className="my-6 border-border" />

              <PostBody sections={post.sections} />

              <KeyTakeaways items={post.keyTakeaways} />

              {post.externalRefs && post.externalRefs.length > 0 && (
                <section className="mt-8 p-5 rounded-2xl border border-border bg-muted/40">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Official references</h3>
                  <ul className="space-y-2 text-sm">
                    {post.externalRefs.map((r, i) => (
                      <li key={i}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer nofollow" className="text-accent hover:underline font-medium">
                          {r.label} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <FaqSection items={post.faq} />

              {/* Related courses / materials */}
              {(post.relatedCourses?.length || post.relatedMaterials?.length) && (
                <section className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-secondary to-blue-50 border border-primary/10">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-accent" />
                    <h2 className="text-xl md:text-2xl font-bold text-primary">Explore related courses & material</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {post.relatedCourses?.map((slug) => {
                      const link = getCourseLink(slug);
                      if (!link) return null;
                      return (
                        <Link key={slug} to={link.href} className="group flex items-center justify-between p-4 rounded-xl bg-white border border-border hover:border-accent hover:shadow-md transition-all">
                          <span className="font-semibold text-primary group-hover:text-accent">{link.label}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </Link>
                      );
                    })}
                    {post.relatedMaterials?.map((m, i) => (
                      <Link key={i} to={m.href} className="group flex items-center justify-between p-4 rounded-xl bg-white border border-border hover:border-accent hover:shadow-md transition-all">
                        <span className="font-semibold text-primary group-hover:text-accent">{m.label}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-10 pt-6 border-t border-border">
                <ShareButtons url={url} title={post.title} />
              </div>

              <NewsletterCTA />
              <RelatedPosts posts={related} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;
