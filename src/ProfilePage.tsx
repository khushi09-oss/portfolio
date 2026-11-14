import { Companion } from "./Companion";
import { Icon } from "./Icon";
import { useState } from "react";

export function ProfilePage({
  contact,
  discoveries,
}: {
  contact: boolean;
  discoveries: string[];
}) {
  const [copyMessage, setCopyMessage] = useState("");
  if (contact)
    return (
      <section className="contact-section page-width" id="contact">
        <p className="eyebrow">CONTACT</p>
        <h1 tabIndex={-1}>Get in touch.</h1>
        <div className="contact-bottom">
          <div className="contact-copy">
            <p>
              I can help build an AI feature, connect it to your backend, or
              turn a prototype into a working interface.
            </p>
            <p>
              Tell me what you’re building, where you need help and your
              timeline. For engineering roles, send the role and team details.
            </p>
            <div className="contact-address">
              <a href="mailto:work.khushisahni@gmail.com">
                work.khushisahni@gmail.com
              </a>
              <button
                className="text-button"
                onClick={async () => {
                  try {
                    if (!navigator.clipboard)
                      throw new Error("Clipboard unavailable");
                    await navigator.clipboard.writeText(
                      "work.khushisahni@gmail.com",
                    );
                    setCopyMessage("Email copied.");
                  } catch {
                    setCopyMessage("Select the address above to copy it.");
                  }
                }}
              >
                Copy email
              </button>
            </div>
            <p className="copy-status" role="status">
              {copyMessage}
            </p>
          </div>
          <div className="contact-links">
            <a
              className="inline-link"
              href="https://www.linkedin.com/in/khushi-sahni"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <Icon name="diagonal" size={16} />
            </a>
            <a
              className="button primary"
              href="mailto:work.khushisahni@gmail.com"
            >
              Email me <Icon name="diagonal" size={18} />
            </a>
          </div>
        </div>
      </section>
    );
  return (
    <div className="page-width profile-page">
      <section
        className="about-section"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="about-intro">
          <p className="eyebrow">ABOUT ME</p>
          <h1 id="about-title" tabIndex={-1}>
            I’m Khushi Sahni.
          </h1>
          <p>
            I work across ML, backend code, and frontend features. At Recollia,
            I built an AI tutor for medical exam prep.
          </p>
          <p>I also teach Python to school kids.</p>
          <a className="inline-link" href="/work/recollia">
            Explore my work <Icon name="arrow" size={18} />
          </a>
        </div>
        <div className="experience-list">
          <div>
            <span className="eyebrow">MAY — OCTOBER 2026</span>
            <h2>Machine Learning Engineer</h2>
            <p>Recollia · Medical exam-prep AI</p>
          </div>
          <div>
            <span className="eyebrow">JUL 2025 — MAY 2026</span>
            <h2>AI-ML Product Developer Intern</h2>
            <p>GrapeDawn · AI & multi-tenant platforms</p>
          </div>
          <div>
            <span className="eyebrow">TEACHING & COMMUNITY</span>
            <h2>AI/ML Lead · GDGoC</h2>
            <p>Agent and RAG workshops, mentoring, and Python tuitions.</p>
          </div>
          <div>
            <span className="eyebrow">EDUCATION</span>
            <h2>B.Tech · AI & Data Science</h2>
            <p>Ajeenkya D Y Patil University · CGPA 8.5</p>
          </div>
        </div>
      </section>
      <Companion learned={discoveries.length} discoveries={discoveries} />
    </div>
  );
}
