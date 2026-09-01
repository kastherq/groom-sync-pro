import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard, EmptyState } from "@/components/gs/primitives";
import { ApptStateBadge, PetStateBadge, PetStateTimeline } from "@/components/gs/badges";
import { PetActionCard } from "@/components/gs/pet-action-card";
import { useGroom } from "@/lib/groomsync-store";
import { findService } from "@/lib/groomsync-data";

export const Route = createFileRoute("/app/mascotas/$petId")({
  head: () => ({
    meta: [
      { title: "Detalle de mascota — GroomSync" },
      { name: "description", content: "Ficha de la mascota: datos, observaciones, estado actual e historial." },
      { property: "og:title", content: "Detalle de mascota — GroomSync" },
      { property: "og:description", content: "Estado del servicio en tiempo real y notas importantes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PetDetail,
});

function PetDetail() {
  const { petId } = Route.useParams();
  const { pets, customers, appointments, employees, role } = useGroom();
  const pet = pets.find((p) => p.id === petId);

  if (!pet) {
    return (
      <EmptyState
        icon={PawPrint}
        title="Mascota no encontrada"
        description="Esta mascota no existe o fue eliminada."
        action={
          <Button asChild variant="outline">
            <Link to="/app/mascotas">Volver a mascotas</Link>
          </Button>
        }
      />
    );
  }

  const owner = customers.find((c) => c.id === pet.ownerId);
  const history = appointments.filter((a) => a.petId === pet.id);
  const active = history.find((a) => a.petState !== "recogida" && a.status !== "cancelada");
  const backTo = role === "peluquero" ? "/app/mis-mascotas" : "/app/mascotas";

  return (
    <div className="space-y-5">
      <Link to={backTo} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>

      <PageHeader
        title={pet.name}
        subtitle={`${pet.breed} · ${pet.sex} · ${pet.age}`}
        actions={active ? <PetStateBadge state={active.petState} size="lg" /> : undefined}
      />

      {active && (
        <SectionCard title="Estado del servicio" description={`Cita de hoy a las ${active.time}`}>
          <PetStateTimeline state={active.petState} />
        </SectionCard>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Ficha" className="lg:col-span-1">
          <div className="mb-4 grid place-items-center rounded-2xl bg-primary-soft py-6 text-6xl">{pet.photo}</div>
          <dl className="space-y-2.5 text-sm">
            {[
              ["Nombre", pet.name],
              ["Raza", pet.breed],
              ["Sexo", pet.sex],
              ["Peso", pet.weight],
              ["Edad", pet.age],
              ["Dueño", owner?.name ?? "—"],
              ["Teléfono", owner?.phone ?? "—"],
              ["Última visita", pet.lastVisit],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
                <dt className="type-caption">{k}</dt>
                <dd className="truncate font-semibold text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </SectionCard>

        <div className="space-y-4 lg:col-span-2">
          <SectionCard title="Observaciones importantes">
            <p className="rounded-xl border border-state-issue-foreground/20 bg-state-issue/50 p-3 text-sm text-state-issue-foreground">
              {pet.notes || "Sin observaciones registradas."}
            </p>
          </SectionCard>

          {active && (
            <div>
              <h2 className="eyebrow mb-2.5 text-muted-foreground">Actualizar estado</h2>
              <PetActionCard appt={active} compact />
            </div>
          )}

          <SectionCard title="Historial" description={`${history.length} citas`}>
            <ul className="divide-y divide-border">
              {history.map((a) => (
                <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {a.date} · {a.time} · {findService(a.serviceId)?.name}
                    </p>
                    <p className="type-caption truncate">
                      {employees.find((e) => e.id === a.employeeId)?.name} · ${a.price}
                    </p>
                  </div>
                  <ApptStateBadge state={a.status} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
