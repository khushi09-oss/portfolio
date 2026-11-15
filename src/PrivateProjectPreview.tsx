import { useEffect, useRef, useState } from "react";
import { previewHeight } from "./private-preview";

export function PrivateProjectPreview({ id }: { id: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(640);
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
      <iframe
        ref={frame}
        title="Interactive interface concepts"
        src={`${import.meta.env.DEV ? "/.private-previews" : "/private-previews"}/${encodeURIComponent(id)}/index.html`}
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
    </section>
  );
}
