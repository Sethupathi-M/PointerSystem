"use client";
import { useRouter } from "next/navigation";

export function NavItem({
  icon,
  label,
  count,
  compact,
  id,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  compact?: boolean;
  id?: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/identity/${id}`)}
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-zinc-700 transition-colors cursor-pointer"
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

// supabase
// Netlify
// Render
