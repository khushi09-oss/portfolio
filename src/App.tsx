import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { projects } from "./data";
import { Icon } from "./Icon";
import { Introduction, Notebook } from "./Notebook";
import { ProfilePage } from "./ProfilePage";
import { ProjectPage } from "./ProjectPage";
import "./notebook.css";
import "./gallery.css";

const Lab = lazy(() =>
  import("./Lab").then((module) => ({ default: module.Lab })),
);

function getNight() {
  try {
    return localStorage.getItem("khushi-theme") === "night";
  } catch {
    return false;
  }
}

function readRoute(hash: string) {
  const [name, id, extra] = hash.replace(/^#/, "").split("/");
  const project = projects.find((item) => item.id === (id || "recollia"));
  if (
    (name === "work" || name === "project") &&
    project &&
    !extra &&
    (name === "work" || id)
  )
    return { name, project };
  if (!id && ["", "home", "lab", "about", "contact"].includes(name))
    return { name: name || "home" };
  return { name: "not-found" };
}

function FocusPage({ hash, children }: { hash: string; children: ReactNode }) {
  useLayoutEffect(() => {
    const heading = document.querySelector<HTMLElement>("main h1");
    heading?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `${heading?.textContent || "Notebook"} | Khushi Sahni`;
  }, [hash]);
  return children;
}

export default function App() {
  const [night, setNight] = useState(getNight);
  const [hash, setHash] = useState(() => window.location.hash);
  const route = readRoute(hash);
  const [notebookId, setNotebookId] = useState(
    () => route.project?.id ?? "recollia",
  );
  const [learned, setLearned] = useState<Set<string>>(
    () =>
      new Set(
        route.name === "project" && route.project ? [route.project.id] : [],
      ),
  );
  const currentProject =
    route.project ??
    projects.find((item) => item.id === notebookId) ??
    projects[0];
  const workHref = `#work/${currentProject.id}`;
  useEffect(() => {
    document.documentElement.dataset.theme = night ? "night" : "day";
    try {
      localStorage.setItem("khushi-theme", night ? "night" : "day");
    } catch {
      /* Theme storage is optional. */
    }
  }, [night]);
  useEffect(() => {
    function navigate() {
      const nextHash = window.location.hash;
      setHash(nextHash);
      const next = readRoute(nextHash);
      if (next.project) setNotebookId(next.project.id);
      if (next.name === "project" && next.project) {
        const id = next.project.id;
        setLearned((previous) => new Set(previous).add(id));
      }
    }
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  let content: ReactNode;
  if (route.name === "lab")
    content = (
      <Lab
        night={night}
        discoveries={[...learned]}
        onLearn={() =>
          setLearned((previous) => new Set(previous).add("source-finding"))
        }
      />
    );
  else
    content = (
      <main id="main" tabIndex={-1}>
        {route.name === "home" && <Introduction key={hash} night={night} />}
        {route.name === "work" && (
          <Notebook project={currentProject} night={night} />
        )}
        {route.name === "project" && (
          <ProjectPage project={currentProject} night={night} />
        )}
        {(route.name === "about" || route.name === "contact") && (
          <ProfilePage
            contact={route.name === "contact"}
            discoveries={[...learned]}
          />
        )}
        {route.name === "not-found" && (
          <section className="missing-page page-width">
            <p className="eyebrow">404</p>
            <h1 tabIndex={-1}>Page not found.</h1>
            <p>That page isn’t in this notebook.</p>
            <a className="button primary" href="#work/recollia">
              Open the notebook <Icon name="arrow" size={16} />
            </a>
          </section>
        )}
      </main>
    );
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
          khushi{" "}
          <span className="notebook-star" aria-hidden="true">
            ✳
          </span>
          <span className="wordmark-role">ML ENGINEER</span>
        </a>
        <nav aria-label="Main navigation">
          <a
            href={workHref}
            aria-current={
              route.name === "work" || route.name === "project"
                ? "page"
                : undefined
            }
          >
            Work
          </a>
          <a
            href="#lab"
            aria-current={route.name === "lab" ? "page" : undefined}
          >
            Lab
          </a>
          <a
            href="#about"
            aria-current={route.name === "about" ? "page" : undefined}
          >
            About
          </a>
          <a
            href="#contact"
            aria-current={route.name === "contact" ? "page" : undefined}
          >
            Contact
          </a>
        </nav>
        <button
          className="theme-toggle"
          aria-label={night ? "Switch to day mode" : "Switch to night mode"}
          aria-pressed={night}
          onClick={() => setNight((value) => !value)}
        >
          <Icon name="sun" size={16} />
          <Icon name="moon" size={16} />
          <span className="toggle-thumb" />
        </button>
      </header>
      <Suspense
        fallback={
          <main
            id="main"
            tabIndex={-1}
            className="page-width route-loading"
            role="status"
          >
            Opening the lab…
          </main>
        }
      >
        <FocusPage hash={hash}>{content}</FocusPage>
      </Suspense>
      <footer className="site-footer page-width">
        <span>© {new Date().getFullYear()} Khushi Sahni</span>
        <a
          href="https://github.com/khushi09-oss"
          target="_blank"
          rel="noreferrer"
        >
          GitHub <Icon name="diagonal" size={13} />
        </a>
        <a href="#contact">
          Get in touch <Icon name="diagonal" size={13} />
        </a>
      </footer>
    </>
  );
}
