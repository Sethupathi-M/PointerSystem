"use client";
import { Checkbox } from "@headlessui/react";

export const TaskCheckbox = ({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}) => {
  return (
    <Checkbox
      checked={enabled}
      onChange={setEnabled}
      className="group block border rounded-lg size-5"
    >
      <svg
        className="stroke-white opacity-0 group-data-checked:opacity-100"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M3 8L6 11L11 3.5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Checkbox>
  );
};
