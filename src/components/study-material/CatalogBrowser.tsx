import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  BookOpen,
  Sparkles,
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  Layers,
  Unlock,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useStudyMaterialCatalog,
  CatalogStudyMaterial,
} from '@/hooks/useStudyMaterials';
import CatalogMaterialCard from './CatalogMaterialCard';
import { WhatsAppButton } from '@/components/shared/CTAButtons';
import { useAuth } from '@/contexts/AuthContext';
import { useClasses } from '@/hooks/useClasses';
import { CANONICAL_COURSES, classNameToCourseSlug } from '@/data/canonicalSyllabus';
import { StudentCouponBanner } from '@/components/shared/StudentCouponBanner';

const COURSES = [
  { slug: 'all', label: 'All Courses' },
  ...CANONICAL_COURSES.map((c) => ({ slug: c.slug, label: c.name })),
];

const RESOURCE_TYPES = [
  { slug: 'all', label: 'All Resources' },
  { slug: 'chapter', label: 'Chapter Notes' },
  { slug: 'pyq', label: 'PYQs' },
  { slug: 'sample_paper', label: 'Sample Papers' },
  { slug: 'formula_sheet', label: 'Formula Sheets' },
  { slug: 'revision_notes', label: 'Revision Notes' },
];

interface CatalogBrowserProps {
  initialCourseSlug?: string;
  initialSubjectSlug?: string;
  hideCourseFilter?: boolean;
  hideSubjectFilter?: boolean;
  title?: string;
  description?: string;
}

export const CatalogBrowser: React.FC<CatalogBrowserProps> = ({
  initialCourseSlug = 'all',
  initialSubjectSlug = 'all',
  hideCourseFilter = false,
  hideSubjectFilter = false,
  title = 'Browse Study Materials Catalog',
  description = 'Search and download verified study notes, previous year questions, and chapter materials prepared by Rays Academy faculty.',
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>(initialCourseSlug);
  const [selectedResourceType, setSelectedResourceType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectSlug);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [freeOnly, setFreeOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { profile } = useAuth();
  const { data: classes } = useClasses();

  // If initialCourseSlug was 'all' and student has a class_id, auto-select student's class course
  React.useEffect(() => {
    if (initialCourseSlug === 'all' && profile?.class_id && classes && classes.length > 0) {
      const studentClass = classes.find((c) => c.id === profile.class_id);
      if (studentClass) {
        const studentCourseSlug = classNameToCourseSlug(studentClass.name);
        if (studentCourseSlug && studentCourseSlug !== 'all') {
          setSelectedCourse(studentCourseSlug);
        }
      }
    }
  }, [profile?.class_id, classes, initialCourseSlug]);

  const { data: materials, isLoading, error } = useStudyMaterialCatalog({
    courseSlug: selectedCourse === 'all' ? undefined : selectedCourse,
    resourceType: selectedResourceType === 'all' ? undefined : selectedResourceType,
    subjectSlug: selectedSubject === 'all' ? undefined : selectedSubject,
    sectionName: selectedSection === 'all' ? undefined : selectedSection,
    isFree: freeOnly ? true : undefined,
    search: searchTerm,
  });

  // Extract distinct subjects and sections available in current items
  const availableSections = useMemo(() => {
    if (!materials) return [];
    const set = new Set<string>();
    materials.forEach((m) => {
      if (m.section_name) set.add(m.section_name);
    });
    return Array.from(set).sort();
  }, [materials]);

  return (
    <div className="space-y-6">
      {/* Title & Overview */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <Badge className="bg-accent text-accent-foreground mb-3">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Verified Study Materials
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {title}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Student Coupon Info Banner */}
      <StudentCouponBanner className="mb-6" />

      {/* Filter Bar */}
      <div className="p-4 md:p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by chapter, topic title, section, or subject..."
            className="pl-10 h-11 bg-background"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Course Filter */}
          {!hideCourseFilter && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Course / Exam
              </label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="h-9 bg-background">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Resource Type Filter */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Resource Type
            </label>
            <Select
              value={selectedResourceType}
              onValueChange={setSelectedResourceType}
            >
              <SelectTrigger className="h-9 bg-background">
                <SelectValue placeholder="All Resource Types" />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map((r) => (
                  <SelectItem key={r.slug} value={r.slug}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section Filter */}
          {availableSections.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                Section / Subsection
              </label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
                <SelectTrigger className="h-9 bg-background">
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {availableSections.map((sec) => (
                    <SelectItem key={sec} value={sec}>
                      {sec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Free Only Toggle */}
          <div className="flex items-end">
            <Button
              type="button"
              variant={freeOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFreeOnly(!freeOnly)}
              className={`h-9 w-full text-xs font-medium ${
                freeOnly
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                  : 'text-foreground'
              }`}
            >
              <Unlock className="w-3.5 h-3.5 mr-1.5" />
              {freeOnly ? 'Showing Free Only' : 'Filter Free Chapters Only'}
            </Button>
          </div>
        </div>

        {/* Quick Filter Pills for Course */}
        {!hideCourseFilter && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 scrollbar-none no-scrollbar flex-wrap sm:flex-nowrap">
            <span className="text-xs text-muted-foreground shrink-0 mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Quick:
            </span>
            {COURSES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setSelectedCourse(c.slug)}
                className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedCourse === c.slug
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Materials Results Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading study catalog...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
          <p className="text-sm text-destructive">
            Failed to load catalog materials. Please try again.
          </p>
        </div>
      ) : materials && materials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {materials.map((mat) => (
            <CatalogMaterialCard key={mat.id} material={mat} />
          ))}
        </div>
      ) : (
        <div className="text-center py-14 p-6 rounded-2xl border border-dashed bg-card/60">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            New Materials Releasing Regularly
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            Our faculty is currently uploading and certifying study material for this selection.
            Need chapter notes immediately? Message our team for direct access on WhatsApp.
          </p>
          <div className="flex justify-center gap-3">
            <WhatsAppButton
              size="sm"
              label="Request via WhatsApp"
              message={`Hi Rays Academy, I am looking for study material for ${
                selectedCourse !== 'all' ? selectedCourse : 'my course'
              }. Please share available notes.`}
            />
            {(selectedCourse !== 'all' ||
              selectedResourceType !== 'all' ||
              searchTerm ||
              freeOnly) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCourse('all');
                  setSelectedResourceType('all');
                  setSelectedSubject('all');
                  setSelectedSection('all');
                  setFreeOnly(false);
                  setSearchTerm('');
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogBrowser;

