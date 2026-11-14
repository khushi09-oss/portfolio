import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { projects } from "./data";
import { projectHref } from "./routes";
import { FocusPage, usePortfolioNavigation } from "./usePortfolioNavigation";
import { Icon } from "./Icon";
import { Introduction, Notebook } from "./Notebook";
import { ProfilePage } from "./ProfilePage";
import { ProjectPage } from "./ProjectPage";
import "./notebook.css";
import "./gallery.css";
import "./flow.css";

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

export default function App() {
  const [night, setNight] = useState(getNight);
  const navigation = usePortfolioNavigation();
  const { route, hash, visited: learned } = navigation;
  const currentProject =
    ("project" in route ? route.project : undefined) ??
    projects.find((item) => item.id === navigation.notebookId) ??
    projects[0];
  const workHref = `#work/${currentProject.id}`;
  const labCaseHref =
    route.name === "lab" && route.fromProject
      ? projectHref(
          route.fromProject,
          route.fromGallery ? { page: route.page } : undefined,
        )
      : undefined;
  useEffect(() => {
    document.documentElement.dataset.theme = night ? "night" : "day";
    try {
      localStorage.setItem("khushi-theme", night ? "night" : "day");
    } catch {
      /* Theme storage is optional. */
    }
  }, [night]);
  let content: ReactNode;
  if (route.name === "lab")
    content = (
      <Lab
        backHref={labCaseHref}
        caseHref={labCaseHref}
        backLabel={
          route.fromProject
            ? `Back to ${projects.find((item) => item.id === route.fromProject)?.name}`
            : undefined
        }
        night={night}
        discoveries={[...learned]}
        onLearn={() => navigation.discover("source-finding")}
      />
    );
  else
    content = (
      <main id="main" tabIndex={-1}>
        {route.name === "home" && (
          <Introduction
            night={night}
            galleryPage={route.page}
            onGalleryPage={navigation.selectGalleryPage}
          />
        )}
        {route.name === "work" && (
          <Notebook project={currentProject} night={night} />
        )}
        {route.name === "project" && (
          <ProjectPage
            project={currentProject}
            night={night}
            fromGallery={route.fromGallery}
            galleryPage={route.page}
          />
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
    <div className="portfolio-shell" onClickCapture={navigation.onLinkCapture}>
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
        <FocusPage
          hash={hash}
          position={navigation.position}
          selectionOnly={navigation.selectionOnly}
          intro={route.name === "home" && route.intro}
        >
          {content}
        </FocusPage>
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
    </div>
  );
}
