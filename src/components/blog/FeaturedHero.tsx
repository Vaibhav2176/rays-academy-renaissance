import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import type { BlogPost } from '@/data/blog/types';
import { getCategory } from '@/data/blog/categories';
import { cn } from '@/lib/utils';

const FeaturedHero = ({ post }: { post: BlogPost }) => {
  const category = getCategory(post.category);
  const gradient = post.heroGradient ?? category.gradient;
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <Link to={`/blog/${post.slug}`} className="block group">
        <div className="grid md:grid-cols-2 gap-6 items-stretch rounded-3xl overflow-hidden border border-border bg-white shadow-lg">
          <div className={cn('relative min-h-[280px] md:min-h-[380px] bg-gradient-to-br flex items-center justify-center overflow-hidden', gradient)}>
            <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
            <span className="text-8xl md:text-9xl drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500" aria-hidden>{post.heroEmoji}</span>
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-primary uppercase tracking-wider">
              Featured · {category.label}
            </span>
          </div>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight group-hover:text-accent transition-colors mb-4">
              {post.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3 md:line-clamp-4">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readingMinutes} min read</span>
              <span>By Rays Academy Team</span>
            </div>
            <span className="inline-flex items-center gap-2 text-accent font-semibold group-hover:gap-3 transition-all">
              Read the article <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.section>
  );
};

export default FeaturedHero;
