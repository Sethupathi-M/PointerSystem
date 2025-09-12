import {
  CounterTask,
  PointsType,
  SubTask,
  Task as TaskType,
  TaskType as TaskTypeEnum,
} from "@/generated/prisma";
import { subtaskApi } from "@/lib/api/subtaskApi";
import { SubTaskList } from "./SubTaskList";

// Extended task type with counter relation
type TaskWithCounter = TaskType & {
  counterTask?:
    | (CounterTask & {
        CounterDayPoints?: Array<{
          id: string;
          points: number;
          day: Date;
        }>;
      })
    | null;
  SubTask?: SubTask[];
  isPinned?: boolean;
  sortValue?: number;
};

import { useOptimisticTaskMutation } from "@/hooks/useOptimisticMutation";
import { taskApi } from "@/lib/api/taskApi";
import { useDrawerStore } from "@/store/useDrawerStore";
import { useSelectedTaskStore } from "@/store/useSelectedTaskStore";
import { DrawerType } from "@/types";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  Lock,
  Pin,
  PinOff,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { IconButton } from "../IconButton";
import PointsInput from "../PointsInput";
import { TaskCounter } from "../TaskCounter/TaskCounter";
import CounterPointsBadge from "./CounterPointsBadge";
import { TaskCheckbox } from "./TaskCheckbox";

export const Task = ({
  task,
  dragListeners,
}: {
  task: TaskWithCounter;
  dragListeners?: Record<string, unknown>;
}) => {
  const { openDrawer } = useDrawerStore();
  const { setSelectedTaskId } = useSelectedTaskStore();
  const [enabled, setEnabled] = useState(!task.isActive);
  const [points, setPoints] = useState(
    task.taskType === TaskTypeEnum.COUNTER
      ? task.counterTask?.defaultPoints
      : task.points
  );
  const [pointsType, setPointsType] = useState<PointsType>(task.pointsType);
  const [showSubtasks, setShowSubtasks] = useState(false);

  // Fetch subtasks
  const { data: subtasks = [] } = useQuery({
    queryKey: ["subtask", task.id],
    queryFn: () => subtaskApi.getByParentTask(task.id),
    enabled: !!task.id,
  });

  // Sync local state with task prop changes
  useEffect(() => {
    setPoints(task.points);
    setPointsType(task.pointsType);
    setEnabled(!task.isActive);
  }, [task.points, task.pointsType, task.isActive]);

  // Optimistic task completion toggle using the custom hook
  const {
    mutation: toggleCompletionMutation,
    createOptimisticUpdate,
    rollbackQueries,
  } = useOptimisticTaskMutation(
    (id: string) => taskApi.update(id, { isActive: !task.isActive }),
    task.identityId
  );

  const toggleCompletion = async (id: string) => {
    const updateTask = createOptimisticUpdate<TaskWithCounter[]>((tasks) =>
      tasks?.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );

    // Store previous data for rollback
    const context = {
      previous_task: updateTask(["task"]),
      previous_today_task: updateTask(["today", "task"]),
      [`previous_task_${task.identityId}`]: updateTask([
        "task",
        task.identityId,
      ]),
    };

    try {
      await toggleCompletionMutation.mutateAsync(id);
    } catch (error) {
      rollbackQueries(context);
      console.error("Failed to toggle task completion:", error);
    }
  };

  // Optimistic favorites toggle using the custom hook
  const {
    mutation: favoritesMutation,
    createOptimisticUpdate: createFavoritesUpdate,
    rollbackQueries: rollbackFavorites,
  } = useOptimisticTaskMutation(
    (id: string) => taskApi.update(id, { isFavorited: !task.isFavorited }),
    task.identityId
  );

  const addToFavorites = async (id: string) => {
    const updateTask = createFavoritesUpdate<TaskWithCounter[]>((tasks) =>
      tasks?.map((t) =>
        t.id === id ? { ...t, isFavorited: !t.isFavorited } : t
      )
    );

    const context = {
      previous_task: updateTask(["task"]),
      previous_today_task: updateTask(["today", "task"]),
      [`previous_task_${task.identityId}`]: updateTask([
        "task",
        task.identityId,
      ]),
    };

    try {
      await favoritesMutation.mutateAsync(id);
    } catch (error) {
      rollbackFavorites(context);
      console.error("Failed to toggle favorites:", error);
    }
  };

  // Optimistic pin toggle using the custom hook
  const {
    mutation: pinMutation,
    createOptimisticUpdate: createPinUpdate,
    rollbackQueries: rollbackPin,
  } = useOptimisticTaskMutation(
    (id: string) => taskApi.togglePin(id),
    task.identityId
  );

  const togglePin = async (id: string) => {
    const updateTask = createPinUpdate<TaskWithCounter[]>((tasks) =>
      tasks?.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );

    const context = {
      previous_task: updateTask(["task"]),
      previous_today_task: updateTask(["today", "task"]),
      [`previous_task_${task.identityId}`]: updateTask([
        "task",
        task.identityId,
      ]),
    };

    try {
      await pinMutation.mutateAsync(id);
    } catch (error) {
      rollbackPin(context);
      console.error("Failed to toggle pin:", error);
    }
  };

  // Optimistic task deletion using the custom hook
  const {
    mutation: deleteMutation,
    createOptimisticUpdate: createDeleteUpdate,
    rollbackQueries: rollbackDelete,
  } = useOptimisticTaskMutation(
    (id: string) => taskApi.delete(id),
    task.identityId
  );

  const deleteTask = async (id: string) => {
    const updateTask = createDeleteUpdate<TaskWithCounter[]>((tasks) =>
      tasks?.filter((t) => t.id !== id)
    );

    const context = {
      previous_task: updateTask(["task"]),
      previous_today_task: updateTask(["today", "task"]),
      [`previous_task_${task.identityId}`]: updateTask([
        "task",
        task.identityId,
      ]),
    };

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      rollbackDelete(context);
      console.error("Failed to delete task:", error);
    }
  };

  const accumulatedPoints = useMemo(() => {
    return (
      task?.counterTask?.CounterDayPoints?.reduce(
        (sum: number, dayPoint: { points: number }) => sum + dayPoint.points,
        0
      ) || 0
    );
  }, [task?.counterTask]);

  return (
    <div className="group relative">
      {/* Epic Task Card */}
      <div
        className={`relative overflow-hidden rounded-xl transition-all duration-500 cursor-pointer ${
          enabled
            ? task.isLocked
              ? "bg-slate-800/30 border border-amber-500/20 shadow-amber-500/5"
              : "bg-slate-800/20 border border-slate-600/20"
            : "bg-slate-800/40 border border-slate-600/30 hover:border-slate-500/50 hover:shadow-md hover:shadow-slate-900/10"
        }`}
        onClick={() => {
          setSelectedTaskId(task.id);
          openDrawer(DrawerType.TASK_DETAILS);
        }}
      >
        {/* Subtle Background Effects */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-500/2 via-purple-500/2 to-emerald-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/3 via-transparent to-emerald-400/3 animate-pulse" /> */}

        {/* Lock indicator for locked tasks */}
        {task.isLocked && (
          <div className="absolute top-3 right-3 z-20">
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full backdrop-blur-sm">
              <Lock size={12} className="text-amber-400" />
              <span className="text-xs font-medium text-amber-300">Locked</span>
            </div>
          </div>
        )}

        {/* Task Content */}
        <div className="relative z-10 p-4">
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            {dragListeners && (
              <div
                className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 hover:bg-slate-700/50 rounded"
                {...dragListeners}
              >
                <div className="w-1 h-6 bg-slate-500 rounded-full"></div>
              </div>
            )}

            {/* Checkbox */}
            <div className="flex-shrink-0">
              <TaskCheckbox
                enabled={enabled}
                setEnabled={(newEnabled) => {
                  if (!task.isLocked) {
                    setEnabled(newEnabled);
                    toggleCompletion(task.id);
                  }
                }}
                isLocked={task.isLocked}
              />
            </div>

            {/* Task Name and Counter */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
              {/* Subtask Toggle Button with Progress */}
              {subtasks.length > 0 && (
                <div className="flex items-center gap-2">
                  {/* Progress Ring */}
                  <div className="relative w-6 h-6">
                    <svg
                      className="w-6 h-6 transform -rotate-90"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-slate-600"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 10}`}
                        strokeDashoffset={`${2 * Math.PI * 10 * (1 - subtasks.filter((subtask) => subtask.isActive).length / subtasks.length)}`}
                        className="text-cyan-500 transition-all duration-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {subtasks.filter((subtask) => subtask.isActive).length}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSubtasks(!showSubtasks);
                    }}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    aria-label={
                      showSubtasks ? "Hide subtasks" : "Show subtasks"
                    }
                  >
                    {showSubtasks ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    <span className="text-xs font-medium">
                      {subtasks.filter((subtask) => subtask.isActive).length}/
                      {subtasks.length}
                    </span>
                  </button>
                </div>
              )}

              {/* Counter UI - Only show for counter tasks */}
              {task.taskType === TaskTypeEnum.COUNTER && task.counterTask && (
                <TaskCounter
                  taskId={task.id}
                  currentCount={task.counterTask.count}
                  targetCount={task.counterTask.target}
                  isCompleted={enabled}
                  disabled={task.isLocked}
                  inputPoints={points}
                  pointsType={pointsType}
                />
              )}

              {/* Task Name */}
              <div
                className={`flex-1 text-lg font-medium transition-all duration-300 ${
                  enabled
                    ? "line-through text-slate-400"
                    : "text-white group-hover:text-cyan-100"
                }`}
              >
                {task.name}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 transition-opacity duration-300">
              {task.taskType === TaskTypeEnum.COUNTER && task.counterTask && (
                <CounterPointsBadge accumulatedPoints={accumulatedPoints} />
              )}
              <div className={enabled || task.isLocked ? "opacity-50" : ""}>
                <PointsInput
                  points={points ?? 0}
                  setPoints={setPoints}
                  pointsType={pointsType}
                  setPointsType={setPointsType}
                  disabled={task.isLocked}
                />
              </div>

              <IconButton
                icon={
                  task.isPinned ? (
                    <Pin className="size-6" fill="currentColor" />
                  ) : (
                    <PinOff className="size-6" />
                  )
                }
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(task.id);
                }}
                className={task.isPinned ? "text-amber-400" : "text-slate-400"}
              />

              <IconButton
                icon={
                  <Star
                    className="size-6"
                    fill={task.isFavorited ? "yellow" : "none"}
                  />
                }
                onClick={(e) => {
                  e.stopPropagation();
                  addToFavorites(task.id);
                }}
              />

              <IconButton
                icon={<TrashIcon className="size-6" />}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar for Counter Tasks */}
        {task.taskType === TaskTypeEnum.COUNTER && task.counterTask && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, (task.counterTask.count / task.counterTask.target) * 100)}%`,
              }}
            />
          </div>
        )}

        {/* Bottom Progress Bar for Tasks with Subtasks */}
        {subtasks.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, (subtasks.filter((subtask) => subtask.isActive).length / subtasks.length) * 100)}%`,
              }}
            />
          </div>
        )}

        {/* Subtle Hover Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/2 group-hover:via-blue-500/2 group-hover:to-purple-500/2 transition-all duration-500 pointer-events-none" />
      </div>

      {/* Subtask List */}
      {subtasks.length > 0 && (
        <div className="mt-2 ml-6">
          <SubTaskList
            parentTaskId={task.id}
            subtasks={subtasks}
            isExpanded={showSubtasks}
            onToggle={() => setShowSubtasks(!showSubtasks)}
            onEditSubtask={(subtask) =>
              console.log("Edit subtask in task:", subtask)
            }
          />
        </div>
      )}
    </div>
  );
};
