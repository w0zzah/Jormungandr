"use client";
import {useEffect, useState} from "react";
import {Mode} from "@/types/mode";
import {CodeLine} from "@/types/line";
import {addLine, editLine, getLines} from "@/lib/api";
import Toolbar from "@/components/Editor/Toolbar";
import LineList from "./Code/LineList";
import OutputPanel from "@/components/Editor/OutputPanel";
import Composer from "./Code/Composer";

export default function Editor() {

    // Editing state
    const [mode, setMode] = useState<Mode | null>(null);

    // Code State
    const [lines, setLines] = useState<CodeLine[]>([]);
    const [draft, setDraft] = useState("");
    const [output, setOutput] = useState<string | null>(null);

    // Internal State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [running, setRunning] = useState(false);

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

        // Creating a new line
        if (mode.kind === "add" && draft.trim() === "") {
            open(null);
            return;
        }

        setSaving(true);

        try {

            if (mode.kind === "edit") {

                await editLine(mode.id, draft);
                await refresh();
                open(null);

            } else {

                const saved = await addLine(draft);
                await refresh();
                open({kind: "add", after: saved.id});

            }
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    }


    /* run code */
    function run() {
        setRunning(true);
        setOutput("");
        const w = new Worker("/py-worker.js");
        const timer = setTimeout(() => {
            w.terminate();
            setOutput((o) => `${o ?? ""}\nStopped: the program ran longer than 10 seconds.`);
            setRunning(false);
        }, 10_000);
        w.onmessage = (e) => {
            if (e.data.done) {
                clearTimeout(timer);
                w.terminate();
                setRunning(false);
            } else {
                setOutput((o) => (o ?? "") + e.data.text);
            }
        };
        w.postMessage(lines.map((l) => l.text).join("\n"));
    }

    return (
        <>
            <section aria-label="Program" className="w-full">
                <Toolbar
                    running={running}
                    canRun={lines.length > 0}
                    onRun={run}
                    onAdd={() => open({kind: "add", after: lines.at(-1)?.id ?? null})}
                />

                {error && <p role="alert" className="mb-3 text-red-600 dark:text-red-400">{error}</p>}

                <LineList
                    lines={lines}
                    mode={mode}
                    loading={loading}
                    onEdit={(l) => open({kind: "edit", id: l.id}, l.text)}
                    composer={mode && (
                        <Composer
                            kind={mode.kind}
                            value={draft}
                            saving={saving}
                            onChange={setDraft}
                            onSubmit={submit}
                            onCancel={() => open(null)}
                        />
                    )}
                />
            </section>

            <OutputPanel output={output} running={running}/>
        </>


    );
}