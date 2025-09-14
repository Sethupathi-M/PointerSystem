"use client";

import { useIdentityContext } from "@/components/IdentityContext";
import {
  ExtendedIdentity,
  IdentityProgressBar,
} from "@/components/IdentityProgressBar";
import { identityApi } from "@/lib/api/identityApi";
import { taskApi } from "@/lib/api/taskApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function StatusPage() {
  const { isLoggedIn } = useIdentityContext();
  const [identities, setIdentities] = useState<ExtendedIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: quote } = useQuery({
    queryKey: ["quote"],
    queryFn: () => taskApi.getQuoteForAllIdentities(),
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (isLoggedIn) {
      fetchIdentities();
    }
  }, [isLoggedIn]);

  const fetchIdentities = async () => {
    try {
      // Use the existing getAll method which includes totalAcquiredPoints
      const data = await identityApi.getAll();
      setIdentities(data);
    } catch (error) {
      console.error("Failed to fetch identities:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="h-full p-4 flex justify-center items-center">
        <div className="text-lg text-white">
          Please log in to view your progress.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full p-4 flex justify-center items-center">
        <div className="text-lg text-white">Loading your journey...</div>
      </div>
    );
  }

  if (identities.length === 0) {
    return (
      <div className="h-full p-4 flex flex-col items-center justify-center text-zinc-400">
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-xl font-semibold mb-2 text-white">
          Your Adventure Awaits!
        </h3>
        <p className="text-sm text-center max-w-md">
          Create your first identity to start your journey and unlock amazing
          rewards along the way!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full p-4">
      <div className="space-y-8" role="list">
        <div className="relative">
          {/* Epic entrance particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full
                  opacity-0 animate-epic-entrance-particle delay-${i * 75}ms
                `}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 75}ms`,
                }}
              />
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {identities.map((identity, index) => (
              <div
                key={identity.id}
                role="listitem"
                className={`
                  animate-in slide-in-from-bottom-0 duration-1200 delay-${index * 300}ms
                  ${index % 2 === 0 ? "md:animate-slide-in-from-left delay-${index * 150}ms" : "md:animate-slide-in-from-right delay-${index * 150}ms"}
                  group/list
                `}
              >
                <IdentityProgressBar identity={identity} quote={quote} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
