import { PixelBot } from "./Companion";
import { companionPhase } from "./companion-progress";

export function CoopWorld({
  night,
  sourceVerified,
  complete,
  discoveries,
}: {
  night: boolean;
  sourceVerified: boolean;
  complete: boolean;
  discoveries: number;
}) {
  const tiles = complete ? 3 : sourceVerified ? 2 : 0;
  return (
    <figure
      className={`coop-world ${night ? "is-night" : ""} ${complete ? "is-complete" : ""}`}
      aria-label="Co-op evidence bridge"
      data-tiles={tiles}
    >
      <div className="world-caption">
        <span>FIELD EXPERIMENT / 01</span>
        <span>
          {night ? "After hours" : "A little daylight"}{" "}
          <span aria-hidden="true">{night ? "◐" : "☀"}</span>
        </span>
      </div>
      <svg
        className="world-landscape"
        viewBox="0 0 1000 330"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="world-sky" x2="0" y2="1">
            <stop stopColor="var(--world-sky-top)" />
            <stop offset="1" stopColor="var(--world-sky-bottom)" />
          </linearGradient>
          <pattern
            id="world-rain"
            width="42"
            height="42"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="m15 0-5 17m30 8-5 17"
              stroke="var(--world-rain)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <path fill="url(#world-sky)" d="M0 0h1000v330H0z" />
        <g className="world-clouds" fill="var(--world-cloud)">
          <path d="M80 68h35V53h62v15h40v14H80zM700 45h24V31h48v14h34v14H700zM430 105h28V94h42v11h29v11h-99z" />
        </g>
        <g className="world-stars" fill="var(--world-lamp)">
          <path d="M130 45h2v9h-2zm-4 4h10v2h-10zM650 83h2v9h-2zm-4 4h10v2h-10zM875 25h2v9h-2zm-4 4h10v2h-10z" />
          <circle cx="325" cy="34" r="1.5" />
          <circle cx="560" cy="58" r="1.5" />
          <circle cx="800" cy="100" r="1.5" />
        </g>
        <circle cx="894" cy="65" r="21" fill="var(--world-moon)" />
        <path
          d="m0 164 93-47 82 36 90-60 90 70 88-30 88 45 77-82 95 75 92-49 125 45v163H0z"
          fill="var(--world-distance)"
        />
        <g opacity=".4" stroke="var(--world-line)">
          <path d="M0 276h1000M0 294h1000M0 312h1000" />
          <path d="m100 330 80-70m120 70 40-70m160 70v-70m200 70-40-70m240 70-80-70" />
        </g>
        <path
          d="M0 220h360v20h-15v31h-23v28h-27v19h-56v-11h-35v-12h-45v-19h-36v-20H0zM640 220h360v36H879v20h-36v19h-45v12h-35v11h-56v-19h-27v-28h-23v-31h-17z"
          fill="var(--world-rock)"
        />
        <path
          d="M0 220h360v16H0zm640 0h360v16H640z"
          fill="var(--world-grass)"
        />
        <path
          d="M0 236h360m280 0h360"
          stroke="var(--world-line)"
          strokeWidth="2"
        />
        <path
          d="M91 220V158h105v62m-115-62 62-40 63 40z"
          fill="var(--world-paper)"
          stroke="var(--world-line)"
          strokeWidth="2"
        />
        <path
          d="M102 159h83m-67 61v-35h24v35m17-50h17v20h-17z"
          stroke="var(--world-line)"
          strokeWidth="3"
        />
        <path d="M165 173h9v14h-9z" fill="var(--world-lamp)" />
        <path
          d="M824 220V123h15v97m-28-97h41v-11h-41zm6-11V86h28v26z"
          fill="var(--world-metal)"
          stroke="var(--world-line)"
          strokeWidth="2"
        />
        <path d="M822 92h18v14h-18z" fill="var(--world-lamp)" />
        <path
          d="M48 220v-25m-16 2h32v-16H32zm852 23v-24m-17 0h34v-17h-34zm-656 24v-13m-10 0h20v-10h-20z"
          fill="var(--world-leaf)"
          stroke="var(--world-line)"
          strokeWidth="2"
        />
        <path
          d="M725 220v-28h47v28m-42-27v-14h39v14m-34-14v-13h29v13"
          fill="var(--world-paper)"
          stroke="var(--world-line)"
          strokeWidth="2"
        />
        <path
          d="M737 183h22m-22 14h22m-22 9h16"
          stroke="var(--world-accent)"
          strokeWidth="2"
        />
        <path
          d="M355 244h290"
          stroke="var(--world-line)"
          strokeWidth="2"
          strokeDasharray="3 9"
        />
        {[0, 1, 2].map((index) => (
          <g
            key={index}
            className={index < tiles ? "bridge-tile connected" : "bridge-tile"}
          >
            <rect
              x={375 + index * 84}
              y="222"
              width="74"
              height="15"
              fill={
                index < tiles ? "var(--world-accent)" : "var(--world-paper)"
              }
              stroke="var(--world-line)"
              strokeWidth="2"
              strokeDasharray={index < tiles ? undefined : "4 5"}
            />
            <path
              d={`M${382 + index * 84} 237v10h57v-10`}
              stroke="var(--world-line)"
              strokeWidth="2"
            />
            <text
              x={412 + index * 84}
              y="273"
              textAnchor="middle"
              fill="var(--world-ink)"
            >
              {["file", "revision", "claim"][index]}
              {index < tiles ? " ✓" : ""}
            </text>
          </g>
        ))}
        <path
          className="world-rain"
          fill="url(#world-rain)"
          d="M0 0h1000v330H0z"
        />
      </svg>
      <div className="world-traveller">
        <span className="world-character-label">YOU</span>
        <svg viewBox="0 0 24 36" aria-hidden="true" shapeRendering="crispEdges">
          <path
            d="M6 2h12v3h3v10h-3v3h-2v3h3v9h-5v6h-4v-6H5v-9h3v-3H6v-3H3V5h3z"
            fill="var(--world-ink)"
          />
          <path d="M6 8h12v7H6z" fill="var(--world-paper)" />
          <path d="M7 3h10v4H7zm-2 20h14v6H5z" fill="var(--world-accent)" />
          <path d="M14 10h2v2h-2z" fill="var(--world-ink)" />
        </svg>
      </div>
      <div className="world-partner">
        <span className="world-character-label">LAB PARTNER</span>
        <PixelBot growth={companionPhase(discoveries)} />
        <span className="world-bubble">
          {complete
            ? "Good evidence. Bridge built."
            : sourceVerified
              ? "Two tiles down. Can the source support the claim?"
              : "You find the evidence. I’ll help connect it."}
        </span>
      </div>
      <figcaption>
        <span>
          {complete
            ? "Connected. A source we can follow."
            : `${tiles} of 3 bridge tiles connected`}
        </span>
        <span>Local puzzle · no model calls</span>
      </figcaption>
    </figure>
  );
}
