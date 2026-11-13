import { lazy, Suspense, useState } from "react";
import Machine from "./Machine";
import { Companion } from "./Companion";
import { Icon } from "./Icon";
import { iterations } from "./data";
import { checkSource, sources } from "./evidence";
import { claims, claimIsSupported } from "./companion-progress";
import { CoopWorld } from "./CoopWorld";

const HandControls = lazy(() => import("./HandControls"));

export function Lab({
  night,
  discoveries,
  onLearn,
}: {
  night: boolean;
  discoveries: string[];
  onLearn: () => void;
}) {
  const [stage, setStage] = useState(0);
  const [iteration, setIteration] = useState(0);
  const [challenge, setChallenge] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [complete, setComplete] = useState(false);
  const [sourceVerified, setSourceVerified] = useState(false);
  const [handPanel, setHandPanel] = useState(false);
  function chooseSource(index: number) {
    const source = sources[index];
    if (!source) return;
    if (checkSource(source.file, source.commit)) {
      setFeedback(
        "Evidence connected. The retrieved file and commit both match.",
      );
      setStage(2);
      setSourceVerified(true);
    } else {
      setFeedback(
        source.commit !== "a1b2c3d"
          ? "Right filename, wrong revision. Try the source pinned to a1b2c3d."
          : "This file was not retrieved for the answer. Find the retrieved source.",
      );
      setStage(2);
    }
  }
  function chooseClaim(claim: string) {
    if (!claimIsSupported(sourceVerified, claim)) {
      setFeedback(
        "That claim is not supported by the fixture. Check what the function combines.",
      );
      return;
    }
    setFeedback("Bridge complete. The file, revision, and claim all connect.");
    setComplete(true);
    setStage(3);
    onLearn();
  }
  return (
    <main id="main" tabIndex={-1} className="lab-page page-width">
      <a className="back-link" href="#home">
        ← Back to portfolio
      </a>
      <div className="lab-heading">
        <div>
          <p className="eyebrow">A SMALL EXPERIMENT IN UNDERSTANDING</p>
          <h1 tabIndex={-1}>
            Follow the <em>evidence.</em>
          </h1>
          <p className="lead">Pull an idea apart. See what makes it work.</p>
          <button
            className="inline-link lab-world-link"
            onClick={() =>
              document.getElementById("bridge-world")?.scrollIntoView()
            }
          >
            Explore the co-op world <span aria-hidden="true">↓</span>
          </button>
        </div>
        <button
          className="button"
          onClick={() => setHandPanel((v) => !v)}
          aria-expanded={handPanel}
        >
          <Icon name="hand" /> Hand controls
        </button>
      </div>
      <div className={`lab-workbench ${handPanel ? "with-hands" : ""}`}>
        <div>
          <Machine night={night} stage={stage} onStage={setStage} />
          <div className="lab-machine-foot">
            <span>
              <span className="status-dot" /> Local illustration · no model
              calls
            </span>
            <button
              className="text-button"
              onClick={() => {
                setStage(0);
                setFeedback("");
                setComplete(false);
                setSourceVerified(false);
              }}
            >
              <Icon name="reset" size={16} /> Reset machine
            </button>
          </div>
        </div>
        {handPanel && (
          <Suspense
            fallback={
              <aside className="hand-panel">Loading hand controls…</aside>
            }
          >
            <HandControls
              onPosition={(p) => setStage(Math.min(3, Math.floor(p * 4)))}
              onClose={() => setHandPanel(false)}
            />
          </Suspense>
        )}
      </div>
      <div className="lab-bottom-grid">
        <section
          className="challenge-panel"
          id="bridge-world"
          aria-labelledby="challenge-title"
        >
          <p className="eyebrow">YOU + YOUR LAB PARTNER</p>
          <h2 id="challenge-title">Two minds. One source.</h2>
          <p>
            I’ll hold the answer. You connect its evidence. Can you spot the
            source that actually belongs?
          </p>
          <CoopWorld
            night={night}
            sourceVerified={sourceVerified}
            complete={complete}
            discoveries={discoveries.length}
          />
          {!challenge ? (
            <button
              className="button primary"
              onClick={() => {
                setChallenge(true);
                setStage(1);
              }}
            >
              Try a co-op task <Icon name="arrow" />
            </button>
          ) : (
            <>
              <div className="bridge-task">
                <div className="task-brief">
                  <span className="eyebrow">ILLUSTRATIVE ANSWER</span>
                  <p>“The retriever combines two ranked result lists.”</p>
                  <code>retrieved: retrieval.py @ a1b2c3d</code>
                  <code>combine_ranks(bm25_results, dense_results)</code>
                  <span className="fixture-label">
                    Illustrative source, not project code.
                  </span>
                </div>
                <div className="source-options">
                  {sources.map((source, i) => (
                    <button
                      key={`${source.file}-${source.commit}`}
                      className="source-option"
                      onClick={() => chooseSource(i)}
                      disabled={sourceVerified}
                    >
                      <Icon name="code" size={18} />
                      <span>
                        <strong>{source.label}</strong>
                        <code>{source.commit}</code>
                      </span>
                      <Icon name="arrow" size={16} />
                    </button>
                  ))}
                </div>
              </div>
              {sourceVerified && (
                <div className="claim-task">
                  <p className="eyebrow">
                    THE FINAL TILE / WHAT DOES THE SOURCE SUPPORT?
                  </p>
                  <div className="claim-options">
                    {claims.map((claim) => (
                      <button
                        key={claim.id}
                        className="claim-option"
                        onClick={() => chooseClaim(claim.id)}
                        disabled={complete}
                      >
                        {claim.text}
                        <Icon name="arrow" size={17} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p
                className={`task-feedback ${complete ? "success" : ""}`}
                role="status"
              >
                {feedback ||
                  "Choose the retrieved file at the correct revision."}
              </p>
              {complete && (
                <button
                  className="text-button"
                  onClick={() => {
                    setComplete(false);
                    setSourceVerified(false);
                    setFeedback("");
                    setStage(1);
                  }}
                >
                  Try again <Icon name="reset" size={14} />
                </button>
              )}
            </>
          )}
        </section>
        <section className="iteration-panel" aria-labelledby="iteration-title">
          <p className="eyebrow">AN IDEA, UNDER THE MICROSCOPE</p>
          <div
            className="iteration-tabs"
            role="group"
            aria-label="Explore the engineering decision"
          >
            {iterations.map((item, i) => (
              <button
                key={item.label}
                aria-pressed={iteration === i}
                className={iteration === i ? "active" : ""}
                onClick={() => {
                  setIteration(i);
                  setStage(i);
                }}
              >
                <span>0{i + 1}</span>
                {item.label}
              </button>
            ))}
          </div>
          <div className="iteration-copy" aria-live="polite">
            <h2 id="iteration-title">{iterations[iteration].title}</h2>
            <p>{iterations[iteration].body}</p>
          </div>
          <a
            className="inline-link"
            href="https://github.com/khushi09-oss/github-mcp"
            target="_blank"
            rel="noreferrer"
          >
            Explore the actual project <Icon name="diagonal" size={17} />
          </a>
        </section>
      </div>
      <Companion
        learned={discoveries.length}
        discoveries={discoveries}
        message={
          complete ? "Source finding, learned. We make a good team." : undefined
        }
      />
    </main>
  );
}
