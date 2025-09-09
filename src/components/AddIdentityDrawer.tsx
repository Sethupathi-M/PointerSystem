import { useDrawerStore } from "@/store/useDrawerStore";
import OverlayDrawer from "./OverlayDrawer";
import React, { useEffect } from "react";
import { DrawerType } from "@/types";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { identityApi } from "@/lib/api/identityApi";
import type { Identity } from "@/generated/prisma";

type IdentityFormData = Omit<Identity, "id" | "createdAt" | "Task">;

const AddIdentityDrawer = () => {
  const { isOpen, toggleDrawer } = useDrawerStore();
  const { register, handleSubmit, setFocus } = useForm<IdentityFormData>({
    defaultValues: {
      name: "",
      description: "",
      requiredPoints: 100,
      isActive: true,
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: identityApi.create,
    onSuccess: () => {
      toggleDrawer(DrawerType.ADD_IDENTITY);
      queryClient.invalidateQueries({ queryKey: ["identity"] });
    },
  });

  const onSubmit = (data: IdentityFormData) => {
    mutate(data);
  };

  useEffect(() => {
    setFocus("name");
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
            {...register("name")}
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
            {...register("requiredPoints", { valueAsNumber: true })}
            type="number"
            className="text-white text-sm bg-zinc-800 rounded-md p-2"
            placeholder="Minimum Required Points"
          />
         

          <div className="flex gap-2 w-full">
            <button
              type="button"
              className="bg-blue-500 text-white text-sm rounded-md p-2"
              onClick={handleSubmit(onSubmit)}
            >
              Add
            </button>
            <button
              type="button"
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
