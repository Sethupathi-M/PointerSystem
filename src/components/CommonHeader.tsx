"use client";

import { Zap, Crown } from "lucide-react";
import { identityApi } from "@/lib/api/identityApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { motion } from "framer-motion";

interface IdentityWithPoints {
  id: string;
  name: string;
  description: string;
  requiredPoints: number;
  isActive: boolean;
  createdAt: Date;
  totalAcquiredPoints: number;
}
  
export const CommonHeader = () => {
  // Fetch all identities to calculate total earned points
  const { data: identities, isLoading } = useQuery({
    queryKey: ["identity"],
    queryFn: () => identityApi.getAll(),
  });

  // Calculate total earned points across all identities
  const totalEarnedPoints = useMemo(() => {
    if (!identities) return 0;
    return (identities as IdentityWithPoints[]).reduce((total, identity) => {
      return total + (identity.totalAcquiredPoints || 0);
    }, 0);
  }, [identities]);

  const isPositive = totalEarnedPoints >= 0;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Epic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/3 via-transparent to-emerald-400/3 animate-pulse" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-between w-full items-center px-6 py-4">
        {/* Left Side - Minimalist Title */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div className="px-4 py-2 rounded-lg bg-slate-800/40 border border-slate-600/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Crown className="text-amber-400" size={18} />
              <h1 className="text-sm font-medium text-slate-200">
                SAVE THE FUTURE YOU, FROM YOU
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Minimalist Stats */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <div className="px-4 py-2 rounded-lg bg-slate-800/40 border border-slate-600/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Zap className={`${isPositive ? "text-emerald-400" : "text-red-400"}`} size={16} />
              <span className="text-xs text-slate-400">Total Points:</span>
              <motion.span
                className={`text-sm font-semibold ${isPositive ? "text-emerald-300" : "text-red-300"}`}
                key={totalEarnedPoints}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                ) : (
                  totalEarnedPoints.toLocaleString()
                )}
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </div>
  );
};
