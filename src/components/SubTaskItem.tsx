"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Edit2 } from "lucide-react";
import { SubTask } from "@/generated/prisma";
import { subtaskApi } from "@/lib/api/subtaskApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SubTaskItemProps {
  subtask: SubTask;
  onEdit: (subtask: SubTask) => void;
}

export const SubTaskItem = ({ subtask, onEdit }: SubTaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subtask.name);
  const queryClient = useQueryClient();

  const { mutate: updateSubtask } = useMutation({
    mutationFn: (data: Partial<SubTask>) => subtaskApi.update(subtask.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtask"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });

  const { mutate: deleteSubtask } = useMutation({
    mutationFn: () => subtaskApi.delete(subtask.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtask"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });

  const handleToggle = () => {
    updateSubtask({ isActive: !subtask.isActive });
  };

  const handleSave = () => {
    if (editName.trim()) {
      updateSubtask({ name: editName.trim() });
      setIsEditing(false);
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
              subtask.isActive
                ? "line-through text-slate-400"
                : "text-white"
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
            onClick={() => onEdit(subtask)}
            className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
            aria-label="Edit subtask"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => deleteSubtask()}
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
