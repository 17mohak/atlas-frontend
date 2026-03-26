"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// 1. Zod Schema: Type-safe form validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// 2. Inline SVG Component for the ATLAS Cube
const AtlasCube = () => (
  <svg width="100" height="115" viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
    <path d="M50 5 L95 30 L50 55 L5 30 Z" fill="hsl(var(--primary))" />
    <path d="M5 30 L50 55 L50 105 L5 80 Z" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="2" />
    <path d="M50 55 L95 30 L95 80 L50 105 Z" fill="hsl(var(--accent))" />
  </svg>
);

export default function AtlasLandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize React Hook Form with Zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // 3. API Integration with Developer Bypass
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      // --- DEVELOPER BYPASS ---
      // Skips the live API for testing the dashboard UI
      if (data.email === "admin@atlasuniversity.edu.in" && data.password === "password") {
        console.log("Developer Bypass Activated!");
        sessionStorage.setItem("accessToken", "dev_dummy_token");
        router.push('/dashboard');
        return;
      }

      // --- LIVE API FALLBACK ---
      const LIVE_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://testing.isdi.in";

      const response = await fetch(`${LIVE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const result = await response.json();

      // Store tokens securely
      sessionStorage.setItem("accessToken", result.accessToken);
      sessionStorage.setItem("refreshToken", result.refreshToken);

      // Navigate to the dashboard layout
      router.push('/dashboard');

    } catch (error) {
      form.setError("root", { message: "Authentication failed. Please verify your credentials." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">

      {/* Top Right Nav Button */}
      <div className="absolute top-8 right-12 z-50">
        <Button
          variant="ghost"
          onClick={() => setShowLogin(!showLogin)}
          className="rounded-full px-8 tracking-widest text-xs font-bold hover:bg-accent/50 transition-colors"
        >
          {showLogin ? "CANCEL" : "LOGIN"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {!showLogin ? (
          // --- LANDING STATE ---
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center space-y-10"
          >
            <AtlasCube />
            <div className="space-y-4">
              <h1 className="text-7xl font-black tracking-[0.2em] italic text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
                ATLAS
              </h1>
              <p className="text-slate-400/80 text-sm tracking-[0.3em] font-light uppercase">
                The Architect of Academic Time
              </p>
            </div>
            <Button
              onClick={() => setShowLogin(true)}
              size="lg"
              className="rounded-full px-12 py-8 text-sm font-bold tracking-[0.2em] shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:scale-105 transition-all duration-300"
            >
              INITIALIZE <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          // --- LOGIN STATE ---
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md px-6"
          >
            <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl">
              <CardHeader className="space-y-1 pb-8">
                <div className="w-12 h-12 mb-4 mx-auto">
                  <AtlasCube />
                </div>
                <CardTitle className="text-2xl font-bold text-center tracking-wider">System Access</CardTitle>
                <CardDescription className="text-center">Authenticate with your ATLAS credentials.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider text-slate-400">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@atlasuniversity.edu.in" className="bg-accent/30 border-border h-12" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider text-slate-400">Security Key</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" className="bg-accent/30 border-border h-12" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    {form.formState.errors.root && (
                      <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                        {form.formState.errors.root.message}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 font-bold tracking-widest mt-4"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> AUTHENTICATING </>
                      ) : (
                        "VERIFY IDENTITY"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}