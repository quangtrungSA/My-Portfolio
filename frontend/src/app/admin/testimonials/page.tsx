"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Resolver } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Testimonial } from "@/types";
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/api";

const testimonialSchema = z.object({
  authorName: z.string().min(1, "Author name is required"),
  authorTitle: z.string().min(1, "Author title is required"),
  authorAvatar: z.string().optional().default(""),
  content: z.string().min(1, "Content is required"),
  rating: z.coerce.number().min(1).max(5),
  featured: z.boolean().optional().default(false),
  sortOrder: z.coerce.number().optional().default(0),
});

type TestimonialFormData = {
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  content: string;
  rating: number;
  featured: boolean;
  sortOrder: number;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema) as Resolver<TestimonialFormData>,
    defaultValues: {
      authorName: "",
      authorTitle: "",
      authorAvatar: "",
      content: "",
      rating: 5,
      featured: false,
      sortOrder: 0,
    },
  });

  const featuredValue = watch("featured");

  const loadTestimonials = useCallback(async () => {
    try {
      const res = await fetchTestimonials();
      setTestimonials(res.data ?? []);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const openCreateDialog = () => {
    setEditingTestimonial(null);
    reset({
      authorName: "",
      authorTitle: "",
      authorAvatar: "",
      content: "",
      rating: 5,
      featured: false,
      sortOrder: 0,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    reset({
      authorName: testimonial.authorName,
      authorTitle: testimonial.authorTitle,
      authorAvatar: testimonial.authorAvatar,
      content: testimonial.content,
      rating: testimonial.rating,
      featured: testimonial.featured,
      sortOrder: testimonial.sortOrder,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: TestimonialFormData) => {
    setSaving(true);
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, data);
        toast.success("Testimonial updated successfully");
      } else {
        await createTestimonial(data);
        toast.success("Testimonial created successfully");
      }
      setDialogOpen(false);
      await loadTestimonials();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save testimonial"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted successfully");
      await loadTestimonials();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete testimonial"
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
          <h2 className="text-2xl font-bold tracking-tight">Testimonials</h2>
          <p className="text-sm text-muted-foreground">
            Manage testimonials and recommendations
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />} onClick={openCreateDialog}>
            <Plus className="size-4" />
            Add Testimonial
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial
                  ? "Edit Testimonial"
                  : "Add New Testimonial"}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial
                  ? "Update the testimonial details below."
                  : "Fill in the details for the new testimonial."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="authorName">Author Name</Label>
                <Input
                  id="authorName"
                  placeholder="e.g. John Doe"
                  {...register("authorName")}
                />
                {errors.authorName && (
                  <p className="text-xs text-destructive">
                    {errors.authorName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorTitle">Author Title</Label>
                <Input
                  id="authorTitle"
                  placeholder="e.g. CTO at Company"
                  {...register("authorTitle")}
                />
                {errors.authorTitle && (
                  <p className="text-xs text-destructive">
                    {errors.authorTitle.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorAvatar">Avatar URL (optional)</Label>
                <Input
                  id="authorAvatar"
                  placeholder="https://..."
                  {...register("authorAvatar")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write the testimonial content..."
                  rows={4}
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-xs text-destructive">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    {...register("rating")}
                  />
                  {errors.rating && (
                    <p className="text-xs text-destructive">
                      {errors.rating.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    {...register("sortOrder")}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={featuredValue}
                  onCheckedChange={(checked: boolean) =>
                    setValue("featured", checked)
                  }
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingTestimonial ? (
                    "Update Testimonial"
                  ) : (
                    "Create Testimonial"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No testimonials found.</p>
              <Button variant="link" onClick={openCreateDialog}>
                Add your first testimonial
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">
                      {testimonial.authorName}
                    </TableCell>
                    <TableCell>{testimonial.authorTitle}</TableCell>
                    <TableCell>
                      <StarRating rating={testimonial.rating} />
                    </TableCell>
                    <TableCell>
                      {testimonial.featured ? (
                        <Badge>Featured</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(testimonial)}
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
                                Delete Testimonial
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the testimonial
                                from &quot;{testimonial.authorName}&quot;? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleDelete(testimonial.id)}
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
