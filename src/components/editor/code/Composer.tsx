import type { Mode } from "@/types/mode";
import Button from "@/components/ui/button";

type Props = {
    value: string;
    onChange: (text: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

export default function Composer({ value, onChange, onSubmit, onCancel }: Props) {
    return (
        <input
            className="w-full border border-gray-300 bg-white px-2 py-1 text-black dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            value={value}
            maxLength={255}
            spellCheck={false}
            autoFocus
            aria-label="Line of code"
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter")
                    onSubmit();
                if (e.key === "Escape")
                    onCancel();
            }}
        />
    );
}