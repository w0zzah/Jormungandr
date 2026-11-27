import { useEffect } from "react";

export type Hotkeys = Record<string, () => void>;

// Turns a key press into a name like "ArrowUp", "shift+Enter" or "mod+Enter" (mod = Ctrl or Cmd)
function keyName(e: KeyboardEvent) {

    const parts: string[] = [];

    if (e.ctrlKey || e.metaKey)
        parts.push("mod");
    if (e.shiftKey)
        parts.push("shift");

    parts.push(e.key);
    return parts.join("+");
}

export function useHotkeys(hotkeys: Hotkeys, enabled = true) {

    useEffect(() => {
        if (!enabled)
            return;

        const onKeyDown = (e: KeyboardEvent) => {

            // The input box already handled this key
            if (e.defaultPrevented)
                return;

            // Holding a key down shouldn't repeat actions (except moving with the arrows)
            const isArrow = e.key.startsWith("Arrow");
            if (e.repeat && !isArrow)
                return;

            const action = hotkeys[keyName(e)];
            if (!action)
                return;

            e.preventDefault();
            action();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [hotkeys, enabled]);
}