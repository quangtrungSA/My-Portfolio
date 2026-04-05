"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Resolver } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Certification } from "@/types";
import {
  fetchCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from "@/lib/api";
import { format } from "date-fns";

const certificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuingOrg: z.string().min(1, "Issuing organization is required"),
  credentialId: z.string().optional().default(""),
  credentialUrl: z.string().optional().default(""),
  badgeUrl: z.string().optional().default(""),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().optional().default(""),
  sortOrder: z.coerce.number().optional().default(0),
});

type CertificationFormData = {
  name: string;
  issuingOrg: string;
  credentialId: string;
  credentialUrl: string;
  badgeUrl: string;
  issueDate: string;
  expiryDate: string;
  sortOrder: number;
};

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "MMM yyyy");
  } catch {
    return dateStr;
  }
}

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema) as Resolver<CertificationFormData>,
    defaultValues: {
      name: "",
      issuingOrg: "",
      credentialId: "",
      credentialUrl: "",
      badgeUrl: "",
      issueDate: "",
      expiryDate: "",
      sortOrder: 0,
    },
  });

  const loadCertifications = useCallback(async () => {
    try {
      const res = await fetchCertifications();
      setCertifications(res.data ?? []);
    } catch {
      toast.error("Failed to load certifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

  const openCreateDialog = () => {
    setEditingCert(null);
    reset({
      name: "",
      issuingOrg: "",
      credentialId: "",
      credentialUrl: "",
      badgeUrl: "",
      issueDate: "",
      expiryDate: "",
      sortOrder: 0,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (cert: Certification) => {
    setEditingCert(cert);
    reset({
      name: cert.name,
      issuingOrg: cert.issuingOrg,
      credentialId: cert.credentialId,
      credentialUrl: cert.credentialUrl,
      badgeUrl: cert.badgeUrl,
      issueDate: cert.issueDate ? cert.issueDate.slice(0, 10) : "",
      expiryDate: cert.expiryDate ? cert.expiryDate.slice(0, 10) : "",
      sortOrder: cert.sortOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: CertificationFormData) => {
    setSaving(true);
    const payload = {
      ...data,
      expiryDate: data.expiryDate || null,
    };
    try {
      if (editingCert) {
        await updateCertification(editingCert.id, payload);
        toast.success("Certification updated successfully");
      } else {
        await createCertification(payload);
        toast.success("Certification created successfully");
      }
      setDialogOpen(false);
      await loadCertifications();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save certification"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCertification(id);
      toast.success("Certification deleted successfully");
      await loadCertifications();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete certification"
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Certifications</h2>
          <p className="text-sm text-muted-foreground">
            Manage your professional certifications and credentials
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />} onClick={openCreateDialog}>
            <Plus className="size-4" />
            Add Certification
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingCert ? "Edit Certification" : "Add New Certification"}
              </DialogTitle>
              <DialogDescription>
                {editingCert
                  ? "Update the certification details below."
                  : "Fill in the details for the new certification."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. AWS Solutions Architect"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuingOrg">Issuing Organization</Label>
                <Input
                  id="issuingOrg"
                  placeholder="e.g. Amazon Web Services"
                  {...register("issuingOrg")}
                />
                {errors.issuingOrg && (
                  <p className="text-xs text-destructive">
                    {errors.issuingOrg.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    {...register("issueDate")}
                  />
                  {errors.issueDate && (
                    <p className="text-xs text-destructive">
                      {errors.issueDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    {...register("expiryDate")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="credentialId">Credential ID (optional)</Label>
                <Input
                  id="credentialId"
                  placeholder="e.g. ABC123XYZ"
                  {...register("credentialId")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credentialUrl">Credential URL (optional)</Label>
                <Input
                  id="credentialUrl"
                  placeholder="https://..."
                  {...register("credentialUrl")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="badgeUrl">Badge Image URL (optional)</Label>
                <Input
                  id="badgeUrl"
                  placeholder="https://..."
                  {...register("badgeUrl")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  {...register("sortOrder")}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingCert ? (
                    "Update Certification"
                  ) : (
                    "Create Certification"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {certifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">
                No certifications found.
              </p>
              <Button variant="link" onClick={openCreateDialog}>
                Add your first certification
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Issuing Org</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.name}</TableCell>
                    <TableCell>{cert.issuingOrg}</TableCell>
                    <TableCell>{formatDate(cert.issueDate)}</TableCell>
                    <TableCell>
                      {cert.expiryDate
                        ? formatDate(cert.expiryDate)
                        : "No Expiry"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(cert)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={<Button variant="ghost" size="icon" />}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Certification
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {cert.name}&quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleDelete(cert.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
