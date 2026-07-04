import PostCard from './PostCard';
import type { BlogPost } from '@/data/blog/types';

const RelatedPosts = ({ posts }: { posts: BlogPost[] }) => {
  if (!posts.length) return null;
  return (
    <section className="mt-14">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">You may also like</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
