"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { LogIn, Loader2, Eye, EyeOff, Shield, Lock, User, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";
import { toast } from "sonner";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = { username: string; password: string };

// ── Constellation canvas ──────────────────────────────────────────────────────
function ConstellationBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let id: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.4,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
      });
      for (let i = 0; i < dots.length; i++)
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / 150) * 0.18})`; ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
      dots.forEach((d) => {
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(167,139,250,0.45)"; ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full" />;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<"username" | "password" | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as Resolver<LoginFormData>,
    defaultValues: { username: "", password: "" },
  });

  const usernameField = register("username");
  const passwordField = register("password");

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

      {/* Base background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-[#0d0d1a] to-slate-950 -z-20" />

      {/* Constellation */}
      <ConstellationBg />

      {/* Radial glow */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(109,40,217,0.12),transparent)]" />

      {/* Animated orbs */}
      <motion.div animate={{ x:[0,50,0], y:[0,-40,0], scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:14, ease:"easeInOut" }}
        className="fixed left-[5%] top-[10%] h-80 w-80 rounded-full bg-purple-600/12 blur-[100px] -z-10" />
      <motion.div animate={{ x:[0,-40,0], y:[0,50,0], scale:[1,1.2,1] }} transition={{ repeat:Infinity, duration:18, ease:"easeInOut", delay:3 }}
        className="fixed right-[5%] bottom-[10%] h-96 w-96 rounded-full bg-blue-600/12 blur-[120px] -z-10" />
      <motion.div animate={{ scale:[1,1.4,1], opacity:[0.3,0.6,0.3] }} transition={{ repeat:Infinity, duration:10, ease:"easeInOut", delay:6 }}
        className="fixed left-[45%] top-[40%] h-56 w-56 rounded-full bg-violet-500/8 blur-[80px] -z-10" />

      {/* Twinkling dots edges */}
      {[{l:"2%",t:"15%",s:7,d:1.8,dl:0},{l:"1%",t:"50%",s:5,d:2.0,dl:0.5},{l:"2%",t:"80%",s:7,d:1.6,dl:0.9},
        {l:"96%",t:"20%",s:8,d:1.9,dl:0.3},{l:"97%",t:"55%",s:5,d:2.1,dl:0.7},{l:"96%",t:"85%",s:6,d:1.7,dl:0.2},
        {l:"40%",t:"2%",s:6,d:2.2,dl:0.6},{l:"62%",t:"96%",s:5,d:1.9,dl:0.8}].map((s,i)=>(
        <motion.div key={i} className="fixed z-0 rounded-full bg-violet-300 pointer-events-none"
          style={{left:s.l,top:s.t,width:s.s,height:s.s,boxShadow:`0 0 ${s.s*2}px ${s.s}px rgba(139,92,246,0.4)`}}
          animate={{opacity:[0.2,0.8,0.2],scale:[0.7,1.3,0.7]}}
          transition={{repeat:Infinity,duration:s.d,delay:s.dl,ease:"easeInOut"}} />
      ))}
      {[{l:"1%",t:"30%",dl:0.3},{l:"97%",t:"38%",dl:1.0},{l:"2%",t:"65%",dl:0.7},{l:"96%",t:"70%",dl:0.5}].map((c,i)=>(
        <motion.div key={i} className="fixed z-0 pointer-events-none" style={{left:c.l,top:c.t}}
          animate={{opacity:[0,0.6,0],scale:[0.6,1.2,0.6]}}
          transition={{repeat:Infinity,duration:2.2+i*0.3,delay:c.dl,ease:"easeInOut"}}>
          <svg width="14" height="14" viewBox="0 0 14 14"><line x1="7" y1="0" x2="7" y2="14" stroke="rgba(167,139,250,0.8)" strokeWidth="2" strokeLinecap="round"/><line x1="0" y1="7" x2="14" y2="7" stroke="rgba(167,139,250,0.8)" strokeWidth="2" strokeLinecap="round"/></svg>
        </motion.div>
      ))}

      {/* Edge travellers */}
      {[0,1,2].map(i=>(
        <motion.div key={`t${i}`} className="fixed top-0 h-[2px] w-20 rounded-full bg-gradient-to-r from-transparent via-violet-400/50 to-transparent pointer-events-none z-0"
          animate={{left:["-8%","108%"]}} transition={{repeat:Infinity,duration:6+i*1.5,delay:i*2,ease:"linear"}} />
      ))}
      {[0,1].map(i=>(
        <motion.div key={`b${i}`} className="fixed bottom-0 h-[2px] w-24 rounded-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent pointer-events-none z-0"
          animate={{left:["108%","-8%"]}} transition={{repeat:Infinity,duration:8+i*2,delay:i*3,ease:"linear"}} />
      ))}

      {/* Login card */}
      <div className="relative z-10 w-full max-w-sm">

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 4, delay: 2 }}
            className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-xl shadow-violet-500/30"
          >
            <Shield className="size-8 text-white" />
          </motion.div>
          <motion.h1
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Admin Panel
          </motion.h1>
          <motion.p
            className="mt-1 text-sm text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Portfolio Content Management System
          </motion.p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.15 }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          {/* Top gradient bar */}
          <motion.div
            className="h-[2px] bg-gradient-to-r from-transparent via-violet-500/80 to-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />

          <div className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-white">Sign in</h2>
              <p className="mt-1 text-sm text-slate-400">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Username */}
              <motion.div
                animate={{ scale: focused === "username" ? 1.01 : 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="username" className="text-sm font-medium text-slate-300">
                  Username
                </Label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 size-4 -translate-y-1/2 transition-colors ${focused === "username" ? "text-violet-400" : "text-slate-500"}`} />
                  <Input
                    id="username"
                    placeholder="Enter username"
                    autoComplete="username"
                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600 transition-all focus-visible:border-violet-500/60 focus-visible:ring-violet-500/20"
                    {...usernameField}
                    onFocus={() => setFocused("username")}
                    onBlur={(e) => { usernameField.onBlur(e); setFocused(null); }}
                  />
                </div>
                <AnimatePresence>
                  {errors.username && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-xs text-red-400">{errors.username.message}</motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password */}
              <motion.div
                animate={{ scale: focused === "password" ? 1.01 : 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 size-4 -translate-y-1/2 transition-colors ${focused === "password" ? "text-violet-400" : "text-slate-500"}`} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="border-white/10 bg-white/5 pl-10 pr-10 text-white placeholder:text-slate-600 transition-all focus-visible:border-violet-500/60 focus-visible:ring-violet-500/20"
                    {...passwordField}
                    onFocus={() => setFocused("password")}
                    onBlur={(e) => { passwordField.onBlur(e); setFocused(null); }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300">
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-xs text-red-400">{errors.password.message}</motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.97 }}
                className="relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/40 disabled:opacity-60"
              >
                {/* Shine */}
                <motion.span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  whileHover={{ translateX: "200%" }}
                  transition={{ duration: 0.55 }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <><Loader2 className="size-4 animate-spin" />Signing in...</>
                  ) : (
                    <><LogIn className="size-4" />Sign In</>
                  )}
                </span>
              </motion.button>
            </form>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/[0.06] px-8 py-4 flex items-center justify-center gap-2">
            <motion.div animate={{ rotate: [0,20,-10,0], scale:[1,1.15,1] }} transition={{ repeat:Infinity, duration:4, delay:3 }}>
              <Sparkles className="size-3 text-violet-400/60" />
            </motion.div>
            <p className="text-xs text-slate-600">Protected area &middot; Authorized personnel only</p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-6 text-center text-xs text-slate-700"
        >
          &copy; 2025 Ly Van Quang Trung &middot; Portfolio CMS
        </motion.p>
      </div>
    </div>
  );
}
