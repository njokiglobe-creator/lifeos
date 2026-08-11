"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/timetable");
    }
  }, [authLoading, user, router]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/timetable");
    } catch (err) {
      console.error(err);
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-dawn-gradient opacity-[0.08] blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm text-center">
        <h1 className="font-display italic text-4xl mb-2">LifeOS</h1>
        <p className="text-sm text-muted mb-8">
          Your personal operating system for discipline and consistency.
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full rounded-lg bg-dawn-gradient text-[#0b0d12] font-medium py-3 px-4 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        {error && <p className="mt-4 text-sm text-accent-danger">{error}</p>}
      </div>
    </main>
  );
}
