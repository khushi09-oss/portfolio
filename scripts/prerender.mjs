import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { createElement } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { createServer } from "vite";

process.env.NODE_ENV = "production";

const origin = new URL(
  process.env.SITE_URL ||
    "https://khushi-sahni-workbench.khushipranav2603.chatgpt.site",
).origin;
const template = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
const escape = (value) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const vite = await createServer({
  mode: "production",
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
  const { projects } = await vite.ssrLoadModule("/src/data.ts");
  const ids = projects.map((project) => project.id);
  if (
    new Set(ids).size !== ids.length ||
    ids.some((id) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))
  )
    throw new Error(
      "Project IDs must be unique lowercase slugs before generating pages.",
    );
  const { pageMetadata } = await vite.ssrLoadModule("/src/page-metadata.ts");
  const paths = [
    "/",
    "/about",
    "/contact",
    "/lab",
    "/404",
    ...projects.flatMap((p) => [`/work/${p.id}`, `/project/${p.id}`]),
  ];
  for (const path of paths) {
    const { prelude } = await prerenderToNodeStream(
      createElement(App, { initialUrl: path }),
      // Static files must not need React's scripts to reveal large Suspense segments.
      {
        progressiveChunkSize: Number.MAX_SAFE_INTEGER,
        onError(error) { throw error; },
      },
    );
    let body = "";
    for await (const chunk of prelude) body += chunk.toString();
    const meta = pageMetadata(path);
    const url = new URL(meta.path, origin).href;
    const tags = `<link rel="canonical" href="${escape(url)}" />\n<meta property="og:type" content="website" />\n<meta property="og:title" content="${escape(meta.title)}" />\n<meta property="og:description" content="${escape(meta.description)}" />\n<meta property="og:url" content="${escape(url)}" />\n<meta property="og:image" content="${new URL(meta.image, origin).href}" />\n<meta name="twitter:card" content="summary_large_image" />`;
    const html = template
      .replace(/<title>.*?<\/title>/s, `<title>${escape(meta.title)}</title>`)
      .replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
        `<meta name="description" content="${escape(meta.description)}" />`,
      )
      .replace(
        "</head>",
        `${tags}${meta.noindex ? '\n<meta name="robots" content="noindex" />' : ""}\n</head>`,
      )
      .replace(
        '<div id="root"></div>',
        `<div id="root" data-prerendered="true" data-page="${path}">${body}</div>`,
      );
    const directory = new URL(
      `../dist${path === "/" ? "/" : path + "/"}`,
      import.meta.url,
    );
    await mkdir(directory, { recursive: true });
    await writeFile(new URL("index.html", directory), html);
    if (path !== "/")
      await writeFile(new URL(`../dist${path}.html`, import.meta.url), html);
  }
  console.log(`Generated ${paths.length} static pages with project metadata.`);
  const privateProjects = JSON.parse(
    vite.config.define["import.meta.env.VITE_PRIVATE_PROJECT_PREVIEWS"],
  )
    .split(",")
    .filter(Boolean);
  for (const id of privateProjects) {
    if (!ids.includes(id))
      throw new Error("A private preview must match a project ID.");
    const directory = new URL(
      `../dist/private-previews/${id}/`,
      import.meta.url,
    );
    await mkdir(directory, { recursive: true });
    await copyFile(
      new URL(`../.private-previews/${id}/document.json`, import.meta.url),
      new URL("document.json", directory),
    );
  }
} finally {
  await vite.close();
}
