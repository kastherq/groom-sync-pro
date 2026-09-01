import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Filter, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, SectionCard, EmptyState } from "@/components/gs/primitives";
import { ApptStateBadge, PetStateBadge } from "@/components/gs/badges";
import { NewAppointmentDialog } from "@/components/gs/appointment-dialog";
import { useGroom } from "@/lib/groomsync-store";
import { findCustomer, findPet, findService, type ApptState } from "@/lib/groomsync-data";

export const Route = createFileRoute("/app/citas")({
  head: () => ({
    meta: [
      { title: "Citas — GroomSync" },
      { name: "description", content: "Administra las citas de tu peluquería: crear, confirmar, cancelar y completar." },
      { property: "og:title", content: "Citas — GroomSync" },
      { property: "og:description", content: "Listado y gestión de citas por día, estado y peluquero." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CitasPage,
});

function CitasPage() {
  const { appointments, employees, setApptState } = useGroom();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ApptState | "todas">("todas");
  const [groomer, setGroomer] = useState("todos");

  const rows = appointments.filter((a) => {
    const pet = findPet(a.petId);
    const customer = findCustomer(a.customerId);
    const text = `${pet?.name} ${customer?.name}`.toLowerCase();
    return (
      text.includes(query.toLowerCase()) &&
      (status === "todas" || a.status === status) &&
      (groomer === "todos" || a.employeeId === groomer)
    );
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Citas"
        subtitle={`${rows.length} citas encontradas`}
        actions={
          <>
            <Button asChild variant="outline" className="h-10">
              <Link to="/app/agenda">
                <CalendarDays className="mr-1.5 h-4 w-4" /> Ver calendario
              </Link>
            </Button>
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

      <div className="surface-card grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-10 pl-9"
            placeholder="Buscar por mascota o cliente"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as ApptState | "todas")}>
          <SelectTrigger className="h-10 sm:w-44">
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="confirmada">Confirmada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
            <SelectItem value="completada">Completada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={groomer} onValueChange={setGroomer}>
          <SelectTrigger className="h-10 sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los peluqueros</SelectItem>
            {employees
              .filter((e) => e.role === "peluquero")
              .map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Sin citas que mostrar"
          description="Ajusta los filtros o crea una nueva cita para comenzar."
        />
      ) : (
        <>
          <SectionCard title="Listado de citas" description="Vista de tabla para escritorio" className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    {["Fecha / Hora", "Mascota", "Cliente", "Servicio", "Peluquero", "Estado cita", "Estado mascota", "Precio", ""].map(
                      (h) => (
                        <th key={h} className="pb-2 font-semibold text-muted-foreground">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.id} className="border-b border-border/60 last:border-0">
                      <td className="py-3 font-semibold text-foreground">
                        {a.date}
                        <span className="block text-xs font-normal text-muted-foreground">{a.time}</span>
                      </td>
                      <td className="py-3">
                        <Link
                          to="/app/mascotas/$petId"
                          params={{ petId: a.petId }}
                          className="font-semibold text-foreground hover:text-primary"
                        >
                          {findPet(a.petId)?.photo} {findPet(a.petId)?.name}
                        </Link>
                      </td>
                      <td className="py-3 text-muted-foreground">{findCustomer(a.customerId)?.name}</td>
                      <td className="py-3 text-muted-foreground">{findService(a.serviceId)?.name}</td>
                      <td className="py-3 text-muted-foreground">{employees.find((e) => e.id === a.employeeId)?.name}</td>
                      <td className="py-3">
                        <ApptStateBadge state={a.status} />
                      </td>
                      <td className="py-3">
                        <PetStateBadge state={a.petState} size="sm" />
                      </td>
                      <td className="py-3 font-semibold text-foreground">${a.price}</td>
                      <td className="py-3 text-right">
                        <Select
                          value={a.status}
                          onValueChange={(v) => {
                            setApptState(a.id, v as ApptState);
                            toast.success("Estado de la cita actualizado");
                          }}
                        >
                          <SelectTrigger className="h-9 w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="confirmada">Confirmada</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                            <SelectItem value="completada">Completada</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div className="grid gap-3 lg:hidden">
            {rows.map((a) => (
              <article key={a.id} className="surface-card space-y-3 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display font-bold text-foreground">
                      {findPet(a.petId)?.photo} {findPet(a.petId)?.name}
                    </p>
                    <p className="type-caption truncate">{findCustomer(a.customerId)?.name}</p>
                  </div>
                  <ApptStateBadge state={a.status} />
                </div>
                <dl className="grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-3 text-sm">
                  <div>
                    <dt className="type-caption">Fecha</dt>
                    <dd className="font-semibold">{a.date} · {a.time}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="type-caption">Servicio</dt>
                    <dd className="truncate font-semibold">{findService(a.serviceId)?.name}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="type-caption">Peluquero</dt>
                    <dd className="truncate font-semibold">{employees.find((e) => e.id === a.employeeId)?.name}</dd>
                  </div>
                  <div>
                    <dt className="type-caption">Precio</dt>
                    <dd className="font-semibold">${a.price}</dd>
                  </div>
                </dl>
                <div className="flex items-center justify-between gap-2">
                  <PetStateBadge state={a.petState} size="sm" />
                  <Button asChild variant="outline" size="sm">
                    <Link to="/app/mascotas/$petId" params={{ petId: a.petId }}>
                      Ver mascota
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
