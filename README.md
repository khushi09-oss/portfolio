# Portfolio notebook

A personal ML engineering portfolio with an optional introduction, an illustrated project notebook, shareable project pages, and a browser-based source-checking lab.

## Run

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Scroll through the project gallery, open a project directly, or choose **Skip introduction** to open the notebook. The optional short introduction sits below the gallery. Select a project tab, then **Open the full project** for its contribution, design decisions and available code/demo links. Work and Contact are always reachable. The separate **Lab** contains the optional source-checking task; a wrong commit or an unretrieved file is rejected.

The first `dev` or `build` command downloads Google's versioned hand model and verifies its SHA-256. The build copies the installed MediaPipe runtime into ignored local assets. Fonts, the model, and runtime assets are served from the same origin; no camera frames are uploaded. Network access is needed for the initial model download, not for subsequent cached builds.

## What runs

- React and TypeScript render the introduction, six-project notebook, dedicated project pages, About/Contact pages, day/night theme, and lab decision history.
- Three.js renders a procedural machine. It redraws when its state or size changes, pauses offscreen, and respects reduced motion. Text controls remain usable if WebGL is unavailable.
- The companion grows from a seed into a learner and guide as distinct projects are explored during a visit. Revisiting the same project does not increase progress. It does not train a model.
- The co-op bridge pairs one visitor with the local companion, not a remote player. Two tiles require the retrieved file at the right revision; the third requires a claim supported by the local fixture. Day/night mode also changes the illustrated scene, including rain and lamplight.
- Hand tracking runs in a worker after camera opt-in. Pinch and move sideways to change stages. Closing the panel, leaving the lab, hiding the page, or cancelling startup stops camera tracks. Mouse, touch, and keyboard controls remain available.

The machine uses a small local evidence fixture. It does not call an LLM, connect to private repositories, or run the actual projects shown in the portfolio. Project descriptions distinguish employer contributions, team projects, experiments, and work in development.

Tiny Town's previews are captures of its actual interface with a staged mock replay, including day and night views. Galilearn's preview is captured from its coded design prototype and is labelled as a prototype. The portfolio does not ship either project's source code.

## Navigation and layout

On larger screens, scrolling gathers the six project cards from a gallery into a rotating ring. Cards open their project pages and lift on hover or keyboard focus. The motion uses transforms updated only on scroll/resize; there is no continuous animation loop, scroll interception or extra animation dependency. Phones and reduced-motion mode use a static grid. Work and Contact stay available in the sticky header. Dark mode uses charcoal surfaces with muted rose accents.

The introduction opens into one notebook, with all six project choices visible on phones. `#work/<project-id>` selects a spread, `#project/<project-id>` opens its full page, and `#about`, `#contact`, and `#lab` open the other pages. Browser Back/Forward and reload preserve the URL-selected project. Each project has a direct return to its notebook spread. Unknown pages show a recovery link. The introduction restarts only when explicitly opened or replayed.

The existing hash-based setup keeps deep links compatible with static hosting without server rewrites or a routing dependency. Typed project data is shared by notebook spreads and project pages. Original SVG illustrations use the same cream/graphite/rose tokens in both themes; actual Tiny Town and Galilearn images remain the previews for those projects. The lab and its 3D code load separately from the entry pages, and camera assets remain opt-in. Project-specific interactive case studies are a later refinement.

## Verify

```sh
npm run check
npx playwright install chromium --only-shell
npm run test:browser
npm audit
```

On Linux, install browser system dependencies with `npx playwright install chromium --with-deps --only-shell`.

Verification covers provenance checks, pinch input validation, introduction completion/skip/replay, notebook history and reload, project pages, both themes, automated accessibility, layouts from 320–1440px, permission denial, real model startup on a synthetic camera, and camera cleanup including late permission resolution. Real-hand accuracy, device-specific camera behavior, and Safari/Firefox have not been verified.

To test a production build, run `npm run build` and `npm run preview -- --port 5179` in a separate terminal, then set `PORTFOLIO_BASE_URL=http://127.0.0.1:5179` when running browser tests.

## Edit

- Project content: `src/data.ts`
- Navigation and shared shell: `src/App.tsx`
- Introduction and notebook: `src/Notebook.tsx`, `src/notebook.css`
- Project pages and original SVG illustrations: `src/ProjectPage.tsx`, `src/ProjectArtwork.tsx`
- Visual tokens and responsive layouts: `src/styles.css`
- Lab task and history: `src/Lab.tsx`, `src/evidence.ts`
- Procedural model: `src/machine-scene.ts`
- Camera lifecycle and inference: `src/HandControls.tsx`, `src/hand.worker.ts`

The site builds to `dist/` for static hosting over HTTPS. No server, API keys, accounts, or analytics are required. Hosting-provider metadata, local planning, generated mockups, debug reports, build output, and downloaded runtime assets are excluded from Git. Required font and library notices ship in `public/licenses/`.
