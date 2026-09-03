import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — GroomSync" },
      { name: "description", content: "Accede a GroomSync con las credenciales entregadas por tu peluquería." },
      { property: "og:title", content: "Iniciar sesión — GroomSync" },
      { property: "og:description", content: "Acceso al panel de gestión de tu peluquería canina." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <Outlet />,
});
