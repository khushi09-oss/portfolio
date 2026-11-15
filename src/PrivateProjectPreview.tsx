import { useEffect, useRef, useState } from "react";
import { previewHeight } from "./private-preview";

export function PrivateProjectPreview({ id }: { id: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(640);
  const [document, setDocument] = useState<string>();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const path = `${import.meta.env.DEV ? "/.private-previews" : "/private-previews"}/${encodeURIComponent(id)}/document.json`;
    fetch(path, { signal: controller.signal, credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw new Error("Preview unavailable");
        return response.json() as Promise<{ html?: unknown }>;
      })
      .then((value) => {
        if (typeof value.html !== "string") throw new Error("Invalid preview");
        if (!controller.signal.aborted) setDocument(value.html);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [id]);
  useEffect(() => {
    const resize = (event: MessageEvent<unknown>) => {
      if (event.source !== frame.current?.contentWindow) return;
      const next = previewHeight(event.data);
      if (next !== null) setHeight(next);
    };
    window.addEventListener("message", resize);
    return () => window.removeEventListener("message", resize);
  }, []);
  return (
    <section
      id="project-concepts"
      className="private-project-concepts"
      aria-labelledby="concepts-title"
    >
      <p className="eyebrow">DESIGN CONCEPTS</p>
      <h2 id="concepts-title" tabIndex={-1}>
        Interface concepts
      </h2>
      <p>Explore the layouts and interactions I designed.</p>
      {!document && !failed && <p role="status">Loading interface concepts…</p>}
      {failed ? (
        <div role="alert">
          <p>
            The interface concepts couldn't load. The rest of the project is
            still available.
          </p>
          <button className="button" onClick={() => location.reload()}>
            Reload page
          </button>
        </div>
      ) : (
        <iframe
          ref={frame}
          title="Interactive interface concepts"
          srcDoc={document ?? ""}
          sandbox="allow-scripts"
          loading="lazy"
          style={{ height }}
          onLoad={() =>
            frame.current?.contentWindow?.postMessage(
              { type: "portfolio-preview:measure" },
              "*",
            )
          }
        />
      )}
    </section>
  );
}
