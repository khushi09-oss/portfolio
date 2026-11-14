export type Project = {
  id: string;
  name: string;
  category: string;
  summary: string;
  overview: string;
  contribution: string;
  role: string;
  stack: string[];
  sections: { title: string; body: string }[];
  lesson: string;
  link?: string;
  demo?: string;
  status: string;
  preview?: {
    src: string;
    nightSrc?: string;
    srcSet?: string;
    nightSrcSet?: string;
    alt: string;
    note: string;
  };
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
    sections: [
      {
        title: "A citation needs to support the answer",
        body: "A relevant passage is only the start. A cited source has to be one the system actually retrieved, and it has to support the claim being made. I treated those as two separate checks in the tutor.",
      },
      {
        title: "Retrieval and source checks",
        body: "I combined BGE-M3 dense retrieval and BM25 keyword search using reciprocal rank fusion, with the licensed corpus in PostgreSQL/pgvector. One checker rejects sources outside the retrieved set. A second checks whether a source supports the answer’s claim.",
      },
      {
        title: "Beyond the text response",
        body: "I built the voice path with streaming speech and a multi-model gateway with fallbacks, and integrated Sarvam speech services and Eka Care tools. My work also covered timed exams, spaced reviews, a Weakness Map, adaptive planning and offline packs.",
      },
      {
        title: "Evaluation and releases",
        body: "I used retrieval and answer evaluation, automated tests, red-team rounds and physician review to work through quality and safety issues. I also handled releases and hotfixes through GitHub Actions and worked on moving production from Supabase to AWS.",
      },
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
    sections: [
      {
        title: "One explanation, one version of the code",
        body: "An assistant can read several files while explaining a repository. If those reads come from different commits, the explanation can connect code that never existed together. I resolve the revision first and keep subsequent reads tied to it.",
      },
      {
        title: "Tools for following the code",
        body: "I built Python tools for browsing repository files, inspecting imports and generating architecture diagrams. The server is read-only and runs locally through an MCP-compatible AI client; the client supplies the assistant, while the server supplies repository context.",
      },
      {
        title: "From a file to a claim",
        body: "Keeping a file and commit together makes the source easier to check. The source-check exercise on this site lets you try that reasoning: match the retrieved filename and revision, then decide what the code supports.",
      },
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
    sections: [
      {
        title: "The numbers can look right and still be wrong",
        body: "Textract can be confident about a price that does not add up with the rest of a bill row. That makes the confidence score a poor final check for a shop owner who needs to trust the extracted numbers.",
      },
      {
        title: "My part of the pipeline",
        body: "I built the ingestion side of the team project: direct photo uploads to S3, extraction with Textract and normalisation into structured rows. This gives the rest of the bill-checking flow usable data rather than an image or raw OCR text.",
      },
      {
        title: "Checking the arithmetic",
        body: "I added a check against each row’s arithmetic after normalisation. It catches inconsistent prices even when the OCR confidence is high, before the extracted bill moves further through the workflow.",
      },
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
    sections: [
      {
        title: "Making a change in the data testable",
        body: "A drift detector needs a way to be checked before a real distribution change arrives. I wanted a known change in the input so we could exercise the detection path on purpose.",
      },
      {
        title: "The ML work I owned",
        body: "I preprocessed the PaySim fraud dataset, trained an Isolation Forest anomaly model, added model storage in MinIO and built KS-test drift detection. Those components sit inside the team’s larger Temporal pipeline for retraining, evaluation and deployment.",
      },
      {
        title: "Injecting drift",
        body: "I built a helper that changes the input data so the detector can be tested against a known disturbance. That gives the team a concrete way to try the drift path instead of waiting for live data to change.",
      },
    ],
    lesson:
      "I used injected drift to test the detection path with a known change in the data, rather than waiting for one to happen.",
  },
  {
    id: "galilearn",
    name: "Galilearn",
    preview: {
      src: "/projects/galilearn-prototype.jpg",
      srcSet:
        "/projects/galilearn-prototype-480.webp 480w, /projects/galilearn-prototype-960.webp 960w, /projects/galilearn-prototype-1440.webp 1440w",
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
    sections: [
      {
        title: "Seeing what to learn first",
        body: "ML topics depend on one another, but a list of lessons can hide those connections. I’m using a map of planets to make the concept order visible and connect each topic to its lessons, quizzes and spaced reviews.",
      },
      {
        title: "The interface and the learning backend",
        body: "I’m building the interface in React and TypeScript, with Cloudflare Workers and D1 behind the learning app. The map is meant to be useful navigation: a way to choose a topic and understand where it fits.",
      },
      {
        title: "Grading stays on the server",
        body: "The browser sends the learner’s answer and displays the result. Answer keys and grading stay on the server so changing browser state is not enough to award progress.",
      },
      {
        title: "Still in development",
        body: "The preview comes from my coded design prototype. I’m continuing to build the learning product around the concept map, lessons and review flow.",
      },
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
      srcSet:
        "/projects/tiny-town-day-480.webp 480w, /projects/tiny-town-day-960.webp 960w, /projects/tiny-town-day-1440.webp 1440w",
      nightSrcSet:
        "/projects/tiny-town-night-480.webp 480w, /projects/tiny-town-night-960.webp 960w, /projects/tiny-town-night-1440.webp 1440w",
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
    sections: [
      {
        title: "A day in a small town",
        body: "Thirty residents eat, work, rest, socialise and wander through a pixel village. I wanted someone visiting the demo to be able to follow one resident and inspect a day, rather than just watch the whole town from a distance.",
      },
      {
        title: "Simulation and replay have different jobs",
        body: "I built the simulation in Python and the replay interface in TypeScript with Phaser. The simulation records what happened; the interface lets you move through that record and follow a resident.",
      },
      {
        title: "A demo you can explore straight away",
        body: "The public demo replays a saved run with mock decisions. You can explore the same day without starting a model or waiting for a fresh simulation, while the Python simulation remains separate from the browser replay.",
      },
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
