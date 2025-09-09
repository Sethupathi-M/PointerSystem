import { useQuery } from "@tanstack/react-query";
import { identityApi } from "@/lib/api/identityApi";

export const useTotalPoints = () => {
  const { data: identities, isLoading, error } = useQuery({
    queryKey: ["identity"],
    queryFn: identityApi.getAll,
  });

  const totalPoints = identities?.reduce((sum, identity) => {
    return sum + (identity.totalAcquiredPoints || 0);
  }, 0) || 0;

  return {
    totalPoints,
    isLoading,
    error,
  };
};
