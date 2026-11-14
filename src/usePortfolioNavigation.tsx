import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { homeHref, parseRoute, routeKey } from "./routes";

type Position = { key: string; y: number; focus?: string };
function savedPosition(state: unknown, key: string): Position | undefined {
  if (!state || typeof state !== "object" || !("portfolioPosition" in state))
    return;
  const p = state.portfolioPosition;
  if (
    !p ||
    typeof p !== "object" ||
    !("key" in p) ||
    !("y" in p) ||
    p.key !== key ||
    typeof p.y !== "number" ||
    !Number.isFinite(p.y) ||
    p.y < 0
  )
    return;
  return {
    key,
    y: p.y,
    focus: "focus" in p && typeof p.focus === "string" ? p.focus : undefined,
  };
}

export function usePortfolioNavigation() {
  const [state, setState] = useState(() => {
    const hash = location.hash,
      route = parseRoute(hash);
    const project = "project" in route ? route.project : undefined;
    return {
      hash,
      position: savedPosition(history.state, routeKey(route)),
      selectionOnly: false,
      notebookId: project?.id || "recollia",
      visited: new Set<string>(
        route.name === "project" ? [route.project.id] : [],
      ),
    };
  });
  const positions = useRef(new Map<string, Position>());
  const returning = useRef(false);
  const route = parseRoute(state.hash);
  useEffect(() => {
    const oldRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    function navigate() {
      const hash = location.hash,
        next = parseRoute(hash),
        key = routeKey(next);
      const position = returning.current
        ? positions.current.get(key) || savedPosition(history.state, key)
        : savedPosition(history.state, key);
      returning.current = false;
      setState((previous) => {
        const prior = parseRoute(previous.hash);
        const sameArea =
          (prior.name === "home" && next.name === "home") ||
          (prior.name === "work" && next.name === "work");
        return {
          hash,
          position,
          selectionOnly: !position && sameArea,
          notebookId: "project" in next ? next.project.id : previous.notebookId,
          visited:
            next.name === "project"
              ? new Set(previous.visited).add(next.project.id)
              : previous.visited,
        };
      });
    }
    window.addEventListener("hashchange", navigate);
    return () => {
      history.scrollRestoration = oldRestoration;
      window.removeEventListener("hashchange", navigate);
    };
  }, []);
  function remember(focus?: string) {
    const position = { key: routeKey(route), y: scrollY, focus };
    positions.current.set(position.key, position);
    history.replaceState({ ...history.state, portfolioPosition: position }, "");
  }
  function onLinkCapture(event: MouseEvent<HTMLElement>) {
    if (
      event.button ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>(
      "a[href]",
    );
    const href = anchor?.getAttribute("href");
    if (!href?.startsWith("#") || anchor?.target === "_blank") return;
    if (routeKey(parseRoute(href)) === routeKey(route)) {
      event.preventDefault();
      returning.current = false;
      const heading = document.querySelector<HTMLElement>(
        route.name === "work" ? ".notebook-spread h2" : "main h1",
      );
      heading?.focus({ preventScroll: true });
      if (route.name === "work")
        heading?.scrollIntoView({ block: "nearest", behavior: "instant" });
      else window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    remember(href);
    returning.current = anchor?.hasAttribute("data-return") || false;
  }
  function selectGalleryPage(page: number) {
    remember();
    location.hash = homeHref(page);
  }
  function discover(id: string) {
    setState((previous) => ({
      ...previous,
      visited: new Set(previous.visited).add(id),
    }));
  }
  return { ...state, route, onLinkCapture, selectGalleryPage, discover };
}

export function FocusPage({
  hash,
  position,
  selectionOnly,
  intro = false,
  children,
}: {
  hash: string;
  position?: Position;
  selectionOnly: boolean;
  intro?: boolean;
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    const heading = document.querySelector<HTMLElement>("main h1");
    document.title = `${heading?.innerText.replace(/\s+/g, " ") || "Notebook"} | Khushi Sahni`;
    if (position) {
      const target = [
        ...document.querySelectorAll<HTMLAnchorElement>("main a[href]"),
      ].find((a) => a.getAttribute("href") === position.focus);
      (target || heading)?.focus({ preventScroll: true });
      window.scrollTo({ top: position.y, behavior: "instant" });
    } else if (intro) {
      const title = document.querySelector<HTMLElement>("#introduction h2");
      title?.focus({ preventScroll: true });
      document
        .getElementById("introduction")
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    } else if (selectionOnly) {
      const title = document.querySelector<HTMLElement>(".notebook-spread h2");
      title?.focus({ preventScroll: true });
      title?.scrollIntoView({ block: "nearest", behavior: "instant" });
    } else {
      heading?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [hash, position, selectionOnly, intro]);
  return children;
}
