type Props = { output: string | null; running: boolean };

export default function OutputPanel({output, running}: Props) {

    if (output === null)
        return null;

    return (
        <section aria-label="Output" className="w-full">
            <h2 className="mb-2 mt-6 text-xl font-semibold">Output</h2>
            <pre
                className="min-h-16 overflow-x-auto whitespace-pre-wrap p-4 font-mono text-sm rounded-2xl border border-[#1e3a8a] bg-[#fdfdfd] dark:border-zinc-900 dark:bg-zinc-700">
                {output || (running ? "Starting Python…" : "(no output)")}
            </pre>
        </section>
    );
}