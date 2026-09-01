import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, SectionCard } from "@/components/gs/primitives";
import { ApptStateBadge, PetStateBadge } from "@/components/gs/badges";
import { NewAppointmentDialog } from "@/components/gs/appointment-dialog";
import { useGroom } from "@/lib/groomsync-store";
import { findCustomer, findPet, findService, TODAY } from "@/lib/groomsync-data";

export const Route = createFileRoute("/app/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda — GroomSync" },
      { name: "description", content: "Calendario diario y semanal de citas con peluquero, servicio y estado." },
      { property: "og:title", content: "Agenda — GroomSync" },
      { property: "og:description", content: "Visualiza la carga de trabajo por día y por semana." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgendaPage,
});

const WEEK = [
  { date: "2026-09-01", label: "Lun 1" },
  { date: "2026-09-02", label: "Mar 2" },
  { date: "2026-09-03", label: "Mié 3" },
  { date: "2026-09-04", label: "Jue 4" },
  { date: "2026-09-05", label: "Vie 5" },
];

const HOURS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "14:00", "15:00", "16:00"];

function AgendaPage() {
  const { appointments, employees } = useGroom();
  const [view, setView] = useState("dia");

  const dayAppts = appointments.filter((a) => a.date === TODAY).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Agenda"
        subtitle="Lunes 1 de septiembre, 2026 · Costa del Este"
        actions={
          <>
            <Tabs value={view} onValueChange={setView}>
              <TabsList>
                <TabsTrigger value="dia">Día</TabsTrigger>
                <TabsTrigger value="semana">Semana</TabsTrigger>
              </TabsList>
            </Tabs>
            <NewAppointmentDialog
              trigger={
                <Button className="h-10">
                  <Plus className="mr-1.5 h-4 w-4" /> Nueva cita
                </Button>
              }
            />
          </>
        }
      />

      {view === "dia" ? (
        <SectionCard title="Vista día" description="Franjas de 30 minutos">
          <ul className="space-y-2">
            {HOURS.map((hour) => {
              const slot = dayAppts.filter((a) => a.time === hour);
              return (
                <li key={hour} className="grid grid-cols-[64px_minmax(0,1fr)] gap-3">
                  <span className="pt-2 text-xs font-semibold text-muted-foreground">{hour}</span>
                  <div className="min-w-0 space-y-2 border-l border-border pl-3">
                    {slot.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                        Disponible
                      </div>
                    ) : (
                      slot.map((a) => (
                        <div
                          key={a.id}
                          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-primary/20 bg-primary-soft/70 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground">
                              {findPet(a.petId)?.photo} {findPet(a.petId)?.name} · {findService(a.serviceId)?.name}
                            </p>
                            <p className="type-caption truncate">
                              {employees.find((e) => e.id === a.employeeId)?.name} · {findCustomer(a.customerId)?.name}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <ApptStateBadge state={a.status} />
                            <PetStateBadge state={a.petState} size="sm" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      ) : (
        <SectionCard title="Vista semana" description="Semana del 1 al 5 de septiembre">
          <div className="grid gap-3 md:grid-cols-5">
            {WEEK.map((day) => {
              const items = appointments.filter((a) => a.date === day.date);
              return (
                <div key={day.date} className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="type-label mb-2 text-foreground">{day.label}</p>
                  <div className="space-y-2">
                    {items.length === 0 && <p className="type-caption">Sin citas</p>}
                    {items.map((a) => (
                      <div key={a.id} className="rounded-lg bg-surface p-2 shadow-sm">
                        <p className="text-xs font-bold text-foreground">{a.time}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {findPet(a.petId)?.name} · {findService(a.serviceId)?.name}
                        </p>
                        <div className="mt-1.5">
                          <ApptStateBadge state={a.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
