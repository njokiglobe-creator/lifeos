"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/timetable");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted text-sm">Loading...</p>
      </main>
    );
  }

  if (user) return null;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-dawn-gradient opacity-[0.08] blur-3xl pointer-events-none" />

      <div className="relative max-w-md">
        <p className="text-xs tracking-[0.2em] uppercase text-accent-dawn mb-4">05:00 — Wake Up</p>
        <h1 className="font-display italic text-5xl mb-4">LifeOS</h1>
        <p className="text-muted mb-10 leading-relaxed">
          Your personal operating system for discipline and consistency.
          Plan your day, track your habits, and let your AI coach keep you
          moving forward — without the guilt.
        </p>

        <Link
          href="/login"
          className="inline-block w-full rounded-lg bg-dawn-gradient text-[#0b0d12] font-medium py-3 px-6 hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
