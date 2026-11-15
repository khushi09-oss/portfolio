import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Self-host runtime assets: enabling a camera never sends frames to an asset CDN.
const output = new URL("../public/vision/", import.meta.url);
await mkdir(output, { recursive: true });
await cp(
  new URL("../node_modules/@mediapipe/tasks-vision/wasm/", import.meta.url),
  new URL("wasm/", output),
  { recursive: true },
);
const model = new URL("hand_landmarker.task", output);
const expectedHash =
  "fbc2a30080c3c557093b5ddfc334698132eb341044ccee322ccf8bcf3607cde1";
let bytes;
try {
  bytes = await readFile(model);
} catch {
  const response = await fetch(
    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
  );
  if (!response.ok)
    throw new Error(`Hand model download failed: ${response.status}`);
  bytes = new Uint8Array(await response.arrayBuffer());
}
if (createHash("sha256").update(bytes).digest("hex") !== expectedHash)
  throw new Error("Hand model checksum does not match the pinned model.");
await writeFile(model, bytes);
console.log("Hand-tracking runtime prepared for local serving.");
