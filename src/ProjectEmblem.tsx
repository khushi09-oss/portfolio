import type { Project } from "./data";
import { ProjectArtwork } from "./ProjectArtwork";

/** Navigation illustrations; actual project captures appear in the project notes. */
export function ProjectEmblem({ project }: { project: Project }) {
  return (
    <div className="project-emblem" data-project={project.id} aria-hidden="true">
      {project.id === "tiny-town" ? (
        <svg viewBox="0 0 360 220">
          <path className="atlas-ground" d="m30 159 154-63 148 65-154 49z" />
          <path className="atlas-route" d="m49 168 121-47 114 48-91 30" />
          <g className="atlas-town">
            <path className="cut-sheet" d="M78 81h59v80H78zm71 32h68v62h-68zm83-37h48v86h-48z" />
            <path className="cut-highlight" d="m72 81 35-28 36 28zm70 32 41-27 41 27zm85-37 29-24 30 24z" />
            <path className="cut-rule" d="M95 161v-28h23v28m49-11h12m13 0h12M93 99h10m12 0h10m-32 17h10m12 0h10m120-23h10m-10 18h10m-10 18h10" />
          </g>
          <path className="cut-sheet" d="M47 111h8v-10h12v10h8v21h-9v9H54v-9h-7zm247 12h7v-10h12v10h8v20h-9v9h-10v-9h-8z" />
          <path className="cut-rule" d="M61 140v20m247-9v17" />
          <g className="atlas-town-car">
            <path className="cut-highlight" d="M184 179h37l-5-11h-22zm-5 0h48v12h-48z" />
            <circle className="atlas-wheel" cx="188" cy="192" r="4" />
            <circle className="atlas-wheel" cx="217" cy="192" r="4" />
          </g>
        </svg>
      ) : project.id === "galilearn" ? (
        <svg viewBox="0 0 360 220">
          <path className="atlas-ground" d="m32 165 145-50 151 50-146 43z" />
          <g className="atlas-planets">
            <ellipse className="cut-link" cx="180" cy="86" rx="119" ry="42" transform="rotate(-20 180 86)" />
            <circle className="cut-sheet" cx="180" cy="86" r="45" />
            <path className="cut-highlight" d="M180 41a45 45 0 0 1 0 90c23-24 23-66 0-90z" />
            <circle className="cut-seal" cx="70" cy="120" r="13" />
            <circle className="cut-sheet" cx="282" cy="51" r="17" />
            <path className="cut-rule" d="M137 86h85m-42-45c-25 22-25 68 0 90" />
          </g>
          <g className="atlas-lessons">
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${68 + i * 66} ${164 - i * 12})`}>
                <path className="cut-sheet" d="M0 0h91v37H0z" />
                <path className="cut-highlight" d="M9 9h13v18H9z" />
                <path className="cut-rule" d="M32 12h47m-47 10h33" />
              </g>
            ))}
          </g>
        </svg>
      ) : (
        <ProjectArtwork project={{ ...project, preview: undefined }} night={false} />
      )}
    </div>
  );
}
