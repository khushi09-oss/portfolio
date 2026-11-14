import { parseRoute } from "./routes";

export function pageMetadata(href: string) {
  const route = parseRoute(href);
  const project = "project" in route ? route.project : undefined;
  let name = "Khushi Sahni | ML engineer";
  if (project) name = project.name;
  else if (route.name === "about") name = "About Khushi";
  else if (route.name === "contact") name = "Get in touch";
  else if (route.name === "lab") name = "Try a source check";
  else if (route.name === "not-found") name = "Page not found";
  return {
    title: route.name === "home" ? name : `${name} | Khushi Sahni`,
    description:
      project?.overview ??
      "I'm Khushi, an ML engineer building AI products across models, backend systems and interfaces. Explore my projects or get in touch about a role or freelance work.",
    path: project
      ? `/project/${project.id}`
      : route.name === "home"
        ? "/"
        : route.name === "not-found"
          ? "/404"
          : `/${route.name}`,
    image: "/social/portfolio.png",
    noindex: route.name === "not-found",
  };
}
