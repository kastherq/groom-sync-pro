import { createFileRoute } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import { PageHeader, EmptyState, SectionCard } from "@/components/gs/primitives";
import { PetActionCard } from "@/components/gs/pet-action-card";
import { useGroom } from "@/lib/groomsync-store";
import { TODAY } from "@/lib/groomsync-data";

export const Route = createFileRoute("/app/mis-mascotas")({
  head: () => ({
    meta: [
      { title: "Mascotas del día — GroomSync" },
      { name: "description", content: "Todas las mascotas del día: asígnate las libres y actualiza estados." },
      { property: "og:title", content: "Mascotas del día — GroomSync" },
      { property: "og:description", content: "Cambia el estado de cada mascota con un solo toque." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MisMascotasPage,
});

function MisMascotasPage() {
  const { appointments, currentEmployeeId } = useGroom();
  const today = appointments
    .filter((a) => a.date === TODAY && a.status !== "cancelada")
    .sort((a, b) => a.time.localeCompare(b.time));
  const free = today.filter((a) => !a.employeeId);
  const mine = today.filter((a) => a.employeeId === currentEmployeeId);
  const others = today.filter((a) => a.employeeId && a.employeeId !== currentEmployeeId);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Mascotas del día"
        subtitle={`${free.length} sin asignar · ${mine.length} tuyas · ${others.length} de compañeros`}
      />

      {today.length === 0 ? (
        <EmptyState icon={PawPrint} title="Sin mascotas hoy" description="Recepción todavía no registró citas para hoy." />
      ) : (
        <>
          <SectionCard title="Disponibles para asignar" description="El primero que la tome queda como responsable">
            {free.length === 0 ? (
              <p className="type-caption">Todas las mascotas de hoy ya tienen responsable.</p>
            ) : (
              <div className="grid gap-3 xl:grid-cols-2">
                {free.map((a) => (
                  <PetActionCard key={a.id} appt={a} />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Mis mascotas" description="Las que te asignaste">
            {mine.length === 0 ? (
              <p className="type-caption">Todavía no te asignaste ninguna mascota.</p>
            ) : (
              <div className="grid gap-3 xl:grid-cols-2">
                {mine.map((a) => (
                  <PetActionCard key={a.id} appt={a} />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Mascotas de compañeros" description="Puedes ver y actualizar el estado de todas">
            {others.length === 0 ? (
              <p className="type-caption">Ningún compañero tiene mascotas asignadas hoy.</p>
            ) : (
              <div className="grid gap-3 xl:grid-cols-2">
                {others.map((a) => (
                  <PetActionCard key={a.id} appt={a} />
                ))}
              </div>
            )}
          </SectionCard>
        </>
      )}
    </div>
  );
}
