type Props = {
    value: string;
    onChange: (text: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    onMove: (direction: -1 | 1) => void;
};

export default function Composer({ value, onChange, onSubmit, onCancel, onMove }: Props) {
    return (
        <input
            className="w-full bg-blue-500/15 px-3 py-1 font-mono text-sm text-inherit outline-none"
            value={value}
            maxLength={255}
            spellCheck={false}
            autoFocus
            aria-label="Line of code"
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
                    e.preventDefault();
                    onSubmit();
                }
                if (e.key === "Escape") {
                    e.preventDefault();
                    onCancel();
                }
                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    onMove(-1);
                }
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    onMove(1);
                }
            }}
        />
    );
}