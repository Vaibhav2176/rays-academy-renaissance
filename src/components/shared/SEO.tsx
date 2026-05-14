import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const SITE = 'https://raysacademy.lovable.app';

const SEO = ({ title, description, canonical, jsonLd }: SEOProps) => {
  const href = canonical ? (canonical.startsWith('http') ? canonical : `${SITE}${canonical}`) : undefined;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {href && <link rel="canonical" href={href} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {href && <meta property="og:url" content={href} />}
      <meta property="og:type" content="website" />
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(b)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
