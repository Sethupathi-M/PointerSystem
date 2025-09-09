/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddTask } from "@/components/AddTask";
import { Header } from "@/components/Header";
import Spinner from "@/components/Spinner";
import { TaskList } from "@/components/TaskList"; 
import type { Identity, Task    } from "@/generated/prisma";
import { identityApi } from "@/lib/api/identityApi";
import { taskApi } from "@/lib/api/taskApi";
import { useQuery } from "@tanstack/react-query"; 
import React from "react";

const Identity = ({ id }: { id: string }) => {
  const { data: identity, isLoading } = useQuery({
    queryKey: ["identity", id],
    queryFn: () => identityApi.getById(id),
  });
 
  const { data, isLoading: taskLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: () => taskApi.getById(id),
  });
  
  return (
    <div className="px-8 mt-1 relative w-full flex gap-0 lg:gap-4 h-11/12"> 
      
      <main className="flex-1 lg:p-6">
        {isLoading || taskLoading || !identity ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-2 h-full">
            <Header
              gainedPoints={(identity as any)["totalAcquiredPoints"]}
              level={1}
              name={identity.name}
              requiredPoints={identity.requiredPoints}
            />
            <TaskList tasks={data as unknown as Task[]} />
            <AddTask identityId={id} /> 
          </div>
        )}
      
      </main>
      </div>
  );
};

export default Identity;
