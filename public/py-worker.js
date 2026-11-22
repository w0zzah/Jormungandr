importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");

const ready = loadPyodide();

onmessage = async (e) => {
    const send = (text) => postMessage({ text });
    try {
        const py = await ready;
        py.setStdout({ batched: (s) => send(s + "\n") });
        py.setStderr({ batched: (s) => send(s + "\n") });
        await py.runPythonAsync(e.data, { globals: py.globals.get("dict")() });
    } catch (err) {
        send(String((err && err.message) || err) + "\n");
    }
    postMessage({ done: true });
};