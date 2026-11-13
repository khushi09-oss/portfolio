import { useEffect, useRef } from "react";
import type { Project } from "./data";
import { Icon } from "./Icon";
import { ProjectPreview } from "./ProjectPreview";

export function ProjectDialog({
  project,
  night,
  onClose,
}: {
  project: Project | null;
  night: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (project) ref.current?.showModal();
    else ref.current?.close();
  }, [project]);

  return (
    <dialog
      className="project-dialog"
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="project-title"
    >
      {project && (
        <article>
          <div className="dialog-top">
            <span className="eyebrow">{project.category}</span>
            <button
              className="icon-button"
              onClick={onClose}
              aria-label="Close project"
            >
              <Icon name="close" />
            </button>
          </div>
          <p className="project-status">{project.status}</p>
          <h2 id="project-title">{project.name}</h2>
          <p className="dialog-deck">{project.summary}</p>
          <ProjectPreview project={project} night={night} />
          <p className="role-label">{project.role}</p>
          <div className="stack">
            {project.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="case-copy">
            {project.details.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <aside className="lesson">
            <span className="eyebrow">WHY I BUILT IT THIS WAY</span>
            <p>{project.lesson}</p>
          </aside>
          <div className="dialog-links">
            {project.link && (
              <a
                className="button primary"
                href={project.link}
                target="_blank"
                rel="noreferrer"
              >
                Explore the repository <Icon name="diagonal" />
              </a>
            )}
            {project.demo && (
              <a
                className="button"
                href={project.demo}
                target="_blank"
                rel="noreferrer"
              >
                Try the demo <Icon name="diagonal" />
              </a>
            )}
          </div>
        </article>
      )}
    </dialog>
  );
}
