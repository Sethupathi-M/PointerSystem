"use client";
import { ListType } from "@/types";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useNavPath } from "@/hooks/useNavPath";

export function NavItem({
  icon,
  label,
  count,
  compact,
  id,
  listType,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number | null;
  compact?: boolean;
  id?: string;
  listType: ListType;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const targetPath = useNavPath(listType, id);
  const isSelected = pathname === targetPath;
 
  return (
    <button
      onClick={() => router.push(targetPath)}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-zinc-700 transition-colors cursor-pointer ${isSelected ? "bg-zinc-700" : "hover:bg-zinc-700"}`}
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-700">
        {icon}
      </span>
      {!compact && <span className="flex-1 truncate">{label}</span>}
      {!compact && typeof count === "number" && (
        <span className="ml-auto inline-flex min-w-[1.5rem] justify-center rounded-full border border-zinc-600 px-2 text-xs">
          {count}
        </span>
      )}
    </button>
  );
}
