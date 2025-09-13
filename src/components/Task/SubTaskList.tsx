"use client";
import { SubTask } from "@/generated/prisma";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { SubTaskItem } from "./SubTaskItem";

interface SubTaskListProps {
  parentTaskId: string;
  subtasks: SubTask[];
  isExpanded: boolean;
  onToggle: () => void;
  onAddSubtask?: (name: string) => void;
  onEditSubtask?: (subtask: SubTask) => void;
}

export const SubTaskList = ({
  subtasks,
  isExpanded,
  onAddSubtask,
}: SubTaskListProps) => {
  const [newSubtaskName, setNewSubtaskName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddSubtask = () => {
    if (newSubtaskName.trim() && onAddSubtask) {
      onAddSubtask(newSubtaskName.trim());
      setNewSubtaskName("");
      inputRef.current?.focus();
    }
  };

  const handleEdit = (subtask: SubTask) => {
    // This could open a modal or inline edit
    console.log("Edit subtask:", subtask);
  };

  return (
    <div className="mt-2">
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
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    setNewSubtaskName(e.target.value);
                  }}
                  placeholder="Enter subtask name"
                  className="flex-1 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddSubtask();
                    }
                    if (e.key === "Escape") {
                      setIsAdding(false);
                      setNewSubtaskName("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  aria-label="Add subtask"
                >
                  <Plus size={14} />
                </button>
                <button
                  type="button"
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
                type="button"
                onClick={(e) => {
                  setIsAdding(true);
                  e.stopPropagation();
                }}
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
