// Chromium ReturnAsStream JSON has one trace event per line. Bound analysis memory.
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
export async function summarizeTrace(path) {
  const rendererThreads = new Set(),
    tasksByThread = new Map(),
    eventCounts = {};
  for await (const line of createInterface({
    input: createReadStream(path),
    crlfDelay: Infinity,
  })) {
    const value = line.trim().replace(/,$/, "");
    if (!value.startsWith("{") || value.startsWith('{"traceEvents":')) continue;
    let event;
    try {
      event = JSON.parse(value);
    } catch {
      continue;
    }
    const key = `${event.pid}:${event.tid}`;
    if (event.name === "thread_name" && event.args?.name === "CrRendererMain")
      rendererThreads.add(key);
    if (/RunTask$/.test(event.name) && event.dur) {
      const tasks = tasksByThread.get(key) ?? [];
      tasks.push(event.dur / 1000);
      tasksByThread.set(key, tasks);
    }
    if (
      /FramePresented|DrawFrame|DroppedFrame|PipelineReporter|EventLatency/.test(
        event.name,
      )
    )
      eventCounts[event.name] = (eventCounts[event.name] ?? 0) + 1;
  }
  const tasks = [...rendererThreads].flatMap(
    (key) => tasksByThread.get(key) ?? [],
  );
  return {
    eventCounts,
    rendererTasksObserved: tasks.length,
    longTasksOver50ms: tasks.length ? tasks.filter((t) => t > 50).length : null,
    maxTaskMs: tasks.length
      ? tasks.reduce((max, t) => Math.max(max, t), 0)
      : null,
  };
}
