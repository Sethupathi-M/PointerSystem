import { useDrawerStore } from "@/store/useDrawerStore";
import OverlayDrawer from "./OverlayDrawer";
import React, { useEffect } from "react";
import { DrawerType, IdentityItem } from "@/types";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postIdentityBoard } from "@/api/identity";

const AddIdentityDrawer = () => {
  const { isOpen, toggleDrawer } = useDrawerStore();
  const { register, handleSubmit, setFocus } = useForm();
  const { mutate } = useMutation({
    mutationFn: postIdentityBoard,
    onSuccess: () => {
      toggleDrawer(DrawerType.ADD_IDENTITY);
    },
  });

  const queryClient = useQueryClient();
  const onSubmit = (data: IdentityItem) => {
    mutate(data);
    queryClient.invalidateQueries({ queryKey: ["identity"] });
  };

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  return (
    <OverlayDrawer
      isOpen={isOpen(DrawerType.ADD_IDENTITY)}
      setIsOpen={() => toggleDrawer(DrawerType.ADD_IDENTITY)}
    >
      <div className="p-4 bg-zinc-900 h-full">
        <h1 className="text-white text-2xl font-bold">Add Identity</h1>
        <div className="flex flex-col gap-4">
          <input
            {...register("title")}
            type="text"
            className="text-white text-sm bg-zinc-800 rounded-md p-2"
            placeholder="Name"
          />
          <input
            {...register("description")}
            type="text"
            className="text-white text-sm bg-zinc-800 rounded-md p-2"
            placeholder="Description"
          />
          <input
            {...register("requiredPoints")}
            type="text"
            className="text-white text-sm bg-zinc-800 rounded-md p-2"
            placeholder="Minimum Required Points"
          />
          <div className="flex gap-2 w-full">
            <button
              type="button"
              className="bg-blue-500 text-white text-sm rounded-md p-2"
              onClick={handleSubmit((data) => onSubmit(data as IdentityItem))}
            >
              Add
            </button>
            <button
              className="bg-red-500 text-white text-sm rounded-md p-2"
              onClick={() => toggleDrawer(DrawerType.ADD_IDENTITY)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </OverlayDrawer>
  );
};

export default AddIdentityDrawer;
