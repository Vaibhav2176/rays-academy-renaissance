import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/data/blog/types';
import { getCategory } from '@/data/blog/categories';
import { cn } from '@/lib/utils';

interface Props {
  post: BlogPost;
  variant?: 'default' | 'compact';
}

const PostCard = ({ post, variant = 'default' }: Props) => {
  const category = getCategory(post.category);
  const gradient = post.heroGradient ?? category.gradient;

  if (variant === 'compact') {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
      >
        <div className={cn('w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl', gradient)}>
          <span aria-hidden>{post.heroEmoji}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-accent uppercase tracking-wide">{category.short}</p>
          <p className="text-sm font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
            {post.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{post.readingMinutes} min read</p>
        </div>
      </Link>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="group h-full"
    >
      <Link to={`/blog/${post.slug}`} className="block h-full">
        <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className={cn('relative h-44 bg-gradient-to-br flex items-center justify-center overflow-hidden', gradient)}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <span className="text-6xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500" aria-hidden>
              {post.heroEmoji}
            </span>
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold text-primary uppercase tracking-wider">
              {category.label}
            </span>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-primary leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readingMinutes} min</span>
              <span className="flex items-center gap-1 text-accent font-semibold group-hover:gap-2 transition-all">
                Read <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default PostCard;
