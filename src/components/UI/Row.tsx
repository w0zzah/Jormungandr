import type { ReactNode } from "react";

export default function Row({ children }: { children: ReactNode }) {
    return <div className="group flex items-stretch">{children}</div>;
}