import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const RewardDetailsDrawer = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  return (
    <AnimatePresence initial={false}>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 350 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky right-0 top-0 h-screen shrink-0 overflow-hidden border-l border-zinc-700 bg-zinc-900"
      >
        {/* Header */}
        {isOpen && (
          <div className="flex items-center justify-between border-b border-zinc-700 p-3">
            <span className="text-sm font-medium text-white">
              Reward Details
            </span>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-zinc-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="h-full overflow-y-auto p-4">
          {isOpen ? (
            <>
              <h3 className="text-lg font-semibold text-white">
                Reward Details
              </h3>
              <p className="text-sm text-zinc-400 mt-2">Reward Details</p>
            </>
          ) : null}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default RewardDetailsDrawer;
