import { createFileRoute } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/gs/primitives";
import { PetActionCard } from "@/components/gs/pet-action-card";
import { useGroom } from "@/lib/groomsync-store";
import { TODAY } from "@/lib/groomsync-data";

export const Route = createFileRoute("/app/mis-mascotas")({
  head: () => ({
    meta: [
      { title: "Mis mascotas — GroomSync" },
      { name: "description", content: "Mascotas asignadas al peluquero con su estado y siguiente acción." },
      { property: "og:title", content: "Mis mascotas — GroomSync" },
      { property: "og:description", content: "Cambia el estado de cada mascota con un solo toque." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MisMascotasPage,
});

function MisMascotasPage() {
  const { appointments, currentEmployeeId } = useGroom();
  const mine = appointments.filter(
    (a) => a.employeeId === currentEmployeeId && a.date === TODAY && a.status !== "cancelada",
  );

  return (
    <div className="space-y-5">
      <PageHeader title="Mis mascotas" subtitle={`${mine.length} mascotas asignadas hoy`} />
      {mine.length === 0 ? (
        <EmptyState icon={PawPrint} title="Sin mascotas asignadas" description="Recepción todavía no te asignó mascotas hoy." />
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {mine.map((a) => (
            <PetActionCard key={a.id} appt={a} />
          ))}
        </div>
      )}
    </div>
  );
}
