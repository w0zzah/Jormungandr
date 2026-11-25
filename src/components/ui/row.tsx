import type { ReactNode } from "react";

export default function Row({ children }: { children: ReactNode }) {
    return <div className="group flex items-start gap-5 p-3">{children}</div>;
}