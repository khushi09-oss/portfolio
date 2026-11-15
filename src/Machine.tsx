import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { PixelBot } from "./Companion";

export default function Machine({
  night,
  stage,
  onStage,
  compact = false,
}: {
  night: boolean;
  stage: number;
  onStage: (stage: number) => void;
  compact?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const stageRef = useRef(stage);
  const [state, setState] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);
  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    import("./machine-scene")
      .then(({ mountMachine }) => {
        if (cancelled || !host.current) return;
        try {
          dispose = mountMachine(host.current, night, () => stageRef.current);
          setState("ready");
        } catch {
          setState("fallback");
        }
      })
      .catch(() => {
        if (!cancelled) setState("fallback");
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [night]);

  return (
    <div className={`machine ${compact ? "compact" : ""}`}>
      <div className="machine-caption">
        <span className="eyebrow">THE EVIDENCE ENGINE</span>
        <span className="live-indicator">Interactive illustration</span>
      </div>
      <div
        className="machine-stage"
        aria-label={`Evidence machine: ${["ready", "retrieving", "checking source", "answer with evidence"][stage]}`}
      >
        <div className="machine-canvas" ref={host} />
        {night && (
          <div className="machine-internals" aria-label="Internal view">
            <span>01 / resolve revision</span>
            <span>02 / retrieve evidence</span>
            <span>03 / preserve provenance</span>
          </div>
        )}
        {state !== "ready" && (
          <div className="machine-fallback">
            <Icon name="code" size={32} />
            <span>
              {state === "loading"
                ? "Assembling the workbench…"
                : "A source, a revision, a traceable answer."}
            </span>
            <div>
              RETRIEVE <span>→</span> VERIFY <span>→</span> ANSWER
            </div>
          </div>
        )}
        <div className="machine-bot">
          <PixelBot small />
          <span>
            {stage === 3
              ? "Now we can trace it."
              : "Every answer starts somewhere."}
          </span>
        </div>
      </div>
      <div className="machine-controls" aria-label="Machine stages">
        {["Load source", "Retrieve", "Verify", "Answer"].map((label, i) => (
          <button
            key={label}
            className={stage === i ? "active" : ""}
            aria-pressed={stage === i}
            onClick={() => onStage(i)}
          >
            <span className="step-number">0{i + 1}</span>
            {label}
            {i === 3 && <Icon name="arrow" size={15} />}
          </button>
        ))}
      </div>
    </div>
  );
}
