import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { taskApi } from "@/lib/api/taskApi";
import { PointsType, Task, TaskType } from "@/generated/prisma";
import PointsInput from "./PointsInput";
import { useForm, Controller } from "react-hook-form"; 
import { IconButton } from "./IconButton";
import { SendHorizonalIcon } from "lucide-react";

type FormValues = {
  taskName: string;
  points: number;
  pointsType: PointsType;
};

export const AddTask = ( { identityId }: { identityId: string } ) => {
  // const { isOpen } = useMainSideBar();
  // const offsetWidth = useMemo(() => {
  //   let width = 60;
  //   width += isOpen ? 280 : 80;
  //   return width;
  // }, [isOpen]);
 
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      taskName: "",
      points: 100,
      pointsType: PointsType.POSITIVE,
    },
  });

  const { mutate: createTask } = useMutation({
    mutationFn: (task: Partial<Task>) => taskApi.create(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["identity"] });
      reset();
    },
  });

  const onSubmit = (data: FormValues) => {
    createTask({
      name: data.taskName,
      identityId,
      points: data.points,
      pointsType: data.pointsType,
      taskType: TaskType.DEFAULT,
      isFavorited: false,
      isActive: true,
      isAddedToToday: false,
    });
  };

  return (
    <div className="w-full justify-center flex">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-5/6 bottom-3 fixed flex items-center justify-between bg-zinc-700 rounded-lg p-2"
    >
     
<input
  {...register("taskName", {
    required: "Task name is required",
    minLength: 1,
  })}
  type="text"
  placeholder="Enter task name"
  className="text-white text-2xl bg-zinc-700 outline-none p-1 rounded-lg w-full"
/>
<PointsInput
        points={watch("points")}
        setPoints={(val) => setValue("points", val)}
        pointsType={watch("pointsType")}
        setPointsType={(val) =>  
          setValue("pointsType", val) 
        }
      />
<button type="submit" className="" ><IconButton icon={<SendHorizonalIcon className="size-7" />} onClick={() => {}} /></button>

    </form>
    </div>
  );
};
