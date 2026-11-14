import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

type Input =
  | { type: "init"; root: string }
  | { type: "frame"; frame: ImageBitmap; timestamp: number };
const scope = self as unknown as {
  onmessage: ((event: MessageEvent<Input>) => void) | null;
  postMessage: (message: unknown) => void;
};
let detector: HandLandmarker | undefined;

scope.onmessage = async ({ data }) => {
  try {
    if (data.type === "init") {
      const files = await FilesetResolver.forVisionTasks(
        `${data.root}/wasm`,
        true,
      );
      detector = await HandLandmarker.createFromOptions(files, {
        baseOptions: {
          modelAssetPath: `${data.root}/hand_landmarker.task`,
          delegate: "CPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });
      scope.postMessage({ type: "ready" });
    } else {
      try {
        const landmarks =
          detector?.detectForVideo(data.frame, data.timestamp).landmarks[0] ??
          [];
        scope.postMessage({ type: "landmarks", landmarks });
      } finally {
        data.frame.close();
      }
    }
  } catch (error) {
    console.error(
      "Hand tracking failed to initialize or process a frame.",
      error,
    );
    scope.postMessage({ type: "error" });
  }
};
