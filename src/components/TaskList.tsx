"use client";
import { Task as TaskType } from "@/generated/prisma";
import { Task } from "./Task";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { taskApi } from "@/lib/api/taskApi";
import { useMutation } from "@tanstack/react-query";

// Sortable Task Item Component
const SortableTaskItem = ({ task }: { task: TaskType }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Task task={task} dragListeners={listeners} />
    </div>
  );
};

export const TaskList = ({ tasks }: { tasks: TaskType[] }) => {
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);
  const [localTasks, setLocalTasks] = useState<TaskType[]>(tasks);

  // Update local tasks when props change
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Separate active and completed tasks
  const activeTasks = localTasks.filter((task) => task.isActive);
  const completedTasks = localTasks.filter((task) => !task.isActive);

  // Sort active tasks by pinned status and sortValue
  const sortedActiveTasks = [...activeTasks].sort((a, b) => {
    // First sort by pinned status (pinned tasks first)
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Then sort by sortValue
    return a.sortValue - b.sortValue;
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Store previous order for rollback
  const [previousOrder, setPreviousOrder] = useState<TaskType[]>([]);

  // Update sort order mutation
  const { mutate: updateSortOrder } = useMutation({
    mutationFn: (taskIds: string[]) => taskApi.updateSort(taskIds),
    onSuccess: () => {
      // No query invalidation - optimistic update handles UI
      console.log("Sort order updated successfully");
      setPreviousOrder([]); // Clear previous order on success
    },
    onError: (error) => {
      console.error("Failed to update sort order:", error);
      // Rollback to previous order
      if (previousOrder.length > 0) {
        setLocalTasks(previousOrder);
        setPreviousOrder([]);
      }
    },
  });

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedActiveTasks.findIndex(
        (task) => task.id === active.id
      );
      const newIndex = sortedActiveTasks.findIndex(
        (task) => task.id === over.id
      );

      const newOrder = arrayMove(sortedActiveTasks, oldIndex, newIndex);
      const taskIds = newOrder.map((task) => task.id);

      // Store current order for potential rollback
      setPreviousOrder([...localTasks]);

      // Optimistic update: Update local state immediately
      setLocalTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        newOrder.forEach((task, index) => {
          const taskIndex = updatedTasks.findIndex((t) => t.id === task.id);
          if (taskIndex !== -1) {
            updatedTasks[taskIndex] = {
              ...updatedTasks[taskIndex],
              sortValue: index,
            };
          }
        });
        return updatedTasks;
      });

      // Then make API call
      updateSortOrder(taskIds);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto">
      {/* Active Tasks with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedActiveTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortedActiveTasks.map((task) => (
              <SortableTaskItem key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
