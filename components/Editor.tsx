"use client";
import { useRef, useState } from "react";
import Image from "next/image";

type Line = { id: number; text: string };
type Mode = { kind: "edit"; id: number } | { kind: "add"; after: number | null };
const STARTER = ['print("hello world")'];

const btn = "bg-gray-100 p-3 text-black hover:bg-gray-200 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700";
const row = "group flex items-start gap-5 p-3";
const gutter = "w-14 shrink-0 select-none text-right text-gray-500";
const iconBtn = "shrink-0 px-2 text-blue-700 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none dark:text-blue-400 [@media(hover:none)]:opacity-100";

export default function Editor() {
    /**
     * State: changing any of these re-renders the page.
     *  lines:   the whole program, in order
     *  mode:    which composer (if any) is open
     *  draft:   the text typed into the composer but not yet committed
     *  output:  null = output panel hidden, string = shown
     *  running: a run is in progress
     */
    const [lines, setLines] = useState<Line[]>(STARTER.map((text, i) => ({ id: i + 1, text })));
    const [mode, setMode] = useState<Mode | null>(null);
    const [draft, setDraft] = useState("");
    const [output, setOutput] = useState<string | null>(null);
    const [running, setRunning] = useState(false);

    const nextId = useRef(STARTER.length + 1);

    const open = (m: Mode | null, text = "") => {
        setMode(m);
        setDraft(text);
    };

    /* add code */
    function submit() {
        if (!mode) return;

        if (mode.kind === "edit") {
            setLines((ls) => ls.map((l) => (l.id === mode.id ? { ...l, text: draft } : l)));
            open(null);
            return;
        }

        if (draft.trim() === "") { open(null); return; }

        const id = nextId.current++;
        setLines((ls) => {
            const at = mode.after === null ? 0 : ls.findIndex((l) => l.id === mode.after) + 1;
            return [...ls.slice(0, at), { id, text: draft }, ...ls.slice(at)];
        });
        open({ kind: "add", after: id });
    }
    /* remove code */
    function remove(id: number) {
        setLines((ls) => ls.filter((l) => l.id !== id));
        open(null);
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

    /** where to write the new code in */
    const composer = (
        <div className="flex-1 pb-2">
            <input
                className="w-full border border-gray-300 bg-white px-2 py-1 text-black dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                value={draft}
                maxLength={255}
                spellCheck={false}
                autoFocus
                aria-label="Line of code"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
                    if (e.key === "Escape") open(null);
                }}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2 font-sans text-sm">
                <button className={btn} onClick={submit}>{mode?.kind === "edit" ? "Save" : "Add line"}</button>
                <button className={btn} onClick={() => open(null)}>Done</button>
                <span className="text-gray-500">
                    {mode?.kind === "edit"
                        ? "Enter saves, Esc cancels."
                        : "Enter adds the line and opens the next one. Enter on an empty box (or Esc) finishes."}
                </span>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-dvh flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
            <header className="flex flex-col items-center pt-10">
                <h1 className="text-7xl font-semibold tracking-tight">jormungandr</h1>
                <p className="text-zinc-600 dark:text-zinc-400 pb-2">ever growing, ever devouring</p>
                <Image
                    className="size-15 animate-[spin_10s_linear_infinite] motion-reduce:animate-none dark:invert"
                    src="/ouraborus1.svg"
                    alt="Ouroboros"
                    width={75}
                    height={75}
                    priority
                />
            </header>

            <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 pb-50">
                <section aria-label="Program" className="w-full">
                    <div className="my-5 flex flex-wrap justify-center gap-5">
                        <button className={btn} onClick={run} disabled={running || lines.length === 0}>{running ? "Running…" : "Run program"}</button>
                        <button className={btn} onClick={() => open({ kind: "add", after: lines.at(-1)?.id ?? null })}>Add line at end</button>
                        <button className={btn} onClick={() => open({ kind: "add", after: null })}>Insert at top</button>
                    </div>

                    <ol className="overflow-x-auto bg-gray-100 font-mono text-sm dark:bg-zinc-900">
                        {mode?.kind === "add" && mode.after === null && (
                            <li><div className={row}><span className={gutter}>+</span>{composer}</div></li>
                        )}

                        {lines.length === 0 && !mode && <li className="px-5 py-4 font-sans text-gray-500">Write on me!</li>}

                        {lines.map((l, i) => {
                            const editing = mode?.kind === "edit" && mode.id === l.id;
                            const adding = mode?.kind === "add" && mode.after === l.id;
                            return (
                                <li key={l.id}>
                                    <div className={row}>
                                        <span className={gutter}>{String(i + 1).padStart(4, "0")}</span>

                                        {editing ? composer : (
                                            <button
                                                className="flex-1 cursor-text whitespace-pre text-left enabled:hover:bg-blue-500/10"
                                                disabled={!!mode}
                                                onClick={() => open({ kind: "edit", id: l.id }, l.text)}
                                            >
                                                {l.text || " "}
                                            </button>
                                        )}

                                        {!mode && (
                                            <>
                                                <button className={iconBtn} aria-label={`Add a line after line ${i + 1}`} onClick={() => open({ kind: "add", after: l.id })}>+</button>
                                                <button className={iconBtn} aria-label={`Delete line ${i + 1}`} onClick={() => remove(l.id)}>×</button>
                                            </>
                                        )}
                                    </div>
                                    {adding && <div className={row}><span className={gutter}>+</span>{composer}</div>}
                                </li>
                            );
                        })}
                    </ol>
                </section>

                {output !== null && (
                    <section aria-label="Output" className="w-full">
                        <h2 className="mt-6 mb-2 text-xl font-semibold">Output</h2>
                        <pre className="min-h-16 overflow-x-auto whitespace-pre-wrap bg-zinc-900 p-4 font-mono text-sm text-zinc-100 dark:bg-zinc-800">{output || (running ? "Starting Python…" : "(no output)")}</pre>
                    </section>
                )}
            </main>
        </div>
    );
}