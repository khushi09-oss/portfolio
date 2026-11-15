const paths = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  diagonal: "M6 18 18 6M6 6h12v12",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  moon: "M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z",
  close: "m6 6 12 12M6 18 18 6",
  code: "m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14",
  camera: "M8 6l2-3h4l2 3h4v14H4V6h4Zm8 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  play: "m9 5 10 7-10 7V5Z",
  check: "m5 12 4 4L19 6",
  reset: "M4 10a8 8 0 1 1 1 7M4 4v6h6",
  hand: "M8 12V6a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v9c0 4-3 6-7 6-3 0-4-2-6-4l-3-4a2 2 0 0 1 3-2l1 1",
} as const;

export function Icon({
  name,
  size = 20,
}: {
  name: keyof typeof paths;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
