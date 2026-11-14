import type { Project } from "./data";

export function ProjectPreview({
  project,
  night,
}: {
  project: Project;
  night: boolean;
}) {
  if (!project.preview) return null;
  const { src, nightSrc, alt, note } = project.preview;
  return (
    <figure className="project-preview">
      <img
        src={night && nightSrc ? nightSrc : src}
        alt={alt}
        loading="lazy"
        width="1440"
        height="900"
      />
      <figcaption>{note}</figcaption>
    </figure>
  );
}
