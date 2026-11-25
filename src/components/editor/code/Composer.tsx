import type { Mode } from "@/types/mode";
import Button from "@/components/ui/button";

type Props = {
    kind: Mode["kind"];
    value: string;
    saving: boolean;
    onChange: (text: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

export default function Composer({ kind, value, saving, onChange, onSubmit, onCancel }: Props) {
    return (
        <div className="flex-1 pb-2">
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
            <div className="mt-2 flex flex-wrap items-center gap-2 font-sans text-sm">
                <Button onClick={onSubmit} disabled={saving}>
                    {kind === "edit" ? "Save" : "Add line"}
                </Button>
                <Button onClick={onCancel}>Cancel</Button>
            </div>
        </div>
    );
}