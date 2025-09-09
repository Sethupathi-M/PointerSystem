import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Save, X } from "lucide-react";
import { useSelectedTaskStore } from "@/store/useSelectedTaskStore";
import { taskApi } from "@/lib/api/taskApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PointsType, Task as TaskType } from "@/generated/prisma";
import PointsInput from "./PointsInput";

interface TaskFormData {
  name: string;
  points: number;
  pointsType: PointsType;
  isFavorited: boolean;
  isAddedToToday: boolean;
}

export const TaskDetailsDrawer = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const { selectedTaskId, clearSelectedTask } = useSelectedTaskStore();
  const queryClient = useQueryClient();
  
  // Form setup with React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormData>({
    defaultValues: {
      name: "",
      points: 0,
      pointsType: PointsType.POSITIVE,
      isFavorited: false,
      isAddedToToday: false,
    },
    mode: "onChange" // Enable real-time validation
  });

  // Watch form values for controlled components
  const watchedValues = watch();

  // Fetch task data
  const { data: task, isLoading } = useQuery({
    queryKey: ["task", selectedTaskId],
    queryFn: () => taskApi.getTaskById(selectedTaskId!),
    enabled: !!selectedTaskId,
  });

  // Update form when task data loads
  useEffect(() => {
    if (task) {
      reset({
        name: task.name,
        points: task.points,
        pointsType: task.pointsType,
        isFavorited: task.isFavorited,
        isAddedToToday: task.isAddedToToday,
      });
    }
  }, [task, reset]);

  // Update task mutation
  const { mutate: updateTask } = useMutation({
    mutationFn: (updatedData: Partial<TaskType>) => 
      taskApi.update(selectedTaskId!, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["identity"] });
      // Also invalidate the specific task query if we have the task data
      if (task?.identityId) {
        queryClient.invalidateQueries({ queryKey: ["task", task.identityId] });
      }
      clearSelectedTask();
      setIsOpen(false);
    },
  });

  const onSubmit = (data: TaskFormData) => {
    updateTask({
      name: data.name.trim(),
      points: data.points,
      pointsType: data.pointsType,
      isFavorited: data.isFavorited,
      isAddedToToday: data.isAddedToToday,
    });
  };

  const handleCancel = () => {
    // Reset form to original values
    if (task) {
      reset({
        name: task.name,
        points: task.points,
        pointsType: task.pointsType,
        isFavorited: task.isFavorited,
        isAddedToToday: task.isAddedToToday,
      });
    }
    clearSelectedTask();
    setIsOpen(false);
  };

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 350 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky h-fit shrink-0 overflow-hidden border-zinc-700 bg-zinc-900"
      >
        {/* Header */}
        {isOpen && (
          <div className="flex items-center justify-between border-b border-zinc-700 p-3">
            <span className="text-sm font-medium text-white">Edit Task</span>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-zinc-700 transition-colors"
              onClick={() => {
                clearSelectedTask();
                setIsOpen(false);
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="h-full overflow-y-auto p-4">
          {isOpen && selectedTaskId ? (
            isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-white">Loading...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Task Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Task Name
                  </label>
                  <input
                    {...register("name", { 
                      required: "Task name is required",
                      minLength: {
                        value: 1,
                        message: "Task name must not be empty"
                      },
                      maxLength: {
                        value: 100,
                        message: "Task name must be less than 100 characters"
                      }
                    })}
                    type="text"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Points */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Points
                  </label>
                  <div>
                    <input
                      {...register("points", {
                        required: "Points are required",
                        min: {
                          value: 0,
                          message: "Points must be 0 or greater"
                        },
                        max: {
                          value: 10000,
                          message: "Points must be less than 10,000"
                        }
                      })}
                      type="hidden"
                    />
                    <PointsInput
                      points={watchedValues.points}
                      setPoints={(value) => setValue("points", value, { shouldValidate: true })}
                      pointsType={watchedValues.pointsType}
                      setPointsType={(value) => setValue("pointsType", value, { shouldValidate: true })}
                    />
                  </div>
                  {errors.points && (
                    <p className="text-red-400 text-sm mt-1">{errors.points.message}</p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      {...register("isFavorited")}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-zinc-300">Add to Favorites</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      {...register("isAddedToToday")}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-zinc-300">Add to Today</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save size={16} className="mr-2" />
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            )
          ) : null}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default TaskDetailsDrawer;
