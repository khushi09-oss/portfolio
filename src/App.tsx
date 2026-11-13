import { useEffect, useState } from "react";
import { Companion, PixelBot } from "./Companion";
import { projects, type Project } from "./data";
import { Icon } from "./Icon";
import { Lab } from "./Lab";
import Machine from "./Machine";
import { ProjectDialog } from "./ProjectDialog";

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
                <span className="tiny-asterisk">✳</span> ENGINEER. BUILDER.
                ALWAYS A STUDENT.
              </p>
              <h1 id="intro-title" tabIndex={-1}>
                AI systems,
                <br />
                from retrieval
                <br />
                to <em>release.</em>
              </h1>
              <p className="hero-description">
                I’m Khushi. I build production RAG systems
                <br className="desktop-break" /> and the products around them.
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
                <span className="status-dot" /> Currently building the AI Tutor
                at{" "}
                <button onClick={() => openProject(projects[0])}>
                  Recollia <Icon name="diagonal" size={12} />
                </button>
              </p>
            </div>
            <div className="hero-workbench">
              <Machine compact night={night} stage={stage} onStage={setStage} />
              <div className="hero-lab-link">
                <span>Curiosity looks good on you.</span>
                <a href="#lab">
                  Play with the workbench <Icon name="arrow" size={17} />
                </a>
              </div>
            </div>
            <div className="hero-bottom">
              <span>A little engineering. A little wonder.</span>
              <a href="#work">
                SCROLL TO EXPLORE <span>↓</span>
              </a>
              <span>BUILT TO KEEP LEARNING</span>
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
                  Things I’ve <em>put into the world.</em>
                </h2>
              </div>
              <span className="section-aside">
                From a real problem
                <br />
                to something people can use.
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
                <p className="eyebrow">02 / FOLLOWING MY CURIOSITY</p>
                <h2 id="play-title">
                  Some things start with <em>“what if?”</em>
                </h2>
              </div>
              <PixelBot small />
            </div>
            <div className="experiment-grid">
              <button
                className="experiment-card town-card"
                onClick={() => openProject(projects[5])}
              >
                <div className="town-art" aria-hidden="true">
                  <div className="pixel-sun" />
                  <div className="pixel-cloud cloud-one" />
                  <div className="pixel-cloud cloud-two" />
                  <div className="town-ground" />
                  <div className="pixel-tree tree-one" />
                  <div className="pixel-tree tree-two" />
                  <div className="pixel-house house-one" />
                  <div className="pixel-house house-two" />
                  <div className="town-path" />
                  <div className="town-person" />
                </div>
                <div className="experiment-caption">
                  <div>
                    <span className="eyebrow">
                      A SMALL PIXEL-WORLD EXPERIMENT
                    </span>
                    <h3>Tiny Town</h3>
                    <p>Thirty neighbors. One unfolding day.</p>
                  </div>
                  <Icon name="diagonal" size={24} />
                </div>
              </button>
              <button
                className="experiment-card planet-card"
                onClick={() => openProject(projects[4])}
              >
                <div className="orbit-art" aria-hidden="true">
                  <div className="orbit-ring ring-one" />
                  <div className="orbit-ring ring-two" />
                  <div className="orbit-planet" />
                  <span className="orbit-moon" />
                  <span className="orbit-star star-one">+</span>
                  <span className="orbit-star star-two">+</span>
                  <span className="orbit-label">
                    a little universe
                    <br />
                    of understanding
                  </span>
                </div>
                <div className="experiment-caption">
                  <div>
                    <span className="eyebrow">
                      IN DEVELOPMENT / COSMIC STUDY BUDDY
                    </span>
                    <h3>Galilearn</h3>
                    <p>Find your way through machine learning.</p>
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
              <p className="eyebrow">03 / THE PERSON BEHIND THE PIPELINE</p>
              <h2 id="about-title">
                Serious about learning.
                <br />
                <em>Curious about everything.</em>
              </h2>
              <p>
                I’m an ML engineer who likes taking an idea all the way: the
                retrieval, the interface, the uncomfortable edge cases, and the
                release.
              </p>
              <p>
                Outside the build, you’ll find me teaching Python to school
                kids, getting a little competitive in co-op games, or adding
                another tiny car to my collection. Soft aesthetics, pixel
                worlds, and a very real love of how things work.
              </p>
              <a className="inline-link" href="#lab">
                Meet me at the workbench <Icon name="arrow" size={18} />
              </a>
            </div>
            <div className="experience-list">
              <div>
                <span className="eyebrow">MAY 2026 — PRESENT</span>
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
            <p className="eyebrow">SOMETHING ON YOUR MIND?</p>
            <h2>
              Let’s make it <em>work.</em>
              <span className="rose-period">*</span>
            </h2>
            <div className="contact-bottom">
              <p>
                A role, a collaboration, or a wonderfully specific idea.
                <br />
                I’d like to hear about it.
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
                  Say hello <Icon name="diagonal" size={18} />
                </a>
              </div>
            </div>
          </section>
        </main>
      )}
      <footer className="site-footer page-width">
        <span>© {new Date().getFullYear()} Khushi Sahni</span>
        <span>Made with care. And a little curiosity.</span>
        <a href="#home">Back to the beginning ↑</a>
      </footer>
      <ProjectDialog project={project} onClose={() => setProject(null)} />
    </>
  );
}
