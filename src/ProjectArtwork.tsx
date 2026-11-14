import type { ReactNode } from "react";
import type { Project } from "./data";
import { ProjectPreview } from "./ProjectPreview";

const illustrations: Record<string, ReactNode> = {
  "github-mcp": (
    <svg viewBox="0 0 360 220" aria-hidden="true">
      <path className="cut-shadow" d="M66 50h127v125H66z" />
      <g transform="rotate(-7 112 101)">
        <path className="cut-sheet" d="M46 34h112v122H46z" />
        <path className="cut-fold" d="M139 34v19h19" />
        <path
          className="cut-rule"
          d="M65 69h72m-72 13h57m-57 14h69m-69 13h41"
        />
      </g>
      <rect
        className="cut-sheet"
        x="96"
        y="62"
        width="119"
        height="123"
        rx="4"
      />
      <path className="cut-rule" d="M115 97h72m-72 13h50m-50 13h72" />
      <path className="cut-ink" d="m116 80 6 4-6 4m13-2h24" />
      <path className="cut-track" d="M215 108h24q15 0 15 15v19h22" />
      <circle className="cut-merge" cx="254" cy="108" r="9" />
      <path className="cut-check" d="m250 108 3 3 5-6" />
      <path className="cut-sheet" d="M268 120h64v62h-64z" />
      <path className="cut-highlight" d="M277 143h47v12h-47z" />
      <path className="cut-rule" d="M278 133h42m-42 15h31m-31 16h37" />
      <path className="cut-link" d="M284 120V78q0-15-16-15h-53" />
      <circle className="cut-particle" cx="229" cy="63" r="4" />
    </svg>
  ),
  kiranaledger: (
    <svg viewBox="0 0 360 220" aria-hidden="true">
      <g transform="rotate(-7 101 110)">
        <rect
          className="cut-sheet"
          x="44"
          y="28"
          width="104"
          height="159"
          rx="13"
        />
        <path className="cut-rule" d="M80 40h32m-24 135h18" />
        <path className="desk-book" d="M56 56h80v103H56z" />
        <path
          className="cut-sheet"
          d="M66 65h60v83l-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4-6-4-6 4z"
        />
        <path
          className="cut-rule"
          d="M77 80h37m-37 12h29m-29 12h36m-36 12h24m-24 12h37"
        />
        <path className="scan-line" d="M57 101h77" />
      </g>
      <path className="cut-track" d="M160 112h29" />
      <path className="cut-ink" d="m183 106 7 6-7 6" />
      <path className="cut-shadow" d="M215 61h116v120H215z" />
      <rect
        className="cut-sheet"
        x="204"
        y="49"
        width="116"
        height="120"
        rx="4"
      />
      <path
        className="cut-rule"
        d="M219 69h58m-58 23h85m-85 22h85m-85 23h85m-57-52v59m29-59v59"
      />
      <path className="cut-highlight" d="M213 118h99v16h-99z" />
      <path className="cut-ink" d="M222 126h14m13 0h13m15 0h18" />
      <circle className="cut-seal" cx="313" cy="162" r="22" />
      <path className="cut-check" d="m303 162 7 7 13-16" />
    </svg>
  ),
  reforge: (
    <svg viewBox="0 0 360 220" aria-hidden="true">
      <path
        className="cut-track"
        d="M51 112h260M285 131v30q0 20-20 20H91q-20 0-20-20v-24"
      />
      <path className="cut-ink" d="m64 143 7-7 7 7m225-30 9-1-7-7" />
      <rect className="cut-sheet" x="29" y="57" width="88" height="89" rx="6" />
      <path className="cut-rule" d="M43 129h60" />
      <path className="model-bars" d="M48 115V98m16 17V87m16 28V71m16 44V82" />
      <path className="cut-link" d="M42 90h63" />
      <path className="cut-shadow" d="m163 67 44-24 41 24v63l-42 24-43-24z" />
      <path className="cut-sheet" d="m151 57 43-24 43 24v63l-43 24-43-24z" />
      <path className="cut-ink" d="m151 57 43 24 43-24m-43 24v63" />
      <path className="cut-highlight" d="m161 57 33-18 33 18-33 18z" />
      <rect
        className="cut-sheet"
        x="273"
        y="70"
        width="57"
        height="71"
        rx="5"
      />
      <path className="cut-rule" d="M285 85h32m-32 11h22" />
      <circle className="cut-seal" cx="312" cy="132" r="21" />
      <path className="cut-check" d="m303 132 6 6 13-15" />
      <circle className="cut-particle" cx="149" cy="181" r="4" />
    </svg>
  ),
  recollia: (
    <svg viewBox="0 0 240 170" aria-hidden="true">
      <g transform="rotate(-9 112 92)">
        <path className="cut-shadow" d="M47 45h135v110H47z" />
        <path className="cut-sheet" d="M39 31h136v116H39z" />
        <path
          className="cut-rule"
          d="M59 54h69m-69 14h94m-94 15h79m-79 15h91m-91 15h66"
        />
      </g>
      <g transform="rotate(7 135 90)">
        <path className="cut-sheet" d="M79 30h120v119H79z" />
        <path className="cut-fold" d="M178 30v21h21" />
        <path
          className="cut-rule"
          d="M96 69h83m-83 13h69m-69 14h83m-83 14h57"
        />
        <path className="cut-highlight" d="M93 91h91v12H93z" />
        <path className="cut-ink" d="M96 97h72" />
      </g>
      <path className="cut-binding" d="M69 142h135v11H69z" />
      <path className="cut-ink" d="M58 148h142" />
    </svg>
  ),
};

const labels: Record<string, string> = {
  recollia: "Licensed source pages",
  "github-mcp": "Repository files linked to one commit",
  kiranaledger: "Bill photo, extraction, and arithmetic checks",
  reforge: "Drift detection, model evaluation, and deployment",
};

const defaultIllustration = (
  <svg
    className="project-default-illustration"
    viewBox="0 0 360 220"
    aria-hidden="true"
  >
    <path className="cut-shadow" d="M78 64h220v124H78z" />
    <path className="cut-sheet" d="M61 48h90l19 20h112v107H61z" />
    <path className="cut-highlight" d="M78 88h187v25H78z" />
    <path className="cut-rule" d="M94 100h103m-103 32h148m-148 17h104" />
  </svg>
);

export function ProjectArtwork({
  project,
  night,
}: {
  project: Project;
  night: boolean;
}) {
  if (project.preview)
    return <ProjectPreview project={project} night={night} />;
  const label = labels[project.id] ?? project.name;
  return (
    <figure className="project-illustration" aria-label={label}>
      {illustrations[project.id] ?? defaultIllustration}
      <figcaption>{label}</figcaption>
    </figure>
  );
}
