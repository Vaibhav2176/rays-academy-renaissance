import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, BookOpen, Calendar, Bell, 
  User, LogOut, Clock,
  CheckCircle, Award, Loader2, Shield,
  ShoppingBag, Sparkles, Layers, Search, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useStudyMaterials, useStudyMaterialCatalog, StudyMaterial, CatalogStudyMaterial } from '@/hooks/useStudyMaterials';
import { useScholarshipTests, useTestRegistrations, useRegisterForTest } from '@/hooks/useScholarshipTests';
import { useClasses } from '@/hooks/useClasses';
import { useMaterialPurchases } from '@/hooks/useMaterialPurchases';
import {
  useStudentEntitlements,
  useStudentOrders,
  checkMaterialEntitlement,
} from '@/hooks/useStudentEntitlements';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import MaterialCard from '@/components/portal/MaterialCard';
import StudentLibraryCard from '@/components/portal/StudentLibraryCard';
import StudentOrdersList from '@/components/portal/StudentOrdersList';
import EditProfileDialog from '@/components/portal/EditProfileDialog';
import { StudentCouponBanner } from '@/components/shared/StudentCouponBanner';
const formatDateOfBirth = (dob?: string | null) => {
  if (!dob) return 'Not set';
  try {
    const d = new Date(dob);
    return isNaN(d.getTime()) ? dob : format(d, 'dd MMM yyyy');
  } catch {
    return dob;
  }
};

const Portal = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');
  const [librarySubjectFilter, setLibrarySubjectFilter] = useState('all');

  const { data: materials, isLoading: materialsLoading } = useStudyMaterials();
  const { data: catalogMaterials, isLoading: catalogLoading } = useStudyMaterialCatalog();
  const { data: entitlements, isLoading: entitlementsLoading } = useStudentEntitlements();
  const { data: orders, isLoading: ordersLoading } = useStudentOrders();
  const { data: tests, isLoading: testsLoading } = useScholarshipTests();
  const { data: registrations, isLoading: registrationsLoading } = useTestRegistrations();
  const { data: classes } = useClasses();
  const { data: purchases, isLoading: purchasesLoading } = useMaterialPurchases();
  const registerMutation = useRegisterForTest();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle()
        .then(({ data }) => {
          if (isMounted && data) {
            setIsAdmin(true);
          }
        });
    } else {
      setIsAdmin(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleRegisterForTest = async (testId: string) => {
    try {
      await registerMutation.mutateAsync(testId);
      toast({
        title: "Registered Successfully!",
        description: "You have been registered for the test.",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const isRegisteredForTest = (testId: string) => {
    return registrations?.some(r => r.test_id === testId) ?? false;
  };

  const getClassName = (classId: string | null) => {
    if (!classId) return 'All Classes';
    return classes?.find(c => c.id === classId)?.name ?? 'Unknown';
  };

  const groupMaterialsBySubject = (materials: StudyMaterial[]) => {
    const grouped: Record<string, StudyMaterial[]> = {};
    materials.forEach(material => {
      const subject = material.subject || 'General';
      if (!grouped[subject]) grouped[subject] = [];
      grouped[subject].push(material);
    });
    return grouped;
  };

  const hasMaterialAccess = (materialId: string, courseSlug?: string | null, subjectSlug?: string | null) => {
    if (isAdmin) return true;
    if (purchases?.some(p => p.material_id === materialId)) return true;
    if (!entitlements) return false;
    return entitlements.some(e => {
      if (e.status !== 'active') return false;
      if (e.entitlement_scope === 'single_material' && e.material_id === materialId) return true;
      if (e.entitlement_scope === 'subject_bundle' && subjectSlug && e.subject_slug === subjectSlug) return true;
      if (e.entitlement_scope === 'course_bundle' && courseSlug && e.course_slug === courseSlug) return true;
      return false;
    });
  };

  // Active bundle pass counts / badges
  const coursePasses = useMemo(() => {
    return (entitlements || []).filter(e => e.entitlement_scope === 'course_bundle' && e.status === 'active');
  }, [entitlements]);

  const subjectPasses = useMemo(() => {
    return (entitlements || []).filter(e => e.entitlement_scope === 'subject_bundle' && e.status === 'active');
  }, [entitlements]);

  // Merge & resolve unlocked catalog materials
  const unlockedCatalogMaterials = useMemo(() => {
    if (!catalogMaterials) return [];
    return catalogMaterials
      .map(m => {
        const ent = checkMaterialEntitlement(m, entitlements || [], purchases || [], isAdmin, { forLibraryOnly: true });
        return {
          material: m,
          access: ent,
        };
      })
      .filter(item => item.access.isEntitled);
  }, [catalogMaterials, entitlements, purchases, isAdmin]);

  // Unique subjects in user's unlocked library
  const librarySubjects = useMemo(() => {
    const subs = new Set<string>();
    unlockedCatalogMaterials.forEach(item => {
      if (item.material.subject_name) {
        subs.add(item.material.subject_name);
      }
    });
    return Array.from(subs).sort();
  }, [unlockedCatalogMaterials]);

  // Filtered library materials
  const filteredLibraryMaterials = useMemo(() => {
    return unlockedCatalogMaterials.filter(item => {
      const term = librarySearch.trim().toLowerCase();
      const matchesSearch =
        term === '' ||
        item.material.title.toLowerCase().includes(term) ||
        (item.material.description && item.material.description.toLowerCase().includes(term)) ||
        item.material.course_title.toLowerCase().includes(term) ||
        (item.material.subject_name && item.material.subject_name.toLowerCase().includes(term));

      const matchesSubject =
        librarySubjectFilter === 'all' ||
        item.material.subject_name === librarySubjectFilter;

      return matchesSearch && matchesSubject;
    });
  }, [unlockedCatalogMaterials, librarySearch, librarySubjectFilter]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-rays-blue-700 to-primary">
        <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const groupedMaterials = materials ? groupMaterialsBySubject(materials) : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary to-rays-blue-700 text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-display font-bold">
                      Welcome, {profile?.full_name || 'Student'}!
                    </h1>
                    <p className="text-primary-foreground/80">
                      {profile?.email} • {getClassName(profile?.class_id ?? null)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditProfileOpen(true)}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  {isAdmin && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/admin')}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:text-white"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/admin/materials')}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:text-white"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Materials
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="secondary" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="library" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 max-w-3xl">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Library ({unlockedCatalogMaterials.length})</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Catalog</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({orders?.length ?? 0})</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Tests</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Student Library Tab */}
          <TabsContent value="library">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Active passes alert */}
              {(coursePasses.length > 0 || subjectPasses.length > 0) && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Active Access Passes:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {coursePasses.map(cp => (
                      <Badge key={cp.id} variant="default" className="bg-primary hover:bg-primary/90 text-xs">
                        <Layers className="w-3 h-3 mr-1" />
                        Full Course: {cp.course_slug || 'Enrolled Course'}
                      </Badge>
                    ))}
                    {subjectPasses.map(sp => (
                      <Badge key={sp.id} variant="secondary" className="border-primary/30 text-xs">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Subject Pass: {sp.subject_slug || 'Subject'}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl font-bold">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        My Study Library
                      </CardTitle>
                      <CardDescription>
                        Access and securely download all study materials unlocked through direct purchases, bundles, or coupons.
                      </CardDescription>
                    </div>

                    {/* Search & Subject filter */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative min-w-[200px]">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search unlocked notes..."
                          value={librarySearch}
                          onChange={(e) => setLibrarySearch(e.target.value)}
                          className="pl-9 h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject Filter Pills */}
                  {librarySubjects.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-3">
                      <Button
                        size="sm"
                        variant={librarySubjectFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setLibrarySubjectFilter('all')}
                        className="h-7 text-xs rounded-full"
                      >
                        All Subjects ({unlockedCatalogMaterials.length})
                      </Button>
                      {librarySubjects.map(sub => {
                        const count = unlockedCatalogMaterials.filter(m => m.material.subject_name === sub).length;
                        return (
                          <Button
                            key={sub}
                            size="sm"
                            variant={librarySubjectFilter === sub ? 'default' : 'outline'}
                            onClick={() => setLibrarySubjectFilter(sub)}
                            className="h-7 text-xs rounded-full"
                          >
                            {sub} ({count})
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  {catalogLoading || entitlementsLoading || purchasesLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Loading your library & entitlements...</p>
                    </div>
                  ) : unlockedCatalogMaterials.length === 0 ? (
                    <div className="text-center py-16 px-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Unlocked Materials Yet</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                        Explore our study material catalog or enroll in courses to unlock comprehensive study guides, chapter notes, and video lectures.
                      </p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        <Button onClick={() => navigate('/study-material')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Explore Study Material
                        </Button>
                        <Button onClick={() => navigate('/courses')} variant="outline">
                          Browse Courses
                        </Button>
                      </div>
                    </div>
                  ) : filteredLibraryMaterials.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <p className="text-muted-foreground mb-3">No study materials match your search or filter.</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setLibrarySearch('');
                          setLibrarySubjectFilter('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredLibraryMaterials.map(item => (
                        <StudentLibraryCard
                          key={item.material.id}
                          material={item.material}
                          entitlementReason={item.access.reason}
                          entitlementDescription={item.access.description}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Orders / Purchase History Tab */}
          <TabsContent value="orders">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <StudentOrdersList orders={orders} isLoading={ordersLoading} />
            </motion.div>
          </TabsContent>

          {/* Study Materials Catalog Tab */}
          <TabsContent value="materials">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Study Materials Catalog
                  </CardTitle>
                  <CardDescription>
                    Browse all course materials, notes, and video lectures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {materialsLoading || purchasesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : materials && materials.length > 0 ? (
                    <div className="space-y-6">
                      <StudentCouponBanner compact className="mb-4" />
                      {Object.entries(groupedMaterials).map(([subject, items]) => (
                        <div key={subject}>
                          <h3 className="font-semibold text-lg mb-3 text-foreground">{subject}</h3>
                          <div className="grid gap-3">
                            {items.map((material) => (
                              <MaterialCard
                                key={material.id}
                                material={material}
                                hasAccess={hasMaterialAccess(material.id, material.course_slug, material.subject_slug)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Materials Yet</h3>
                      <p className="text-muted-foreground">
                        Study materials for your class will appear here once uploaded.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Scholarship Tests Tab */}
          <TabsContent value="tests">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    Scholarship Tests
                  </CardTitle>
                  <CardDescription>
                    Register for scholarship tests and track your progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {testsLoading || registrationsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : tests && tests.length > 0 ? (
                    <div className="grid gap-4">
                      {tests.map((test) => {
                        const isRegistered = isRegisteredForTest(test.id);
                        return (
                          <div
                            key={test.id}
                            className="p-5 rounded-xl border bg-card hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{test.title}</h3>
                                  <Badge variant={test.test_type === 'online' ? 'default' : 'secondary'}>
                                    {test.test_type === 'online' ? 'Online' : 'Offline'}
                                  </Badge>
                                </div>
                                {test.description && (
                                  <p className="text-muted-foreground mb-3">{test.description}</p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {test.duration_minutes} minutes
                                  </span>
                                  {test.test_date && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {format(new Date(test.test_date), 'PPP')}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <GraduationCap className="w-4 h-4" />
                                    {getClassName(test.class_id)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isRegistered ? (
                                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Registered
                                  </Badge>
                                ) : (
                                  <Button
                                    onClick={() => handleRegisterForTest(test.id)}
                                    disabled={registerMutation.isPending}
                                  >
                                    {registerMutation.isPending ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : null}
                                    Register Now
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Tests Available</h3>
                      <p className="text-muted-foreground">
                        Scholarship tests will appear here when available.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Your Profile
                      </CardTitle>
                      <CardDescription>
                        View and manage your account information
                      </CardDescription>
                    </div>
                    <Button onClick={() => setEditProfileOpen(true)} size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {(!profile?.phone || !profile?.parent_phone || !profile?.class_id) && (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-amber-700 dark:text-amber-300">
                          <strong>Incomplete Profile:</strong> Please add your {!profile?.phone ? 'phone number' : !profile?.parent_phone ? "parent's phone number" : 'class/batch'} for verification and test notifications.
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs border-amber-500/30 shrink-0" onClick={() => setEditProfileOpen(true)}>
                          Complete Profile
                        </Button>
                      </div>
                    )}
                    {/* Personal & Contact Details */}
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Personal & Contact Details
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                          <p className="font-semibold text-sm text-foreground">{profile?.full_name || 'Not set'}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                          <p className="font-semibold text-sm text-foreground break-all">{profile?.email || user?.email || 'Not set'}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Student Phone</p>
                          <p className="font-semibold text-sm text-foreground">{profile?.phone || 'Not set'}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                          <p className="font-semibold text-sm text-foreground">{formatDateOfBirth(profile?.date_of_birth)}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Gender</p>
                          <p className="font-semibold text-sm text-foreground capitalize">{profile?.gender || 'Not set'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Parent / Guardian Information */}
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Parent / Guardian Information
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Parent / Guardian Name</p>
                          <p className="font-semibold text-sm text-foreground">{profile?.parent_name || 'Not set'}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Parent Phone Number</p>
                          <p className="font-semibold text-sm text-foreground">{profile?.parent_phone || 'Not set'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Details */}
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Academic Details
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Class / Batch</p>
                          <p className="font-semibold text-sm text-foreground">{getClassName(profile?.class_id ?? null) || 'Not set'}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">School Name</p>
                          <p className="font-semibold text-sm text-foreground">{profile?.school_name || 'Not set'}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">Board</p>
                          <p className="font-semibold text-sm text-foreground">{profile?.board || 'CBSE'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Address Details */}
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Address & Location
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 sm:col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Residential Address</p>
                          <p className="font-semibold text-sm text-foreground">{profile?.address || 'Not set'}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">City</p>
                          <p className="font-semibold text-sm text-foreground">{profile?.city || 'Not set'}</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50">
                          <p className="text-xs text-muted-foreground mb-1">State & Pincode</p>
                          <p className="font-semibold text-sm text-foreground">
                            {profile?.state || 'Madhya Pradesh'}{profile?.pincode ? ` - ${profile.pincode}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold mb-4">Your Activity</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-primary/10">
                          <div className="text-2xl font-bold text-primary">
                            {unlockedCatalogMaterials.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Unlocked In Library</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-emerald-500/10">
                          <div className="text-2xl font-bold text-emerald-600">
                            {orders?.filter(o => o.status === 'paid').length ?? 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Paid Purchases</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-accent/10">
                          <div className="text-2xl font-bold text-accent">
                            {registrations?.length ?? 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Tests Registered</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-yellow-500/10">
                          <div className="text-2xl font-bold text-yellow-600">
                            {registrations?.filter(r => r.status === 'completed' || (r as any).score != null).length ?? 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Tests Completed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      <EditProfileDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        classes={classes || []}
      />
    </div>
  );
};

export default Portal;
