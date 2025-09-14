/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { identityApi } from "@/lib/api/identityApi";
import { useDrawerStore } from "@/store/useDrawerStore";
import { useMainSideBar } from "@/store/useMainSideBar";
import { DrawerType, INavItem, ListType } from "@/types";
import { useIdentityContext } from "../IdentityContext";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  HomeIcon,
  List,
  MapPlus,
  Star,
} from "lucide-react";
import { NavItem } from "./NavItem";
import Spinner from "../Spinner";

export const MainSideBar = () => {
  const { isOpen, setIsOpen } = useMainSideBar();
  const { openDrawer } = useDrawerStore();
  const { isLoggedIn } = useIdentityContext();
  const { data, isLoading } = useQuery({
    queryKey: ["identity"],
    queryFn: () => identityApi.getAll(),
  });

  const baseNavItems: INavItem[] = [
    {
      id: "my-day",
      name: "My Day",
      path: "/",
      icon: <HomeIcon className="text-blue-400" />,
      count: null,
      listType: ListType.MY_DAY,
      accentColor: "blue",
    },
    {
      id: "favourites",
      name: "Favourites",
      path: "/favourites",
      icon: <Star className="text-amber-400" />,
      count: null,
      listType: ListType.FAVOURITES,
      accentColor: "amber",
    },
    {
      id: "rewards",
      name: "Rewards",
      path: "/rewards",
      icon: <Gift className="text-emerald-400" />,
      count: null,
      listType: ListType.REWARDS,
      accentColor: "emerald",
    },
    {
      id: "status",
      name: "Status",
      path: "/status",
      icon: <List className="text-indigo-400" />,
      count: null,
      listType: ListType.STATUS, // Using REWARDS for now, may need new type
      accentColor: "indigo",
    },
  ];

  const identityNavItems: INavItem[] = data
    ? data.map((identity) => ({
        id: identity.id,
        name: identity.name,
        path: `/identity/${identity.id}`,
        icon: <List className="text-purple-400" />,
        count: (identity as any)?._count?.Task ?? null,
        listType: ListType.IDENTITY,
        accentColor: "purple",
      }))
    : [];

  const navItems: INavItem[] = isLoggedIn
    ? [...baseNavItems, ...identityNavItems]
    : baseNavItems.filter((item) => item.listType !== ListType.IDENTITY);

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky h-screen border-r border-slate-700/50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
        aria-label="Sidebar navigation"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-emerald-500/3" />

        <div className="relative flex items-center justify-end border-b border-slate-700/50 p-3 bg-slate-900/20 backdrop-blur-sm">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-200 hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <div className="overflow-y-auto w-full justify-between flex flex-col relative z-10">
          <nav className="flex flex-col gap-1 p-3 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
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
                  accentColor={navItem.accentColor || "slate"}
                />
              ))
            )}
          </nav>
        </div>

        <button
          className="relative bg-gradient-to-r from-slate-800 to-slate-900/80 hover:from-slate-700 hover:to-slate-800/80 border-t border-slate-700/50 backdrop-blur-sm transition-all duration-200 bottom-0 w-full group"
          onClick={() => openDrawer(DrawerType.ADD_IDENTITY)}
        >
          <div className="font-bold flex items-center gap-3 p-4 w-full justify-center text-slate-200 group-hover:text-slate-100 transition-colors">
            <MapPlus
              size={24}
              className="group-hover:scale-110 transition-transform duration-200"
            />
            {isOpen && (
              <span className="text-ellipsis duration-200 whitespace-nowrap">
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
