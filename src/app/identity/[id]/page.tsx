"use client";
import { getIdentityBoardById } from "@/api/identity";
import Identity from "@/app/views/Identity";
import { useQuery } from "@tanstack/react-query";
import React from "react";
// set
const IdentityPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const { data, isLoading } = useQuery({
    queryKey: ["identity", id],
    queryFn: () => getIdentityBoardById(id),
  });

  return <Identity identity={data} isLoading={isLoading}></Identity>;
};

export default IdentityPage;
