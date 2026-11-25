import type { ReactNode } from "react";
import type { CodeLine } from "@/types/line";
import type { Mode } from "@/types/mode";
import Row from "@/components/ui/row";
import Gutter from "@/components/ui/gutter";
import NewLineRow from "@/components/editor/code/NewLineRow";

type Props = {
    lines: CodeLine[];
    mode: Mode | null;
    loading: boolean;
    composer: ReactNode;
    onEdit: (line: CodeLine) => void;
};

export default function LineList({ lines, mode, loading, composer, onEdit }: Props) {

    const editingId = mode?.kind === "edit" ? mode.id : null;
    const addingAfter = mode?.kind === "add" ? mode.after : undefined;

    return (
        <ol className="overflow-x-auto bg-gray-100 font-mono text-sm dark:bg-zinc-900">

            {loading && <li className="px-5 py-4 font-sans text-gray-500">Loading…</li>}

            {!loading && lines.length === 0 && !mode && (
                <li className="px-5 py-4 font-sans text-gray-500">Enter code here...</li>
            )}

            {/* empty file: nothing for the composer to sit under */}
            {addingAfter === null && <li>
                <NewLineRow>{composer}</NewLineRow>
            </li>}

            {lines.map((l, i) => (
                <li key={l.id}>
                    <Row>
                        <Gutter>{String(i + 1).padStart(4, "0")}</Gutter>
                        {editingId === l.id ? composer : (
                            <button
                                className="flex-1 cursor-text whitespace-pre text-left enabled:hover:bg-blue-500/10"
                                disabled={!!mode}
                                onClick={() => onEdit(l)}
                            >
                                {l.text || " "}
                            </button>
                        )}
                    </Row>
                    {addingAfter === l.id && <NewLineRow>{composer}</NewLineRow>}
                </li>
            ))}
        </ol>
    );
}