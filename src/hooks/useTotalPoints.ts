import { useQuery } from "@tanstack/react-query";
import { identityApi } from "@/lib/api/identityApi";
import { taskApi } from "@/lib/api/taskApi";

export const useTotalPoints = () => {
  const {
    data: identities,
    isLoading: identitiesLoading,
    error: identitiesError,
  } = useQuery({
    queryKey: ["identity"],
    queryFn: identityApi.getAll,
  });

  const {
    data: allTasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["task"],
    queryFn: taskApi.getAll,
  });

  const totalPoints =
    allTasks?.reduce((sum, task) => {
      if (!task.isActive && task.pointsType === "POSITIVE") {
        return sum + task.points;
      }
      return sum;
    }, 0) || 0;

  return {
    totalPoints,
    isLoading: identitiesLoading || tasksLoading,
    error: identitiesError || tasksError,
  };
};
