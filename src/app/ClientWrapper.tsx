"use client";

import AddIdentityDrawer from "@/components/Drawers/AddIdentityDrawer";
import { CommonHeader } from "@/components/CommonHeader";
import MainSideBar from "@/components/MainSideBar/MainSideBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-gray-950">
        {/* Top bar */}

        <div className="relative mx-auto flex h-screen">
          {/* STATIC (FLOW) DRAWER */}
          <MainSideBar />

          {/* MAIN CONTENT */}
          <main className="flex-1 flex flex-col h-screen">
            <CommonHeader />
            <div className="flex-1 overflow-y-auto pb-12">{children}</div>
          </main>
          <AddIdentityDrawer />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default ClientWrapper;
