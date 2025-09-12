"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Edit2 } from "lucide-react";
import { SubTask, Task } from "@/generated/prisma";
import { subtaskApi } from "@/lib/api/subtaskApi";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";

// Type for tasks with subtasks
type TaskWithSubTasks = Task & {
  SubTask?: SubTask[];
};

interface SubTaskItemProps {
  subtask: SubTask;
  onEdit: (subtask: SubTask) => void;
}

export const SubTaskItem = ({ subtask, onEdit }: SubTaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subtask.name);

  // Optimistic subtask toggle mutation
  const {
    mutation: toggleMutation,
    createOptimisticUpdate: createToggleUpdate,
    rollbackQueries: rollbackToggle,
  } = useOptimisticMutation({
    mutationFn: (data: Partial<SubTask>) => subtaskApi.update(subtask.id, data),
    queryKeys: [["subtask", subtask.parentTaskId], ["task"]],
  });

  // Optimistic subtask update mutation
  const {
    mutation: updateMutation,
    createOptimisticUpdate: createUpdateUpdate,
    rollbackQueries: rollbackUpdate,
  } = useOptimisticMutation({
    mutationFn: (data: Partial<SubTask>) => subtaskApi.update(subtask.id, data),
    queryKeys: [["subtask", subtask.parentTaskId], ["task"]],
  });

  // Optimistic subtask deletion mutation
  const {
    mutation: deleteMutation,
    createOptimisticUpdate: createDeleteUpdate,
    rollbackQueries: rollbackDelete,
  } = useOptimisticMutation({
    mutationFn: () => subtaskApi.delete(subtask.id),
    queryKeys: [["subtask", subtask.parentTaskId], ["task"]],
  });

  const handleToggle = async () => {
    const newIsActive = !subtask.isActive;

    // Create optimistic update for subtask toggle
    const updateSubtasks = createToggleUpdate<SubTask[]>((subtasks) =>
      subtasks?.map((st) =>
        st.id === subtask.id ? { ...st, isActive: newIsActive } : st
      )
    );

    // Store previous data for rollback
    const context = {
      previous_subtask: updateSubtasks(["subtask", subtask.parentTaskId]),
      previous_task: createToggleUpdate<TaskWithSubTasks[]>((tasks) =>
        tasks?.map((task) => ({
          ...task,
          SubTask: task.SubTask?.map((st: SubTask) =>
            st.id === subtask.id ? { ...st, isActive: newIsActive } : st
          ),
        }))
      )(["task"]),
    };

    try {
      await toggleMutation.mutateAsync({ isActive: newIsActive });
    } catch (error) {
      rollbackToggle(context);
      console.error("Failed to toggle subtask:", error);
    }
  };

  const handleSave = async () => {
    if (editName.trim()) {
      const newName = editName.trim();

      // Create optimistic update for subtask name
      const updateSubtasks = createUpdateUpdate<SubTask[]>((subtasks) =>
        subtasks?.map((st) =>
          st.id === subtask.id ? { ...st, name: newName } : st
        )
      );

      // Store previous data for rollback
      const context = {
        previous_subtask: updateSubtasks(["subtask", subtask.parentTaskId]),
        previous_task: createUpdateUpdate<TaskWithSubTasks[]>((tasks) =>
          tasks?.map((task) => ({
            ...task,
            SubTask: task.SubTask?.map((st: SubTask) =>
              st.id === subtask.id ? { ...st, name: newName } : st
            ),
          }))
        )(["task"]),
      };

      try {
        await updateMutation.mutateAsync({ name: newName });
        setIsEditing(false);
      } catch (error) {
        rollbackUpdate(context);
        console.error("Failed to update subtask:", error);
      }
    }
  };

  const handleDelete = async () => {
    // Create optimistic update for subtask deletion
    const updateSubtasks = createDeleteUpdate<SubTask[]>((subtasks) =>
      subtasks?.filter((st) => st.id !== subtask.id)
    );

    // Store previous data for rollback
    const context = {
      previous_subtask: updateSubtasks(["subtask", subtask.parentTaskId]),
      previous_task: createDeleteUpdate<TaskWithSubTasks[]>((tasks) =>
        tasks?.map((task) => ({
          ...task,
          SubTask: task.SubTask?.filter((st: SubTask) => st.id !== subtask.id),
        }))
      )(["task"]),
    };

    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      rollbackDelete(context);
      console.error("Failed to delete subtask:", error);
    }
  };

  const handleCancel = () => {
    setEditName(subtask.name);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors duration-200"
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
          subtask.isActive
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-slate-400 hover:border-emerald-400"
        }`}
        aria-label={`Mark subtask as ${subtask.isActive ? "incomplete" : "complete"}`}
      >
        {subtask.isActive && <Check size={12} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <button
              onClick={handleSave}
              className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors"
              aria-label="Save subtask"
            >
              <Check size={14} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-400 hover:text-red-300 transition-colors"
              aria-label="Cancel editing"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            className={`text-sm transition-all duration-200 ${
              subtask.isActive ? "line-through text-slate-400" : "text-white"
            }`}
          >
            {subtask.name}
          </div>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setIsEditing(true);
              onEdit?.(subtask);
            }}
            className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
            aria-label="Edit subtask"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Delete subtask"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </motion.div>
  );
};
