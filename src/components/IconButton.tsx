"use client";
export const IconButton = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className="outline-none hover:bg-zinc-700 rounded-full flex items-center justify-center w-5 h-5 transition-colors duration-300 "
      onClick={onClick}
    >
      {icon}
    </button>
  );
};
