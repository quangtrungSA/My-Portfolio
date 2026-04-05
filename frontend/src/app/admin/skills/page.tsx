"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Resolver } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
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
import type { Skill, SkillCategory } from "@/types";
import {
  fetchSkills,
  fetchSkillCategories,
  createSkill,
  updateSkill,
  deleteSkill,
  type SkillInput,
} from "@/lib/api";

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  proficiencyLevel: z.coerce.number().min(0).max(100),
  icon: z.string().optional().default(""),
  sortOrder: z.coerce.number().optional().default(0),
});

type SkillFormData = {
  name: string;
  categoryId: string;
  proficiencyLevel: number;
  icon: string;
  sortOrder: number;
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema) as Resolver<SkillFormData>,
    defaultValues: {
      name: "",
      categoryId: "",
      proficiencyLevel: 50,
      icon: "",
      sortOrder: 0,
    },
  });

  const loadData = useCallback(async () => {
    try {
      const [skillsRes, categoriesRes] = await Promise.all([
        fetchSkills(),
        fetchSkillCategories(),
      ]);
      setSkills(skillsRes.data ?? []);
      setCategories(categoriesRes.data ?? []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateDialog = () => {
    setEditingSkill(null);
    reset({
      name: "",
      categoryId: categories[0]?.id ?? "",
      proficiencyLevel: 80,
      icon: "",
      sortOrder: 0,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (skill: Skill) => {
    setEditingSkill(skill);
    reset({
      name: skill.name,
      categoryId: skill.category?.id ?? "",
      proficiencyLevel: skill.proficiencyLevel,
      icon: skill.icon,
      sortOrder: skill.sortOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: SkillFormData) => {
    setSaving(true);
    const payload: SkillInput = {
      name: data.name,
      categoryId: data.categoryId,
      proficiencyLevel: data.proficiencyLevel,
      icon: data.icon,
      sortOrder: data.sortOrder,
    };
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, payload);
        toast.success("Skill updated successfully");
      } else {
        await createSkill(payload);
        toast.success("Skill created successfully");
      }
      setDialogOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id);
      toast.success("Skill deleted successfully");
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete skill");
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
          <h2 className="text-2xl font-bold tracking-tight">Skills</h2>
          <p className="text-sm text-muted-foreground">
            Manage your skills and proficiency levels
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />} onClick={openCreateDialog}>
            <Plus className="size-4" />
            Add Skill
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </DialogTitle>
              <DialogDescription>
                {editingSkill
                  ? "Update the skill details below."
                  : "Fill in the details for the new skill."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="e.g. React" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <NativeSelect
                  id="categoryId"
                  className="w-full"
                  {...register("categoryId")}
                >
                  <NativeSelectOption value="">Select a category…</NativeSelectOption>
                  {categories.map((cat) => (
                    <NativeSelectOption key={cat.id} value={cat.id}>
                      {cat.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {errors.categoryId && (
                  <p className="text-xs text-destructive">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="proficiencyLevel">Proficiency (0-100)</Label>
                <Input
                  id="proficiencyLevel"
                  type="number"
                  min={0}
                  max={100}
                  {...register("proficiencyLevel")}
                />
                {errors.proficiencyLevel && (
                  <p className="text-xs text-destructive">
                    {errors.proficiencyLevel.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input id="icon" placeholder="e.g. react" {...register("icon")} />
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
                  ) : editingSkill ? (
                    "Update Skill"
                  ) : (
                    "Create Skill"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No skills found.</p>
              <Button variant="link" onClick={openCreateDialog}>
                Add your first skill
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Proficiency</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>{skill.category?.name ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${skill.proficiencyLevel}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {skill.proficiencyLevel}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(skill)}
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
                              <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{skill.name}
                                &quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleDelete(skill.id)}
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

