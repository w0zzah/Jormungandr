import type { ReactNode } from "react";

export default function Gutter({ children }: { children: ReactNode }) {
    return <span className="w-14 shrink-0 select-none self-stretch border-r border-[#1e3a8a] bg-[#c4d3ff] px-3 py-1 text-right text-gray-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500">
        {children}</span>;
}