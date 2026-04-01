"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Resolver } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import type { Education } from "@/types";
import {
  fetchEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "@/lib/api";

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().default(""),
  description: z.string().optional().default(""),
  logoUrl: z.string().optional().default(""),
  sortOrder: z.coerce.number().optional().default(0),
});

type EducationFormData = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  logoUrl: string;
  sortOrder: number;
};

export default function AdminEducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema) as Resolver<EducationFormData>,
  });

  const loadEducation = useCallback(async () => {
    try {
      const res = await fetchEducation();
      setEducations(res.data ?? []);
    } catch {
      toast.error("Failed to load education entries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEducation();
  }, [loadEducation]);

  const openCreateDialog = () => {
    setEditingEducation(null);
    reset({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
      logoUrl: "",
      sortOrder: 0,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (edu: Education) => {
    setEditingEducation(edu);
    reset({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate ? edu.startDate.split("T")[0] : "",
      endDate: edu.endDate ? edu.endDate.split("T")[0] : "",
      description: edu.description,
      logoUrl: edu.logoUrl,
      sortOrder: edu.sortOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: EducationFormData) => {
    setSaving(true);
    const payload = {
      ...data,
      endDate: data.endDate || null,
    };
    try {
      if (editingEducation) {
        await updateEducation(editingEducation.id, payload);
        toast.success("Education updated successfully");
      } else {
        await createEducation(payload as Omit<Education, "id">);
        toast.success("Education created successfully");
      }
      setDialogOpen(false);
      await loadEducation();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save education"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEducation(id);
      toast.success("Education entry deleted successfully");
      await loadEducation();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete education"
      );
    }
  };

  const formatDateRange = (start: string, end: string | null) => {
    const startStr = new Date(start).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    const endStr = end
      ? new Date(end).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "Present";
    return `${startStr} - ${endStr}`;
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
          <h2 className="text-2xl font-bold tracking-tight">Education</h2>
          <p className="text-sm text-muted-foreground">
            Manage your educational background
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />} onClick={openCreateDialog}>
            <Plus className="size-4" />
            Add Education
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEducation ? "Edit Education" : "Add New Education"}
              </DialogTitle>
              <DialogDescription>
                {editingEducation
                  ? "Update the education details below."
                  : "Fill in the details for the new education entry."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  placeholder="University or school name"
                  {...register("institution")}
                />
                {errors.institution && (
                  <p className="text-xs text-destructive">
                    {errors.institution.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  placeholder="e.g. Bachelor of Science"
                  {...register("degree")}
                />
                {errors.degree && (
                  <p className="text-xs text-destructive">
                    {errors.degree.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="field">Field of Study</Label>
                <Input
                  id="field"
                  placeholder="e.g. Computer Science"
                  {...register("field")}
                />
                {errors.field && (
                  <p className="text-xs text-destructive">
                    {errors.field.message}
                  </p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-destructive">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" {...register("endDate")} />
                  <p className="text-xs text-muted-foreground">
                    Leave empty if currently studying
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details, honors, etc."
                  rows={3}
                  {...register("description")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  placeholder="https://..."
                  {...register("logoUrl")}
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
                  ) : editingEducation ? (
                    "Update Education"
                  ) : (
                    "Create Education"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {educations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No education entries found.</p>
              <Button variant="link" onClick={openCreateDialog}>
                Add your first education entry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Institution</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {educations.map((edu) => (
                  <TableRow key={edu.id}>
                    <TableCell className="font-medium">
                      {edu.institution}
                    </TableCell>
                    <TableCell>{edu.degree}</TableCell>
                    <TableCell>{edu.field}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(edu)}
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
                                Delete Education
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {edu.institution}&quot;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleDelete(edu.id)}
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
