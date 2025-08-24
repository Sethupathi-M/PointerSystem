"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export const Chervon = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <>
      {isOpen ? (
        <ChevronDownIcon className="size-4" />
      ) : (
        <ChevronUpIcon className="size-4" />
      )}
    </>
  );
};
