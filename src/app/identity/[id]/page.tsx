"use client";

import Identity from "@/components/Identity";
import React from "react";

const IdentityPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);

  return (
    <div className="flex">
      <Identity id={id} />
    </div>
  );
};

export default IdentityPage;
