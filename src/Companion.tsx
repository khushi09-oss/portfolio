export function PixelBot({
  small = false,
  evolved = false,
}: {
  small?: boolean;
  evolved?: boolean;
}) {
  return (
    <svg
      className={`pixel-bot ${small ? "small" : ""}`}
      viewBox="0 0 24 30"
      fill="currentColor"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path d="M11 2h2v4h-2zM4 7h16v2h2v12h-2v2h-6v2h3v2h-4v-2h-2v2H7v-2h3v-2H4v-2H2V9h2zM0 12h2v7H0zm22 0h2v7h-2z" />
      <path className="bot-eyes" d="M6 11h3v5H6zm9 0h3v5h-3z" />
      <path className="bot-accent" d="M10 0h4v3h-4z" />
      {evolved && (
        <path className="bot-accent" d="M0 0h2v2H0zm20 2h2v2h-2zM8 18h8v2H8z" />
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
  return (
    <div className="companion">
      <PixelBot evolved={learned >= 3} />
      <div>
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
      <span className="companion-level" title="Projects explored this visit">
        {String(learned).padStart(2, "0")}
        <span> discoveries</span>
      </span>
    </div>
  );
}
