import { projects, type Project } from "./data";

export type Route =
  | { name: "home"; page: number; intro: boolean }
  | { name: "work"; project: Project }
  | { name: "project"; project: Project; fromGallery: boolean; page: number }
  | { name: "lab"; fromProject?: string; fromGallery: boolean; page: number }
  | { name: "about" | "contact" | "not-found" };

export function homeHref(page = 0) {
  return page > 0 ? `#home?page=${page + 1}` : "#home";
}
export function projectHref(id: string, gallery?: { page: number }) {
  return `#project/${encodeURIComponent(id)}${gallery ? `?from=gallery&page=${gallery.page + 1}` : ""}`;
}
export function labHref(id: string, gallery?: { page: number }) {
  return `#lab?from=${encodeURIComponent(id)}${gallery ? `&gallery=1&page=${gallery.page + 1}` : ""}`;
}

export function parseRoute(hash: string): Route {
  const [path, query] = hash.replace(/^#/, "").split("?");
  const [name, rawId, ...extra] = path.split("/");
  if (extra.length) return { name: "not-found" };
  let id: string | undefined;
  try {
    id = rawId === undefined ? undefined : decodeURIComponent(rawId);
  } catch {
    return { name: "not-found" };
  }
  const params = new URLSearchParams(query);
  const requested = Number(params.get("page") || "1");
  const page =
    Number.isSafeInteger(requested) && requested > 0 ? requested - 1 : 0;
  if (name === "work" || name === "project") {
    const project = projects.find((item) => item.id === (id || "recollia"));
    if (!project || (name === "project" && !id)) return { name: "not-found" };
    return name === "work"
      ? { name, project }
      : { name, project, page, fromGallery: params.get("from") === "gallery" };
  }
  if (id) return { name: "not-found" };
  if (!name || name === "home")
    return { name: "home", page, intro: params.get("intro") === "1" };
  if (name === "lab")
    return {
      name,
      fromProject: projects.find((item) => item.id === params.get("from"))?.id,
      fromGallery: params.get("gallery") === "1",
      page,
    };
  if (name === "about" || name === "contact") return { name };
  return { name: "not-found" };
}

export function routeKey(route: Route) {
  if (route.name === "home")
    return `home:${route.page}:${route.intro ? "intro" : "gallery"}`;
  if (route.name === "work") return `work:${route.project.id}`;
  if (route.name === "project")
    return `project:${route.project.id}:${route.fromGallery ? route.page : "work"}`;
  if (route.name === "lab")
    return `lab:${route.fromProject || ""}:${route.fromGallery ? route.page : "work"}`;
  return route.name;
}
