import type { Project } from "./data";
import { Icon } from "./Icon";
import { labHref } from "./routes";

export function projectEmail(project: Project) {
  return `mailto:work.khushisahni@gmail.com?subject=${encodeURIComponent(`About ${project.name}`)}`;
}

export function ProjectActions({
  project,
  origin,
}: {
  project: Project;
  origin?: { page: number };
}) {
  if (!project.link && !project.demo && project.id !== "github-mcp")
    return null;
  return (
    <nav className="project-actions" aria-label={`${project.name} links`}>
      {project.demo && (
        <a
          className="inline-link"
          href={project.demo}
          target="_blank"
          rel="noreferrer"
        >
          Open live demo <Icon name="diagonal" size={14} />
        </a>
      )}
      {project.link && (
        <a
          className="inline-link"
          href={project.link}
          target="_blank"
          rel="noreferrer"
        >
          View code <Icon name="diagonal" size={14} />
        </a>
      )}
      {project.id === "github-mcp" && (
        <a className="inline-link" href={labHref(project.id, origin)}>
          Try a source check <Icon name="arrow" size={14} />
        </a>
      )}
    </nav>
  );
}
