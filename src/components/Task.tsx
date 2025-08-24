import { DrawerType, PointsType } from "@/types";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Chervon } from "./Chervon";
import { IconButton } from "./IconButton";
import { TaskCheckbox } from "./TaskCheckbox";
import PointsInput from "./PointsInput";
import { useDrawerStore } from "@/store/useDrawerStore";

export const Task = () => {
  const { openDrawer } = useDrawerStore();
  const [enabled, setEnabled] = useState(false);
  const [points, setPoints] = useState(100);
  const [pointsType, setPointsType] = useState<PointsType>(PointsType.POSITIVE);

  return (
    <div
      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-600 transition-colors duration-300 cursor-pointer"
      onClick={() => openDrawer(DrawerType.TASK_DETAILS)}
    >
      <div className="flex items-center gap-2">
        <TaskCheckbox enabled={enabled} setEnabled={setEnabled} />
        <div className="w-full flex items-center justify-between">
          <div className="text-white text-lg">Task Name</div>
          <div className="flex items-center gap-1">
            <PointsInput
              points={points}
              setPoints={setPoints}
              pointsType={pointsType}
              setPointsType={setPointsType}
            />
            <IconButton icon={<Chervon isOpen={true} />} onClick={() => {}} />
            <IconButton
              icon={<EllipsisHorizontalIcon className="size-4" />}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
