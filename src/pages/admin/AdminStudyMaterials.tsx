import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ArrowLeft,
  Loader2,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  CANONICAL_COURSES,
  getSubjectsForCourse,
  getChaptersForSubject,
} from "@/data/canonicalSyllabus";

interface StudyMaterialAdminItem {
  id: string;
  title: string;
  description: string | null;
  course_slug: string;
  subject_slug: string;
  section_name: string | null;
  resource_type: string;
  chapter_number: number | null;
  subject_sequence_number: number | null;
  is_free: boolean;
  price_minor: number;
  price: number;
  status: "draft" | "published" | "archived";
  review_status: "draft" | "in_review" | "approved" | "rejected";
  reviewed_at: string | null;
  published_at: string | null;
  created_at: string;
  versions?: StudyMaterialVersionItem[];
  classes?: { id: string; name: string } | null;
}

interface StudyMaterialVersionItem {
  id: string;
  material_id: string;
  version_number: number;
  storage_path: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  checksum_sha256: string;
  is_current: boolean;
  approval_status: "draft" | "in_review" | "approved" | "rejected";
  approved_at: string | null;
  created_at: string;
}

async function extractEdgeFunctionError(error: any, fallbackMessage: string): Promise<string> {
  if (!error) return fallbackMessage;
  try {
    if (error.context && typeof error.context.json === "function") {
      const cloned = error.context.clone ? error.context.clone() : error.context;
      const data = await cloned.json();
      if (data?.error) return data.error;
    }
  } catch {
    // Ignore JSON parsing failure and fallback to error message
  }
  return error.message || fallbackMessage;
}

const AdminStudyMaterials: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [materials, setMaterials] = useState<StudyMaterialAdminItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Metadata Dialog State
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterialAdminItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCourse, setFormCourse] = useState("nda");
  const [formSubject, setFormSubject] = useState("maths");
  const [formSection, setFormSection] = useState("");
  const [formResourceType, setFormResourceType] = useState("chapter");
  const [formChapterNumber, setFormChapterNumber] = useState<string>("");
  const [formSubjectSequence, setFormSubjectSequence] = useState<string>("");
  const [formDescription, setFormDescription] = useState("");
  const [savingMetadata, setSavingMetadata] = useState(false);

  // Upload Dialog State
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadTargetMaterial, setUploadTargetMaterial] = useState<StudyMaterialAdminItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Review & Publish Dialog State
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewTargetMaterial, setReviewTargetMaterial] = useState<StudyMaterialAdminItem | null>(null);
  const [actionProcessing, setActionProcessing] = useState(false);

  const availableFormSubjects = React.useMemo(() => {
    return getSubjectsForCourse(formCourse);
  }, [formCourse]);

  const availableFormChapters = React.useMemo(() => {
    return getChaptersForSubject(formCourse, formSubject);
  }, [formCourse, formSubject]);

  const duplicateMaterial = React.useMemo(() => {
    if (!formCourse || !formSubject || !formSubjectSequence) return null;
    return materials.find(
      (m) =>
        (!editingMaterial || m.id !== editingMaterial.id) &&
        m.course_slug === formCourse &&
        m.subject_slug === formSubject &&
        String(m.subject_sequence_number) === String(formSubjectSequence)
    );
  }, [materials, editingMaterial, formCourse, formSubject, formSubjectSequence]);

  // 1. Verify Admin Role
  useEffect(() => {
    const checkRole = async () => {
      if (authLoading) return;
      if (!user) {
        setIsAdmin(false);
        setCheckingRole(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (error || !data) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    checkRole();
  }, [user, authLoading]);

  // 2. Fetch Materials via Edge Function
  const fetchMaterials = async () => {
    if (!user) return;
    setLoadingList(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("No session token available");

      const { data, error } = await supabase.functions.invoke("admin-materials", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { action: "list" },
      });

      if (error) {
        const errorMsg = await extractEdgeFunctionError(error, "Failed to load materials");
        throw new Error(errorMsg);
      }
      if (data?.error) throw new Error(data.error);

      setMaterials(data.materials || []);
      return (data.materials || []) as StudyMaterialAdminItem[];
    } catch (err: any) {
      toast({
        title: "Error fetching materials",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchMaterials();
    }
  }, [isAdmin]);

  // Handle Save Metadata
  const handleSaveMetadata = async () => {
    if (!formTitle.trim() || !formCourse.trim() || !formSubject.trim()) {
      toast({
        title: "Missing Required Fields",
        description: "Title, course, and subject are required.",
        variant: "destructive",
      });
      return;
    }

    if (formResourceType === "chapter" && (!formSubjectSequence || Number(formSubjectSequence) < 1)) {
      toast({
        title: "Subject Sequence Required",
        description: "Chapter materials require a positive subject sequence number.",
        variant: "destructive",
      });
      return;
    }

    setSavingMetadata(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const payload = {
        action: "save_metadata",
        metadata: {
          id: editingMaterial ? editingMaterial.id : undefined,
          title: formTitle.trim(),
          course_slug: formCourse.trim(),
          subject_slug: formSubject.trim(),
          section_name: formSection.trim() || null,
          resource_type: formResourceType,
          chapter_number: formChapterNumber ? Number(formChapterNumber) : null,
          subject_sequence_number: formSubjectSequence ? Number(formSubjectSequence) : null,
          description: formDescription.trim() || null,
        },
      };

      const { data, error } = await supabase.functions.invoke("admin-materials", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (error) {
        const errorMsg = await extractEdgeFunctionError(error, "Failed to save metadata");
        throw new Error(errorMsg);
      }
      if (data?.error) throw new Error(data.error);

      toast({
        title: editingMaterial ? "Material Updated" : "Material Draft Created",
        description: `Saved: ${formTitle} (${data.material?.is_free ? "Free" : "₹49 Paid"})`,
      });

      setMetadataDialogOpen(false);
      resetMetadataForm();
      fetchMaterials();
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSavingMetadata(false);
    }
  };

  // Handle PDF Upload
  const handleUploadPdf = async () => {
    if (!uploadTargetMaterial || !selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a valid PDF file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "PDF file size must not exceed 50 MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const formData = new FormData();
      formData.append("materialId", uploadTargetMaterial.id);
      formData.append("file", selectedFile);

      const { data, error } = await supabase.functions.invoke("admin-materials", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (error) {
        const errorMsg = await extractEdgeFunctionError(error, "Upload failed");
        throw new Error(errorMsg);
      }
      if (data?.error) throw new Error(data.error);

      toast({
        title: "PDF Revision Uploaded",
        description: `Version ${data.version?.version_number} uploaded. SHA-256: ${data.checksum_sha256?.slice(0, 12)}...`,
      });

      setUploadDialogOpen(false);
      setSelectedFile(null);
      fetchMaterials();
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle Version Approval
  const handleApproveVersion = async (materialId: string, versionId: string) => {
    setActionProcessing(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const { data, error } = await supabase.functions.invoke("admin-materials", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          action: "approve_version",
          materialId,
          versionId,
        },
      });

      if (error) {
        const errorMsg = await extractEdgeFunctionError(error, "Approval failed");
        throw new Error(errorMsg);
      }
      if (data?.error) throw new Error(data.error);

      toast({
        title: "Version Approved",
        description: "Version approved and designated as active current version.",
      });

      const updatedList = await fetchMaterials();
      if (updatedList) {
        const updatedTarget = updatedList.find((m) => m.id === materialId);
        if (updatedTarget) {
          setReviewTargetMaterial(updatedTarget);
        }
      }
    } catch (err: any) {
      toast({
        title: "Approval Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setActionProcessing(false);
    }
  };

  // Handle Publish Material
  const handlePublishMaterial = async (materialId: string) => {
    setActionProcessing(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const { data, error } = await supabase.functions.invoke("admin-materials", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          action: "publish",
          materialId,
        },
      });

      if (error) {
        const errorMsg = await extractEdgeFunctionError(error, "Publication failed");
        throw new Error(errorMsg);
      }
      if (data?.error) throw new Error(data.error);

      toast({
        title: "Material Published Successfully!",
        description: `Marketplace product linked: ${data.productSlug}`,
      });

      const updatedList = await fetchMaterials();
      if (updatedList && reviewTargetMaterial?.id === materialId) {
        const updatedTarget = updatedList.find((m) => m.id === materialId);
        if (updatedTarget) {
          setReviewTargetMaterial(updatedTarget);
        }
      }
    } catch (err: any) {
      toast({
        title: "Publication Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setActionProcessing(false);
    }
  };

  // Handle Archive / Unpublish Material
  const handleArchiveMaterial = async (materialId: string) => {
    setActionProcessing(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const { data, error } = await supabase.functions.invoke("admin-materials", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          action: "archive",
          materialId,
        },
      });

      if (error) {
        const errorMsg = await extractEdgeFunctionError(error, "Archive failed");
        throw new Error(errorMsg);
      }
      if (data?.error) throw new Error(data.error);

      toast({
        title: "Material Unpublished",
        description: "Material and linked marketplace product have been archived.",
      });

      const updatedList = await fetchMaterials();
      if (updatedList && reviewTargetMaterial?.id === materialId) {
        const updatedTarget = updatedList.find((m) => m.id === materialId);
        if (updatedTarget) {
          setReviewTargetMaterial(updatedTarget);
        }
      }
    } catch (err: any) {
      toast({
        title: "Unpublish Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setActionProcessing(false);
    }
  };

  const resetMetadataForm = () => {
    setEditingMaterial(null);
    setFormTitle("");
    setFormCourse("nda");
    setFormSubject("maths");
    setFormSection("");
    setFormResourceType("chapter");
    setFormChapterNumber("");
    setFormSubjectSequence("");
    setFormDescription("");
  };

  const openCreateDialog = () => {
    resetMetadataForm();
    setMetadataDialogOpen(true);
  };

  const openEditDialog = (mat: StudyMaterialAdminItem) => {
    setEditingMaterial(mat);
    setFormTitle(mat.title);
    setFormCourse(mat.course_slug);
    setFormSubject(mat.subject_slug);
    setFormSection(mat.section_name || "");
    setFormResourceType(mat.resource_type);
    setFormChapterNumber(mat.chapter_number ? String(mat.chapter_number) : "");
    setFormSubjectSequence(mat.subject_sequence_number ? String(mat.subject_sequence_number) : "");
    setFormDescription(mat.description || "");
    setMetadataDialogOpen(true);
  };

  const openUploadDialog = (mat: StudyMaterialAdminItem) => {
    setUploadTargetMaterial(mat);
    setSelectedFile(null);
    setUploadDialogOpen(true);
  };

  const openReviewDialog = (mat: StudyMaterialAdminItem) => {
    setReviewTargetMaterial(mat);
    setReviewDialogOpen(true);
  };

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
              Administrator or Faculty privileges are required to access Study Material Management.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate("/portal")} variant="default">
              Return to Student Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.course_slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject_slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "all" || m.course_slug === filterCourse;
    const matchesStatus = filterStatus === "all" || m.status === filterStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-muted/20 pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/portal")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Portal
              </Button>
              <Badge variant="secondary" className="font-mono text-xs">
                Faculty & Admin
              </Badge>
            </div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              Study Material Administration
            </h1>
            <p className="text-muted-foreground text-sm">
              Author topics, upload PDF revisions, conduct faculty reviews, and manage marketplace publication.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchMaterials} disabled={loadingList}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loadingList ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={openCreateDialog} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Study Material
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, course, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {CANONICAL_COURSES.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Materials Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Study Materials Catalog ({filteredMaterials.length})</CardTitle>
            <CardDescription>
              Sequenced chapter materials follow the database rule: Sequences 1–2 are automatically free; sequences 3+ are ₹49.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingList ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No study materials found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title & Section</TableHead>
                      <TableHead>Course / Subject</TableHead>
                      <TableHead>Seq #</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead>Faculty Review</TableHead>
                      <TableHead>Publication</TableHead>
                      <TableHead>Current Version</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((mat) => {
                      const currentVer = mat.versions?.find((v) => v.is_current);
                      return (
                        <TableRow key={mat.id}>
                          <TableCell>
                            <div className="font-medium text-foreground">{mat.title}</div>
                            {mat.section_name && (
                              <div className="text-xs text-muted-foreground">Section: {mat.section_name}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-semibold uppercase">{mat.course_slug}</div>
                            <div className="text-xs text-muted-foreground capitalize">{mat.subject_slug}</div>
                          </TableCell>
                          <TableCell>
                            {mat.resource_type === "chapter" ? (
                              <Badge variant="outline" className="font-mono">
                                #{mat.subject_sequence_number}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">{mat.resource_type}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {mat.is_free ? (
                              <Badge className="bg-green-600 text-white">FREE</Badge>
                            ) : (
                              <Badge variant="secondary" className="font-mono">
                                ₹{mat.price}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {mat.review_status === "approved" && (
                              <Badge className="bg-emerald-600/10 text-emerald-700 border-emerald-300">
                                <CheckCircle className="w-3 h-3 mr-1" /> Approved
                              </Badge>
                            )}
                            {mat.review_status === "in_review" && (
                              <Badge className="bg-blue-600/10 text-blue-700 border-blue-300">
                                <Clock className="w-3 h-3 mr-1" /> In Review
                              </Badge>
                            )}
                            {mat.review_status === "draft" && (
                              <Badge variant="outline" className="text-amber-700 border-amber-300">
                                Draft
                              </Badge>
                            )}
                            {mat.review_status === "rejected" && (
                              <Badge variant="destructive">Rejected</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {mat.status === "published" && (
                              <Badge className="bg-primary text-primary-foreground">Published</Badge>
                            )}
                            {mat.status === "draft" && <Badge variant="outline">Unpublished</Badge>}
                            {mat.status === "archived" && <Badge variant="secondary">Archived</Badge>}
                          </TableCell>
                          <TableCell>
                            {currentVer ? (
                              <div className="text-xs">
                                <span className="font-semibold text-primary">v{currentVer.version_number}</span>
                                <div className="text-muted-foreground truncate max-w-[120px]" title={currentVer.original_filename}>
                                  {currentVer.original_filename}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-amber-600">No active PDF</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {mat.status !== "published" && mat.review_status === "approved" && currentVer?.approval_status === "approved" && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white font-medium"
                                  onClick={() => handlePublishMaterial(mat.id)}
                                  disabled={actionProcessing}
                                  title="Publish to Marketplace"
                                >
                                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Publish
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openUploadDialog(mat)}
                                title="Upload new PDF revision"
                              >
                                <Upload className="w-3.5 h-3.5 mr-1" /> PDF
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => openReviewDialog(mat)}
                                title="Review versions & publish"
                              >
                                <Sparkles className="w-3.5 h-3.5 mr-1" /> Review
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditDialog(mat)}
                                title="Edit metadata"
                              >
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog 1: Create / Edit Metadata */}
        <Dialog open={metadataDialogOpen} onOpenChange={setMetadataDialogOpen}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMaterial ? "Edit Study Material" : "Create Study Material Draft"}</DialogTitle>
              <DialogDescription>
                Chapter materials must specify canonical subject sequence numbers. Sequence 1 & 2 are free; sequence 3+ are ₹49.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {/* Course & Subject Cascading Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course">Course / Target Exam *</Label>
                  <Select
                    value={formCourse}
                    onValueChange={(val) => {
                      setFormCourse(val);
                      const subs = getSubjectsForCourse(val);
                      if (subs.length > 0) {
                        setFormSubject(subs[0].slug);
                      }
                    }}
                  >
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {CANONICAL_COURSES.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={formSubject}
                    onValueChange={(val) => {
                      setFormSubject(val);
                    }}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFormSubjects.map((s) => (
                        <SelectItem key={s.slug} value={s.slug}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Syllabus Chapter Helper Dropdown */}
              {availableFormChapters.length > 0 && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border/70 space-y-1.5">
                  <Label htmlFor="canonicalChapter" className="text-xs font-semibold text-primary">
                    ⚡ Auto-Fill From Canonical Syllabus
                  </Label>
                  <Select
                    value="none"
                    onValueChange={(val) => {
                      if (val === "none") return;
                      const chapIndex = Number(val);
                      const chap = availableFormChapters[chapIndex];
                      if (chap) {
                        const courseObj = CANONICAL_COURSES.find((c) => c.slug === formCourse);
                        const subjObj = availableFormSubjects.find((s) => s.slug === formSubject);
                        const prefix = `${courseObj ? courseObj.name.split(" ")[0] : formCourse.toUpperCase()} ${subjObj ? subjObj.name : formSubject}`;
                        setFormTitle(`${prefix} - Topic ${chap.sequence} (${chap.title})`);
                        setFormSubjectSequence(String(chap.sequence));
                        if (chap.chapterNumber) setFormChapterNumber(String(chap.chapterNumber));
                        if (chap.section) setFormSection(chap.section);
                      }
                    }}
                  >
                    <SelectTrigger id="canonicalChapter" className="bg-background h-9 text-xs">
                      <SelectValue placeholder="Choose syllabus chapter to auto-fill..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select chapter to auto-fill --</SelectItem>
                      {availableFormChapters.map((chap, idx) => (
                        <SelectItem key={idx} value={String(idx)} className="text-xs">
                          Topic {chap.sequence}: {chap.title} {chap.isFree ? "(FREE)" : "(₹49)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    Selecting a topic automatically fills title, sequence #, chapter #, and section.
                  </p>
                </div>
              )}

              {/* Duplicate Detection Warning */}
              {duplicateMaterial && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold mb-0.5">Topic Already Exists in Database</p>
                    <p>
                      Sequence #{formSubjectSequence} is already occupied by "<strong>{duplicateMaterial.title}</strong>" ({duplicateMaterial.status}).
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-amber-500/40 bg-background"
                        onClick={() => {
                          setMetadataDialogOpen(false);
                          openUploadDialog(duplicateMaterial);
                        }}
                      >
                        <Upload className="w-3.5 h-3.5 mr-1" /> Upload PDF Revision
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-amber-500/40 bg-background"
                        onClick={() => {
                          openEditDialog(duplicateMaterial);
                        }}
                      >
                        Edit Existing
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., NDA Maths - Topic 1 (Sets and Relations)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section">Syllabus Section</Label>
                  <Input
                    id="section"
                    placeholder="e.g., Algebra, Trigonometry"
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="resourceType">Resource Type</Label>
                  <Select value={formResourceType} onValueChange={setFormResourceType}>
                    <SelectTrigger id="resourceType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chapter">Chapter (Sequenced)</SelectItem>
                      <SelectItem value="pyq">Previous Year Questions</SelectItem>
                      <SelectItem value="sample_paper">Sample Paper</SelectItem>
                      <SelectItem value="formula_sheet">Formula Sheet</SelectItem>
                      <SelectItem value="revision_notes">Revision Notes</SelectItem>
                      <SelectItem value="important_questions">Important Questions</SelectItem>
                      <SelectItem value="ncert">NCERT Solution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subjectSeq">
                    Subject Sequence # {formResourceType === "chapter" ? "*" : "(Optional)"}
                  </Label>
                  <Input
                    id="subjectSeq"
                    type="number"
                    min="1"
                    placeholder="e.g., 1, 2, 3..."
                    value={formSubjectSequence}
                    onChange={(e) => setFormSubjectSequence(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Unique per course & subject. Seq 1–2 = Free.
                  </p>
                </div>
                <div>
                  <Label htmlFor="chapterNum">Chapter / Unit # (Optional)</Label>
                  <Input
                    id="chapterNum"
                    type="number"
                    min="1"
                    placeholder="e.g., 1"
                    value={formChapterNumber}
                    onChange={(e) => setFormChapterNumber(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Summary of topics covered, difficulty level, or exam relevance..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMetadataDialogOpen(false)} disabled={savingMetadata}>
                Cancel
              </Button>
              <Button onClick={handleSaveMetadata} disabled={savingMetadata}>
                {savingMetadata ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editingMaterial ? "Update Material" : "Create Draft"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog 2: Upload PDF Revision */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload PDF Revision</DialogTitle>
              <DialogDescription>
                Upload an official PDF for: <strong>{uploadTargetMaterial?.title}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div className="p-4 border-2 border-dashed rounded-lg text-center bg-muted/20">
                <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                <Label htmlFor="pdfFileInput" className="cursor-pointer font-medium text-sm text-primary block">
                  {selectedFile ? selectedFile.name : "Select PDF Document (Max 50MB)"}
                </Label>
                <input
                  id="pdfFileInput"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setSelectedFile(f);
                  }}
                />
                {selectedFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Uploaded PDFs start in <em>draft</em> status and require Faculty Review before replacing the active version.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
                Cancel
              </Button>
              <Button onClick={handleUploadPdf} disabled={uploading || !selectedFile}>
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog 3: Faculty Review & Publish */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Faculty Review & Marketplace Publication</DialogTitle>
              <DialogDescription>
                {reviewTargetMaterial?.title} ({reviewTargetMaterial?.course_slug.toUpperCase()} - {reviewTargetMaterial?.subject_slug})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-2">
              <div>
                <h4 className="font-semibold text-sm mb-2">Version History</h4>
                {reviewTargetMaterial?.versions && reviewTargetMaterial.versions.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {reviewTargetMaterial.versions.map((ver) => (
                      <div
                        key={ver.id}
                        className={`p-3 rounded-lg border flex items-center justify-between text-sm ${
                          ver.is_current ? "bg-primary/5 border-primary/30" : "bg-card"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Version {ver.version_number}</span>
                            {ver.is_current && <Badge className="bg-primary text-xs">Current Active</Badge>}
                            <Badge
                              variant={ver.approval_status === "approved" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {ver.approval_status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {ver.original_filename} • {(ver.file_size_bytes / 1024).toFixed(1)} KB
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono truncate max-w-sm" title={ver.checksum_sha256}>
                            SHA-256: {ver.checksum_sha256}
                          </div>
                        </div>
                        <div>
                          {ver.approval_status !== "approved" && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveVersion(reviewTargetMaterial.id, ver.id)}
                              disabled={actionProcessing}
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve & Set Active
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-muted/30 rounded-lg text-center text-sm text-muted-foreground">
                    No PDF versions have been uploaded for this material yet.
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-muted/40 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">Marketplace Publication Status</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Requires faculty approval and an approved current PDF version.
                    </p>
                  </div>
                  {reviewTargetMaterial?.status === "published" ? (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">Live on Marketplace</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleArchiveMaterial(reviewTargetMaterial!.id)}
                        disabled={actionProcessing}
                      >
                        Unpublish
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white font-medium"
                      onClick={() => handlePublishMaterial(reviewTargetMaterial!.id)}
                      disabled={
                        actionProcessing ||
                        reviewTargetMaterial?.review_status !== "approved" ||
                        !reviewTargetMaterial?.versions?.some((v) => v.is_current && v.approval_status === "approved")
                      }
                    >
                      <Sparkles className="w-4 h-4 mr-2" /> Publish to Marketplace
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminStudyMaterials;

