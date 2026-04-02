"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Loader2, Eye, EyeOff, Shield, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { login } from "@/lib/api";
import { toast } from "sonner";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = {
  username: string;
  password: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as Resolver<LoginFormData>,
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      toast.success("Welcome back!");
      router.replace("/admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />

      {/* Floating orbs */}
      <div className="fixed left-1/4 top-1/4 size-72 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
      <div className="fixed bottom-1/4 right-1/4 size-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl [animation-delay:1s]" />
      <div className="fixed left-1/2 top-1/2 size-64 animate-pulse rounded-full bg-cyan-500/5 blur-3xl [animation-delay:2s]" />

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/25">
            <Shield className="size-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-400">
            Portfolio Content Management System
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-lg text-white">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm text-slate-300">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    autoComplete="username"
                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus-visible:border-purple-500/50 focus-visible:ring-purple-500/20"
                    {...register("username")}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-400">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="border-white/10 bg-white/5 pl-10 pr-10 text-white placeholder:text-slate-500 focus-visible:border-purple-500/50 focus-visible:ring-purple-500/20"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/40"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="size-4" />
                    Sign In
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-slate-500">
                Protected area &middot; Authorized personnel only
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-600">
          &copy; 2025 Ly Van Quang Trung &middot; Portfolio CMS
        </p>
      </div>
    </div>
  );
}
