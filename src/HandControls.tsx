import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { pinchPosition, type Landmark } from "./evidence";

type Status = "off" | "starting" | "active" | "error";
type Session = {
  generation: number;
  stream?: MediaStream;
  worker?: Worker;
  frame?: number;
  timeout?: ReturnType<typeof setTimeout>;
};

export default function HandControls({
  onPosition,
  onClose,
}: {
  onPosition: (position: number) => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("off");
  const [error, setError] = useState("");
  const [pinching, setPinching] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const session = useRef<Session>({ generation: 0 });
  const positionCallback = useRef(onPosition);
  useEffect(() => {
    positionCallback.current = onPosition;
  }, [onPosition]);
  const release = useCallback(() => {
    const current = session.current;
    current.generation++;
    current.stream?.getTracks().forEach((track) => track.stop());
    current.worker?.terminate();
    if (current.frame) cancelAnimationFrame(current.frame);
    if (current.timeout) clearTimeout(current.timeout);
    if (video.current) video.current.srcObject = null;
    session.current = { generation: current.generation };
  }, []);
  const stop = useCallback(() => {
    release();
    setStatus("off");
    setPinching(false);
  }, [release]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("pagehide", stop);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("pagehide", stop);
      release();
    };
  }, [release, stop]);

  async function start() {
    release();
    const generation = session.current.generation;
    const isCurrent = () => session.current.generation === generation;
    setStatus("starting");
    setError("");
    function fail(message: string) {
      if (!isCurrent()) return;
      release();
      setStatus("error");
      setError(message);
      setPinching(false);
    }
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia)
        throw new Error("unavailable");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });
      // Permission may resolve after the visitor has already cancelled or left.
      if (!isCurrent()) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      session.current.stream = stream;
      stream
        .getVideoTracks()
        .forEach((track) =>
          track.addEventListener("ended", stop, { once: true }),
        );
      const element = video.current;
      if (!element) {
        stop();
        return;
      }
      element.srcObject = stream;
      await element.play();
      if (!isCurrent()) return;
      const worker = new Worker(new URL("./hand.worker.ts", import.meta.url), {
        type: "module",
      });
      session.current.worker = worker;
      session.current.timeout = setTimeout(
        () =>
          fail(
            "The hand model took too long to load. Try again or use the stage buttons.",
          ),
        30000,
      );
      let busy = false;
      let lastFrame = -1;
      let lastTime = 0;
      worker.onerror = (event) => {
        event.preventDefault();
        fail(
          "Hand tracking could not start. Mouse, touch, and keyboard still work.",
        );
      };
      worker.onmessage = ({
        data,
      }: MessageEvent<{ type: string; landmarks?: Landmark[] }>) => {
        if (!isCurrent()) return;
        if (data.type === "ready") {
          clearTimeout(session.current.timeout);
          setStatus("active");
          function capture(time: number) {
            if (!isCurrent()) return;
            session.current.frame = requestAnimationFrame(capture);
            if (
              busy ||
              time - lastTime < 90 ||
              element!.readyState < 2 ||
              element!.currentTime === lastFrame
            )
              return;
            busy = true;
            lastTime = time;
            lastFrame = element!.currentTime;
            createImageBitmap(element!)
              .then((bitmap) => {
                if (!isCurrent()) {
                  bitmap.close();
                  return;
                }
                worker.postMessage(
                  { type: "frame", frame: bitmap, timestamp: time },
                  [bitmap],
                );
              })
              .catch(() =>
                fail(
                  "The camera frame could not be read. Try again or use the stage buttons.",
                ),
              );
          }
          session.current.frame = requestAnimationFrame(capture);
        } else if (data.type === "landmarks") {
          busy = false;
          const points = data.landmarks ?? [];
          const position = pinchPosition(points);
          setPinching(position !== null);
          if (position !== null) positionCallback.current(position);
          const context = canvas.current?.getContext("2d");
          if (context) {
            context.clearRect(0, 0, 240, 180);
            context.fillStyle = "#e4a6b4";
            for (const point of points) {
              context.beginPath();
              context.arc(
                (1 - point.x) * 240,
                point.y * 180,
                3,
                0,
                Math.PI * 2,
              );
              context.fill();
            }
          }
        } else if (data.type === "error")
          fail(
            "The hand model could not process this camera. Try again or use the stage buttons.",
          );
      };
      worker.postMessage({
        type: "init",
        root: new URL(
          `${import.meta.env.BASE_URL}vision`,
          window.location.origin,
        ).href,
      });
    } catch (cause) {
      const message =
        cause instanceof DOMException && cause.name === "NotAllowedError"
          ? "Camera permission was declined. You can still use every part of the lab."
          : "No usable camera was found. Use HTTPS or localhost with a camera, or continue with the stage buttons.";
      fail(message);
    }
  }

  return (
    <aside className="hand-panel" aria-labelledby="hand-title">
      <div className="hand-title">
        <h2 id="hand-title">Hand controls</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close hand controls"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <p className="camera-status" role="status">
        <span className={`status-dot ${status === "active" ? "on" : ""}`} />
        {status === "active"
          ? "Camera on"
          : status === "starting"
            ? "Starting camera…"
            : "Camera off"}
      </p>
      <div
        className={`camera-preview ${status === "active" || status === "starting" ? "visible" : ""}`}
      >
        <video
          ref={video}
          muted
          playsInline
          aria-label="Local camera preview"
        />
        <canvas ref={canvas} width="240" height="180" aria-hidden="true" />
        {status !== "active" && status !== "starting" && (
          <Icon name="hand" size={62} />
        )}
      </div>
      <p className="gesture-instruction">
        <strong>Pinch. Move. Explore.</strong>
        <span>
          Pinch your thumb and index finger, then move sideways to scrub the
          machine stages.
        </span>
      </p>
      {error && (
        <p className="camera-error" role="alert">
          {error}
        </p>
      )}
      {status === "active" || status === "starting" ? (
        <button className="button full-width" onClick={stop}>
          {status === "starting" ? "Cancel camera" : "Stop camera"}
        </button>
      ) : (
        <button className="button primary full-width" onClick={start}>
          <Icon name="camera" size={17} /> Enable camera
        </button>
      )}
      <p className="tracking-state" aria-live="polite">
        {status === "active"
          ? pinching
            ? "Pinch detected · move sideways"
            : "Hold up one hand and pinch"
          : "Optional. You’re in control."}
      </p>
      <p className="camera-note">
        Frames are processed in this browser. Nothing is recorded or uploaded.
        Camera stops when this panel closes or the page is hidden.
      </p>
      <p className="camera-note">Mouse, touch, and keyboard always work.</p>
    </aside>
  );
}
