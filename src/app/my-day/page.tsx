"use client";
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { taskApi } from '@/lib/api/taskApi';
import { TaskList } from '@/components/TaskList';
import Spinner from '@/components/Spinner';
import { Task } from '@/generated/prisma';

const MyDay = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["today", "task"],
        queryFn: () => taskApi.getAddedToToday(),
    });
  return (
    <div>
        {isLoading ? <Spinner /> : <TaskList tasks={data as unknown as Task[]} />}
    </div>
  )
}

export default MyDay