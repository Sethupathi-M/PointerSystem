"use client";
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { taskApi } from '@/lib/api/taskApi';
import { TaskList } from '@/components/TaskList';
import Spinner from '@/components/Spinner';
import { Task } from '@/generated/prisma';

const Favourites = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["favourites", "task"],
        queryFn: () => taskApi.getFavourites(),
    });
  return (
    <div>
        {isLoading ? <Spinner /> : <TaskList tasks={data as unknown as Task[]} />}
    </div>
  )
}

export default Favourites