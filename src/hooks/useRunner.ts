import { useEffect, useRef, useState } from "react";

const TIMEOUT_MS = 10_000;

export function useRunner() {

    const [output, setOutput] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const worker = useRef<Worker | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const spawn = () => {

        const w = new Worker("/py-worker.js");
        w.onmessage = (e) => {
            if (e.data.done) {
                clearTimeout(timer.current);
                setRunning(false);
            } else {
                setOutput((o) => (o ?? "") + e.data.text);
            }
        };
        worker.current = w;
    };

    useEffect(() => {
        spawn();
        return () => {
            clearTimeout(timer.current);
            worker.current?.terminate();
        };
    }, []);

    const run = (code: string) => {
        setRunning(true);
        setOutput("");
        worker.current!.postMessage(code);
        timer.current = setTimeout(() => {
            worker.current?.terminate();
            spawn();
            setOutput((o) => `${o ?? ""}\nStopped: the program exceeded max runtime of ${TIMEOUT_MS}ms`);
            setRunning(false);
        }, TIMEOUT_MS);
    };

    return { output, running, run };
}