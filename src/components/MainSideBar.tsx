/* eslint-disable @typescript-eslint/no-explicit-any */
import { identityApi } from "@/lib/api/identityApi";
import { useDrawerStore } from "@/store/useDrawerStore";
import { useMainSideBar } from "@/store/useMainSideBar";
import { DrawerType, INavItem, ListType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  HomeIcon,
  List,
  MapPlus,
  Star
} from "lucide-react";
import { NavItem } from "./NavItem";
import Spinner from "./Spinner";

export const MainSideBar = () => {
  const { isOpen, setIsOpen } = useMainSideBar();
  const { openDrawer } = useDrawerStore();
  const { data, isLoading } = useQuery({
    queryKey: ["identity"],
    queryFn: () => identityApi.getAll(),
  });

  const navItems: INavItem[] = [
    {
      id: "my-day",
name: "My Day",
path: "/",
icon: <HomeIcon />,
count: null,
listType: ListType.MY_DAY,
    },
    {
      id: "favourites",
      name: "Favourites",
      path: "/favourites",
      icon: <Star />,
      count: null,
      listType: ListType.FAVOURITES,
    },
    {
      id: "rewards",
      name: "Rewards",
      path: "/rewards",
      icon: <Gift />,
      count: null,
      listType: ListType.REWARDS,
    },
    ...(data
      ? data.map((identity) => ({
          id: identity.id,
          name: identity.name,
          path: `/identity/${identity.id}`,
          icon: <List />,
          count: (identity as any)?._count?.Task ?? null,
          listType: ListType.IDENTITY,
        }))
      : []),
  ]
  
  return (
    <AnimatePresence initial={false}>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky h-screen border-r border-zinc-700 bg-zinc-800"
        aria-label="Sidebar navigation"
      >
        <div className="relative flex items-center justify-end border-b border-zinc-700 p-3">
          {/* <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-zinc-700" />
            {isOpen && (
              <span className="text-sm font-medium text-white">
                Project Name
              </span>
            )}
          </div> */}
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
              navItems?.map((navItem) => (
                <NavItem
                  key={navItem.id}
                  id={navItem.id}
                  icon={navItem.icon}
                  label={navItem.name}
                  count={navItem.count ?? null}
                  compact={!isOpen}
                  listType={navItem.listType}
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
