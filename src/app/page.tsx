"use client";

import { AddTask } from "@/components/AddTask";
import { useState } from "react";
import { Header } from "../components/Header";
import { TaskList } from "../components/TaskList";

function Home() {
  return (
    <div className="px-8 mt-1 relative mx-auto flex gap-0 lg:gap-4 h-11/12">
      {/* MAIN CONTENT */}
      <main className="flex-1 lg:p-6">
        <div className="flex flex-col gap-2  h-full">
          {/* <Header /> */}
          <TaskList />
          <AddTask />
        </div>
      </main>
    </div>
  );
}

export default Home;
