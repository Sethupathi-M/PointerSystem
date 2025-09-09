"use client";
 
import { useDrawerStore } from "@/store/useDrawerStore";
import TaskDetailsDrawer from "@/components/TaskDetailsDrawer";
import { DrawerType } from "@/types";
import Identity from "@/views/Identity";
import React from "react";

const IdentityPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const { isOpen, toggleDrawer } = useDrawerStore();
  const isTaskDetailsOpen = isOpen(DrawerType.TASK_DETAILS);
 
  return  <div className="flex"><Identity  id={id} />
  <TaskDetailsDrawer isOpen={isTaskDetailsOpen} setIsOpen={()=>toggleDrawer(DrawerType.TASK_DETAILS)} />
  </div>
   
};

export default IdentityPage;
