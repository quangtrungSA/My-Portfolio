"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Resolver } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Profile } from "@/types";
import { fetchProfile, updateProfile } from "@/lib/api";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().optional().default(""),
  avatarUrl: z.string().optional().default(""),
  resumeUrl: z.string().optional().default(""),
  email: z.string().email("Invalid email").optional().default(""),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
});

type ProfileFormData = {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  email: string;
  phone: string;
  location: string;
};

interface SocialLink {
  key: string;
  value: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormData>,
  });

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetchProfile();
      const data = res.data;
      setProfile(data);
      reset({
        name: data.name,
        title: data.title,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        resumeUrl: data.resumeUrl,
        email: data.email,
        phone: data.phone,
        location: data.location,
      });
      // Build social links array from individual fields
      const links: SocialLink[] = [];
      if (data.githubUrl) links.push({ key: "github", value: data.githubUrl });
      if (data.linkedinUrl) links.push({ key: "linkedin", value: data.linkedinUrl });
      if (data.leetcodeUrl) links.push({ key: "leetcode", value: data.leetcodeUrl });
      if (data.facebookUrl) links.push({ key: "facebook", value: data.facebookUrl });
      if (data.instagramUrl) links.push({ key: "instagram", value: data.instagramUrl });
      if (data.dailydevUrl) links.push({ key: "dailydev", value: data.dailydevUrl });
      if (data.redditUrl) links.push({ key: "reddit", value: data.redditUrl });
      if (data.twitterUrl) links.push({ key: "twitter", value: data.twitterUrl });
      if (data.websiteUrl) links.push({ key: "website", value: data.websiteUrl });
      setSocialLinks(links.length > 0 ? links : [{ key: "", value: "" }]);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const addSocialLink = () => {
    setSocialLinks((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSocialLink = (
    index: number,
    field: "key" | "value",
    val: string
  ) => {
    setSocialLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: val } : link))
    );
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;
    setSaving(true);

    // Build individual social link fields from array
    const socialData: Record<string, string | undefined> = {
      githubUrl: undefined,
      linkedinUrl: undefined,
      leetcodeUrl: undefined,
      facebookUrl: undefined,
      instagramUrl: undefined,
      dailydevUrl: undefined,
      redditUrl: undefined,
      twitterUrl: undefined,
      websiteUrl: undefined,
    };
    
    socialLinks.forEach((link) => {
      if (link.key.trim() && link.value.trim()) {
        const key = link.key.trim().toLowerCase();
        const fieldName = `${key}Url` as keyof typeof socialData;
        if (fieldName in socialData) {
          socialData[fieldName] = link.value.trim();
        }
      }
    });

    try {
      await updateProfile({
        ...data,
        githubUrl: socialData.githubUrl,
        linkedinUrl: socialData.linkedinUrl,
        leetcodeUrl: socialData.leetcodeUrl,
        facebookUrl: socialData.facebookUrl,
        instagramUrl: socialData.instagramUrl,
        dailydevUrl: socialData.dailydevUrl,
        redditUrl: socialData.redditUrl,
        twitterUrl: socialData.twitterUrl,
        websiteUrl: socialData.websiteUrl,
      });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">
          No profile found. Create one from your backend first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your personal information and social links
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Basic details about you that appear on the portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Full Stack Developer"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Write something about yourself..."
                rows={5}
                {...register("bio")}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  placeholder="https://..."
                  {...register("avatarUrl")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resumeUrl">Resume URL</Label>
                <Input
                  id="resumeUrl"
                  placeholder="https://..."
                  {...register("resumeUrl")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              How people can reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  {...register("phone")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  {...register("location")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Add links to your social profiles
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialLink}
              >
                <Plus className="size-4" />
                Add Link
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  placeholder="Platform (e.g. github)"
                  value={link.key}
                  onChange={(e) =>
                    updateSocialLink(index, "key", e.target.value)
                  }
                  className="w-40"
                />
                <Input
                  placeholder="URL (e.g. https://github.com/username)"
                  value={link.value}
                  onChange={(e) =>
                    updateSocialLink(index, "value", e.target.value)
                  }
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocialLink(index)}
                  disabled={socialLinks.length <= 1}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
