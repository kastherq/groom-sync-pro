import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PawPrint, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, EmptyState } from "@/components/gs/primitives";
import { PetStateBadge } from "@/components/gs/badges";
import { NewPetDialog } from "@/components/gs/appointment-dialog";
import { useGroom } from "@/lib/groomsync-store";

export const Route = createFileRoute("/app/mascotas/")({
  head: () => ({
    meta: [
      { title: "Mascotas — GroomSync" },
      { name: "description", content: "Todas las mascotas de la sucursal con su estado actual y última visita." },
      { property: "og:title", content: "Mascotas — GroomSync" },
      { property: "og:description", content: "Consulta raza, dueño, estado actual e historial de cada mascota." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MascotasPage,
});

function MascotasPage() {
  const { pets, customers, appointments } = useGroom();
  const [query, setQuery] = useState("");
  const rows = pets.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.breed.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Mascotas"
        subtitle={`${pets.length} mascotas registradas`}
        actions={
          <NewPetDialog
            trigger={
              <Button className="h-10">
                <PawPrint className="mr-1.5 h-4 w-4" /> Nueva mascota
              </Button>
            }
          />
        }
      />

      <div className="surface-card p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-10 pl-9"
            placeholder="Buscar por nombre o raza"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={PawPrint} title="Sin resultados" description="No encontramos mascotas con esa búsqueda." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => {
            const active = appointments.find((a) => a.petId === p.id && a.petState !== "recogida" && a.status !== "cancelada");
            return (
              <Link
                key={p.id}
                to="/app/mascotas/$petId"
                params={{ petId: p.id }}
                className="surface-card grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 p-4 transition-shadow hover:shadow-elevated"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-3xl">
                  {p.photo}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display font-bold text-foreground">{p.name}</p>
                  <p className="type-caption truncate">
                    {p.breed} · {customers.find((c) => c.id === p.ownerId)?.name}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {active ? <PetStateBadge state={active.petState} size="sm" /> : <span className="type-caption">Sin cita activa</span>}
                    <span className="type-caption">Últ. visita {p.lastVisit}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
