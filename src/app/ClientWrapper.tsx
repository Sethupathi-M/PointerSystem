"use client";

import AddIdentityDrawer from "@/components/AddIdentityDrawer";
import { CommonHeader } from "@/components/CommonHeader";
import MainSideBar from "@/components/MainSideBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-gray-950">
        {/* Top bar */}

        <div className="relative mx-auto flex gap-0 lg:gap-4 h-screen">
          {/* STATIC (FLOW) DRAWER */}
          <MainSideBar />

          {/* MAIN CONTENT */}
          <main className="flex-1 h-screen">
            <CommonHeader />
            {children}
          </main>
          <AddIdentityDrawer />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default ClientWrapper;
