import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { projects, type Project } from "./data";
import { ProjectArtwork } from "./ProjectArtwork";
import { ProjectEmblem } from "./ProjectEmblem";
import { galleryPosition, galleryChapter } from "./gallery-layout";
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
  const hover = useRef(false);
  const [highlightedId, setHighlightedId] = useState(visible[0]?.id);
  const highlighted =
    visible.find((item) => item.id === highlightedId) ?? visible[0];
  useLayoutEffect(() => {
    hover.current = false;
    const track = ref.current!;
    const stage = track.querySelector<HTMLElement>(".gallery-stage")!;
    const cards = [
      ...track.querySelectorAll<HTMLAnchorElement>(".gallery-card"),
    ];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    function paint() {
      frame = 0;
      const moving =
        innerWidth > 900 && innerHeight >= 620 && !reduced.matches && cards.length > 0;
      track.dataset.motion = String(moving);
      if (!cards.length) return;
      const bounds = track.getBoundingClientRect();
      const width = stage.clientWidth;
      const height =
        track.querySelector<HTMLElement>(".gallery-cards")!.clientHeight;
      const cardWidth = Math.min(width * 0.24, height * 0.29);
      stage.style.setProperty("--card-width", `${cardWidth}px`);
      const progress = Math.max(
        0,
        Math.min(
          1,
          (innerHeight * 0.14 - bounds.top) /
            Math.max(1, bounds.height - stage.clientHeight),
        ),
      );
      cards.forEach((card, index) => {
        if (!moving) {
          const r = card.getBoundingClientRect();
          const reveal = reduced.matches
            ? 0
            : Math.max(0, Math.min(1, (innerHeight - r.top) / innerHeight));
          card.style.setProperty("--journey", String(reveal));
          return;
        }
        const { x, y, tilt } = galleryPosition(
          index,
          cards.length,
          width,
          height,
          Math.min(1, progress / 0.72),
        );
        card.style.setProperty("--card-x", `${x}px`);
        card.style.setProperty("--card-y", `${y}px`);
        card.style.setProperty("--card-tilt", `${tilt}deg`);
        card.style.setProperty("--journey", String(progress));
      });
      const focused = document.activeElement?.closest(".gallery-card");
      const inspecting = track
        .querySelector(".gallery-detail")
        ?.contains(document.activeElement);
      if (!inspecting && !focused && !hover.current && moving) {
        setHighlightedId(visible[galleryChapter(progress, cards.length)]?.id);
      }
      stage.style.setProperty("--journey", String(reduced.matches ? 0 : progress));
      const angle = progress * Math.PI * 1.5 + Math.PI / 2;
      stage.querySelector(".atlas-traveller")?.setAttribute(
        "transform",
        `translate(${300 + Math.cos(angle) * 280} ${190 + Math.sin(angle) * 150}) rotate(${Math.sin(angle) * 12})`,
      );
      stage.querySelector(".atlas-centre")?.setAttribute(
        "transform",
        `translate(200 90) rotate(${progress * 120} 100 100)`,
      );
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
          <span>PROJECT ATLAS</span>
          <span>
            {items.length
              ? `${String(start + 1).padStart(2, "0")}—${String(start + visible.length).padStart(2, "0")} / ${items.length}`
              : "0 projects"}
          </span>
        </div>
        {items.length > 0 && (
          <div className="gallery-orbit" aria-hidden="true">
            <svg viewBox="0 0 600 380">
              <ellipse
                className="atlas-orbit-path"
                cx="300" cy="190" rx="280" ry="150"
              />
              <ellipse
                className="atlas-orbit-path atlas-orbit-cross"
                cx="300" cy="190" rx="255" ry="108"
                transform="rotate(-20 300 190)"
              />
              <g className="atlas-centre" transform="translate(200 90)">
                <circle cx="100" cy="100" r="70" />
                {Array.from({ length: 6 }, (_, i) => (
                  <ellipse
                    key={i}
                    cx="100" cy="68" rx="24" ry="43"
                    transform={`rotate(${i * 60} 100 100)`}
                  />
                ))}
              </g>
              <g className="atlas-traveller">
                <path d="M-16 0l7-10H9l7 10M-21 0h42v12h-42zM0-10V0" />
                <circle cx="-10" cy="13" r="3" />
                <circle cx="11" cy="13" r="3" />
              </g>
            </svg>
          </div>
        )}
        <div className="gallery-cards">
          {visible.map((project, index) => (
            <a
              className="gallery-card"
              key={project.id}
              href={projectHref(project.id, { page: currentPage })}
              data-active={highlighted?.id === project.id}
              onMouseEnter={() => {
                hover.current = true;
                setHighlightedId(project.id);
              }}
              onMouseLeave={() => { hover.current = false; }}
              onFocus={() => setHighlightedId(project.id)}
            >
              <div className="gallery-card-paper">
                <div className="gallery-card-image" aria-hidden="true">
                  <ProjectEmblem project={project} />
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
        {highlighted && (
          <div className="gallery-detail">
            <div className="gallery-detail-preview" aria-hidden="true">
              <ProjectArtwork project={highlighted} night={night} sizes="140px" />
            </div>
            <div className="gallery-detail-copy">
              <span className="eyebrow">INSIDE THE PROJECT</span>
              <strong>{highlighted.name}</strong>
              <p>{highlighted.summary}</p>
              <a
                id="gallery-notes-open"
                href={projectHref(highlighted.id, { page: currentPage })}
              >
                Open {highlighted.name} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
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
            <span className="gallery-scroll-hint">Scroll to follow the orbit · </span>
            Choose any project to look inside.
          </p>
        )}
      </div>
    </section>
  );
}
