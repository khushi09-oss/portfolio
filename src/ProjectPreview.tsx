import type { Project } from "./data";

export function ProjectPreview({
  project,
  night,
  sizes = "(max-width: 700px) 90vw, 45vw",
}: {
  project: Project;
  night: boolean;
  sizes?: string;
}) {
  if (!project.preview) return null;
  const { src, nightSrc, srcSet, nightSrcSet, alt, note } = project.preview;
  return (
    <figure className="project-preview">
      <img
        src={night && nightSrc ? nightSrc : src}
        srcSet={night && nightSrc ? nightSrcSet : srcSet}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        width="1440"
        height="900"
      />
      <figcaption>{note}</figcaption>
    </figure>
  );
}
