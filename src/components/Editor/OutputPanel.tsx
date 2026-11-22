type Props = { output: string | null; running: boolean };

export default function OutputPanel({output, running}: Props) {

    if (output === null)
        return null;

    return (
        <section aria-label="Output" className="w-full">
            <h2 className="mb-2 mt-6 text-xl font-semibold">Output</h2>
            <pre
                className="min-h-16 overflow-x-auto whitespace-pre-wrap bg-zinc-900 p-4 font-mono text-sm text-zinc-100 dark:bg-zinc-800">
                {output || (running ? "Starting Python…" : "(no output)")}
            </pre>
        </section>
    );
}