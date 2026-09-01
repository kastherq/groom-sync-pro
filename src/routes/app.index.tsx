import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { HOME_BY_ROLE } from "@/components/gs/nav";
import { useGroom } from "@/lib/groomsync-store";

export const Route = createFileRoute("/app/")({
  component: AppIndex,
});

function AppIndex() {
  const { role } = useGroom();
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: HOME_BY_ROLE[role], replace: true });
  }, [role, navigate]);

  return <p className="text-sm text-muted-foreground">Cargando tu espacio de trabajo…</p>;
}
