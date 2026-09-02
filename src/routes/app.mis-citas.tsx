import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { PageHeader, SectionCard, EmptyState, StatCard } from "@/components/gs/primitives";
import { PetActionCard } from "@/components/gs/pet-action-card";
import { ApptStateBadge } from "@/components/gs/badges";
import { useGroom } from "@/lib/groomsync-store";
import { findPet, findService, TODAY } from "@/lib/groomsync-data";
import { PetStateBadge } from "@/components/gs/badges";

export const Route = createFileRoute("/app/mis-citas")({
  head: () => ({
    meta: [
      { title: "Mis citas — GroomSync" },
      { name: "description", content: "Las citas asignadas al peluquero para el día de hoy." },
      { property: "og:title", content: "Mis citas — GroomSync" },
      { property: "og:description", content: "Vista simple para atender y actualizar el estado de cada mascota." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MisCitasPage,
});

function MisCitasPage() {
  const { appointments, currentEmployeeId, userName, employees } = useGroom();
  const today = appointments
    .filter((a) => a.date === TODAY && a.status !== "cancelada")
    .sort((a, b) => a.time.localeCompare(b.time));
  const mine = today.filter((a) => a.employeeId === currentEmployeeId);
  const free = today.filter((a) => !a.employeeId);
  const pending = mine.filter((a) => a.petState !== "recogida" && a.petState !== "lista");

  return (
    <div className="space-y-5">
      <PageHeader title={`Hola, ${userName.split(" ")[0]}`} subtitle="Tus citas de hoy, en orden de entrada" />

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Mías hoy" value={mine.length} />
        <StatCard label="Pendientes" value={pending.length} tone="warning" />
        <StatCard label="Listas" value={mine.filter((a) => a.petState === "lista").length} tone="success" />
      </div>

      {free.length > 0 && (
        <SectionCard title="Sin asignar" description="Tómalas para quedar como responsable">
          <div className="grid gap-3 xl:grid-cols-2">
            {free.map((a) => (
              <PetActionCard key={a.id} appt={a} />
            ))}
          </div>
        </SectionCard>
      )}

      {mine.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Sin citas propias" description="Asígnate una mascota de la lista de hoy." />
      ) : (
        <>
          <div className="grid gap-3 xl:grid-cols-2">
            {pending.map((a) => (
              <PetActionCard key={a.id} appt={a} />
            ))}
          </div>

          <SectionCard title="Agenda del día del equipo" description="Todas las citas de hoy, de todo el equipo">
            <ul className="divide-y divide-border">
              {today.map((a) => (
                <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {a.time} · {findPet(a.petId)?.photo} {findPet(a.petId)?.name}
                    </p>
                    <p className="type-caption truncate">
                      {findService(a.serviceId)?.name} ·{" "}
                      {a.employeeId
                        ? a.employeeId === currentEmployeeId
                          ? "Tú"
                          : (employees.find((e) => e.id === a.employeeId)?.name ?? "—")
                        : "Sin asignar"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PetStateBadge state={a.petState} size="sm" />
                    <ApptStateBadge state={a.status} />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </>
      )}
    </div>
  );
}
