import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronRight,
  Lock,
  Unlock,
  Star,
  CheckCircle,
  Lightbulb,
  Clock,
  Target,
  Award,
  Download,
  Loader2,
  Search,
  Filter,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ContactButton, WhatsAppButton } from '@/components/shared/CTAButtons';
import DownloadButton from '@/components/shared/DownloadPlaceholderDialog';
import StudentCouponBanner from '@/components/shared/StudentCouponBanner';
import SEO from '@/components/shared/SEO';
import { useToast } from '@/hooks/use-toast';
import {
  useStudyMaterialCatalog,
  CatalogStudyMaterial,
  downloadCatalogMaterial,
  triggerFileDownload,
} from '@/hooks/useStudyMaterials';
import { useUserMaterialAccess } from '@/hooks/useStudentEntitlements';
import PaidMaterialDialog from './PaidMaterialDialog';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

interface Subject {
  name: string;
  chapters: { name: string; isFree: boolean }[];
  icon?: string;
}

interface StudyMaterialPageTemplateProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  syllabusOverview: string;
  subjects: Subject[];
  importantTopics: string[];
  examTips: string[];
  faqs: { question: string; answer: string }[];
  localSeoKeywords: string[];
  pricePerChapter?: number;
  fullSubjectPrice?: number;
  fullCoursePrice?: number;
  breadcrumbLabel: string;
  courseSlug?: string;
  relatedResources?: { title: string; description: string; href: string }[];
  officialResources?: { name: string; url: string }[];
  canonical?: string;
}

const normalizeSubject = (str: string): string => {
  const s = str.toLowerCase();
  if (s.includes('math')) return 'maths';
  if (s.includes('physic')) return 'physics';
  if (s.includes('chem')) return 'chemistry';
  if (s.includes('bio')) return 'biology';
  if (s.includes('english')) return 'english';
  if (s.includes('social') || s.includes('sst')) return 'social-science';
  if (s.includes('general ability') || s.includes('gat')) return 'gat';
  return s.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

const StudyMaterialPageTemplate: React.FC<StudyMaterialPageTemplateProps> = ({
  title,
  metaTitle,
  metaDescription,
  heroDescription,
  syllabusOverview,
  subjects,
  importantTopics,
  examTips,
  faqs,
  localSeoKeywords,
  pricePerChapter = 49,
  fullSubjectPrice = 499,
  fullCoursePrice = 999,
  breadcrumbLabel,
  courseSlug,
  relatedResources,
  officialResources,
  canonical,
}) => {
  const { toast } = useToast();
  const { hasAccess, isAdmin } = useUserMaterialAccess();

  useEffect(() => {
    document.title = metaTitle;
  }, [metaTitle]);

  const effectiveCourseSlug =
    courseSlug ||
    (canonical
      ? canonical.replace(/^\/study-material\//, '').trim().toLowerCase()
      : undefined);

  // Fetch verified published study materials from the safe catalog view
  const { data: catalogItems = [], isLoading: catalogLoading } =
    useStudyMaterialCatalog({
      courseSlug: effectiveCourseSlug,
    });

  // Separate chapters and non-chapter reference materials
  const chapterCatalogItems = useMemo(
    () => catalogItems.filter((i) => i.resource_type === 'chapter'),
    [catalogItems]
  );
  const practiceCatalogItems = useMemo(
    () => catalogItems.filter((i) => i.resource_type !== 'chapter'),
    [catalogItems]
  );

  // Filters state
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [freeOnlyFilter, setFreeOnlyFilter] = useState<boolean>(false);
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');

  // Download & Modal state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [paidModalItem, setPaidModalItem] = useState<{
    id?: string;
    title: string;
    price: string;
    subject?: string;
    courseSlug?: string;
    subjectSlug?: string;
  } | null>(null);

  const handleDownload = async (item: CatalogStudyMaterial) => {
    const userHasAccess = item.is_free || hasAccess(item);
    if (!userHasAccess) {
      setPaidModalItem({
        id: item.id,
        title: item.title,
        price: `₹${((item.price_minor || 0) / 100).toFixed(0)}`,
        subject: item.subject || undefined,
        courseSlug: item.course_slug || courseSlug || undefined,
        subjectSlug: item.subject_slug || undefined,
      });
      return;
    }

    try {
      setDownloadingId(item.id);
      const { downloadUrl } = await downloadCatalogMaterial(item.id);
      triggerFileDownload(downloadUrl, item.title);
      toast({
        title: 'Download started!',
        description: `Starting download for "${item.title}".`,
      });
    } catch (err) {
      console.error('Download error:', err);
      toast({
        title: 'Download unavailable',
        description:
          err instanceof Error
            ? err.message
            : 'Unable to start download. Please try again shortly or contact support.',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  // Extract sections available for currently active subject
  const availableSections = useMemo(() => {
    const set = new Set<string>();
    chapterCatalogItems.forEach((m) => {
      if (m.section_name) set.add(m.section_name);
    });
    return Array.from(set).sort();
  }, [chapterCatalogItems]);

  // Filter subjects list
  const filteredSubjects = useMemo(() => {
    let result = subjects;
    if (selectedSubjectFilter !== 'all') {
      result = result.filter((s) => s.name === selectedSubjectFilter);
    }
    return result;
  }, [subjects, selectedSubjectFilter]);

  return (
    <div className="min-h-screen pt-16">
      <SEO title={metaTitle} description={metaDescription} canonical={canonical} />

      {/* Breadcrumb */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/study-material" className="hover:text-primary transition-colors">
              Study Material
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{breadcrumbLabel}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-10 md:py-14">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <Badge className="bg-accent text-accent-foreground mb-4">
              📚 Study Material
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-primary-foreground/80 mb-8">{heroDescription}</p>
            <div className="flex flex-wrap gap-4">
              <a href="#subjects">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full shadow-lg shadow-accent/30"
                >
                  <BookOpen className="w-5 h-5 mr-2" /> Explore Chapters
                </Button>
              </a>
              <a href="https://wa.me/917024057876" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold rounded-full shadow-lg shadow-green-600/30"
                >
                  <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 mr-2" /> WhatsApp Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Syllabus Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Syllabus Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed">{syllabusOverview}</p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Info - Complete 4-concept presentation */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Transparent Study Material Pricing</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Explore free chapters risk-free or unlock targeted revision materials and comprehensive passes
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {/* Option 1: Free Chapters */}
              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 flex flex-col justify-between shadow-sm">
                <CardContent className="p-5 text-center flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-3 text-green-600">
                      <Unlock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-1">Free Chapters</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      First 2 eligible chapters of every subject are free forever. Try our notes before making any purchase.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-green-200/60 dark:border-green-900/40">
                    <Badge className="bg-green-600 hover:bg-green-700 text-white font-semibold">FREE FOREVER</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Option 2: Single Chapter */}
              <Card className="border-accent/30 bg-accent/5 flex flex-col justify-between shadow-sm">
                <CardContent className="p-5 text-center flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3 text-accent">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-1">Single Chapter</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Unlock individual paid chapter notes and problem sets for targeted study and quick concept revision.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-accent/20">
                    <p className="text-2xl font-bold text-accent">₹{pricePerChapter}</p>
                    <span className="text-[11px] text-muted-foreground">per chapter note</span>
                  </div>
                </CardContent>
              </Card>

              {/* Option 3: Full Subject Bundle */}
              <Card className="border-primary/30 bg-primary/5 flex flex-col justify-between shadow-sm">
                <CardContent className="p-5 text-center flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                      <Star className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-1">Subject Bundle</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Access all chapters, revision notes, PYQs and future curriculum updates in one complete subject.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-primary/20">
                    <p className="text-2xl font-bold text-primary">₹{fullSubjectPrice}</p>
                    <span className="text-[11px] text-muted-foreground">all chapters in subject</span>
                  </div>
                </CardContent>
              </Card>

              {/* Option 4: Full Course Pass */}
              <Card className="border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col justify-between shadow-sm">
                <CardContent className="p-5 text-center flex flex-col h-full justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-3 text-indigo-600 dark:text-indigo-400">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-1">Full Course Pass</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      All-inclusive access to all subjects, syllabus modules & practice sheets covered by the entire course.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-indigo-200/60 dark:border-indigo-900/40">
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹{fullCoursePrice}</p>
                    <span className="text-[11px] text-muted-foreground">all subjects in course</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subject-wise Study Material */}
      <section id="subjects" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Subject-wise Study Material
            </h2>
            <p className="text-muted-foreground">
              Explore chapter-wise notes and download available PDFs
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Student Coupon & Complimentary Access Banner */}
            <StudentCouponBanner />

            {/* Interactive Search & Filter Controls */}
            <div className="p-4 rounded-xl bg-card border border-border space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search chapter or topic title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={freeOnlyFilter ? 'default' : 'outline'}
                    onClick={() => setFreeOnlyFilter(!freeOnlyFilter)}
                    className={`h-9 text-xs ${
                      freeOnlyFilter
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : ''
                    }`}
                  >
                    <Unlock className="w-3.5 h-3.5 mr-1" />
                    {freeOnlyFilter ? 'Showing Free Only' : 'Free Chapters (1 & 2)'}
                  </Button>
                </div>
              </div>

              {/* Subject Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar pt-1 flex-wrap sm:flex-nowrap">
                <span className="text-xs text-muted-foreground shrink-0 mr-1 flex items-center">
                  <Filter className="w-3 h-3 mr-1" /> Subject:
                </span>
                <button
                  onClick={() => setSelectedSubjectFilter('all')}
                  className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                    selectedSubjectFilter === 'all'
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  All Subjects
                </button>
                {subjects.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSubjectFilter(s.name)}
                    className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                      selectedSubjectFilter === s.name
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Section Filter (if sections exist in catalog) */}
              {availableSections.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar pt-1 border-t border-border/50 flex-wrap sm:flex-nowrap">
                  <span className="text-xs text-muted-foreground shrink-0 mr-1 flex items-center">
                    <Layers className="w-3 h-3 mr-1" /> Section:
                  </span>
                  <button
                    onClick={() => setSelectedSectionFilter('all')}
                    className={`text-xs px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                      selectedSectionFilter === 'all'
                        ? 'bg-accent/20 text-accent font-semibold border border-accent/40'
                        : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All Sections
                  </button>
                  {availableSections.map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSelectedSectionFilter(sec)}
                      className={`text-xs px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                        selectedSectionFilter === sec
                          ? 'bg-accent/20 text-accent font-semibold border border-accent/40'
                          : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion for Subjects & Chapters */}
            <Accordion
              type="multiple"
              defaultValue={[]}
              className="space-y-4"
            >
              {filteredSubjects.map((subject, idx) => {
                const normSubj = normalizeSubject(subject.name);

                // Find catalog chapters for this subject
                const subjectCatalog = chapterCatalogItems.filter(
                  (item) =>
                    normalizeSubject(item.subject_slug || item.subject || '') ===
                    normSubj
                );

                // Build unified chapter items
                const chaptersList = subject.chapters
                  .map((ch, cIdx) => {
                    const sequenceNumber = cIdx + 1;
                    // First 2 chapters in subject-wide sequence are always free by DB rule
                    const isSequentialFree = sequenceNumber <= 2;

                    // Match with live catalog item
                    const catalogItem = subjectCatalog.find(
                      (ci) =>
                        ci.subject_sequence_number === sequenceNumber ||
                        ci.chapter_number === sequenceNumber ||
                        ci.title.toLowerCase().includes(ch.name.toLowerCase())
                    );

                    return {
                      name: ch.name,
                      sequenceNumber,
                      isFree: catalogItem ? catalogItem.is_free : isSequentialFree,
                      catalogItem,
                    };
                  })
                  .filter((ch) => {
                    if (freeOnlyFilter && !ch.isFree) return false;
                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase().trim();
                      return (
                        ch.name.toLowerCase().includes(q) ||
                        ch.catalogItem?.title.toLowerCase().includes(q)
                      );
                    }
                    if (
                      selectedSectionFilter !== 'all' &&
                      ch.catalogItem?.section_name !== selectedSectionFilter
                    ) {
                      return false;
                    }
                    return true;
                  });

                return (
                  <motion.div
                    key={subject.name}
                    {...fadeInUp}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <AccordionItem
                      value={subject.name}
                      className="border rounded-xl overflow-hidden shadow-sm bg-card"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">
                              {subject.name}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({chaptersList.length} chapters)
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="space-y-2.5">
                          {chaptersList.map((ch, cIdx) => {
                            const isPublished = Boolean(ch.catalogItem);
                            const priceFormatted = ch.catalogItem
                              ? `₹${((ch.catalogItem.price_minor || 0) / 100).toFixed(0)}`
                              : `₹${pricePerChapter}`;

                            return (
                              <div
                                key={cIdx}
                                className="flex items-center justify-between p-3.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                                  <span className="text-xs font-semibold text-muted-foreground w-6 shrink-0 text-center">
                                    {ch.sequenceNumber}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {ch.catalogItem?.title || ch.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                      {ch.catalogItem?.section_name && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] py-0 px-1.5 h-4 text-muted-foreground"
                                        >
                                          {ch.catalogItem.section_name}
                                        </Badge>
                                      )}
                                      {!isPublished && (
                                        <span className="text-[11px] text-amber-600 dark:text-amber-400">
                                          Curriculum Chapter
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {isPublished ? (
                                    ch.catalogItem && hasAccess(ch.catalogItem) ? (
                                      <Badge className="bg-green-600 text-white text-xs">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Unlocked
                                      </Badge>
                                    ) : ch.isFree ? (
                                      <Badge className="bg-green-600 text-white text-xs">
                                        FREE
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="text-xs border-accent text-accent font-semibold"
                                      >
                                        <Lock className="w-3 h-3 mr-1" /> {priceFormatted}
                                      </Badge>
                                    )
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-xs text-muted-foreground border-dashed"
                                    >
                                      {ch.isFree ? 'Coming Soon (Free)' : 'Coming Soon'}
                                    </Badge>
                                  )}

                                  {/* Download or Unlock Action */}
                                  {isPublished && (ch.isFree || (ch.catalogItem && hasAccess(ch.catalogItem))) ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={downloadingId === ch.catalogItem?.id}
                                      onClick={() =>
                                        ch.catalogItem && handleDownload(ch.catalogItem)
                                      }
                                      className="h-8 px-2.5 text-xs text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground"
                                    >
                                      {downloadingId === ch.catalogItem?.id ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Download className="w-3.5 h-3.5 mr-1" />
                                      )}
                                      Download PDF
                                    </Button>
                                  ) : isPublished && !ch.isFree ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setPaidModalItem({
                                          id: ch.catalogItem?.id,
                                          title: ch.catalogItem?.title || ch.name,
                                          price: priceFormatted,
                                          subject: subject.name,
                                          courseSlug: ch.catalogItem?.course_slug || courseSlug || undefined,
                                          subjectSlug: ch.catalogItem?.subject_slug || subject.slug || undefined,
                                        })
                                      }
                                      className="h-8 px-2.5 text-xs text-accent border-accent/40 hover:bg-accent hover:text-accent-foreground"
                                    >
                                      <Lock className="w-3.5 h-3.5 mr-1" /> Unlock
                                    </Button>
                                  ) : (
                                    <DownloadButton
                                      label="Request"
                                      variant="inline"
                                      resourceName={`${breadcrumbLabel} ${subject.name} - ${ch.name}`}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          <div className="mt-4 p-3.5 rounded-lg bg-primary/5 border border-primary/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                            <p className="text-muted-foreground">
                              <Star className="w-4 h-4 inline text-primary mr-1" />
                              Subject Access: <strong className="text-primary font-semibold">₹{fullSubjectPrice}</strong> ({subject.name})
                            </p>
                            <p className="text-muted-foreground">
                              <Layers className="w-4 h-4 inline text-indigo-600 dark:text-indigo-400 mr-1" />
                              Complete Course Pass: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">₹{fullCoursePrice}</strong>
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                );
              })}
            </Accordion>

            {/* Non-Chapter Reference Materials (PYQs, Formula Sheets, Sample Papers) */}
            {practiceCatalogItems.length > 0 && (
              <div className="mt-12 p-6 rounded-2xl bg-muted/20 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-lg text-foreground">
                    Exam Practice & Reference Materials ({breadcrumbLabel})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {practiceCatalogItems.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-3.5 rounded-xl border bg-card flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {mat.title}
                        </p>
                        <span className="text-xs text-muted-foreground capitalize">
                          {(mat.resource_type || 'study_material').replace('_', ' ')} · {mat.subject || 'General'}
                        </span>
                      </div>
                      <div>
                        {mat.is_free || hasAccess(mat) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(mat)}
                            disabled={downloadingId === mat.id}
                            className="h-8 text-xs"
                          >
                            {downloadingId === mat.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5 mr-1" />
                            )}
                            Download
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setPaidModalItem({
                                id: mat.id,
                                title: mat.title,
                                price: `₹${((mat.price_minor || 0) / 100).toFixed(0)}`,
                                subject: mat.subject || undefined,
                                courseSlug: mat.course_slug || courseSlug || undefined,
                                subjectSlug: mat.subject_slug || undefined,
                              })
                            }
                            className="h-8 text-xs text-accent border-accent/30"
                          >
                            <Lock className="w-3.5 h-3.5 mr-1" /> Unlock
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Important Topics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Important Topics & Questions
            </h2>
            <p className="text-muted-foreground">High-weightage topics for exam preparation</p>
          </motion.div>
          <motion.div
            {...stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
          >
            {importantTopics.map((topic, idx) => (
              <motion.div key={idx} {...fadeInUp}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{topic}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Exam Tips */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Exam Preparation Tips
            </h2>
            <p className="text-muted-foreground">Expert strategies for exam success</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {examTips.map((tip, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }}>
                <div className="flex items-start gap-4 p-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    {idx % 3 === 0 ? (
                      <Lightbulb className="w-5 h-5 text-accent" />
                    ) : idx % 3 === 1 ? (
                      <Clock className="w-5 h-5 text-accent" />
                    ) : (
                      <Target className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Rays Academy */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Why Rays Academy Study Material?
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Award,
                title: 'Expert Faculty',
                desc: 'Prepared by teachers with 3–33+ years of experience',
              },
              {
                icon: BookOpen,
                title: 'Chapter-wise',
                desc: 'Structured material covering every topic in detail',
              },
              {
                icon: Target,
                title: 'Exam-Oriented',
                desc: 'Focused on board & competitive exam patterns',
              },
              {
                icon: Lightbulb,
                title: 'Concept Clarity',
                desc: 'Clear explanations with solved examples',
              },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }}>
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Local SEO */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              {localSeoKeywords.join(' • ')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Related Internal Resources */}
      {(() => {
        const fallback = [
          {
            title: 'Previous Year Questions',
            description: 'Solved PYQs across boards & competitive exams.',
            href: '/study-material/previous-year-questions',
          },
          {
            title: 'Sample Papers',
            description: 'Latest pattern sample papers for practice.',
            href: '/study-material/sample-papers',
          },
          {
            title: 'Formula Sheets',
            description: 'Quick revision formula sheets for Maths, Physics & Chemistry.',
            href: '/study-material/formula-sheets',
          },
        ];
        const items =
          relatedResources && relatedResources.length > 0
            ? relatedResources
            : fallback;
        return (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <motion.div {...fadeInUp} className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Related Resources
                </h2>
                <p className="text-muted-foreground text-sm">
                  Explore more from Rays Academy to strengthen your preparation
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                {items.map((r, i) => (
                  <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.08 }}>
                    <Link to={r.href}>
                      <Card className="h-full border border-border/60 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {r.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{r.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Official External Resources */}
      {officialResources && officialResources.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                Official Resources
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Trusted external links for syllabus, notifications and official material
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {officialResources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary text-sm font-medium transition-colors"
                  >
                    {r.name} <ChevronRight className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left text-sm font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Preparation?
            </h2>
            <p className="text-primary-foreground/85 mb-8 max-w-xl mx-auto">
              Join Rays Academy and get access to expert-prepared study material, personal
              mentoring, and proven results.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <ContactButton label="Join Rays Academy" />
              <WhatsAppButton />
              <ContactButton
                label="Contact Us"
                className="bg-white !text-primary hover:bg-gray-100 shadow-white/20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Paid Material Info Dialog */}
      {paidModalItem && (
        <PaidMaterialDialog
          open={Boolean(paidModalItem)}
          onOpenChange={(open) => !open && setPaidModalItem(null)}
          materialId={paidModalItem.id}
          title={paidModalItem.title}
          priceFormatted={paidModalItem.price}
          courseTitle={breadcrumbLabel}
          subjectTitle={paidModalItem.subject}
          courseSlug={paidModalItem.courseSlug || courseSlug || undefined}
          subjectSlug={paidModalItem.subjectSlug || undefined}
        />
      )}
    </div>
  );
};

export default StudyMaterialPageTemplate;
