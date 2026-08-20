import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  IndianRupee,
  CalendarClock,
  Bus,
  CheckCircle2,
  Snowflake,
  ShieldCheck,
  Users,
} from 'lucide-react';
import SEO from '@/components/shared/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContactButton, WhatsAppButton } from '@/components/shared/CTAButtons';

const ADDRESS = 'Plot 2, Gufa Mandir Rd, Jain Nagar, Nayapura, Lalghati, Bhopal, MP 462030';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Rays+Academy+Gufa+Mandir+Road+Lalghati+Bhopal';

const batches = [
  { name: 'Classes 6–8 (Foundation)', timing: 'After school hours, weekday batches', href: '/courses/class-6-8' },
  { name: 'Class 9', timing: 'Morning & evening batches', href: '/courses/class-9' },
  { name: 'Class 10 (Board)', timing: 'Morning & evening batches + Sunday tests', href: '/courses/class-10' },
  { name: 'Class 11 (PCM / PCB)', timing: 'Morning & evening batches', href: '/courses/class-11' },
  { name: 'Class 12 (Board)', timing: 'Morning & evening batches + Sunday tests', href: '/courses/class-12' },
  { name: 'IIT-JEE (Main & Advanced)', timing: 'Integrated with Class 11 & 12 batches', href: '/courses/iit-jee' },
  { name: 'NEET', timing: 'Integrated with Class 11 & 12 batches', href: '/courses/neet' },
  { name: 'NDA', timing: 'Dedicated written-exam batch', href: '/courses/nda' },
  { name: 'CUET', timing: 'Class 12 & repeater batch', href: '/courses/cuet' },
];

const facilities = [
  { icon: Snowflake, label: 'AC classrooms with smart panels' },
  { icon: ShieldCheck, label: 'CCTV-monitored campus' },
  { icon: Users, label: 'Small batches with personal attention' },
  { icon: CheckCircle2, label: '5 days of free trial classes' },
];

const areas = [
  'Lalghati',
  'Nayapura',
  'Jain Nagar',
  'Halalpur',
  'Karond',
  'Bairagarh',
  'Koh-e-Fiza',
  'Idgah Hills',
  'VIP Road',
  'Airport Road',
];

const faqs = [
  {
    q: 'Where is Rays Academy located in Bhopal?',
    a: `Rays Academy is at ${ADDRESS}, on Gufa Mandir Road in Lalghati — a short drive from Bairagarh, Karond, Koh-e-Fiza and the Airport Road side of Bhopal.`,
  },
  {
    q: 'What are the coaching fees at Rays Academy Bhopal?',
    a: 'Fees depend on the class, stream and the number of subjects you take, so we share the exact structure after a short counselling call. Call +91 9303333490 or message us on WhatsApp and we will send the fee structure for your class the same day.',
  },
  {
    q: 'What are the timings and working hours?',
    a: 'The institute is open Monday to Saturday, 9:00 AM to 7:00 PM. Most classes run in morning and evening batches so school students can attend comfortably.',
  },
  {
    q: 'Can I attend a class before joining?',
    a: 'Yes. We offer 5 days of free trial classes so you can sit in the actual batch, meet the faculty and decide before paying anything.',
  },
  {
    q: 'Which boards do you teach?',
    a: 'We teach CBSE, ICSE and MP Board syllabi for Classes 6 to 12, plus dedicated preparation for IIT-JEE, NEET, NDA, CUET and Olympiads.',
  },
];

const CoachingInBhopal = () => {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      '@id': 'https://www.raysacademybhopal.in/#organization',
      name: 'Rays Academy',
      alternateName: 'Rays Academy Bhopal',
      url: 'https://www.raysacademybhopal.in/',
      foundingDate: '2006',
      description:
        'Coaching institute in Lalghati, Bhopal for Classes 6 to 12 (CBSE, ICSE, MP Board) and competitive exams including IIT-JEE, NEET, NDA and CUET.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot 2, Gufa Mandir Rd, Jain Nagar, Nayapura, Lalghati',
        addressLocality: 'Bhopal',
        addressRegion: 'Madhya Pradesh',
        postalCode: '462030',
        addressCountry: 'IN',
      },
      telephone: '+91-9303333490',
      email: 'raysacademybhopal@gmail.com',
      areaServed: areas.map((a) => ({ '@type': 'Place', name: `${a}, Bhopal` })),
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '19:00',
        },
      ],
      hasMap: MAPS_URL,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.raysacademybhopal.in/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Coaching Classes in Bhopal',
          item: 'https://www.raysacademybhopal.in/coaching-classes-in-bhopal',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Coaching Classes in Bhopal | Fees, Timings & Location"
        description="Rays Academy, Gufa Mandir Road, Lalghati Bhopal — batch timings, facilities, areas we serve and how to get the fee structure for Class 6-12, JEE, NEET, NDA and CUET."
        canonical="/coaching-classes-in-bhopal"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge className="bg-accent text-accent-foreground mb-4">Lalghati, Bhopal · Since 2006</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Coaching Classes in Bhopal — Fees, Batch Timings &amp; Location
            </h1>
            <p className="text-lg text-primary-foreground/85 mb-8">
              Rays Academy has taught Bhopal students since 2006 on Gufa Mandir Road, Lalghati. Everything you need
              before visiting us — where we are, when batches run, what the campus offers, and how to get the exact
              fee structure for your class.
            </p>
            <div className="flex flex-wrap gap-3">
              <ContactButton />
              <WhatsAppButton />
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="bg-white text-primary hover:bg-white/90 font-semibold rounded-full">
                  <MapPin className="w-4 h-4 mr-2" /> Get Directions
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key details */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: MapPin, title: 'Address', body: ADDRESS },
              { icon: Clock, title: 'Working Hours', body: 'Monday – Saturday, 9:00 AM – 7:00 PM' },
              { icon: Phone, title: 'Phone', body: '+91 9303333490 · +91 7987081894' },
              { icon: Mail, title: 'Email', body: 'raysacademybhopal@gmail.com' },
            ].map((item) => (
              <Card key={item.title} className="border-border h-full">
                <CardContent className="p-5">
                  <item.icon className="w-6 h-6 text-accent mb-3" />
                  <h2 className="font-semibold text-primary mb-1 text-base">{item.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="py-14 bg-secondary/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="w-5 h-5 text-accent" />
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Fee structure</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our fees depend on the class you are joining, the stream (PCM, PCB or Commerce), the number of subjects,
            and whether you take an integrated entrance-exam batch alongside school coaching. Because of that we share
            the exact structure after a short counselling conversation instead of publishing a single number that would
            not apply to your case.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Call us on <a href="tel:+919303333490" className="text-primary font-semibold hover:text-accent">+91 9303333490</a>{' '}
            or send a WhatsApp message with your class and stream, and we will send the fee structure, batch options and
            the installment schedule the same day. Every enrolment also includes{' '}
            <strong className="text-primary">5 days of free trial classes</strong> — attend the real batch first, decide
            after.
          </p>
          <div className="flex flex-wrap gap-3">
            <ContactButton label="Request Fee Structure" />
            <WhatsAppButton message="Hi Rays Academy, please share the fee structure and batch timings." />
          </div>
        </div>
      </section>

      {/* Batches */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <CalendarClock className="w-5 h-5 text-accent" />
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Batches &amp; timings</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((b) => (
              <Link key={b.name} to={b.href} className="group">
                <Card className="border-border h-full transition-shadow hover:shadow-lg">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-primary group-hover:text-accent transition-colors mb-1">
                      {b.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{b.timing}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-5">
            Exact batch slots change each session as school timings shift. Confirm the current timing for your class on
            a call or on <Link to="/contact" className="text-primary font-semibold hover:text-accent">our contact page</Link>.
          </p>
        </div>
      </section>

      {/* Facilities + areas */}
      <section className="py-14 bg-secondary/40">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-5">On campus</h2>
            <ul className="space-y-3">
              {facilities.map((f) => (
                <li key={f.label} className="flex items-start gap-3">
                  <f.icon className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Bus className="w-5 h-5 text-accent" />
              <h2 className="text-2xl md:text-3xl font-bold text-primary">Students travel to us from</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {areas.map((a) => (
                <span key={a} className="px-3 py-1.5 rounded-full bg-white border border-border text-sm text-primary">
                  {a}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We are on Gufa Mandir Road in Lalghati, well connected to Bairagarh, Karond, Halalpur bus stand and the
              Airport Road side of Bhopal.
            </p>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-5">Find us on the map</h2>
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
            <iframe
              title="Rays Academy Bhopal location map"
              src="https://www.google.com/maps?q=Gufa%20Mandir%20Road%2C%20Lalghati%2C%20Bhopal&output=embed"
              width="100%"
              height="380"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-secondary/40">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <Card key={f.q} className="border-border">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-primary mb-2">{f.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ContactButton label="Book Free Counselling" />
            <WhatsAppButton />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoachingInBhopal;
