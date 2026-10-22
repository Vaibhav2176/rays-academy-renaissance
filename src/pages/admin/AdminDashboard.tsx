import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Download,
  BookOpen,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Search,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ShieldCheck,
  Loader2,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface OrderRow {
  id: string;
  user_id: string;
  status: string;
  currency: string;
  subtotal_minor: number;
  discount_minor: number;
  total_minor: number;
  created_at: string;
  paid_at: string | null;
  user_email?: string;
  user_name?: string;
  payment_attempt?: {
    provider_order_id?: string;
    provider_payment_id?: string;
    payment_method?: string;
    status?: string;
  };
}

interface EntitlementRow {
  id: string;
  user_id: string;
  entitlement_scope: 'single_material' | 'subject_bundle' | 'course_bundle';
  material_id: string | null;
  course_slug: string | null;
  subject_slug: string | null;
  source: string;
  status: string;
  granted_at: string;
  user_email?: string;
  user_name?: string;
  material_title?: string;
}

interface DownloadRow {
  id: string;
  material_id: string;
  user_id: string | null;
  is_free_download: boolean;
  created_at: string;
  user_email?: string;
  material_title?: string;
  course_slug?: string;
  subject_slug?: string;
}

interface WebhookRow {
  id: string;
  provider: string;
  provider_event_id: string;
  event_type: string;
  processing_status: string;
  error_message: string | null;
  received_at: string;
  processed_at: string | null;
}

interface MaterialSummary {
  id: string;
  title: string;
  course_slug: string;
  subject_slug: string;
  is_free: boolean;
  status: string;
  review_status: string;
  price_minor: number;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Data states
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [entitlements, setEntitlements] = useState<EntitlementRow[]>([]);
  const [downloads, setDownloads] = useState<DownloadRow[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookRow[]>([]);
  const [materials, setMaterials] = useState<MaterialSummary[]>([]);

  // Filter states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [entitlementSearch, setEntitlementSearch] = useState('');
  const [downloadSearch, setDownloadSearch] = useState('');
  const [webhookStatusFilter, setWebhookStatusFilter] = useState('all');

  // Verify Admin Role
  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      if (authLoading) return;
      if (!user) {
        if (isMounted) {
          setIsAdmin(false);
          setCheckingRole(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (isMounted) {
          if (error || !data) {
            setIsAdmin(false);
          } else {
            setIsAdmin(true);
          }
        }
      } catch {
        if (isMounted) setIsAdmin(false);
      } finally {
        if (isMounted) setCheckingRole(false);
      }
    };

    verify();
    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch orders & payment attempts
      const { data: ordersData, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (ordersErr) console.warn('Orders query:', ordersErr.message);

      const { data: attemptsData } = await supabase
        .from('payment_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      // 2. Fetch entitlements
      const { data: entData, error: entErr } = await supabase
        .from('material_entitlements')
        .select('*')
        .order('granted_at', { ascending: false })
        .limit(150);

      if (entErr) console.warn('Entitlements query:', entErr.message);

      // 3. Fetch downloads
      const { data: dlData, error: dlErr } = await supabase
        .from('material_download_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(150);

      if (dlErr) console.warn('Downloads query:', dlErr.message);

      // 4. Fetch webhook events
      const { data: whData, error: whErr } = await supabase
        .from('payment_webhook_events')
        .select('*')
        .order('received_at', { ascending: false })
        .limit(100);

      if (whErr) console.warn('Webhooks query:', whErr.message);

      // 5. Fetch study materials
      const { data: matData, error: matErr } = await supabase
        .from('study_materials')
        .select('id, title, course_slug, subject_slug, is_free, status, review_status, price_minor, created_at')
        .order('created_at', { ascending: false });

      if (matErr) console.warn('Materials query:', matErr.message);

      // 6. Fetch profiles for user email / names mapping
      const { data: profData } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone');

      const profileMap = new Map<string, { name?: string; email?: string }>();
      (profData || []).forEach((p) => {
        profileMap.set(p.id, {
          name: p.full_name || undefined,
          email: p.email || undefined,
        });
      });

      const materialMap = new Map<string, MaterialSummary>();
      (matData || []).forEach((m) => {
        materialMap.set(m.id, m as MaterialSummary);
      });

      // Map payment attempt to order
      const attemptMap = new Map<string, any>();
      (attemptsData || []).forEach((a) => {
        if (a.order_id) {
          attemptMap.set(a.order_id, a);
        }
      });

      // Assemble Orders
      const assembledOrders: OrderRow[] = (ordersData || []).map((o) => {
        const prof = profileMap.get(o.user_id);
        const attempt = attemptMap.get(o.id);
        return {
          ...o,
          user_name: prof?.name,
          user_email: prof?.email,
          payment_attempt: attempt
            ? {
                provider_order_id: attempt.provider_order_id,
                provider_payment_id: attempt.provider_payment_id,
                payment_method: attempt.payment_method,
                status: attempt.status,
              }
            : undefined,
        };
      });

      // Assemble Entitlements
      const assembledEntitlements: EntitlementRow[] = (entData || []).map((e) => {
        const prof = profileMap.get(e.user_id);
        const mat = e.material_id ? materialMap.get(e.material_id) : undefined;
        return {
          ...e,
          user_name: prof?.name,
          user_email: prof?.email,
          material_title: mat?.title,
        };
      });

      // Assemble Downloads
      const assembledDownloads: DownloadRow[] = (dlData || []).map((d) => {
        const prof = d.user_id ? profileMap.get(d.user_id) : undefined;
        const mat = materialMap.get(d.material_id);
        return {
          ...d,
          user_email: prof?.email,
          material_title: mat?.title,
          course_slug: mat?.course_slug,
          subject_slug: mat?.subject_slug,
        };
      });

      setOrders(assembledOrders);
      setEntitlements(assembledEntitlements);
      setDownloads(assembledDownloads);
      setWebhooks(whData || []);
      setMaterials(matData || []);
      setLastRefreshed(new Date());
    } catch (err: any) {
      toast({
        title: 'Error loading dashboard',
        description: err.message || 'Failed to query database metrics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const paidOrders = orders.filter((o) => o.status === 'paid');
    const totalRevenueMinor = paidOrders.reduce((sum, o) => sum + (o.total_minor || 0), 0);
    const totalRevenue = totalRevenueMinor / 100;

    const coursePasses = entitlements.filter(
      (e) => e.entitlement_scope === 'course_bundle' && e.status === 'active'
    ).length;
    const subjectPasses = entitlements.filter(
      (e) => e.entitlement_scope === 'subject_bundle' && e.status === 'active'
    ).length;
    const singlePasses = entitlements.filter(
      (e) => e.entitlement_scope === 'single_material' && e.status === 'active'
    ).length;

    const publishedMaterials = materials.filter((m) => m.status === 'published').length;
    const draftMaterials = materials.filter((m) => m.status === 'draft').length;
    const freeMaterials = materials.filter((m) => m.is_free).length;

    const freeDownloads = downloads.filter((d) => d.is_free_download).length;
    const paidDownloads = downloads.filter((d) => !d.is_free_download).length;

    return {
      totalRevenue,
      paidOrdersCount: paidOrders.length,
      totalOrdersCount: orders.length,
      pendingOrdersCount: orders.filter((o) => o.status === 'pending').length,
      activeEntitlementsCount: entitlements.filter((e) => e.status === 'active').length,
      coursePasses,
      subjectPasses,
      singlePasses,
      publishedMaterials,
      draftMaterials,
      freeMaterials,
      totalMaterials: materials.length,
      totalDownloads: downloads.length,
      freeDownloads,
      paidDownloads,
    };
  }, [orders, entitlements, materials, downloads]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const term = orderSearch.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        o.id.toLowerCase().includes(term) ||
        (o.user_email && o.user_email.toLowerCase().includes(term)) ||
        (o.user_name && o.user_name.toLowerCase().includes(term)) ||
        (o.payment_attempt?.provider_payment_id &&
          o.payment_attempt.provider_payment_id.toLowerCase().includes(term));

      const matchesStatus =
        orderStatusFilter === 'all' || o.status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Entitlements
  const filteredEntitlements = useMemo(() => {
    return entitlements.filter((e) => {
      const term = entitlementSearch.toLowerCase().trim();
      if (!term) return true;
      return (
        (e.user_email && e.user_email.toLowerCase().includes(term)) ||
        (e.user_name && e.user_name.toLowerCase().includes(term)) ||
        (e.course_slug && e.course_slug.toLowerCase().includes(term)) ||
        (e.subject_slug && e.subject_slug.toLowerCase().includes(term)) ||
        (e.material_title && e.material_title.toLowerCase().includes(term))
      );
    });
  }, [entitlements, entitlementSearch]);

  // Filtered Downloads
  const filteredDownloads = useMemo(() => {
    return downloads.filter((d) => {
      const term = downloadSearch.toLowerCase().trim();
      if (!term) return true;
      return (
        (d.material_title && d.material_title.toLowerCase().includes(term)) ||
        (d.user_email && d.user_email.toLowerCase().includes(term)) ||
        (d.course_slug && d.course_slug.toLowerCase().includes(term)) ||
        (d.subject_slug && d.subject_slug.toLowerCase().includes(term))
      );
    });
  }, [downloads, downloadSearch]);

  // Filtered Webhooks
  const filteredWebhooks = useMemo(() => {
    return webhooks.filter((w) => {
      if (webhookStatusFilter === 'all') return true;
      return w.processing_status === webhookStatusFilter;
    });
  }, [webhooks, webhookStatusFilter]);

  if (checkingRole || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full border-destructive/20 shadow-lg">
          <CardHeader className="text-center">
            <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-2" />
            <CardTitle className="text-xl">Access Restricted</CardTitle>
            <CardDescription>
              Administrator privileges are required to view the Marketplace Operations Dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/portal')} variant="default">
              Return to Student Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/portal')}
                className="text-muted-foreground hover:text-foreground h-8 px-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Student Portal
              </Button>
              <Badge variant="secondary" className="font-mono text-xs">
                Admin Console
              </Badge>
            </div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              Marketplace Operations & Analytics
            </h1>
            <p className="text-muted-foreground text-sm">
              Live database reporting for Razorpay orders, student entitlements, download telemetry, and webhook idempotency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">
              Refreshed: {format(lastRefreshed, 'hh:mm:ss a')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboardData}
              disabled={loading}
              className="h-9"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/admin/materials')}
              className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Materials
            </Button>
          </div>
        </div>

        {/* Overview Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Revenue */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
                <span>Gross Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-foreground">
                ₹{metrics.totalRevenue.toLocaleString('en-IN')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              {metrics.paidOrdersCount} paid transactions
            </CardContent>
          </Card>

          {/* Orders */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-primary" />
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-foreground">
                {metrics.totalOrdersCount}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              {metrics.paidOrdersCount} paid · {metrics.pendingOrdersCount} pending
            </CardContent>
          </Card>

          {/* Entitlements */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
                <span>Active Entitlements</span>
                <Users className="w-4 h-4 text-purple-600" />
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-foreground">
                {metrics.activeEntitlementsCount}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              {metrics.coursePasses} course · {metrics.subjectPasses} subject passes
            </CardContent>
          </Card>

          {/* Materials */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
                <span>Catalog Items</span>
                <BookOpen className="w-4 h-4 text-amber-600" />
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-foreground">
                {metrics.totalMaterials}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              {metrics.publishedMaterials} live · {metrics.draftMaterials} in review
            </CardContent>
          </Card>

          {/* Downloads */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
                <span>Total Downloads</span>
                <Download className="w-4 h-4 text-blue-600" />
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-foreground">
                {metrics.totalDownloads}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
              {metrics.freeDownloads} free · {metrics.paidDownloads} paid
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Detail Tables */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 max-w-2xl bg-card border">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="entitlements" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Entitlements ({entitlements.length})</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Downloads ({downloads.length})</span>
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Webhooks ({webhooks.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* 1. Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Customer Orders & Razorpay Payments</CardTitle>
                    <CardDescription>
                      Full audit log of purchases, order creation, payment verification, and gross amounts.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px]">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search student, email, order ID..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="pl-9 h-9 text-xs"
                      />
                    </div>
                    <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                      <SelectTrigger className="h-9 text-xs w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No orders match the selected filters.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px]">Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment Ref</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((ord) => (
                          <TableRow key={ord.id}>
                            <TableCell className="font-mono text-xs">
                              {ord.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-xs text-foreground">
                                {ord.user_name || 'Student'}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {ord.user_email || ord.user_id.slice(0, 8)}
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-xs text-foreground">
                              ₹{(ord.total_minor / 100).toFixed(0)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  ord.status === 'paid'
                                    ? 'default'
                                    : ord.status === 'pending'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                                className={
                                  ord.status === 'paid'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white text-[11px]'
                                    : 'text-[11px]'
                                }
                              >
                                {ord.status.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs font-mono text-muted-foreground">
                              {ord.payment_attempt?.provider_payment_id ||
                                ord.payment_attempt?.provider_order_id ||
                                '-'}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(new Date(ord.created_at), 'dd MMM yyyy, hh:mm a')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. Entitlements Tab */}
          <TabsContent value="entitlements">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Student Material Entitlements</CardTitle>
                    <CardDescription>
                      Database records granting student download access via direct purchase, bundle pass, or free unlock.
                    </CardDescription>
                  </div>
                  <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search email, course, subject..."
                      value={entitlementSearch}
                      onChange={(e) => setEntitlementSearch(e.target.value)}
                      className="pl-9 h-9 text-xs"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredEntitlements.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No entitlements match the search term.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Scope</TableHead>
                          <TableHead>Target Asset / Course</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Granted At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEntitlements.map((ent) => (
                          <TableRow key={ent.id}>
                            <TableCell>
                              <div className="font-medium text-xs text-foreground">
                                {ent.user_name || 'Student'}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {ent.user_email || ent.user_id.slice(0, 8)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs capitalize">
                                {ent.entitlement_scope.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">
                              {ent.entitlement_scope === 'course_bundle' ? (
                                <span className="font-semibold text-primary uppercase">
                                  {ent.course_slug || 'Course Pass'}
                                </span>
                              ) : ent.entitlement_scope === 'subject_bundle' ? (
                                <span className="font-semibold text-foreground">
                                  {ent.subject_slug} ({ent.course_slug?.toUpperCase()})
                                </span>
                              ) : (
                                <span className="truncate max-w-xs block font-medium">
                                  {ent.material_title || ent.material_id?.slice(0, 8)}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground capitalize">
                              {ent.source.replace('_', ' ')}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={ent.status === 'active' ? 'default' : 'secondary'}
                                className={ent.status === 'active' ? 'bg-green-600 text-white text-[11px]' : 'text-[11px]'}
                              >
                                {ent.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(new Date(ent.granted_at), 'dd MMM yyyy, hh:mm a')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3. Downloads Tab */}
          <TabsContent value="downloads">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Download Telemetry & Security Audit</CardTitle>
                    <CardDescription>
                      Secure URL generation events tracked with user ID, material ID, and timestamp.
                    </CardDescription>
                  </div>
                  <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search downloaded notes, user..."
                      value={downloadSearch}
                      onChange={(e) => setDownloadSearch(e.target.value)}
                      className="pl-9 h-9 text-xs"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredDownloads.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No download events recorded.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material Title</TableHead>
                          <TableHead>Course / Subject</TableHead>
                          <TableHead>Access Type</TableHead>
                          <TableHead>User / Student</TableHead>
                          <TableHead>Downloaded At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDownloads.map((dl) => (
                          <TableRow key={dl.id}>
                            <TableCell className="font-medium text-xs text-foreground max-w-sm truncate">
                              {dl.material_title || dl.material_id.slice(0, 8)}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {dl.course_slug?.toUpperCase()} {dl.subject_slug ? `· ${dl.subject_slug}` : ''}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={dl.is_free_download ? 'secondary' : 'default'}
                                className={dl.is_free_download ? 'text-xs' : 'bg-primary text-primary-foreground text-xs'}
                              >
                                {dl.is_free_download ? 'Free Chapter' : 'Entitled Download'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {dl.user_email || (dl.user_id ? dl.user_id.slice(0, 8) : 'Anonymous')}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(new Date(dl.created_at), 'dd MMM yyyy, hh:mm a')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. Webhooks Tab */}
          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Razorpay Webhook Event Audit</CardTitle>
                    <CardDescription>
                      Asynchronous webhook events recorded with idempotency keys, verification timestamps, and error states.
                    </CardDescription>
                  </div>
                  <Select value={webhookStatusFilter} onValueChange={setWebhookStatusFilter}>
                    <SelectTrigger className="h-9 text-xs w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredWebhooks.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No webhook events recorded.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event ID</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Event Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Received At</TableHead>
                          <TableHead>Processed At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredWebhooks.map((wh) => (
                          <TableRow key={wh.id}>
                            <TableCell className="font-mono text-xs max-w-[150px] truncate">
                              {wh.provider_event_id}
                            </TableCell>
                            <TableCell className="text-xs uppercase font-mono">
                              {wh.provider}
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-foreground">
                              {wh.event_type}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  wh.processing_status === 'processed'
                                    ? 'default'
                                    : wh.processing_status === 'failed'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                                className={
                                  wh.processing_status === 'processed'
                                    ? 'bg-green-600 text-white text-[11px]'
                                    : 'text-[11px]'
                                }
                              >
                                {wh.processing_status.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(new Date(wh.received_at), 'dd MMM yyyy, hh:mm:ss a')}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {wh.processed_at
                                ? format(new Date(wh.processed_at), 'dd MMM yyyy, hh:mm:ss a')
                                : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

