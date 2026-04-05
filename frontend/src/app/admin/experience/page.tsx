"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray, Controller, Resolver } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Experience } from "@/types";
import {
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/api";

// ─────────────────────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────────────────────

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional().default(""),
  sortOrder: z.coerce.number().optional().default(0),
});

const phaseSchema = z.object({
  name: z.string().min(1, "Phase name is required"),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  teamSize: z.coerce.number().optional().default(0),
  sortOrder: z.coerce.number().optional().default(0),
  roles: z.array(roleSchema).optional().default([]),
});

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  projectName: z.string().optional().default(""),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().default(""),
  goal: z.string().optional().default(""),
  technologies: z.string().optional().default(""),
  logoUrl: z.string().optional().default(""),
  sortOrder: z.coerce.number().optional().default(0),
  phases: z.array(phaseSchema).optional().default([]),
});

type ExperienceFormData = {
  company: string;
  position: string;
  projectName: string;
  startDate: string;
  endDate: string;
  goal: string;
  technologies: string;
  logoUrl: string;
  sortOrder: number;
  phases: {
    name: string;
    startDate: string;
    endDate: string;
    teamSize: number;
    sortOrder: number;
    roles: {
      name: string;
      description: string;
      sortOrder: number;
    }[];
  }[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({});

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema) as Resolver<ExperienceFormData>,
    defaultValues: {
      company: "",
      position: "",
      projectName: "",
      startDate: "",
      endDate: "",
      goal: "",
      technologies: "",
      logoUrl: "",
      sortOrder: 0,
      phases: [],
    },
  });

  const {
    fields: phaseFields,
    append: appendPhase,
    remove: removePhase,
  } = useFieldArray({
    control,
    name: "phases",
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
    setExpandedPhases({});
    reset({
      company: "",
      position: "",
      projectName: "",
      startDate: "",
      endDate: "",
      goal: "",
      technologies: "",
      logoUrl: "",
      sortOrder: 0,
      phases: [],
    });
    setDialogOpen(true);
  };

  const openEditDialog = (exp: Experience) => {
    setEditingExperience(exp);
    setExpandedPhases({});
    reset({
      company: exp.company,
      position: exp.position,
      projectName: exp.projectName || "",
      startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
      endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
      goal: exp.goal || "",
      technologies: (exp.technologies || []).join(", "),
      logoUrl: exp.logoUrl || "",
      sortOrder: exp.sortOrder,
      phases: (exp.phases || []).map((phase) => ({
        name: phase.name,
        startDate: phase.startDate ? phase.startDate.split("T")[0] : "",
        endDate: phase.endDate ? phase.endDate.split("T")[0] : "",
        teamSize: phase.teamSize || 0,
        sortOrder: phase.sortOrder,
        roles: (phase.roles || []).map((role) => ({
          name: role.name,
          description: role.description || "",
          sortOrder: role.sortOrder,
        })),
      })),
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: ExperienceFormData) => {
    setSaving(true);
    const payload = {
      ...data,
      projectName: data.projectName || null,
      endDate: data.endDate || null,
      technologies: data.technologies
        ? data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      phases: data.phases?.map((phase, pIndex) => ({
        ...phase,
        startDate: phase.startDate || null,
        endDate: phase.endDate || null,
        sortOrder: phase.sortOrder ?? pIndex,
        roles: phase.roles?.map((role, rIndex) => ({
          ...role,
          sortOrder: role.sortOrder ?? rIndex,
        })) || [],
      })) || [],
    };
    try {
      if (editingExperience) {
        await updateExperience(editingExperience.id, payload);
        toast.success("Experience updated successfully");
      } else {
        await createExperience(payload);
        toast.success("Experience created successfully");
      }
      setDialogOpen(false);
      await loadExperiences();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save experience");
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
      toast.error(err instanceof Error ? err.message : "Failed to delete experience");
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

  const togglePhaseExpanded = (index: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const countTotalRoles = (exp: Experience) => {
    return (exp.phases || []).reduce((sum, phase) => sum + (phase.roles?.length || 0), 0);
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
            Manage your work experience with phases and roles
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />} onClick={openCreateDialog}>
            <Plus className="size-4" />
            Add Experience
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      placeholder="Company name"
                      {...register("company")}
                    />
                    {errors.company && (
                      <p className="text-xs text-destructive">{errors.company.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      placeholder="Job title (e.g. Java Developer)"
                      {...register("position")}
                    />
                    {errors.position && (
                      <p className="text-xs text-destructive">{errors.position.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="Project name (e.g. E-commerce Platform)"
                    {...register("projectName")}
                  />
                  <p className="text-xs text-muted-foreground">
                    The name of the project you worked on
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input id="startDate" type="date" {...register("startDate")} />
                    {errors.startDate && (
                      <p className="text-xs text-destructive">{errors.startDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" {...register("endDate")} />
                    <p className="text-xs text-muted-foreground">Leave empty for current</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Goal</Label>
                  <Textarea
                    id="goal"
                    placeholder="Project goal or objective..."
                    rows={2}
                    {...register("goal")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe the main goal of this experience/project
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies</Label>
                  <Input
                    id="technologies"
                    placeholder="Java 21, Spring Boot 3, PostgreSQL, Docker..."
                    {...register("technologies")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of technologies used
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input id="logoUrl" placeholder="https://..." {...register("logoUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input id="sortOrder" type="number" {...register("sortOrder")} />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Phases */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Phases</h3>
                    <p className="text-sm text-muted-foreground">
                      Add project phases with their roles
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      appendPhase({
                        name: "",
                        startDate: "",
                        endDate: "",
                        teamSize: 0,
                        sortOrder: phaseFields.length,
                        roles: [],
                      });
                      setExpandedPhases((prev) => ({
                        ...prev,
                        [phaseFields.length]: true,
                      }));
                    }}
                  >
                    <Plus className="size-4" />
                    Add Phase
                  </Button>
                </div>

                {phaseFields.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      No phases yet. Click &quot;Add Phase&quot; to add one.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {phaseFields.map((phaseField, phaseIndex) => (
                      <PhaseCard
                        key={phaseField.id}
                        phaseIndex={phaseIndex}
                        control={control}
                        register={register}
                        errors={errors}
                        isExpanded={expandedPhases[phaseIndex] ?? false}
                        onToggle={() => togglePhaseExpanded(phaseIndex)}
                        onRemove={() => removePhase(phaseIndex)}
                      />
                    ))}
                  </div>
                )}
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
                  <TableHead>Phases</TableHead>
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
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {exp.phases?.length || 0} phases
                        </Badge>
                        <Badge variant="outline">
                          {countTotalRoles(exp)} roles
                        </Badge>
                      </div>
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
                          <AlertDialogTrigger render={<Button variant="ghost" size="icon" />}>
                            <Trash2 className="size-4 text-destructive" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete your experience at &quot;
                                {exp.company}&quot;? This will also delete all phases and
                                roles. This action cannot be undone.
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

// ─────────────────────────────────────────────────────────────────────────────
// PhaseCard Component
// ─────────────────────────────────────────────────────────────────────────────

interface PhaseCardProps {
  phaseIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

function PhaseCard({
  phaseIndex,
  control,
  register,
  errors,
  isExpanded,
  onToggle,
  onRemove,
}: PhaseCardProps) {
  const {
    fields: roleFields,
    append: appendRole,
    remove: removeRole,
  } = useFieldArray({
    control,
    name: `phases.${phaseIndex}.roles`,
  });

  return (
    <Card className="border-l-4 border-l-primary/50">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex items-center gap-2 hover:underline">
              {isExpanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
              <Controller
                control={control}
                name={`phases.${phaseIndex}.name`}
                render={({ field }) => (
                  <span className="font-medium">
                    {field.value || `Phase ${phaseIndex + 1}`}
                  </span>
                )}
              />
              <Badge variant="secondary" className="ml-2">
                {roleFields.length} roles
              </Badge>
            </CollapsibleTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Phase Name *</Label>
                <Input
                  placeholder="e.g., Phase 1 - Development"
                  {...register(`phases.${phaseIndex}.name`)}
                />
                {errors.phases?.[phaseIndex]?.name && (
                  <p className="text-xs text-destructive">
                    {errors.phases[phaseIndex].name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  {...register(`phases.${phaseIndex}.sortOrder`)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  {...register(`phases.${phaseIndex}.startDate`)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  {...register(`phases.${phaseIndex}.endDate`)}
                />
              </div>
            </div>

            <Separator />

            {/* Roles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Roles in this Phase</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendRole({
                      name: "",
                      description: "",
                      sortOrder: roleFields.length,
                    })
                  }
                >
                  <Plus className="size-4" />
                  Add Role
                </Button>
              </div>

              {roleFields.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No roles yet. Click &quot;Add Role&quot; to add one.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {roleFields.map((roleField, roleIndex) => (
                    <div
                      key={roleField.id}
                      className="rounded-lg border bg-muted/30 p-3 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          <Label>Role Name *</Label>
                          <Input
                            placeholder="e.g., Backend Developer"
                            {...register(
                              `phases.${phaseIndex}.roles.${roleIndex}.name`
                            )}
                          />
                          {errors.phases?.[phaseIndex]?.roles?.[roleIndex]?.name && (
                            <p className="text-xs text-destructive">
                              {errors.phases[phaseIndex].roles[roleIndex].name.message}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-6"
                          onClick={() => removeRole(roleIndex)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe your responsibilities..."
                          rows={2}
                          {...register(
                            `phases.${phaseIndex}.roles.${roleIndex}.description`
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

