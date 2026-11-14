import { useState } from "react";
import { projects, type Project } from "./data";
import { Icon } from "./Icon";
import { ProjectArtwork } from "./ProjectArtwork";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectActions } from "./ProjectActions";

export function NotebookGuide() {
  return (
    <svg className="notebook-guide" viewBox="0 0 40 45" aria-hidden="true">
      <path
        d="M10 16h22v22H10z"
        fill="var(--paper)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M20 16V6h11v7H20"
        fill="var(--rose-soft)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15 24v5m11-5v5M15 38v4m12-4v4"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function Introduction({
  night,
  galleryPage = 0,
  onGalleryPage,
}: {
  night: boolean;
  galleryPage?: number;
  onGalleryPage?: (page: number) => void;
}) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "I build across the stack.",
      copy: "My work covers the model, the backend, and the interface. At Recollia, I led development of the AI Tutor.",
      project: projects[0],
    },
    {
      title: "I build personal projects too.",
      copy: "Tiny Town is a pixel-world simulation. I also work on Galilearn, an app for learning ML.",
      project: projects[5],
    },
    {
      title: "Take a look inside my notebook.",
      copy: "Each project has a page for what I built, how it works, and the decisions behind it. Pick whichever interests you.",
      project: projects[1],
    },
  ];
  const current = steps[step];
  return (
    <>
      <section className="welcome page-width" aria-labelledby="welcome-title">
        <div className="welcome-intro">
          <p className="eyebrow">WELCOME / KHUSHI’S NOTEBOOK</p>
          <h1 id="welcome-title" tabIndex={-1}>
            Let me show <br />
            you around.
          </h1>
          <p>
            I’m Khushi, an ML engineer who builds AI products end to end. I work
            across models, backend systems, and interfaces to turn ideas into
            useful software.
          </p>
          <a className="button primary welcome-work-link" href="#work/recollia">
            Explore my work <Icon name="diagonal" size={14} />
          </a>
          <button
            className="tour-link"
            onClick={() => {
              const target = document.getElementById("introduction");
              target?.scrollIntoView({
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              });
              target?.querySelector("h2")?.focus({ preventScroll: true });
            }}
          >
            How I work ↓
          </button>
          <p className="welcome-footnote">
            Previously ML Engineer at Recollia · May–October 2026
          </p>
        </div>
        <ProjectGallery
          night={night}
          selectedPage={galleryPage}
          onSelectPage={onGalleryPage}
        />
      </section>
      <section
        className="welcome-tour page-width"
        id="introduction"
        aria-label="Short introduction"
      >
        <div className="welcome-tour-intro">
          <p className="eyebrow">HOW I WORK</p>
          <h2 tabIndex={-1}>From the model to the interface.</h2>
          <p>
            Three short stops through my work. You can open any project directly
            from the gallery or the notebook.
          </p>
        </div>
        <div className="welcome-page">
          <div className="welcome-page-top">
            <NotebookGuide />
            <span>INTRODUCTION {step + 1} / 3</span>
          </div>
          <div className="welcome-state" key={step}>
            <ProjectArtwork project={current.project} night={night} />
            <div className="welcome-copy" aria-live="polite" aria-atomic="true">
              <h2>{current.title}</h2>
              <p>{current.copy}</p>
            </div>
          </div>
          <div className="welcome-controls">
            <button
              className="welcome-back"
              disabled={step === 0}
              onClick={() => setStep((value) => value - 1)}
            >
              Back
            </button>
            <span
              className="welcome-dots"
              role="img"
              aria-label={`Step ${step + 1} of 3`}
            >
              {steps.map((_, i) => (
                <i key={i} className={i === step ? "active" : ""} />
              ))}
            </span>
            {step === 2 ? (
              <a className="button primary" href="#work/recollia">
                Open my notebook <Icon name="arrow" size={16} />
              </a>
            ) : (
              <button
                className="button primary"
                onClick={() => setStep((value) => value + 1)}
              >
                Next <Icon name="arrow" size={16} />
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function Notebook({
  project,
  night,
}: {
  project: Project;
  night: boolean;
}) {
  return (
    <section className="notebook page-width" aria-labelledby="notebook-title">
      <div className="notebook-intro">
        <div>
          <p className="eyebrow">KHUSHI’S NOTEBOOK / SELECTED WORK</p>
          <h1 id="notebook-title" tabIndex={-1}>
            A closer look
            <br />
            at my work.
          </h1>
        </div>
        <p>
          Open a project tab to see what I worked on and the decisions behind
          it.
        </p>
      </div>
      <div
        className="notebook-tabs"
        role="group"
        aria-label="Notebook projects"
      >
        {projects.map((item) => (
          <a
            key={item.id}
            href={`#work/${item.id}`}
            aria-current={item.id === project.id ? "page" : undefined}
          >
            {item.name}
          </a>
        ))}
      </div>
      <article
        className="notebook-spread"
        key={project.id}
        aria-label={project.name}
      >
        <div className="notebook-page notebook-left">
          <p className="eyebrow">{project.category}</p>
          <h2 tabIndex={-1}>{project.name}</h2>
          <p className="notebook-role">{project.role}</p>
          <h3>What it does</h3>
          <p>{project.overview}</p>
          <h3>My contribution</h3>
          <p>{project.contribution}</p>
          <a
            className="button primary notebook-read-link"
            href={`#project/${project.id}`}
          >
            Open the full project <Icon name="diagonal" size={16} />
          </a>
          <ProjectActions project={project} />
        </div>
        <div className="notebook-binding" aria-hidden="true" />
        <div className="notebook-page notebook-right">
          <ProjectArtwork project={project} night={night} />
          <p className="eyebrow">WHY I BUILT IT THIS WAY</p>
          <p className="notebook-note">{project.lesson}</p>
          <span className="notebook-page-number">
            {projects.indexOf(project) + 1} / {projects.length}
          </span>
        </div>
      </article>
      <div className="notebook-dock">
        <NotebookGuide />
        <p>Choose a project tab. Open the full project for a closer look.</p>
        <a className="inline-link" href="#home?intro=1">
          Replay introduction <Icon name="diagonal" size={13} />
        </a>
      </div>
    </section>
  );
}
