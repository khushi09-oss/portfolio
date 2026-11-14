import { useLayoutEffect, useRef } from "react";
import { projects } from "./data";
import { ProjectArtwork } from "./ProjectArtwork";

export function ProjectGallery({ night }: { night: boolean }) {
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
      const moving = innerWidth > 900 && !reduced.matches;
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
      const blend = Math.min(1, progress / 0.65);
      const eased = blend * blend * (3 - 2 * blend);
      const orbit = (Math.max(0, progress - 0.35) / 0.65) * Math.PI * 0.5;
      const radius = Math.min(width * 0.31, height * 0.32);
      cards.forEach((card, index) => {
        const angle = (index * Math.PI) / 3 - Math.PI * 0.5 + orbit;
        const startX = ((index % 3) - 1) * width * 0.29;
        const startY = (Math.floor(index / 3) - 0.5) * height * 0.38;
        const x = startX * (1 - eased) + Math.cos(angle) * radius * eased;
        const y = startY * (1 - eased) + Math.sin(angle) * radius * eased;
        const tilt =
          (index % 2 ? 4 : -4) * (1 - eased) + Math.sin(angle) * 16 * eased;
        card.style.setProperty("--card-x", `${x}px`);
        card.style.setProperty("--card-y", `${y}px`);
        card.style.setProperty("--card-tilt", `${tilt}deg`);
      });
      stage.style.setProperty("--orbit-turn", `${progress * 120}deg`);
      stage.style.setProperty("--orbit-reveal", String(eased));
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
  }, []);
  return (
    <section
      ref={ref}
      className="project-gallery-track"
      aria-label="Project gallery"
    >
      <div className="gallery-stage">
        <div className="gallery-caption">
          <span>SELECTED WORK</span>
          <span>01—06</span>
        </div>
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
          <span>
            KHUSHI’S
            <br />
            PROJECTS
          </span>
        </div>
        <div className="gallery-cards">
          {projects.map((project, index) => (
            <a
              className="gallery-card"
              key={project.id}
              href={`#project/${project.id}`}
            >
              <div className="gallery-card-paper">
                <div className="gallery-card-image" aria-hidden="true">
                  <ProjectArtwork project={project} night={night} />
                </div>
                <div className="gallery-card-label">
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{project.name}</strong>
                  <span aria-hidden="true">↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <p className="gallery-instruction">
          <span className="gallery-scroll-hint">Scroll to rearrange · </span>
          Open any project to explore it.
        </p>
      </div>
    </section>
  );
}
