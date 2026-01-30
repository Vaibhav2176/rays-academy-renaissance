import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, BookOpen, Calendar, Bell, 
  User, LogOut, Clock,
  CheckCircle, Award, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useStudyMaterials, StudyMaterial } from '@/hooks/useStudyMaterials';
import { useScholarshipTests, useTestRegistrations, useRegisterForTest } from '@/hooks/useScholarshipTests';
import { useClasses } from '@/hooks/useClasses';
import { useMaterialPurchases } from '@/hooks/useMaterialPurchases';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import MaterialCard from '@/components/portal/MaterialCard';

const Portal = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { data: materials, isLoading: materialsLoading } = useStudyMaterials();
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

  const hasMaterialAccess = (materialId: string) => {
    return purchases?.some(p => p.material_id === materialId) ?? false;
  };

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
                <Button 
                  variant="secondary" 
                  onClick={handleSignOut}
                  className="self-start md:self-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Materials</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Study Materials Tab */}
          <TabsContent value="materials">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Study Materials
                  </CardTitle>
                  <CardDescription>
                    Access your course materials, notes, and video lectures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {materialsLoading || purchasesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : materials && materials.length > 0 ? (
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-sm text-accent-foreground">
                          <strong>💡 Tip:</strong> Use coupon codes like <code className="bg-background px-1 rounded">RAYS2024</code> to unlock study materials for free!
                        </p>
                      </div>
                      {Object.entries(groupedMaterials).map(([subject, items]) => (
                        <div key={subject}>
                          <h3 className="font-semibold text-lg mb-3 text-foreground">{subject}</h3>
                          <div className="grid gap-3">
                            {items.map((material) => (
                              <MaterialCard
                                key={material.id}
                                material={material}
                                hasAccess={hasMaterialAccess(material.id)}
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
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Your Profile
                  </CardTitle>
                  <CardDescription>
                    View and manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                        <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="font-medium">{profile?.email}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Phone</p>
                        <p className="font-medium">{profile?.phone || 'Not set'}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Class</p>
                        <p className="font-medium">{getClassName(profile?.class_id ?? null)}</p>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold mb-4">Your Activity</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-primary/10">
                          <div className="text-2xl font-bold text-primary">
                            {materials?.length ?? 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Materials</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-accent/10">
                          <div className="text-2xl font-bold text-accent">
                            {registrations?.length ?? 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Tests Registered</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-green-500/10">
                          <div className="text-2xl font-bold text-green-600">0</div>
                          <div className="text-sm text-muted-foreground">Tests Completed</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-yellow-500/10">
                          <div className="text-2xl font-bold text-yellow-600">-</div>
                          <div className="text-sm text-muted-foreground">Avg. Score</div>
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
    </div>
  );
};

export default Portal;
