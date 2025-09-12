"use client";
import { ListType } from "@/types";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useNavPath } from "@/hooks/useNavPath";
import { Trash2 } from "lucide-react";
import { identityApi } from "@/lib/api/identityApi";
import { useState } from "react";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";

export function NavItem({
  icon,
  label,
  count,
  compact,
  id,
  listType,
  accentColor = "slate",
}: {
  icon: React.ReactNode;
  label: string;
  count?: number | null;
  compact?: boolean;
  id?: string;
  listType: ListType;
  accentColor?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const targetPath = useNavPath(listType, id);
  const isSelected = pathname === targetPath;
  const [isHovered, setIsHovered] = useState(false);

  const deleteIdentityMutation = useOptimisticMutation({
    mutationFn: (identityId: string) => identityApi.delete(identityId),
    queryKeys: [["identity"], ...(id ? [["identity", id]] : [])],
    onMutate: async () => {
      // Immediate navigation to provide instant feedback
      router.push("/favourites");
    },
    onError: (error) => {
      console.error("Failed to delete identity:", error);
      // Navigate back to identities list on error
      router.push("/identity");
      alert("Failed to delete identity. Please try again.");
    },
    onSuccess: () => {
      // Already navigated in onMutate, just log success
      console.log("Identity deleted successfully");
    },
    invalidateKeys: [["identity"]],
  });

  const handleDelete = () => {
    if (!id) return;

    if (
      !window.confirm(
        `Are you sure you want to delete "${label}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    deleteIdentityMutation.mutation.mutate(id);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => router.push(targetPath)}
        className={`
          group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm
          text-slate-200 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer
          relative backdrop-blur-sm border border-slate-700/30
          ${
            isSelected
              ? "bg-gradient-to-r from-slate-600/30 to-slate-700/50 border-slate-400/30 shadow-lg shadow-slate-900/20"
              : "hover:border-slate-600/50 hover:shadow-md hover:shadow-slate-900/10"
          }
        `}
      >
        <span
          className={`
          inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ease-out
          relative overflow-hidden backdrop-blur-sm
          ${
            isSelected
              ? "bg-gradient-to-br from-slate-600/80 to-slate-700/80 shadow-lg shadow-slate-900/30 border border-slate-500/50 ring-1 ring-slate-400/30 ring-offset-1 ring-offset-slate-900/50 before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/10 before:to-emerald-500/10 before:animate-pulse before:rounded-xl"
              : "bg-slate-800/60 group-hover:bg-slate-700/80 border border-slate-700/50 group-hover:border-slate-600/60 group-hover:shadow-md group-hover:shadow-slate-900/20 before:absolute before:inset-0 before:bg-gradient-to-br before:from-slate-600/20 before:to-slate-500/20 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-300 before:rounded-xl"
          }
        `}
        >
          <span
            className={`
            relative z-10 transition-all duration-300
            ${
              isSelected
                ? `text-${accentColor}-300 drop-shadow-[0_0_8px_rgba(var(--${accentColor}-color),0.3)] scale-105`
                : `text-${accentColor}-400 group-hover:text-${accentColor}-200 hover:text-${accentColor}-300`
            }
          `}
          >
            {icon}
          </span>
        </span>

        {!compact && (
          <span
            className={`
          flex-1 truncate font-medium transition-colors duration-200
          ${isSelected ? "text-slate-100" : "group-hover:text-slate-100"}
        `}
          >
            {label}
          </span>
        )}

        {!compact && typeof count === "number" && (
          <span
            className={`
            ml-auto inline-flex min-w-[1.75rem] justify-center rounded-full px-2.5 py-1.5
            text-xs font-bold tracking-wide
            transition-all duration-300 ease-out backdrop-blur-sm shadow-lg shadow-slate-900/30
            border-2 relative overflow-hidden
            ${
              isSelected
                ? "bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-emerald-500/30 text-blue-100 border-blue-400/50 ring-1 ring-blue-500/20 ring-offset-1 ring-offset-slate-900/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/20 before:via-cyan-500/20 before:to-emerald-500/20 before:animate-pulse before:rounded-full before:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:before:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                : "bg-gradient-to-r from-slate-700/60 to-slate-800/60 text-slate-200 border-slate-500/50 group-hover:bg-gradient-to-r group-hover:from-slate-600/70 group-hover:to-slate-700/70 group-hover:border-slate-400/60 group-hover:shadow-[0_0_12px_rgba(148,163,184,0.4)] group-hover:ring-1 group-hover:ring-slate-500/30 group-hover:ring-offset-1 group-hover:ring-offset-slate-900/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-slate-500/20 before:to-slate-400/20 before:opacity-0 group-hover:before:opacity-100 before:transition-all before:duration-300 before:rounded-full"
            }
          `}
          >
            <span className="relative z-10">{count}</span>
          </span>
        )}
      </button>

      {/* Delete button - only for identity items and on hover */}
      {id && listType === "identity" && isHovered && !isSelected && (
        <button
          onClick={handleDelete}
          className="z-[99999]
            absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full
            bg-red-500/90 hover:bg-red-600/90
            border-2 border-white/20
            shadow-lg shadow-red-900/30
            transition-all duration-200 hover:scale-110
            backdrop-blur-sm
          "
          aria-label={`Delete ${label}`}
        >
          <Trash2 size={12} className="text-white" />
        </button>
      )}
    </div>
  );
}
