"use client";

import { StarsIcon } from "lucide-react";
import { identityApi } from "@/lib/api/identityApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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

  return (
    <div className="flex justify-between w-full items-center px-5">
      <p className="text-lg font-bold bg-gradient-to-r from-amber-200 to-amber-600 p-2 rounded-lg text-amber-950">
        SAVE THE FUTURE YOU, FROM YOU
      </p>
      <div className="flex gap-2">
        <div className="text-lg px-2 flex items-center gap-2 text-amber-950 p-1 rounded-lg bg-gradient-to-r from-amber-200 to-amber-600">
          <div>
            <span className="italic">Total Earned Points:</span>
            <span className={`font-bold ${totalEarnedPoints < 0 ? "text-red-600" : "text-green-600"}`}>
              {isLoading ? "..." : totalEarnedPoints}
            </span>
          </div>
          <StarsIcon />
        </div>
      </div>
    </div>
  );
};
