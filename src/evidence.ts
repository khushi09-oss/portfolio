export type Landmark = { x: number; y: number };

export const sources = [
  {
    file: "retrieval.py",
    commit: "a1b2c3d",
    label: "retrieval.py",
    note: "The retrieved source · correct revision",
  },
  {
    file: "retrieval.py",
    commit: "f9e8d7c",
    label: "retrieval.py",
    note: "Same filename · a different revision",
  },
  {
    file: "notes.md",
    commit: "a1b2c3d",
    label: "notes.md",
    note: "Same revision · not retrieved for this answer",
  },
];

export function checkSource(file: string, commit: string): boolean {
  return file === "retrieval.py" && commit === "a1b2c3d";
}

export function pinchPosition(points: Landmark[]): number | null {
  const selected = [points[0], points[9], points[4], points[8]];
  if (
    selected.some(
      (p) =>
        !p ||
        !Number.isFinite(p.x) ||
        !Number.isFinite(p.y) ||
        p.x < 0 ||
        p.x > 1 ||
        p.y < 0 ||
        p.y > 1,
    )
  )
    return null;
  const [wrist, middle, thumb, index] = selected;
  const handSize = Math.hypot(wrist.x - middle.x, wrist.y - middle.y);
  if (handSize < 0.04) return null;
  const gap = Math.hypot(thumb.x - index.x, thumb.y - index.y);
  return gap / handSize < 0.24 ? 1 - (thumb.x + index.x) / 2 : null;
}
