export function previewHeight(value: unknown): number | null {
  if (
    !value ||
    typeof value !== "object" ||
    !("type" in value) ||
    value.type !== "portfolio-preview:height" ||
    !("height" in value)
  )
    return null;
  return typeof value.height === "number" &&
    Number.isFinite(value.height) &&
    value.height > 0 &&
    value.height <= 20000
    ? value.height
    : null;
}

export function hasPrivatePreview(id: string) {
  return (
    (import.meta.env.VITE_PRIVATE_PROJECT_PREVIEWS as string | undefined)
      ?.split(",")
      .includes(id) ?? false
  );
}
