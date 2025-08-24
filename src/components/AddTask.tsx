import { PlusIcon } from "lucide-react";
import { IconButton } from "./IconButton";
import { useMemo } from "react";
import { useMainSideBar } from "@/store/useMainSideBar";
import { useMutation } from "@tanstack/react-query";

export const AddTask = () => {
  const { isOpen } = useMainSideBar();
  const offsetWidth = useMemo(() => {
    let width = 60;

    if (isOpen) {
      width += 280;
    } else {
      width += 80;
    }

    return width;
  }, [isOpen]);

  return (
    <div
      className="bottom-3 fixed flex items-center justify-between bg-zinc-700 rounded-lg p-2"
      style={{
        width: `calc(100% - ${offsetWidth}px)`,
      }}
    >
      <IconButton icon={<PlusIcon className="size-4" />} onClick={() => {}} />
      <input
        type="text"
        className="text-white text-xs bg-zinc-700 outline-none p-1 rounded-lg w-full"
      />
    </div>
  );
};
