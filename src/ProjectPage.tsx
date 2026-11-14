import { projects, type Project } from "./data";
import { Icon } from "./Icon";
import { ProjectArtwork } from "./ProjectArtwork";
import { ProjectActions, projectEmail } from "./ProjectActions";
import { homeHref, projectHref } from "./routes";

export function ProjectPage({
  project,
  night,
  fromGallery = false,
  galleryPage = 0,
}: {
  project: Project;
  night: boolean;
  fromGallery?: boolean;
  galleryPage?: number;
}) {
  const origin = fromGallery ? { page: galleryPage } : undefined;
  const next =
    projects.length > 1
      ? projects[
          (projects.findIndex((item) => item.id === project.id) + 1) %
            projects.length
        ]
      : undefined;
  return (
    <article className="project-page page-width">
      <a
        className="back-link"
        href={fromGallery ? homeHref(galleryPage) : `#work/${project.id}`}
        data-return
      >
        ← {fromGallery ? "Back to gallery" : "Back to notebook"}
      </a>
      <header className="project-page-heading">
        <div>
          <p className="eyebrow">
            {project.category} / {project.status}
          </p>
          <h1 tabIndex={-1}>{project.name}</h1>
          <p className="project-page-role">{project.role}</p>
        </div>
        <p>{project.overview}</p>
      </header>
      <ProjectActions project={project} origin={origin} />
      <div className="project-page-body">
        <div className="project-page-copy">
          <h2>My contribution</h2>
          <p className="contribution-lead">{project.contribution}</p>
          <h3>How it works</h3>
          {project.details.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <div className="stack" aria-label="Tools used">
            {project.stack.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </div>
        <aside className="project-page-art">
          <ProjectArtwork project={project} night={night} />
          <h2>Design decision</h2>
          <p>{project.lesson}</p>
        </aside>
      </div>
      <div className="project-page-links">
        <a className="button primary" href={projectEmail(project)}>
          Discuss this project <Icon name="diagonal" size={16} />
        </a>
      </div>
      {next && (
        <a className="next-project" href={projectHref(next.id, origin)}>
          <span>
            <span className="eyebrow">Next project</span>
            <strong>{next.name}</strong>
            <small>{next.summary}</small>
          </span>
          <span className="next-project-art" aria-hidden="true">
            <ProjectArtwork project={next} night={night} />
          </span>
          <Icon name="arrow" size={22} />
        </a>
      )}
    </article>
  );
}
