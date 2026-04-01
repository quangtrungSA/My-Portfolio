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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Experience } from "@/types";
import {
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/api";

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().default(""),
  description: z.string().optional().default(""),
  logoUrl: z.string().optional().default(""),
  sortOrder: z.coerce.number().optional().default(0),
});

type ExperienceFormData = {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  logoUrl: string;
  sortOrder: number;
};

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema) as Resolver<ExperienceFormData>,
  });

  const loadExperiences = useCallback(async () => {
    try {
      const res = await fetchExperiences();
      setExperiences(res.data ?? []);
    } catch {
      toast.error("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const openCreateDialog = () => {
    setEditingExperience(null);
    reset({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      logoUrl: "",
      sortOrder: 0,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (exp: Experience) => {
    setEditingExperience(exp);
    reset({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
      endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
      description: exp.description,
      logoUrl: exp.logoUrl,
      sortOrder: exp.sortOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: ExperienceFormData) => {
    setSaving(true);
    const payload = {
      ...data,
      endDate: data.endDate || null,
    };
    try {
      if (editingExperience) {
        await updateExperience(editingExperience.id, payload);
        toast.success("Experience updated successfully");
      } else {
        await createExperience(payload as Omit<Experience, "id">);
        toast.success("Experience created successfully");
      }
      setDialogOpen(false);
      await loadExperiences();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save experience"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExperience(id);
      toast.success("Experience deleted successfully");
      await loadExperiences();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete experience"
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
          <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
          <p className="text-sm text-muted-foreground">
            Manage your work experience
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />} onClick={openCreateDialog}>
            <Plus className="size-4" />
            Add Experience
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </DialogTitle>
              <DialogDescription>
                {editingExperience
                  ? "Update the experience details below."
                  : "Fill in the details for the new experience."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Company name"
                  {...register("company")}
                />
                {errors.company && (
                  <p className="text-xs text-destructive">
                    {errors.company.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="Job title"
                  {...register("position")}
                />
                {errors.position && (
                  <p className="text-xs text-destructive">
                    {errors.position.message}
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
                    Leave empty for current position
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your role and achievements..."
                  rows={4}
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
                  ) : editingExperience ? (
                    "Update Experience"
                  ) : (
                    "Create Experience"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {experiences.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No experiences found.</p>
              <Button variant="link" onClick={openCreateDialog}>
                Add your first experience
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiences.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell className="font-medium">{exp.company}</TableCell>
                    <TableCell>{exp.position}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </span>
                      {!exp.endDate && (
                        <Badge variant="secondary" className="ml-2">
                          Current
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(exp)}
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
                                Delete Experience
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete your experience
                                at &quot;{exp.company}&quot;? This action cannot
                                be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleDelete(exp.id)}
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
