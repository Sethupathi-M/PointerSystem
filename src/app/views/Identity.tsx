import { AddTask } from "@/components/AddTask";
import { Header } from "@/components/Header";
import Spinner from "@/components/Spinner";
import { TaskList } from "@/components/TaskList";
import { IdentityItem } from "@/types";
import React from "react";

const Identity = ({
  identity,
  isLoading,
}: {
  identity: IdentityItem | undefined;
  isLoading: boolean;
}) => {
  return (
    <div className="px-8 mt-1 relative mx-auto flex gap-0 lg:gap-4 h-11/12">
      {/* MAIN CONTENT */}

      <main className="flex-1 lg:p-6">
        {isLoading || !identity ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-2  h-full">
            <Header
              gainedPoints={100}
              level={1}
              name={identity.title}
              requiredPoints={identity.requiredPoints}
            />
            <TaskList />
            <AddTask />
          </div>
        )}
      </main>
    </div>
  );
};

export default Identity;
