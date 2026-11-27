import { useState } from "react";
import type { CodeLine } from "@/types/line";

// The highlighted line that keyboard actions apply to
export function useLineCursor(lines: CodeLine[]) {

    const [cursorId, setCursorId] = useState<number | null>(null);

    // Falls back to the last line when nothing is selected (or the selected line was deleted)
    const selected = lines.findIndex((l) => l.id === cursorId);
    const index = selected !== -1 ? selected : lines.length - 1;

    const moveTo = (i: number) => {
        const target = lines[Math.max(0, Math.min(lines.length - 1, i))];
        if (target)
            setCursorId(target.id);
    };

    return {
        current: lines[index] ?? null,
        above: lines[index - 1] ?? null,
        neighbour: lines[index + 1] ?? lines[index - 1] ?? null,
        select: setCursorId,
        up: () => moveTo(index - 1),
        down: () => moveTo(index + 1),
        start: () => moveTo(0),
        end: () => moveTo(lines.length - 1),
    };
}