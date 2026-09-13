"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OfficerProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("officer") || localStorage.getItem("officer");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id) {
          router.replace(`/case-officer/officers/${parsed.id}`);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    router.replace("/case-officer/officers/7");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
      <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
      <p className="text-xs text-slate-500">Loading your profile...</p>
    </div>
  );
}
