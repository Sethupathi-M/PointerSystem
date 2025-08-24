import { useMainSideBar } from "@/store/useMainSideBar";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  HomeIcon,
  List,
  MapPlus,
} from "lucide-react";
import { useDrawerStore } from "@/store/useDrawerStore";
import { DrawerType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getIdentityBoard } from "@/api/identity";
import { NavItem } from "./NavItem";
import Spinner from "./Spinner";

export const MainSideBar = () => {
  const { isOpen, setIsOpen } = useMainSideBar();
  const { openDrawer } = useDrawerStore();
  const { data, isLoading } = useQuery({
    queryKey: ["identity"],
    queryFn: () => getIdentityBoard(),
  });

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky h-screen border-r border-zinc-700 bg-zinc-800"
        aria-label="Sidebar navigation"
      >
        <div className="relative flex items-center justify-between border-b border-zinc-700 p-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-zinc-700" />
            {isOpen && (
              <span className="text-sm font-medium text-white">
                Project Name
              </span>
            )}
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-zinc-700 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
        <div className="overflow-y-auto w-full justify-between flex flex-col">
          <nav className="flex flex-col gap-1 p-2">
            {isLoading ? (
              <Spinner />
            ) : (
              data?.map((identity) => (
                <NavItem
                  key={identity.id}
                  id={identity.id}
                  icon={<List />}
                  label={identity.title}
                  count={identity.requiredPoints}
                  compact={!isOpen}
                />
              ))
            )}
          </nav>
        </div>

        <button
          className="bg-zinc-950 cursor-pointer hover:bg-neutral-900 absolute bottom-0 w-full"
          onClick={() => openDrawer(DrawerType.ADD_IDENTITY)}
        >
          <div className="font-bold flex items-center gap-2 p-3 w-full justify-center">
            <MapPlus size={25} />
            {isOpen && (
              <span className="text-ellipsis duration-200 h-full">
                Add Identity
              </span>
            )}
          </div>
        </button>
      </motion.aside>
    </AnimatePresence>
  );
};

export default MainSideBar;
