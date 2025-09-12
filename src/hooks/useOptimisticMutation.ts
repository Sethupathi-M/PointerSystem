import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

interface OptimisticMutationConfig<TData, TError, TVariables, TContext> {
  mutationFn: (variables: TVariables) => Promise<TData>;

  // Query keys to cancel and update
  queryKeys: string[][];

  // Optimistic update function - should return new data for each query key
  onMutate?: (variables: TVariables) => Promise<TContext>;

  // Error handling - restore previous state
  onError?: (
    error: TError,
    variables: TVariables,
    context: TContext | undefined
  ) => void;

  // Success callback
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext | undefined
  ) => void;

  // Additional queries to invalidate on success (for refreshing related data)
  invalidateKeys?: string[][];
}

/**
 * Custom hook for optimistic mutations with automatic rollback
 * Provides instant UI updates with proper error handling
 */
export function useOptimisticMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(config: OptimisticMutationConfig<TData, TError, TVariables, TContext>) {
  const queryClient = useQueryClient();

  // Create optimistic update helper
  const createOptimisticUpdate = useCallback(
    <T>(updateFn: (oldData: T) => T) =>
      (queryKey: string[]) => {
        const previousData = queryClient.getQueryData(queryKey);
        if (previousData) {
          queryClient.setQueryData(queryKey, updateFn);
        }
        return previousData;
      },
    [queryClient]
  );

  // Create rollback helper
  const rollbackQueries = useCallback(
    (context: Record<string, unknown>) => {
      Object.entries(context).forEach(([key, previousData]) => {
        if (key.startsWith("previous_")) {
          const queryKey = key.replace("previous_", "").split("_");
          queryClient.setQueryData(queryKey, previousData);
        }
      });
    },
    [queryClient]
  );

  return {
    mutation: useMutation({
      mutationFn: config.mutationFn,
      onMutate: async (variables) => {
        // Cancel outgoing refetches
        await Promise.all(
          config.queryKeys.map((queryKey) =>
            queryClient.cancelQueries({ queryKey })
          )
        );

        // Call custom onMutate if provided
        const customContext = config.onMutate
          ? await config.onMutate(variables)
          : undefined;

        return customContext;
      },
      onError: (error, variables, context) => {
        if (config.onError) {
          config.onError(error as TError, variables, context);
        }
        console.error(`Optimistic mutation failed:`, error);
      },
      onSuccess: (data, variables, context) => {
        // Invalidate additional queries if specified
        if (config.invalidateKeys) {
          config.invalidateKeys.forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey });
          });
        }

        if (config.onSuccess) {
          config.onSuccess(data, variables, context);
        }
      },
    }),
    createOptimisticUpdate,
    rollbackQueries,
  };
}

// Specific hook for task operations
export function useOptimisticTaskMutation<TData = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  taskId?: string
) {
  const defaultQueryKeys = [
    ["task"],
    ["today", "task"],
    ...(taskId ? [["task", taskId]] : []),
  ];

  return useOptimisticMutation({
    mutationFn,
    queryKeys: defaultQueryKeys,
    invalidateKeys: [["identity"]], // Always refresh identity data for progress updates
  });
}
