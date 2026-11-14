import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { projects, type Project } from "./data";
import { ProjectArtwork } from "./ProjectArtwork";
import { galleryPosition } from "./gallery-layout";
import { projectHref } from "./routes";

export function ProjectGallery({
  night,
  items = projects,
  selectedPage,
  onSelectPage,
}: {
  night: boolean;
  items?: readonly Project[];
  selectedPage?: number;
  onSelectPage?: (page: number) => void;
}) {
  const [localPage, setLocalPage] = useState(0);
  const page = selectedPage ?? localPage;
  const setPage = onSelectPage ?? setLocalPage;
  const pageCount = Math.max(1, Math.ceil(items.length / 6));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = useMemo(
    () => items.slice(currentPage * 6, (currentPage + 1) * 6),
    [items, currentPage],
  );
  const start = currentPage * 6;
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const track = ref.current!;
    const stage = track.querySelector<HTMLElement>(".gallery-stage")!;
    const cards = [
      ...track.querySelectorAll<HTMLAnchorElement>(".gallery-card"),
    ];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    function paint() {
      frame = 0;
      const moving = innerWidth > 900 && !reduced.matches && cards.length > 0;
      track.dataset.motion = String(moving);
      if (!moving) return;
      const bounds = track.getBoundingClientRect();
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const progress = Math.max(
        0,
        Math.min(
          1,
          (innerHeight * 0.14 - bounds.top) /
            Math.max(1, bounds.height - height),
        ),
      );
      cards.forEach((card, index) => {
        const { x, y, tilt } = galleryPosition(
          index,
          cards.length,
          width,
          height - (pageCount > 1 ? 80 : 0),
          progress,
        );
        card.style.setProperty("--card-x", `${x}px`);
        card.style.setProperty("--card-y", `${y}px`);
        card.style.setProperty("--card-tilt", `${tilt}deg`);
      });
      stage.style.setProperty("--orbit-turn", `${progress * 120}deg`);
      stage.style.setProperty(
        "--orbit-reveal",
        String(Math.min(1, progress / 0.65)),
      );
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }
    paint();
    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    observer.observe(stage);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [visible, pageCount]);
  return (
    <section
      ref={ref}
      className={`project-gallery-track${items.length ? "" : " is-empty"}`}
      aria-label="Project gallery"
    >
      <div className={`gallery-stage${pageCount > 1 ? " has-pages" : ""}`}>
        <div className="gallery-caption">
          <span>SELECTED WORK</span>
          <span>
            {items.length
              ? `${String(start + 1).padStart(2, "0")}—${String(start + visible.length).padStart(2, "0")} / ${items.length}`
              : "0 projects"}
          </span>
        </div>
        {items.length > 0 && (
          <div className="gallery-orbit" aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="94" />
              {Array.from({ length: 6 }, (_, i) => (
                <ellipse
                  key={i}
                  cx="100"
                  cy="68"
                  rx="24"
                  ry="43"
                  transform={`rotate(${i * 60} 100 100)`}
                />
              ))}
            </svg>
          </div>
        )}
        <div className="gallery-cards">
          {visible.map((project, index) => (
            <a
              className="gallery-card"
              key={project.id}
              href={projectHref(project.id, { page: currentPage })}
            >
              <div className="gallery-card-paper">
                <div className="gallery-card-image" aria-hidden="true">
                  <ProjectArtwork project={project} night={night} />
                </div>
                <div className="gallery-card-label">
                  <span aria-hidden="true">
                    {String(start + index + 1).padStart(2, "0")}
                  </span>
                  <strong>{project.name}</strong>
                  <span aria-hidden="true">↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        {!items.length && (
          <p className="gallery-empty">Projects will appear here.</p>
        )}
        {pageCount > 1 && (
          <nav className="gallery-pagination" aria-label="Gallery pages">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              ← Previous projects
            </button>
            <span role="status" aria-live="polite">
              {currentPage + 1} / {pageCount}
            </span>
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === pageCount - 1}
            >
              Next projects →
            </button>
          </nav>
        )}
        {items.length > 0 && (
          <p className="gallery-instruction">
            <span className="gallery-scroll-hint">Scroll to rearrange · </span>
            Open any project to explore it.
          </p>
        )}
      </div>
    </section>
  );
}
