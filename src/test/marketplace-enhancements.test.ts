import { describe, it, expect } from 'vitest';
import {
  CANONICAL_COURSES,
  getCanonicalCourse,
  getCanonicalSubject,
  getSubjectsForCourse,
  getChaptersForSubject,
  classNameToCourseSlug,
  courseSlugToClassName,
} from '@/data/canonicalSyllabus';
import { formatMaterialTitle } from '@/components/study-material/CatalogMaterialCard';
import { checkMaterialEntitlement } from '@/hooks/useStudentEntitlements';

describe('Marketplace UI & Student Experience Enhancements', () => {
  describe('Canonical Syllabus Configuration', () => {
    it('defines all 9 canonical courses with categories', () => {
      const courseSlugs = CANONICAL_COURSES.map((c) => c.slug);
      expect(courseSlugs).toContain('nda');
      expect(courseSlugs).toContain('iit-jee');
      expect(courseSlugs).toContain('neet');
      expect(courseSlugs).toContain('class-12');
      expect(courseSlugs).toContain('class-11');
      expect(courseSlugs).toContain('class-10');
      expect(courseSlugs).toContain('class-9');
      expect(courseSlugs).toContain('class-6-8');
      expect(courseSlugs).toContain('cuet');
      expect(CANONICAL_COURSES.length).toBe(9);
    });

    it('enforces that first 2 chapters of each subject are free', () => {
      CANONICAL_COURSES.forEach((course) => {
        course.subjects.forEach((subject) => {
          if (subject.chapters.length >= 2) {
            expect(subject.chapters[0].isFree).toBe(true);
            expect(subject.chapters[0].sequence).toBe(1);
            expect(subject.chapters[1].isFree).toBe(true);
            expect(subject.chapters[1].sequence).toBe(2);
            if (subject.chapters.length > 2) {
              expect(subject.chapters[2].isFree).toBe(false);
              expect(subject.chapters[2].sequence).toBe(3);
            }
          }
        });
      });
    });

    it('retrieves course and subjects by slug accurately', () => {
      const nda = getCanonicalCourse('nda');
      expect(nda).toBeDefined();
      expect(nda?.name).toContain('NDA');

      const subjects = getSubjectsForCourse('nda');
      expect(subjects.length).toBeGreaterThan(0);
      expect(subjects.map((s) => s.slug)).toContain('maths');

      const chapters = getChaptersForSubject('nda', 'maths');
      expect(chapters.length).toBeGreaterThan(0);
      expect(chapters[0].title).toBe('Algebra - Sets, Relations & Functions');
    });

    it('maps student class names to canonical course slugs', () => {
      expect(classNameToCourseSlug('Class 10')).toBe('class-10');
      expect(classNameToCourseSlug('Class 12th Board')).toBe('class-12');
      expect(classNameToCourseSlug('NDA Batch 2026')).toBe('nda');
      expect(classNameToCourseSlug('IIT-JEE Super 30')).toBe('iit-jee');
      expect(classNameToCourseSlug('NEET Medical')).toBe('neet');
      expect(classNameToCourseSlug('Class 7')).toBe('class-6-8');
      expect(classNameToCourseSlug(null)).toBe('all');
      expect(classNameToCourseSlug('Unknown Class')).toBe('all');
    });

    it('maps course slug back to readable display name', () => {
      expect(courseSlugToClassName('nda')).toContain('NDA');
      expect(courseSlugToClassName('all')).toBe('All Courses');
      expect(courseSlugToClassName(null)).toBe('All Courses');
    });
  });

  describe('Material Title Formatter', () => {
    it('removes file extensions from titles', () => {
      expect(formatMaterialTitle('Chapter_1_Real_Numbers.pdf')).toBe('Chapter 1 Real Numbers');
      expect(formatMaterialTitle('Sets_And_Relations.DOCX')).toBe('Sets And Relations');
    });

    it('converts underscores to spaces when no spaces are present', () => {
      expect(formatMaterialTitle('Coordinate_Geometry_Part_1')).toBe('Coordinate Geometry Part 1');
      expect(formatMaterialTitle('Normal Title With Spaces')).toBe('Normal Title With Spaces');
    });

    it('handles empty or missing title gracefully', () => {
      expect(formatMaterialTitle('')).toBe('Study Material');
    });
  });

  describe('Entitlements Library Scoping (forLibraryOnly)', () => {
    const dummyFreeMaterial = {
      id: 'mat-free-1',
      title: 'Free Chapter 1',
      is_free: true,
      price_minor: 0,
      course_slug: 'nda',
      subject_slug: 'maths',
    };

    const dummyPaidMaterial = {
      id: 'mat-paid-3',
      title: 'Paid Chapter 3',
      is_free: false,
      price_minor: 4900,
      course_slug: 'nda',
      subject_slug: 'maths',
    };

    it('marks free material as entitled by default on public catalog', () => {
      const access = checkMaterialEntitlement(dummyFreeMaterial, [], [], false);
      expect(access.isEntitled).toBe(true);
      expect(access.reason).toBe('free');
    });

    it('does NOT mark free material as entitled in student library if not explicitly unlocked', () => {
      const access = checkMaterialEntitlement(dummyFreeMaterial, [], [], false, {
        forLibraryOnly: true,
      });
      expect(access.isEntitled).toBe(false);
    });

    it('marks free material as entitled in student library when explicit single_material entitlement exists', () => {
      const activeEntitlement = {
        id: 'ent-1',
        user_id: 'user-1',
        entitlement_scope: 'single_material',
        material_id: 'mat-free-1',
        course_slug: null,
        subject_slug: null,
        status: 'active',
        created_at: new Date().toISOString(),
      };

      const access = checkMaterialEntitlement(dummyFreeMaterial, [activeEntitlement], [], false, {
        forLibraryOnly: true,
      });
      expect(access.isEntitled).toBe(true);
      expect(access.reason).toBe('single');
    });

    it('unlocks paid material when active course bundle pass is held', () => {
      const courseBundlePass = {
        id: 'ent-2',
        user_id: 'user-1',
        entitlement_scope: 'course_bundle',
        material_id: null,
        course_slug: 'nda',
        subject_slug: null,
        status: 'active',
        created_at: new Date().toISOString(),
      };

      const access = checkMaterialEntitlement(dummyPaidMaterial, [courseBundlePass], [], false, {
        forLibraryOnly: true,
      });
      expect(access.isEntitled).toBe(true);
      expect(access.reason).toBe('course_bundle');
    });
  });
});
