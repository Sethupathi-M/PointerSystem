"use client";
import { Task } from "./Task";

export const TaskList = () => {
  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto">
      {Array.from({ length: 20 }).map((_, index) => (
        <Task key={index} />
      ))}
    </div>
  );
};
