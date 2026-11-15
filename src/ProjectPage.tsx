import { projects, type Project } from "./data";
import { Icon } from "./Icon";
import { ProjectArtwork } from "./ProjectArtwork";
import { ProjectActions, projectEmail } from "./ProjectActions";
import { homeHref, projectHref } from "./routes";
import { PrivateProjectPreview } from "./PrivateProjectPreview";
import { hasPrivatePreview } from "./private-preview";

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
  const concepts = hasPrivatePreview(project.id);
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
        href={fromGallery ? homeHref(galleryPage) : `/work/${project.id}`}
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
      {concepts && (
        <button
          className="inline-link concepts-shortcut"
          onClick={() => {
            const target = document.getElementById("project-concepts");
            target?.querySelector("h2")?.focus({ preventScroll: true });
            target?.scrollIntoView({ behavior: "instant", block: "start" });
          }}
        >
          See interface concepts <Icon name="arrow" size={16} />
        </button>
      )}
      <div className="project-page-body">
        <div className="project-page-copy">
          <h2>My contribution</h2>
          <p className="contribution-lead">{project.contribution}</p>
          {project.sections.map((section) => (
            <section className="case-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
        <aside className="project-page-art">
          <ProjectArtwork project={project} night={night} />
          <h2>Built with</h2>
          <div className="stack" aria-label="Tools used">
            {project.stack.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </aside>
      </div>
      {concepts && <PrivateProjectPreview id={project.id} />}
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
            <ProjectArtwork project={next} night={night} sizes="150px" />
          </span>
          <Icon name="arrow" size={22} />
        </a>
      )}
    </article>
  );
}
