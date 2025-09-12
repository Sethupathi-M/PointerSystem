"use client";

import { useDrawerStore } from "@/store/useDrawerStore";
import TaskDetailsDrawer from "@/components/Drawers/TaskDetailsDrawer";
import { DrawerType } from "@/types";
import Identity from "@/components/Identity";
import React, { createContext } from "react";
import type { Identity as IdentityType } from "@/generated/prisma";

const IdentityPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);

  const { isOpen, toggleDrawer } = useDrawerStore();
  const isTaskDetailsOpen = isOpen(DrawerType.TASK_DETAILS);

  return (
    <div className="flex">
      <Identity id={id} />
      <TaskDetailsDrawer
        isOpen={isTaskDetailsOpen}
        setIsOpen={() => toggleDrawer(DrawerType.TASK_DETAILS)}
      />
    </div>
  );
};

export default IdentityPage;
