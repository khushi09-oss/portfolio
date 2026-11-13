import { useEffect, useState } from "react";
import { Companion, PixelBot } from "./Companion";
import { projects, type Project } from "./data";
import { Icon } from "./Icon";
import { Lab } from "./Lab";
import Machine from "./Machine";
import { ProjectDialog } from "./ProjectDialog";
import { ProjectPreview } from "./ProjectPreview";

function getNight() {
  try {
    return localStorage.getItem("khushi-theme") === "night";
  } catch {
    return false;
  }
}

export default function App() {
  const [night, setNight] = useState(getNight);
  const [isLab, setIsLab] = useState(() => window.location.hash === "#lab");
  const [project, setProject] = useState<Project | null>(null);
  const [learned, setLearned] = useState<Set<string>>(() => new Set());
  const [stage, setStage] = useState(0);
  useEffect(() => {
    document.documentElement.dataset.theme = night ? "night" : "day";
    try {
      localStorage.setItem("khushi-theme", night ? "night" : "day");
    } catch {
      /* Preferences are optional when storage is unavailable. */
    }
  }, [night]);
  useEffect(() => {
    function navigate() {
      const lab = window.location.hash === "#lab";
      setIsLab(lab);
      requestAnimationFrame(() => {
        const anchor = window.location.hash.slice(1);
        if (anchor === "lab" || anchor === "home" || !anchor)
          window.scrollTo({ top: 0 });
        else document.getElementById(anchor)?.scrollIntoView();
        document
          .querySelector<HTMLElement>("h1")
          ?.focus({ preventScroll: true });
      });
    }
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  function discover(id: string) {
    setLearned((previous) => new Set(previous).add(id));
  }
  function openProject(item: Project) {
    setProject(item);
    discover(item.id);
  }
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header page-width">
        <a className="wordmark" href="#home">
          Khushi Sahni<span className="wordmark-dot">.</span>
          <span className="wordmark-role">ML ENGINEER</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#lab" aria-current={isLab ? "page" : undefined}>
            Lab<span className="nav-spark">✳</span>
          </a>
          <a href="#about">About</a>
          <a
            href="https://github.com/khushi09-oss"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Icon name="diagonal" size={12} />
          </a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            aria-label={night ? "Switch to day mode" : "Switch to night mode"}
            aria-pressed={night}
            onClick={() => setNight((v) => !v)}
          >
            <Icon name="sun" size={16} />
            <Icon name="moon" size={16} />
            <span className="toggle-thumb" />
          </button>
          <a className="quick-link" href="#work">
            Quick view <Icon name="diagonal" size={14} />
          </a>
        </div>
      </header>
      {isLab ? (
        <Lab
          night={night}
          discoveries={[...learned]}
          onLearn={() => discover("source-finding")}
        />
      ) : (
        <main id="main" tabIndex={-1}>
          <section className="hero page-width" aria-labelledby="intro-title">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="tiny-asterisk">✳</span> ML ENGINEER & PYTHON TUTOR
              </p>
              <h1 id="intro-title" tabIndex={-1}>
                AI products,
                <br />
                from idea
                <br />
                to release.
              </h1>
              <p className="hero-description">
                I’m Khushi, an ML engineer who builds AI products end to end. I
                work across models, backend systems, and interfaces to turn
                ideas into useful software.
              </p>
              <div className="hero-links">
                <a className="button primary" href="#work">
                  View selected work <Icon name="arrow" size={18} />
                </a>
                <a className="button quiet" href="#lab">
                  Enter the lab <Icon name="code" size={17} />
                </a>
              </div>
              <p className="current-role">
                Previously Machine Learning Engineer at{" "}
                <button onClick={() => openProject(projects[0])}>
                  Recollia <Icon name="diagonal" size={12} />
                </button>
              </p>
            </div>
            <div className="hero-workbench">
              <Machine compact night={night} stage={stage} onStage={setStage} />
              <div className="hero-lab-link">
                <span>See how the source check works.</span>
                <a href="#lab">
                  Play with the workbench <Icon name="arrow" size={17} />
                </a>
              </div>
            </div>
            <div className="hero-bottom">
              <span>ML systems, developer tools, and learning apps.</span>
              <a href="#work">
                SCROLL TO EXPLORE <span>↓</span>
              </a>
              <span>PYTHON / ML / WEB</span>
            </div>
          </section>
          <section
            className="work-section page-width"
            id="work"
            aria-labelledby="work-title"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">01 / SELECTED WORK</p>
                <h2 id="work-title">
                  Selected work
                </h2>
              </div>
              <span className="section-aside">
                What I built
                <br />
                and how it works.
              </span>
            </div>
            <div className="project-list">
              {projects.slice(0, 4).map((item, i) => (
                <button
                  key={item.id}
                  className="project-row"
                  onClick={() => openProject(item)}
                >
                  <span className="project-index">0{i + 1}</span>
                  <span className="project-main">
                    <span className="eyebrow">{item.category}</span>
                    <span className="project-name">{item.name}</span>
                  <span className="project-role">{item.role}</span>
                    <span className="project-summary">{item.summary}</span>
                  </span>
                  <span className="project-tech">
                    {item.stack.slice(0, 3).join(" / ")}
                  </span>
                  <span className="project-arrow">
                    <Icon name="diagonal" size={25} />
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section
            className="play-section page-width"
            aria-labelledby="play-title"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">02 / PERSONAL PROJECTS</p>
                <h2 id="play-title">
                  Personal projects
                </h2>
              </div>
              <PixelBot small />
            </div>
            <div className="experiment-grid">
              <button
                className="experiment-card town-card"
                onClick={() => openProject(projects[5])}
              >
                <ProjectPreview project={projects[5]} night={night} />
                <div className="experiment-caption">
                  <div>
                    <span className="eyebrow">
                      A SMALL PIXEL-WORLD EXPERIMENT
                    </span>
                    <h3>Tiny Town</h3>
                    <p>A pixel town where 30 residents follow their own routines.</p>
                  </div>
                  <Icon name="diagonal" size={24} />
                </div>
              </button>
              <button
                className="experiment-card planet-card"
                onClick={() => openProject(projects[4])}
              >
                <ProjectPreview project={projects[4]} night={night} />
                <div className="experiment-caption">
                  <div>
                    <span className="eyebrow">
                      IN DEVELOPMENT / COSMIC STUDY BUDDY
                    </span>
                    <h3>Galilearn</h3>
                    <p>An ML study app built around connected concepts.</p>
                  </div>
                  <Icon name="diagonal" size={24} />
                </div>
              </button>
            </div>
          </section>
          <section
            className="about-section page-width"
            id="about"
            aria-labelledby="about-title"
          >
            <div className="about-intro">
              <p className="eyebrow">03 / ABOUT ME</p>
              <h2 id="about-title">
                About me
              </h2>
              <p>
                I work across ML, backend code, and frontend features. At
                Recollia, I built an AI tutor for medical exam prep.
              </p>
              <p>I also teach Python to school kids.</p>
              <a className="inline-link" href="#lab">
                Try the lab <Icon name="arrow" size={18} />
              </a>
            </div>
            <div className="experience-list">
              <div>
                <span className="eyebrow">MAY — OCTOBER 2026</span>
                <h3>Machine Learning Engineer</h3>
                <p>Recollia · Medical exam-prep AI</p>
              </div>
              <div>
                <span className="eyebrow">JUL 2025 — MAY 2026</span>
                <h3>AI-ML Product Developer Intern</h3>
                <p>GrapeDawn · AI & multi-tenant platforms</p>
              </div>
              <div>
                <span className="eyebrow">TEACHING & COMMUNITY</span>
                <h3>AI/ML Lead · GDGoC</h3>
                <p>Agent and RAG workshops, mentoring, and Python tuitions.</p>
              </div>
              <div>
                <span className="eyebrow">EDUCATION</span>
                <h3>B.Tech · AI & Data Science</h3>
                <p>Ajeenkya D Y Patil University · CGPA 8.5</p>
              </div>
            </div>
          </section>
          <div className="page-width">
            <Companion learned={learned.size} discoveries={[...learned]} />
          </div>
          <section className="contact-section page-width" id="contact">
            <p className="eyebrow">CONTACT</p>
            <h2>
              Get in touch
            </h2>
            <div className="contact-bottom">
              <p>
                For roles, freelance work, or collaborations, email me with what
                you’re building.
              </p>
              <div className="contact-links">
                <a
                  className="inline-link"
                  href="https://www.linkedin.com/in/khushi-sahni"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn <Icon name="diagonal" size={16} />
                </a>
                <a
                  className="button primary"
                  href="mailto:work.khushisahni@gmail.com"
                >
                  Email me <Icon name="diagonal" size={18} />
                </a>
              </div>
            </div>
          </section>
        </main>
      )}
      <footer className="site-footer page-width">
        <span>© {new Date().getFullYear()} Khushi Sahni</span>
        <a href="#home">Back to top ↑</a>
      </footer>
      <ProjectDialog
        project={project}
        night={night}
        onClose={() => setProject(null)}
      />
    </>
  );
}
