import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { PageHeader, SectionCard, EmptyState, StatCard } from "@/components/gs/primitives";
import { PetActionCard } from "@/components/gs/pet-action-card";
import { ApptStateBadge } from "@/components/gs/badges";
import { useGroom } from "@/lib/groomsync-store";
import { findPet, findService, TODAY } from "@/lib/groomsync-data";

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
  const { appointments, currentEmployeeId, userName } = useGroom();
  const mine = appointments
    .filter((a) => a.employeeId === currentEmployeeId && a.date === TODAY && a.status !== "cancelada")
    .sort((a, b) => a.time.localeCompare(b.time));
  const pending = mine.filter((a) => a.petState !== "recogida" && a.petState !== "lista");

  return (
    <div className="space-y-5">
      <PageHeader title={`Hola, ${userName.split(" ")[0]}`} subtitle="Tus citas de hoy, en orden de entrada" />

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Asignadas hoy" value={mine.length} />
        <StatCard label="Pendientes" value={pending.length} tone="warning" />
        <StatCard label="Listas" value={mine.filter((a) => a.petState === "lista").length} tone="success" />
      </div>

      {mine.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Sin citas hoy" description="No tienes mascotas asignadas para hoy." />
      ) : (
        <>
          <div className="grid gap-3 xl:grid-cols-2">
            {pending.map((a) => (
              <PetActionCard key={a.id} appt={a} />
            ))}
          </div>

          <SectionCard title="Historial del día" description="Todas tus citas de hoy">
            <ul className="divide-y divide-border">
              {mine.map((a) => (
                <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {a.time} · {findPet(a.petId)?.photo} {findPet(a.petId)?.name}
                    </p>
                    <p className="type-caption truncate">{findService(a.serviceId)?.name}</p>
                  </div>
                  <ApptStateBadge state={a.status} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </>
      )}
    </div>
  );
}
