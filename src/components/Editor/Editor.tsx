"use client";
import {useEffect, useState} from "react";
import {Mode} from "@/types/mode";
import {CodeLine} from "@/types/line";
import {addLine, editLine, getLines, removeLine} from "@/lib/api";
import {useRunner} from "@/hooks/useRunner";
import {useHotkeys} from "@/hooks/useHotkeys";
import {useLineCursor} from "@/hooks/useLineCursor";
import Toolbar from "./Toolbar";
import LineList from "./code/LineList";
import OutputPanel from "./OutputPanel";
import Composer from "./code/Composer";

export default function Editor() {

    // Editing state
    const [mode, setMode] = useState<Mode | null>(null);

    // Code State
    const [lines, setLines] = useState<CodeLine[]>([]);
    const [draft, setDraft] = useState("");

    // Internal State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {output, running, run} = useRunner();
    const cursor = useLineCursor(lines);

    const open = (m: Mode | null, text = "") => {
        setMode(m);
        setDraft(text);
    };

    const refresh = async () => {

        try {

            setLines((await getLines()).lines);
            setError(null);

        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);


    const submit = async () => {

        // Not editing
        if (!mode || saving)
            return;

        // An empty new line means we're done adding
        if (mode.kind === "add" && draft.trim() === "") {
            open(null);
            return;
        }

        setSaving(true);

        try {

            if (mode.kind === "edit") {

                // Only hit the API if the line actually changed
                const current = lines.find((l) => l.id === mode.id);
                if (draft !== current?.text)
                    await editLine(mode.id, draft);

                cursor.select(mode.id);
                await refresh();
                open({kind: "add", after: mode.id});

            } else {

                const saved = await addLine(draft, mode.after);
                cursor.select(saved.id);
                await refresh();
                open({kind: "add", after: saved.id});

            }
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    }

    const removeCurrentLine = async () => {

        if (!cursor.current || saving)
            return;

        setSaving(true);

        try {

            await removeLine(cursor.current.id);
            cursor.select(cursor.neighbour?.id ?? null);
            await refresh();

        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    }


    const goToLine = async (target: CodeLine | undefined) => {

        if (!mode || !target || saving)
            return;

        // Already on that line
        if (mode.kind === "edit" && mode.id === target.id)
            return;

        setSaving(true);

        try {

            if (mode.kind === "edit") {

                // Only hit the API if the line actually changed
                const current = lines.find((l) => l.id === mode.id);
                if (draft !== current?.text)
                    await editLine(mode.id, draft);

            } else if (draft.trim() !== "") {

                // Was typing a new line, keep it
                await addLine(draft, mode.after);
            }

            cursor.select(target.id);
            await refresh();
            open({kind: "edit", id: target.id}, target.text);

        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    }

    const moveEdit = (direction: -1 | 1) => {

        if (!mode)
            return;

        const index = lines.findIndex((l) => l.id === (mode.kind === "edit" ? mode.id : mode.after));

        const target = mode.kind === "edit"
            ? lines[index + direction]
            : lines[direction === -1 ? index : index + 1];

        goToLine(target);
    }

    const clickLine = (line: CodeLine) => {

        if (mode) {
            goToLine(line);
            return;
        }

        cursor.select(line.id);
        open({kind: "edit", id: line.id}, line.text);
    }


    const editCurrentLine = () => {
        if (cursor.current)
            open({kind: "edit", id: cursor.current.id}, cursor.current.text);
        else
            open({kind: "add", after: null});
    }

    const addBelow = () => open({kind: "add", after: cursor.current?.id ?? null});
    const addAbove = () => open({kind: "add", after: cursor.above?.id ?? null});

    const runProgram = () => {
        if (running || lines.length === 0)
            return;

        run(lines.map((l) => l.text).join("\n"));
    }

    useHotkeys({
        "shift+Enter": runProgram,
    });

    return (
        <>
            <section aria-label="Program" className="w-full">

                {error && <p role="alert" className="mb-3 text-red-600 dark:text-red-400">{error}</p>}

                <LineList
                    lines={lines}
                    mode={mode}
                    loading={loading}
                    activeId={cursor.current?.id ?? null}
                    onEdit={clickLine}
                    composer={mode && (
                        <Composer
                            value={draft}
                            onChange={setDraft}
                            onSubmit={submit}
                            onCancel={() => open(null)}
                            onMove={moveEdit}
                        />
                    )}
                />

            </section>

            <Toolbar
                running={running}
                canRun={lines.length > 0}
                onRun={runProgram}
            />
            <OutputPanel output={output} running={running}/>
        </>
    );
}