export function galleryPosition(
  index: number,
  count: number,
  width: number,
  height: number,
  progress: number,
) {
  const blend = Math.min(1, progress / 0.65);
  const eased = blend * blend * (3 - 2 * blend);
  const orbit = (Math.max(0, progress - 0.35) / 0.65) * Math.PI * 0.5;
  const angle = (index * Math.PI * 2) / count - Math.PI * 0.5 + orbit;
  const radius = Math.min(width * 0.31, height * 0.32);
  const columns = Math.min(3, count);
  const rows = Math.ceil(count / columns);
  const row = Math.floor(index / columns);
  const rowCount = Math.min(columns, count - row * columns);
  const startX = ((index % columns) - (rowCount - 1) / 2) * width * 0.29;
  const startY = (row - (rows - 1) / 2) * height * 0.38;
  return {
    x: startX * (1 - eased) + Math.cos(angle) * radius * eased,
    y: startY * (1 - eased) + Math.sin(angle) * radius * eased,
    tilt: (index % 2 ? 4 : -4) * (1 - eased) + Math.sin(angle) * 16 * eased,
  };
}
