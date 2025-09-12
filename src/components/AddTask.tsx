import { PointsType, Task, TaskType } from "@/generated/prisma";
import { taskApi } from "@/lib/api/taskApi";
import { useQueryClient } from "@tanstack/react-query";
import { SendHorizonalIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { IconButton } from "./IconButton";
import PointsInput from "./PointsInput";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";

type FormValues = {
  taskName: string;
  points: number;
  pointsType: PointsType;
};

export const AddTask = ({ identityId }: { identityId: string }) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        taskName: "",
        points: 100,
        pointsType: PointsType.POSITIVE,
      },
    });

  const {
    mutation: { mutate: createTask },
  } = useOptimisticMutation({
    mutationFn: (task: Partial<Task>) => taskApi.create(task),
    queryKeys: [["task", identityId], ["task"], ["today", "task"]],
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches for the task lists
      await queryClient.cancelQueries({ queryKey: ["task", identityId] });
      await queryClient.cancelQueries({ queryKey: ["task"] });
      await queryClient.cancelQueries({ queryKey: ["today", "task"] });

      // Snapshot the previous values
      const previousTasks = queryClient.getQueryData(["task", identityId]);
      const previousAllTasks = queryClient.getQueryData(["task"]);
      const previousTodayTasks = queryClient.getQueryData(["today", "task"]);

      // Optimistically update the task list for this identity
      if (previousTasks && Array.isArray(previousTasks)) {
        queryClient.setQueryData(
          ["task", identityId],
          [...previousTasks, newTask]
        );
      }

      // Optimistically update the all tasks list if it exists
      if (previousAllTasks && Array.isArray(previousAllTasks)) {
        queryClient.setQueryData(["task"], [...previousAllTasks, newTask]);
      }

      return { previousTasks, previousAllTasks, previousTodayTasks };
    },
    onError: (error, newTask, context) => {
      // Rollback the optimistic updates
      if (context?.previousTasks) {
        queryClient.setQueryData(["task", identityId], context.previousTasks);
      }
      if (context?.previousAllTasks) {
        queryClient.setQueryData(["task"], context.previousAllTasks);
      }
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(["today", "task"], context.previousTodayTasks);
      }
      console.error("Failed to create task:", error);
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["task", identityId] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["today", "task"] });
      queryClient.invalidateQueries({ queryKey: ["identity"] });
    },
    invalidateKeys: [["identity"]],
  });

  const onSubmit = (data: FormValues) => {
    const optimisticTask: Partial<Task> = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Temporary ID for optimistic update
      name: data.taskName,
      identityId,
      points: data.points,
      pointsType: data.pointsType,
      taskType: TaskType.DEFAULT,
      isFavorited: false,
      isActive: true,
      isAddedToToday: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    createTask(optimisticTask);
    reset();
  };

  return (
    <div className="w-full justify-center flex">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-5/6 z-[9999] bottom-3 fixed flex items-center justify-between bg-zinc-700 rounded-lg p-2"
      >
        <input
          {...register("taskName", {
            required: "Task name is required",
            minLength: 1,
          })}
          type="text"
          placeholder="Enter task name"
          className="text-white text-2xl bg-zinc-700 outline-none p-1 rounded-lg w-full"
        />
        <PointsInput
          points={watch("points")}
          setPoints={(val) => setValue("points", val)}
          pointsType={watch("pointsType")}
          setPointsType={(val) => setValue("pointsType", val)}
        />
        <IconButton
          type="submit"
          icon={<SendHorizonalIcon className="size-7" />}
          onClick={() => {}}
        />
      </form>
    </div>
  );
};
