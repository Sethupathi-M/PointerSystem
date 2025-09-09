"use client";
import { Task as TaskType } from "@/generated/prisma";
import { Task } from "./Task";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export const TaskList = ({ tasks }: { tasks: TaskType[] }) => {
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

  // Separate active and completed tasks
  const activeTasks = tasks.filter(task => task.isActive);
  const completedTasks = tasks.filter(task => !task.isActive);

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto">
      {/* Active Tasks */}
      <div className="space-y-2">
        {activeTasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>

      {/* Completed Tasks Accordion */}
      {completedTasks.length > 0 && (
        <div className="mt-6 border-t border-zinc-700 pt-4">
          <button
            onClick={() => setIsCompletedOpen(!isCompletedOpen)}
            className="flex items-center gap-2 w-full text-left text-zinc-400 hover:text-zinc-300 transition-colors py-2 group"
          >
            <div className="transition-transform duration-200 group-hover:scale-110">
              {isCompletedOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
            <span className="text-sm font-medium tracking-wide">
              Completed ({completedTasks.length})
            </span>
          </button>
          
          {isCompletedOpen && (
            <div className="ml-6 mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
              {completedTasks.map((task) => (
                <Task key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
