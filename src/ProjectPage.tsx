import type { Project } from "./data";
import { Icon } from "./Icon";
import { ProjectArtwork } from "./ProjectArtwork";

export function ProjectPage({
  project,
  night,
}: {
  project: Project;
  night: boolean;
}) {
  return (
    <article className="project-page page-width">
      <a className="back-link" href={`#work/${project.id}`}>
        ← Back to notebook
      </a>
      <header className="project-page-heading">
        <div>
          <p className="eyebrow">
            {project.category} / {project.status}
          </p>
          <h1 tabIndex={-1}>{project.name}</h1>
          <p className="project-page-role">{project.role}</p>
        </div>
        <p>{project.summary}</p>
      </header>
      <div className="project-page-body">
        <div className="project-page-copy">
          <h2>What I worked on</h2>
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
          <p className="eyebrow">WHY I BUILT IT THIS WAY</p>
          <p>{project.lesson}</p>
        </aside>
      </div>
      <div className="project-page-links">
        {project.link && (
          <a
            className="button primary"
            href={project.link}
            target="_blank"
            rel="noreferrer"
          >
            Explore the repository <Icon name="diagonal" size={16} />
          </a>
        )}
        {project.demo && (
          <a
            className="button"
            href={project.demo}
            target="_blank"
            rel="noreferrer"
          >
            Try the demo <Icon name="diagonal" size={16} />
          </a>
        )}
        {project.id === "github-mcp" && (
          <a className="button" href="#lab">
            Try a source check <Icon name="arrow" size={16} />
          </a>
        )}
        <a className="inline-link" href="mailto:work.khushisahni@gmail.com">
          Ask me about this project <Icon name="diagonal" size={16} />
        </a>
      </div>
    </article>
  );
}
