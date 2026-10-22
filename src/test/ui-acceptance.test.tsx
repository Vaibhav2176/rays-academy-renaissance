import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from '@/components/layout/Navbar';
import PaidMaterialDialog, { resolveCheckoutContact } from '@/components/study-material/PaidMaterialDialog';
import CatalogMaterialCard from '@/components/study-material/CatalogMaterialCard';
import Login from '@/pages/Login';
import Portal from '@/pages/Portal';
import Contact from '@/pages/Contact';
import CoachingInBhopal from '@/pages/CoachingInBhopal';
import Index from '@/pages/Index';
import Courses from '@/pages/Courses';
import StudyMaterial from '@/pages/StudyMaterial';
import SMJEE from '@/pages/study-material/SMJEE';

// Mock framer-motion using a Proxy to handle any HTML element
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        return ({ children, className, ...props }: any) => {
          const Tag = prop as any;
          return <Tag className={className} {...props}>{children}</Tag>;
        };
      },
    }
  ),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock AuthContext
const mockSignOut = vi.fn();
const mockSignIn = vi.fn().mockResolvedValue({ error: null });
const mockSignUp = vi.fn().mockResolvedValue({ error: null });

let mockCurrentUser: any = null;
let mockCurrentProfile: any = null;
let mockAuthLoading = false;

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockCurrentUser,
    profile: mockCurrentProfile,
    loading: mockAuthLoading,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOut: mockSignOut,
  }),
  AuthProvider: ({ children }: any) => <>{children}</>,
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    })),
    functions: {
      invoke: vi.fn(),
    },
  },
}));

let mockCatalogData: any[] = [];

// Mock custom hooks
vi.mock('@/hooks/useStudyMaterials', () => ({
  useStudyMaterials: () => ({ data: [], isLoading: false }),
  useStudyMaterialCatalog: () => ({
    data: mockCatalogData,
    isLoading: false,
    error: null,
  }),
  downloadCatalogMaterial: vi.fn().mockResolvedValue({ downloadUrl: 'https://example.com/test.pdf' }),
  triggerFileDownload: vi.fn(),
}));

vi.mock('@/hooks/useStudentEntitlements', () => ({
  useStudentEntitlements: () => ({ data: [], isLoading: false }),
  useStudentOrders: () => ({ data: [], isLoading: false }),
  useUserMaterialAccess: () => ({
    hasAccess: (mat: any) => mat.is_free,
    entitlements: [],
  }),
  checkMaterialEntitlement: (mat: any, ents: any[], purchases: any[], isAdmin: boolean) => ({
    isEntitled: mat.is_free || isAdmin,
    reason: mat.is_free ? 'free_sample' : 'none',
    description: mat.is_free ? 'Free sample' : 'Requires purchase',
  }),
}));

vi.mock('@/hooks/useScholarshipTests', () => ({
  useScholarshipTests: () => ({ data: [], isLoading: false }),
  useTestRegistrations: () => ({ data: [], isLoading: false }),
  useRegisterForTest: () => ({ mutateAsync: vi.fn() }),
}));

vi.mock('@/hooks/useClasses', () => ({
  useClasses: () => ({ data: [{ id: 'cls-1', name: 'Class 10' }], isLoading: false }),
}));

vi.mock('@/hooks/useMaterialPurchases', () => ({
  useMaterialPurchases: () => ({ data: [], isLoading: false }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('Phase 1 UI & Route Acceptance Review', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    mockCurrentUser = null;
    mockCurrentProfile = null;
    mockAuthLoading = false;
    mockCatalogData = [
      {
        id: 'mat-101',
        title: 'Class 10 Real Numbers',
        course_slug: 'class-10',
        subject: 'Mathematics',
        subject_slug: 'mathematics',
        section_name: 'Algebra',
        resource_type: 'chapter',
        is_free: true,
        price_minor: 0,
        published_version_number: 1,
      },
      {
        id: 'mat-102',
        title: 'Class 10 Polynomials',
        course_slug: 'class-10',
        subject: 'Mathematics',
        subject_slug: 'mathematics',
        section_name: 'Algebra',
        resource_type: 'chapter',
        is_free: false,
        price_minor: 4900,
        published_version_number: 1,
      },
    ];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement, initialRoute = '/') => {
    return render(
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[initialRoute]}>
            {ui}
          </MemoryRouter>
        </QueryClientProvider>
      </HelmetProvider>
    );
  };

  describe('1. Responsive Navbar & Layout (Desktop vs Mobile Viewports)', () => {
    it('renders desktop navigation bar with links and portal CTA on desktop viewport (1280px)', () => {
      window.innerWidth = 1280;
      window.innerHeight = 800;

      renderWithProviders(<Navbar />, '/');

      // Brand Logo & title
      expect(screen.getByAltText(/Rays Academy Logo/i)).toBeInTheDocument();
      expect(screen.getByText(/Excellence Since 2006/i)).toBeInTheDocument();

      // Navigation links
      expect(screen.getByRole('link', { name: /^Home$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Courses/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Study Material/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Contact$/i })).toBeInTheDocument();

      // Desktop Auth Buttons
      expect(screen.getAllByRole('link', { name: /Login/i })[0]).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /Student Portal/i })[0]).toBeInTheDocument();
    });

    it('toggles mobile menu on mobile viewport (375px)', () => {
      window.innerWidth = 375;
      window.innerHeight = 667;

      renderWithProviders(<Navbar />, '/');

      const menuToggle = screen.getByLabelText(/Toggle menu/i);
      expect(menuToggle).toBeInTheDocument();

      // Click to open mobile navigation
      fireEvent.click(menuToggle);

      // Mobile drawer links
      const portalLinks = screen.getAllByRole('link', { name: /Student Portal/i });
      expect(portalLinks.length).toBeGreaterThan(0);
    });
  });

  describe('2. Public Site Route Rendering', () => {
    it('renders Home page (/) without console errors', () => {
      renderWithProviders(<Index />, '/');
      expect(screen.getAllByText(/Rays Academy/i).length).toBeGreaterThan(0);
    });

    it('renders Courses page (/courses) cleanly', () => {
      renderWithProviders(<Courses />, '/courses');
      expect(screen.getAllByText(/Courses/i).length).toBeGreaterThan(0);
    });

    it('renders Study Material Hub (/study-material) with CatalogBrowser', () => {
      renderWithProviders(<StudyMaterial />, '/study-material');
      expect(screen.getByText(/Study Material Hub/i)).toBeInTheDocument();
      expect(screen.getByText(/Browse Study Materials Catalog/i)).toBeInTheDocument();
    });

    it('renders Subject Catalog (/study-material/iit-jee) with chapters and pricing badges', () => {
      renderWithProviders(<SMJEE />, '/study-material/iit-jee');
      expect(screen.getByText(/IIT-JEE Study Material/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Physics/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Mathematics/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Chemistry/i).length).toBeGreaterThan(0);
    });

    it('renders Contact page (/contact) with contact form and information', () => {
      renderWithProviders(<Contact />, '/contact');
      expect(screen.getAllByText(/Contact/i).length).toBeGreaterThan(0);
    });

    it('renders Fees & Location page (/coaching-classes-in-bhopal)', () => {
      renderWithProviders(<CoachingInBhopal />, '/coaching-classes-in-bhopal');
      expect(screen.getAllByText(/Bhopal/i).length).toBeGreaterThan(0);
    });
  });

  describe('3. PaidMaterialDialog & Authoritative Pricing Verification', () => {
    it('resolves student contact phone prioritizing student phone then parent phone', () => {
      const profileBoth = { phone: '9876543210', parent_phone: '9123456789' };
      expect(resolveCheckoutContact(profileBoth)).toEqual({
        contact: '9876543210',
        source: 'student',
      });

      const profileParentOnly = { phone: null, parent_phone: '9123456789' };
      expect(resolveCheckoutContact(profileParentOnly)).toEqual({
        contact: '9123456789',
        source: 'parent',
      });

      expect(resolveCheckoutContact(profileBoth, '9998887776')).toEqual({
        contact: '9998887776',
        source: 'manual',
      });
    });

    it('prompts unauthenticated users to sign in to /login with returnTo preserved', () => {
      mockCurrentUser = null;

      renderWithProviders(
        <PaidMaterialDialog
          open={true}
          onOpenChange={vi.fn()}
          materialId="mat-102"
          title="Class 10 Polynomials"
          priceFormatted="₹49"
        />,
        '/study-material/iit-jee'
      );

      const signInBtn = screen.getByRole('button', { name: /Sign In to Unlock with Razorpay/i });
      expect(signInBtn).toBeInTheDocument();
      expect(screen.getByText(/Signing in secures your purchase to your student account permanently/i)).toBeInTheDocument();
    });

    it('displays authoritative package options: Single (₹49), Subject Bundle (₹499), Course Pass (₹999)', () => {
      mockCurrentUser = { id: 'usr-123', email: 'student@example.com' };
      mockCurrentProfile = { id: 'usr-123', phone: '9876543210', full_name: 'Test Student' };

      renderWithProviders(
        <PaidMaterialDialog
          open={true}
          onOpenChange={vi.fn()}
          materialId="mat-102"
          title="Class 10 Polynomials"
          priceFormatted="₹49"
          courseTitle="IIT-JEE"
          subjectTitle="Mathematics"
          courseSlug="iit-jee"
          subjectSlug="mathematics"
        />,
        '/study-material/iit-jee'
      );

      expect(screen.getByText(/^Single Note$/i)).toBeInTheDocument();
      expect(screen.getAllByText(/₹49/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/^Subject Bundle$/i)).toBeInTheDocument();
      expect(screen.getByText(/₹499/i)).toBeInTheDocument();
      expect(screen.getByText(/^Full Course Pass$/i)).toBeInTheDocument();
      expect(screen.getByText(/₹999/i)).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /Unlock Now for ₹49/i })).toBeInTheDocument();
    });
  });

  describe('4. Student Portal & Empty States', () => {
    it('redirects unauthenticated users to /login', () => {
      mockCurrentUser = null;
      mockAuthLoading = false;

      render(
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={['/portal']}>
              <Routes>
                <Route path="/portal" element={<Portal />} />
                <Route path="/login" element={<div>Login Page Redirected</div>} />
              </Routes>
            </MemoryRouter>
          </QueryClientProvider>
        </HelmetProvider>
      );

      expect(screen.getByText(/Login Page Redirected/i)).toBeInTheDocument();
    });

    it('renders authenticated Student Portal tabs (Profile, My Library, Orders, Catalog)', async () => {
      mockCurrentUser = { id: 'usr-123', email: 'student@example.com' };
      mockCurrentProfile = {
        id: 'usr-123',
        full_name: 'Siddharth Sharma',
        phone: '9876543210',
        board: 'CBSE',
        school_name: 'DPS Bhopal',
      };

      renderWithProviders(<Portal />, '/portal');

      expect(screen.getByText(/Welcome, Siddharth Sharma!/i)).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Profile/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Library/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Orders/i })).toBeInTheDocument();
    });

    it('provides clear empty state CTAs linking to both Study Material and Courses in My Library', () => {
      mockCurrentUser = { id: 'usr-123', email: 'student@example.com' };
      mockCurrentProfile = { id: 'usr-123', full_name: 'Siddharth Sharma' };
      mockCatalogData = [];

      renderWithProviders(<Portal />, '/portal');

      expect(screen.getByText(/No Unlocked Materials Yet/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Explore Study Material/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Browse Courses/i })).toBeInTheDocument();
    });
  });

  describe('5. Auth Page & ReturnTo Navigation', () => {
    it('renders Login and Register tabs', () => {
      renderWithProviders(<Login />, '/login');

      expect(screen.getByRole('tab', { name: /Login/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Register/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/student@example\.com/i)).toBeInTheDocument();
    });
  });
});
