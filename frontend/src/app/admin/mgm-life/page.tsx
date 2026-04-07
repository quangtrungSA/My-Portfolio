"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Resolver } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Play } from "lucide-react";
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
import type { MgmLifeItem } from "@/types";
import {
  fetchAllMgmLifeItems,
  createMgmLifeItem,
  updateMgmLifeItem,
  deleteMgmLifeItem,
} from "@/lib/api";

const CATEGORIES = [
  { value: "ENGLISH_CLASS", label: "English Class" },
  { value: "HAPPY_FRIDAY", label: "Happy Friday" },
  { value: "COMPANY_OVERVIEW", label: "Company Overview" },
  { value: "GENERAL", label: "General" },
] as const;

const MEDIA_TYPES = [
  { value: "IMAGE", label: "Image" },
  { value: "VIDEO", label: "Video (Google Drive embed)" },
] as const;

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  mediaType: z.enum(["IMAGE", "VIDEO"]),
  mediaUrl: z.string().optional().default(""),
  thumbnailUrl: z.string().optional().default(""),
  category: z.enum(["ENGLISH_CLASS", "HAPPY_FRIDAY", "COMPANY_OVERVIEW", "GENERAL"]),
  sortOrder: z.coerce.number().optional().default(0),
  published: z.boolean().optional().default(true),
});

type FormData = {
  title: string;
  description: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  thumbnailUrl: string;
  category: "ENGLISH_CLASS" | "HAPPY_FRIDAY" | "COMPANY_OVERVIEW" | "GENERAL";
  sortOrder: number;
  published: boolean;
};

const CATEGORY_COLORS: Record<string, string> = {
  ENGLISH_CLASS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  HAPPY_FRIDAY: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  COMPANY_OVERVIEW: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  GENERAL: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function AdminMgmLifePage() {
  const [items, setItems] = useState<MgmLifeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MgmLifeItem | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      title: "",
      description: "",
      mediaType: "IMAGE",
      mediaUrl: "",
      thumbnailUrl: "",
      category: "GENERAL",
      sortOrder: 0,
      published: true,
    },
  });

  const publishedValue = watch("published");
  const mediaTypeValue = watch("mediaType");

  const loadItems = useCallback(async () => {
    try {
      const res = await fetchAllMgmLifeItems();
      setItems(res.data ?? []);
    } catch {
      toast.error("Failed to load MGM Life items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const openCreateDialog = () => {
    setEditingItem(null);
    reset({
      title: "",
      description: "",
      mediaType: "IMAGE",
      mediaUrl: "",
      thumbnailUrl: "",
      category: "GENERAL",
      sortOrder: 0,
      published: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: MgmLifeItem) => {
    setEditingItem(item);
    reset({
      title: item.title,
      description: item.description ?? "",
      mediaType: item.mediaType,
      mediaUrl: item.mediaUrl ?? "",
      thumbnailUrl: item.thumbnailUrl ?? "",
      category: item.category,
      sortOrder: item.sortOrder,
      published: item.published,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      if (editingItem) {
        await updateMgmLifeItem(editingItem.id, data);
        toast.success("Item updated successfully");
      } else {
        await createMgmLifeItem(data);
        toast.success("Item created successfully");
      }
      setDialogOpen(false);
      await loadItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMgmLifeItem(id);
      toast.success("Item deleted successfully");
      await loadItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete item");
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
          <h2 className="text-2xl font-bold tracking-tight">MGM Life</h2>
          <p className="text-sm text-muted-foreground">
            Manage media items for the MGM Life page (images &amp; videos)
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />} onClick={openCreateDialog}>
            <Plus className="size-4" />
            Add Item
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit MGM Life Item" : "Add New Item"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Update the media item details below."
                  : "Add a new image or video to the MGM Life page."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Happy Friday tháng 3"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Short description..."
                  rows={2}
                  {...register("description")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mediaType">Media Type</Label>
                  <select
                    id="mediaType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...register("mediaType")}
                  >
                    {MEDIA_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...register("category")}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaUrl">
                  {mediaTypeValue === "VIDEO"
                    ? "Google Drive Embed URL"
                    : "Image URL (Google Drive direct link)"}
                </Label>
                <Input
                  id="mediaUrl"
                  placeholder={
                    mediaTypeValue === "VIDEO"
                      ? "https://drive.google.com/file/d/FILE_ID/preview"
                      : "https://drive.google.com/uc?export=view&id=FILE_ID"
                  }
                  {...register("mediaUrl")}
                />
                {mediaTypeValue === "VIDEO" && (
                  <p className="text-xs text-muted-foreground">
                    Open the file in Drive → Share → Copy link, then change{" "}
                    <code>/view</code> to <code>/preview</code>
                  </p>
                )}
              </div>

              {mediaTypeValue === "VIDEO" && (
                <div className="space-y-2">
                  <Label htmlFor="thumbnailUrl">Thumbnail Image URL (optional)</Label>
                  <Input
                    id="thumbnailUrl"
                    placeholder="https://drive.google.com/uc?export=view&id=..."
                    {...register("thumbnailUrl")}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input id="sortOrder" type="number" {...register("sortOrder")} />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={publishedValue}
                  onCheckedChange={(checked: boolean) =>
                    setValue("published", checked)
                  }
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingItem ? (
                    "Update Item"
                  ) : (
                    "Create Item"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No MGM Life items found.</p>
              <Button variant="link" onClick={openCreateDialog}>
                Add your first item
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {item.mediaType === "VIDEO" ? (
                          <Play className="size-3.5 text-muted-foreground" />
                        ) : (
                          <ImageIcon className="size-3.5 text-muted-foreground" />
                        )}
                        <span className="text-sm">{item.mediaType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.GENERAL
                        }`}
                      >
                        {CATEGORIES.find((c) => c.value === item.category)?.label ??
                          item.category}
                      </span>
                    </TableCell>
                    <TableCell>{item.sortOrder}</TableCell>
                    <TableCell>
                      {item.published ? (
                        <Badge>Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
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
                              <AlertDialogTitle>Delete Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{item.title}
                                &quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleDelete(item.id)}
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
