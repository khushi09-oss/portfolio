import { companionPhase } from "./companion-progress";

export function PixelBot({
  small = false,
  growth,
}: {
  small?: boolean;
  growth?: 0 | 1 | 2;
}) {
  return (
    <svg
      className={`pixel-bot ${small ? "small" : ""}`}
      viewBox="0 0 24 30"
      fill="currentColor"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {growth === 0 ? (
        <>
          <path d="M6 15h12v2h3v9h-3v2H6v-2H3v-9h3zM11 8h2v7h-2z" />
          <path className="bot-accent" d="M5 4h5v2h3v6H8v-2H5zm8 3h5v4h-5z" />
          <path className="bot-eyes" d="M7 20h2v3H7zm8 0h2v3h-2z" />
        </>
      ) : (
        <>
          <path d="M11 2h2v4h-2zM4 7h16v2h2v12h-2v2h-6v2h3v2h-4v-2h-2v2H7v-2h3v-2H4v-2H2V9h2zM0 12h2v7H0zm22 0h2v7h-2z" />
          <path className="bot-eyes" d="M6 11h3v5H6zm9 0h3v5h-3z" />
          <path className="bot-accent" d="M10 0h4v3h-4z" />
          {growth === 2 && (
            <>
              <path
                className="bot-accent"
                d="M0 0h2v2H0zm20 2h2v2h-2zM8 18h8v2H8zM0 22h8v6H0zm16 0h8v6h-8z"
              />
              <path className="bot-eyes" d="M2 24h4v1H2zm16 0h4v1h-4z" />
              <path d="M3 4h3v3H3zm15 0h3v3h-3z" />
            </>
          )}
        </>
      )}
    </svg>
  );
}

export const abilityNames: Record<string, string> = {
  recollia: "Grounded answers",
  "github-mcp": "Source finding",
  kiranaledger: "Document checks",
  reforge: "Drift detection",
  galilearn: "Learning paths",
  "tiny-town": "World replay",
  "source-finding": "Evidence checking",
};

export function Companion({
  learned,
  discoveries = [],
  message,
}: {
  learned: number;
  discoveries?: string[];
  message?: string;
}) {
  const phase = companionPhase(learned);
  return (
    <section
      className="companion companion-growth"
      aria-label="Your companion’s growth"
    >
      <div className="companion-current">
        <PixelBot growth={phase} />
        <div className="companion-copy">
          <span className="eyebrow">
            YOUR LAB PARTNER
            {learned >= 3
              ? " / MAKING CONNECTIONS"
              : learned
                ? " / GETTING CURIOUS"
                : ""}
          </span>
          <p aria-live="polite">
            {message ??
              (learned
                ? `We've made ${learned} ${learned === 1 ? "discovery" : "discoveries"}. What’s next?`
                : "A little curious? So am I.")}
          </p>
          {discoveries.length > 0 && (
            <div
              className="companion-skills"
              aria-label="Abilities discovered this visit"
            >
              {discoveries.map((id) => (
                <span key={id}>{abilityNames[id]}</span>
              ))}
            </div>
          )}
        </div>
        <span className="companion-level" title="Discoveries this visit">
          {String(learned).padStart(2, "0")}
          <span> discoveries</span>
        </span>
      </div>
      <div className="growth-trail" aria-label="Growth stages">
        {(["The seed", "The learner", "The guide"] as const).map(
          (name, index) => (
            <div
              key={name}
              className={`growth-stop ${phase === index ? "current" : ""} ${phase < index ? "locked" : ""}`}
              aria-current={phase === index ? "step" : undefined}
            >
              <span className="growth-number">0{index + 1}</span>
              <PixelBot growth={index as 0 | 1 | 2} />
              <div>
                <strong>{name}</strong>
                <span>
                  {index === 0
                    ? "Start curious"
                    : index === 1
                      ? "Explore a project"
                      : "Make 3 discoveries"}
                </span>
              </div>
              <span className="growth-status">
                {phase === index
                  ? "You are here"
                  : phase > index
                    ? "Discovered"
                    : "Next"}
              </span>
            </div>
          ),
        )}
      </div>
      <p className="growth-note">
        Explore projects to help your companion grow. Progress belongs to this
        visit.
      </p>
    </section>
  );
}
