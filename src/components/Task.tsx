import { PointsType, Task as TaskType } from "@/generated/prisma";
import { taskApi } from "@/lib/api/taskApi";
import { useDrawerStore } from "@/store/useDrawerStore";
import { useSelectedTaskStore } from "@/store/useSelectedTaskStore";
import { DrawerType } from "@/types";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { IconButton } from "./IconButton";
import PointsInput from "./PointsInput";
import { TaskCheckbox } from "./TaskCheckbox";
import { Star, Lock } from 'lucide-react';

export const Task = ({ task }: { task: TaskType }) => {
  const { openDrawer } = useDrawerStore();
  const { setSelectedTaskId } = useSelectedTaskStore();
  const [enabled, setEnabled] = useState(!task.isActive);
  const [points, setPoints] = useState(task.points);
  const [pointsType, setPointsType] = useState<PointsType>(task.pointsType); 
  const queryClient = useQueryClient();

  // Sync local state with task prop changes
  useEffect(() => {
    setPoints(task.points);
    setPointsType(task.pointsType);
    setEnabled(!task.isActive);
  }, [task.points, task.pointsType, task.isActive]); 

  // delete task
  const { mutate: deleteTask } = useMutation({
    mutationFn: (id: string) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["identity"] });
      // Also invalidate the specific task query
      queryClient.invalidateQueries({ queryKey: ["task", task.identityId] });
    },
  });

  const { mutate: addToFavorites } = useMutation({
    mutationFn: (id: string) => taskApi.update(id, { isFavorited: !task.isFavorited }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["identity"] });
      // Also invalidate the specific task query
      queryClient.invalidateQueries({ queryKey: ["task", task.identityId] });
    },
  });

  // Toggle task completion
  const { mutate: toggleCompletion } = useMutation({
    mutationFn: (id: string) => taskApi.update(id, { isActive: !task.isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["identity"] });
      // Also invalidate the specific task query
      queryClient.invalidateQueries({ queryKey: ["task", task.identityId] });
    },
  });

  return (
    <div
      className={`p-2 rounded-lg transition-colors duration-300 cursor-pointer relative ${
        enabled 
          ? task.isLocked
            ? "bg-zinc-700/50 opacity-70 border border-amber-500/30" // Locked completed task styling
            : "bg-zinc-700 opacity-60" // Completed task styling
          : "bg-zinc-800 hover:bg-zinc-600" // Active task styling
      }`}
      onClick={() => {
        setSelectedTaskId(task.id);
        openDrawer(DrawerType.TASK_DETAILS);
      }}
    >
      {/* Lock indicator for locked tasks */}
      {task.isLocked && (
        <div className="absolute top-1 right-1 z-10">
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/20 border border-amber-400/30 rounded-full">
            <Lock size={10} className="text-amber-400" />
            <span className="text-xs font-medium text-amber-300">Locked</span>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
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
        <div className="w-full flex items-center justify-between">
          <div className={`text-lg ${enabled ? "line-through text-zinc-400" : "text-white"}`}>
            {task.name}
          </div>
          <div className="flex items-center gap-1">
            <div className={enabled || task.isLocked ? "opacity-50" : ""}>
              <PointsInput
                points={points}
                setPoints={setPoints}
                pointsType={pointsType}
                setPointsType={setPointsType}
                disabled={task.isLocked}
              />
            </div>
            {/* <IconButton icon={<Chervon isOpen={true} />} onClick={() => {}} /> */}
            <IconButton
              icon={<TrashIcon className="size-7" />}
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
            />
            <IconButton
              icon={<Star
                className="size-7"
                fill={task.isFavorited ? "yellow" : "none"}
              />}
              onClick={(e) => {
                e.stopPropagation();
                addToFavorites(task.id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
