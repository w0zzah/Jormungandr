import type { ReactNode } from "react";

export default function Gutter({ children }: { children: ReactNode }) {
    return <span className="w-14 shrink-0 select-none text-right text-gray-500">{children}</span>;
}