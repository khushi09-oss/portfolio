export type Project = {
  id: string;
  name: string;
  category: string;
  summary: string;
  overview: string;
  contribution: string;
  role: string;
  stack: string[];
  details: string[];
  lesson: string;
  link?: string;
  demo?: string;
  status: string;
  preview?: { src: string; nightSrc?: string; alt: string; note: string };
};

export const projects: Project[] = [
  {
    id: "recollia",
    name: "Recollia AI Tutor",
    category: "PRODUCTION / RAG",
    summary: "The AI Tutor I built for medical exam prep at Recollia.",
    overview:
      "An AI tutor for medical students preparing for exams. It answers questions using licensed medical material, with citations and voice support.",
    contribution:
      "I led the tutor across retrieval, citation checks, voice and safety. I also handled releases, built study features and worked on the AWS migration.",
    role: "Machine Learning Engineer · May–October 2026",
    stack: ["Python", "pgvector", "React", "AWS"],
    status: "Employer work",
    details: [
      "The tutor answers medical exam-prep questions using licensed material. Its sources need to remain traceable through retrieval and the final answer.",
      "I built the tutor’s retrieval pipeline using BGE-M3, BM25, and reciprocal rank fusion over a licensed medical corpus in PostgreSQL/pgvector.",
      "I added voice mode, safety checks, and evaluation tools. I also built study features including timed mock exams, spaced repetition, a Weakness Map, an adaptive planner, and offline packs.",
      "I handled production releases and hotfixes through GitHub Actions and worked on the move from Supabase to AWS. I also integrated Sarvam speech services and Eka Care tools.",
    ],
    lesson:
      "I added separate checks for whether a cited source was retrieved and whether it supported the answer. Finding a relevant passage wasn’t enough on its own.",
  },
  {
    id: "github-mcp",
    name: "GitHub MCP",
    category: "DEVELOPER TOOL / MCP",
    summary: "Tools for an AI assistant to explore a GitHub repository.",
    overview:
      "A read-only MCP server for exploring a GitHub repository from an AI assistant. Files and citations stay tied to one commit.",
    contribution:
      "I built the Python tools for browsing files, inspecting imports and generating architecture diagrams.",
    role: "Personal project",
    stack: ["Python", "MCP", "Source analysis"],
    status: "Open source",
    link: "https://github.com/khushi09-oss/github-mcp",
    details: [
      "Repository explanations can drift when the files come from different commits. The server keeps each read tied to one revision.",
      "I built the repository and file-reading tools in Python, with each read tied to a single commit. It also supports import analysis and architecture diagrams.",
      "The server runs locally and connects to an MCP-compatible AI client.",
    ],
    lesson:
      "I pin file reads to one commit so the assistant works from a consistent version of the repository, even when an explanation uses several files.",
  },
  {
    id: "kiranaledger",
    name: "KiranaLedger",
    category: "HACKATHON / DOCUMENT AI",
    summary: "Photograph a supplier bill and check it before filing it.",
    overview:
      "A bill-checking tool for shop owners. A photo becomes structured rows so duplicates and price changes can be flagged.",
    contribution:
      "I built direct-to-S3 uploads, Textract extraction and normalisation, plus arithmetic checks on the extracted rows.",
    role: "Ingestion and extraction · team project",
    stack: ["S3", "Textract", "DynamoDB"],
    status: "Hackathon project",
    link: "https://github.com/khushi09-oss/kiranaledger",
    details: [
      "OCR can return confident prices that do not add up. The ingestion flow checks the extracted rows before the bill moves on.",
      "I built the ingestion flow: upload a photo directly to S3, extract the bill with Textract, and turn the result into structured rows.",
      "I added arithmetic checks to catch prices that Textract read incorrectly, including cases where its confidence score was high.",
    ],
    lesson:
      "I checked each row’s arithmetic because the OCR confidence score didn’t tell us whether the numbers added up.",
  },
  {
    id: "reforge",
    name: "Reforge",
    category: "MLOPS / MODEL LIFECYCLE",
    summary:
      "An MLOps pipeline that checks for data drift and retrains a fraud model.",
    overview:
      "A team-built pipeline for checking drift, retraining and evaluating a fraud model.",
    contribution:
      "I worked on the model, preprocessing and drift detection. I also added model storage and a helper to test the detector with injected drift.",
    role: "ML pipeline contribution · team project",
    stack: ["Python", "Temporal", "MinIO"],
    status: "Team project",
    details: [
      "The pipeline connects drift detection, retraining, evaluation, and deployment. My part covers the model and data checks within that larger team project.",
      "I worked on the ML side: preprocessing PaySim data, training an Isolation Forest model, storing models in MinIO, and detecting drift with a KS test.",
      "I also built a helper that changes the input data on purpose, so we could test whether the drift detector picked it up.",
    ],
    lesson:
      "I used injected drift to test the detection path with a known change in the data, rather than waiting for one to happen.",
  },
  {
    id: "galilearn",
    name: "Galilearn",
    preview: {
      src: "/projects/galilearn-prototype.jpg",
      alt: "Galilearn's coded design prototype, with illustrated watercolor planets and its learning interface",
      note: "Design prototype · In development",
    },
    category: "LEARNING PRODUCT",
    summary: "An ML study app built around a map of connected concepts.",
    overview:
      "An ML study app in development. Concepts form a map of planets, connected to lessons, quizzes and spaced reviews.",
    contribution:
      "I’m building the interface and backend, including concept ordering and server-side grading.",
    role: "Personal product · Cosmic Study Buddy",
    stack: ["React", "TypeScript", "Workers", "D1"],
    status: "In development",
    details: [
      "Galilearn is the ML study app I’m building. The concept map shows how topics connect and what to learn first.",
      "I’m building it with React, TypeScript, Cloudflare Workers, and D1. Workers and D1 provide the backend for the learning app.",
      "Answer keys and grading stay on the server. The browser sends the learner’s answer and displays the result.",
    ],
    lesson:
      "I kept grading on the server so scores come from the answer key, rather than browser state.",
  },
  {
    id: "tiny-town",
    name: "Tiny Town",
    preview: {
      src: "/projects/tiny-town-day.png",
      nightSrc: "/projects/tiny-town-night.png",
      alt: "Tiny Town's pixel village with thirty residents, cottages, and replay controls",
      note: "Demo replay · Mock decisions",
    },
    category: "EXPERIMENT / PIXEL WORLDS",
    summary: "A pixel town where 30 residents follow their own routines.",
    overview:
      "A pixel-world simulation of 30 residents. The public demo replays a day of routines with mock decisions.",
    contribution:
      "I built the Python simulation and the Phaser replay interface. You can follow a resident and move through the day.",
    role: "Personal experiment",
    stack: ["Python", "TypeScript", "Phaser"],
    status: "Public demo",
    link: "https://github.com/khushi09-oss/jev-town",
    demo: "https://khushi09-oss.github.io/jev-town/",
    details: [
      "The residents eat, work, rest, socialise, and wander. Their routines are recorded for the replay.",
      "I built the simulation in Python and the replay interface with TypeScript and Phaser. You can follow a resident, move through the day, and inspect what happened.",
      "The public demo replays a saved run using mock decisions.",
    ],
    lesson:
      "I separated the simulation from the replay so people can explore the same day without running the simulation again.",
  },
];

export const iterations = [
  {
    label: "The question",
    title: "Where did this answer come from?",
    body: "An assistant reads a file to answer a repository question. This example follows the source from retrieval to the final answer.",
  },
  {
    label: "The catch",
    title: "A source can belong to the wrong revision.",
    body: "A file can change between reads. If the assistant mixes versions, its explanation may refer to code that no longer fits together.",
  },
  {
    label: "The decision",
    title: "Pin the evidence to one commit.",
    body: "I resolve the commit first and use it for each file read. Try matching the retrieved file and its revision in the source check.",
  },
  {
    label: "The result",
    title: "An answer with a traceable source.",
    body: "The answer can point back to the file and commit it used. That is the same approach I used in the GitHub MCP server.",
  },
];
