import Button from "@/components/UI/Button";

type Props = {
    running: boolean;
    canRun: boolean;
    onRun: () => void;
    onAdd: () => void;
};

export default function Toolbar({running, canRun, onRun, onAdd}: Props) {
    return (
        <div className="my-5 flex flex-wrap justify-center gap-5">
            <Button onClick={onRun} disabled={running || !canRun}>
                {running ? "Running…" : "Run program"}
            </Button>
            <Button onClick={onAdd}>Add line at end</Button>
        </div>
    );
}