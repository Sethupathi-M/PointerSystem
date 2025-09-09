"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronRight, X } from "lucide-react";
import { SubTask } from "@/generated/prisma";
import { subtaskApi } from "@/lib/api/subtaskApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubTaskItem } from "./SubTaskItem";

interface SubTaskListProps {
  parentTaskId: string;
  subtasks: SubTask[];
  isExpanded: boolean;
  onToggle: () => void;
}

export const SubTaskList = ({
  parentTaskId,
  subtasks,
  isExpanded,
  onToggle,
}: SubTaskListProps) => {
  const [newSubtaskName, setNewSubtaskName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: createSubtask } = useMutation({
    mutationFn: (data: Partial<SubTask>) => subtaskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtask"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
      setNewSubtaskName("");
      setIsAdding(false);
    },
  });

  const handleAddSubtask = () => {
    if (newSubtaskName.trim()) {
      createSubtask({
        name: newSubtaskName.trim(),
        parentTaskId,
        isActive: false,
        isAddedToToday: false,
      });
    }
  };

  const handleEdit = (subtask: SubTask) => {
    // This could open a modal or inline edit
    console.log("Edit subtask:", subtask);
  };

  const completedCount = subtasks.filter((subtask) => subtask.isActive).length;
  const totalCount = subtasks.length;

  return (
    <div className="mt-2">
      {/* Subtask Header */}
      {/* <div className="flex items-center gap-2 mb-2">
        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          aria-label={isExpanded ? "Hide subtasks" : "Show subtasks"}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="text-sm font-medium">
            Subtasks ({completedCount}/{totalCount})
          </span>
        </button> */}

      {/* Progress Bar */}
      {/* {totalCount > 0 && (
          <div className="flex-1 max-w-[100px] h-1.5 bg-slate-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500"
              style={{ 
                width: `${Math.min(100, (completedCount / totalCount) * 100)}%` 
              }}
            />
          </div>
        )}
      </div> */}

      {/* Subtask List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
          >
            {/* Add New Subtask */}
            {isAdding ? (
              <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <input
                  type="text"
                  value={newSubtaskName}
                  onChange={(e) => setNewSubtaskName(e.target.value)}
                  placeholder="Enter subtask name"
                  className="flex-1 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddSubtask();
                    if (e.key === "Escape") {
                      setIsAdding(false);
                      setNewSubtaskName("");
                    }
                  }}
                />
                <button
                  onClick={handleAddSubtask}
                  className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  aria-label="Add subtask"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewSubtaskName("");
                  }}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  aria-label="Cancel adding subtask"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 w-full p-2 text-slate-400 hover:text-white hover:bg-slate-700/30 rounded-lg transition-colors duration-200"
                aria-label="Add new subtask"
              >
                <Plus size={14} />
                <span className="text-sm">Add subtask</span>
              </button>
            )}

            {/* Subtask Items */}
            {subtasks.map((subtask) => (
              <SubTaskItem
                key={subtask.id}
                subtask={subtask}
                onEdit={handleEdit}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
