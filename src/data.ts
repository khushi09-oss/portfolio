export type Project = {
  id: string;
  name: string;
  category: string;
  summary: string;
  role: string;
  stack: string[];
  details: string[];
  lesson: string;
  link?: string;
  demo?: string;
  status: string;
};

export const projects: Project[] = [
  {
    id: "recollia",
    name: "Recollia AI Tutor",
    category: "PRODUCTION / RAG",
    summary: "Medical learning, grounded in the source.",
    role: "Machine Learning Engineer · May 2026–present",
    stack: ["Python", "pgvector", "React", "AWS"],
    status: "Employer work",
    details: [
      "Led the AI Tutor on a live medical exam-prep platform: question answering, safety checks, voice mode, and the release pipeline.",
      "Built hybrid retrieval using BGE-M3, BM25, and reciprocal rank fusion over a licensed medical corpus in PostgreSQL/pgvector. Citation checks reject sources that were not retrieved; a separate checker evaluates whether a source supports the claim.",
      "Built learning features including timed mock exams, pacing analytics, spaced repetition, a Weakness Map, adaptive planning, and offline packs.",
      "Owned production releases and contributed to the move from Supabase to AWS ECS, RDS, Cognito, and S3. Integrated Sarvam speech services and Eka Care tools.",
    ],
    lesson:
      "A citation is useful only if it points to retrieved evidence that actually supports the answer.",
  },
  {
    id: "github-mcp",
    name: "GitHub MCP",
    category: "DEVELOPER TOOL / MCP",
    summary: "Let an AI explore code. Keep the evidence.",
    role: "Personal project",
    stack: ["Python", "MCP", "Source analysis"],
    status: "Open source",
    link: "https://github.com/khushi09-oss/github-mcp",
    details: [
      "A local, read-only MCP server for exploring GitHub repositories, browsing files, and answering repository questions with source references.",
      "Commit-pinned file reading keeps a multi-file explanation on one revision. Optional source analysis supports import relationships and architecture diagrams.",
      "The server supplies tools and evidence to an AI client. It is not a hosted chat service, and this portfolio does not connect to private repositories.",
    ],
    lesson:
      "Resolve the revision once. Keep every source in the explanation pinned to that same commit.",
  },
  {
    id: "kiranaledger",
    name: "KiranaLedger",
    category: "HACKATHON / DOCUMENT AI",
    summary: "From a photographed bill to usable records.",
    role: "Ingestion and extraction · team project",
    stack: ["S3", "Textract", "DynamoDB"],
    status: "Hackathon project",
    link: "https://github.com/khushi09-oss/kiranaledger",
    details: [
      "A team-built ledger assistant for small shops, designed to surface duplicate supplier bills and unusual price changes.",
      "My contribution was the ingestion side: direct-to-S3 photo upload, Textract extraction, normalization, and arithmetic checks on extracted rows.",
      "Testing a row’s arithmetic can catch an incorrectly read price even when OCR reports high confidence. The repository README still describes an earlier stack; this account reflects my ingestion work.",
    ],
    lesson:
      "A confident extraction can still be wrong. Check the arithmetic before trusting the record.",
  },
  {
    id: "reforge",
    name: "Reforge",
    category: "MLOPS / MODEL LIFECYCLE",
    summary: "Notice drift. Evaluate the next model.",
    role: "ML pipeline contribution · team project",
    stack: ["Python", "Temporal", "MinIO"],
    status: "Project",
    details: [
      "An automated MLOps project for detecting data drift, retraining, evaluating, and deploying models.",
      "Built the ML side using PaySim preprocessing, an Isolation Forest anomaly model, model storage in MinIO, and KS-test drift detection.",
      "Added a helper that injects drift so the detection path can be exercised deliberately. This description does not claim independently verified production capacity.",
    ],
    lesson:
      "Make the failure condition reproducible before trying to automate the recovery.",
  },
  {
    id: "galilearn",
    name: "Galilearn",
    category: "LEARNING PRODUCT / IN DEVELOPMENT",
    summary: "A little universe for learning machine learning.",
    role: "Personal product · Cosmic Study Buddy",
    stack: ["React", "TypeScript", "Workers", "D1"],
    status: "In development",
    details: [
      "A study app for introductory ML, with concepts mapped as planets so learners can see what to learn first.",
      "Lessons, quizzes, and spaced reviews form the learning path. Answer keys and grading stay on the server.",
      "Still in development. No claim of an available public product or user outcomes.",
    ],
    lesson:
      "A playful interface can still put the important correctness checks on the server.",
  },
  {
    id: "tiny-town",
    name: "Tiny Town",
    category: "EXPERIMENT / PIXEL WORLDS",
    summary: "Thirty neighbors. One small, unfolding day.",
    role: "Personal experiment",
    stack: ["Python", "TypeScript", "Phaser"],
    status: "Public demo",
    link: "https://github.com/khushi09-oss/jev-town",
    demo: "https://khushi09-oss.github.io/jev-town/",
    details: [
      "A pixel village where residents eat, work, rest, socialize, and wander according to their needs and personalities.",
      "Python runs the simulation; the browser replays a saved day with controls for following residents, seeking, and inspecting what happened.",
      "The public demo uses mock decisions. It does not train or learn during a run.",
    ],
    lesson:
      "Simulate once, then let people explore the recording without making more model calls.",
  },
];

export const iterations = [
  {
    label: "The question",
    title: "Where did this answer come from?",
    body: "Start with a small repository question. The workbench uses a local example, not a live model or a production repository.",
  },
  {
    label: "The catch",
    title: "A source can belong to the wrong revision.",
    body: "A familiar filename is not enough. Mixing revisions can make an explanation internally inconsistent.",
  },
  {
    label: "The decision",
    title: "Pin the evidence to one commit.",
    body: "Resolve a revision, retrieve the source, and carry the same commit through the explanation. Try the source-checking task.",
  },
  {
    label: "The result",
    title: "An answer with a traceable source.",
    body: "The illustrative output links its statement to the chosen fixture. The real GitHub MCP supplies evidence to an AI client; this little machine explains the idea.",
  },
];
