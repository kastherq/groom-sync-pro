import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/gs/app-shell";
import { GroomProvider, readRole, readUserName } from "@/lib/groomsync-store";
import type { Role } from "@/lib/groomsync-data";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<{ role: Role; name: string } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const role = readRole();
    if (!role) {
      navigate({ to: "/login" });
      setChecked(true);
      return;
    }
    setSession({ role, name: readUserName() || "Usuario GroomSync" });
    setChecked(true);
  }, [navigate]);

  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <p className="text-sm text-muted-foreground">
          {checked ? "Redirigiendo al inicio de sesión…" : "Cargando GroomSync…"}
        </p>
      </div>
    );
  }

  return (
    <GroomProvider role={session.role} userName={session.name}>
      <AppShell>
        <Outlet />
      </AppShell>
    </GroomProvider>
  );
}
