import { useState } from 'react';
import { Mail, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitToFormSubmit } from '@/lib/formsubmit';
import { toast } from '@/hooks/use-toast';

const NewsletterCTA = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await submitToFormSubmit({
        formType: 'Newsletter Subscription',
        email,
      });
      setStatus('success');
      setEmail('');
      toast({ title: 'Subscribed!', description: 'You\'re on the list — we\'ll email new study guides monthly.' });
    } catch {
      setStatus('idle');
      toast({ title: 'Something went wrong', description: 'Please try again in a moment.', variant: 'destructive' });
    }
  };

  return (
    <section className="my-12 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary via-blue-800 to-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="relative grid md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" /> Stay updated
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">New study guides, straight to your inbox</h2>
          <p className="text-white/85 text-sm">Get board strategies, JEE / NEET tips and free study material from the Rays Academy team.</p>
        </div>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="bg-white text-primary placeholder:text-muted-foreground border-none h-12"
            disabled={status !== 'idle'}
          />
          <Button
            type="submit"
            disabled={status !== 'idle'}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12 px-6 rounded-md sm:rounded-md whitespace-nowrap"
          >
            {status === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {status === 'success' && <Check className="w-4 h-4 mr-2" />}
            {status === 'success' ? 'Subscribed' : 'Subscribe'}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterCTA;
