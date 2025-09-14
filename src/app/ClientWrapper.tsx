"use client";

import { usePathname } from "next/navigation";
import AddIdentityDrawer from "@/components/Drawers/AddIdentityDrawer";
import { CommonHeader } from "@/components/CommonHeader";
import MainSideBar from "@/components/MainSideBar/MainSideBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useIdentityContext } from "@/components/IdentityContext";
import TaskDetailsDrawer from "@/components/Drawers/TaskDetailsDrawer";
import { DrawerType } from "@/types";
import { useDrawerStore } from "@/store/useDrawerStore";

const queryClient = new QueryClient();

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useIdentityContext();
  const { isOpen, toggleDrawer } = useDrawerStore();
  const isTaskDetailsOpen = isOpen(DrawerType.TASK_DETAILS);
  const pathname = usePathname();

  useEffect(() => {
    if (isLoggedIn && pathname && pathname !== "/login") {
      localStorage.setItem("lastVisitedPath", pathname);
    }
  }, [isLoggedIn, pathname]);

  useEffect(() => {
    if (isLoggedIn) {
    }
  }, [isLoggedIn]);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-gray-950">
        {/* Top bar */}

        <div className="relative mx-auto flex h-screen">
          {/* STATIC (FLOW) DRAWER */}
          {isLoggedIn && <MainSideBar />}

          {/* MAIN CONTENT */}
          <main className="flex-1 flex flex-col h-screen">
            {isLoggedIn && <CommonHeader />}
            <div className="flex-1 overflow-y-auto pb-12">{children}</div>
          </main>
          <TaskDetailsDrawer
            isOpen={isTaskDetailsOpen}
            setIsOpen={() => toggleDrawer(DrawerType.TASK_DETAILS)}
          />
          <AddIdentityDrawer />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default ClientWrapper;
