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
        className="w-5/6 z-[9999] bottom-3 fixed flex items-center gap-3 justify-between bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 border border-slate-600/30 shadow-lg shadow-slate-900/20"
      >
        <input
          {...register("taskName", {
            required: "Task name is required",
            minLength: 1,
          })}
          type="text"
          placeholder="Enter task name"
          className="flex-1 text-white text-lg bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-slate-500/70"
          autoComplete="off"
        />
        <div className="flex-shrink-0">
          <PointsInput
            points={watch("points")}
            setPoints={(val) => setValue("points", val)}
            pointsType={watch("pointsType")}
            setPointsType={(val) => setValue("pointsType", val)}
          />
        </div>
        <IconButton
          type="submit"
          icon={<SendHorizonalIcon className="size-6" />}
          onClick={() => {}}
          className={`flex-shrink-0 transition-all duration-200 ${
            !watch("taskName")
              ? "bg-slate-600/50 cursor-not-allowed text-slate-400 hover:bg-slate-600/50 opacity-50"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/30"
          }`}
        />
      </form>
    </div>
  );
};
