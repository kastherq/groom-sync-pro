import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarPlus,
  CheckCircle2,
  DollarSign,
  PawPrint,
  Plus,
  Scissors,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard, StatCard, EmptyState } from "@/components/gs/primitives";
import { ApptStateBadge, PetStateBadge } from "@/components/gs/badges";
import { NewAppointmentDialog, NewCustomerDialog, NewPetDialog } from "@/components/gs/appointment-dialog";
import { useGroom } from "@/lib/groomsync-store";
import {
  APPT_STATE_META,
  PET_STATE_META,
  TODAY,
  findCustomer,
  findPet,
  findService,
  type ApptState,
  type PetState,
} from "@/lib/groomsync-data";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — GroomSync" },
      { name: "description", content: "Estado del día de tu peluquería canina: mascotas, citas y equipo." },
      { property: "og:title", content: "Dashboard — GroomSync" },
      { property: "og:description", content: "Panel operativo en tiempo real de tu peluquería." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

const PET_ORDER: PetState[] = ["esperando", "bano", "secado", "grooming", "lista", "recogida", "incidencia"];
const APPT_ORDER: ApptState[] = ["pendiente", "confirmada", "cancelada", "completada"];

function DashboardPage() {
  const { role, userName, appointments, employees, customers } = useGroom();
  const today = appointments.filter((a) => a.date === TODAY);
  const isOwner = role === "dueno";

  const countState = (s: PetState) => today.filter((a) => a.petState === s && a.status !== "cancelada").length;
  const countAppt = (s: ApptState) => today.filter((a) => a.status === s).length;

  const revenue = today.filter((a) => a.status !== "cancelada").reduce((sum, a) => sum + a.price, 0);
  const inProcess = today.filter((a) => ["bano", "secado", "grooming"].includes(a.petState) && a.status !== "cancelada");
  const ready = today.filter((a) => a.petState === "lista");
  const waiting = today.filter((a) => a.petState === "esperando" && a.status !== "cancelada");

  return (
    <div className="space-y-5">
      <PageHeader
        title={isOwner ? `Hola, ${userName.split(" ")[0]}` : "Operación de hoy"}
        subtitle={
          isOwner
            ? "Resumen del día de tu sucursal — lunes 1 de septiembre, 2026"
            : "Todo lo que necesitas para atender el día — lunes 1 de septiembre, 2026"
        }
        actions={
          <>
            <NewCustomerDialog
              trigger={
                <Button variant="outline" className="h-10">
                  <UserPlus className="mr-1.5 h-4 w-4" /> Nuevo cliente
                </Button>
              }
            />
            <NewPetDialog
              trigger={
                <Button variant="outline" className="h-10">
                  <PawPrint className="mr-1.5 h-4 w-4" /> Nueva mascota
                </Button>
              }
            />
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

      <section>
        <h2 className="eyebrow mb-2.5 text-muted-foreground">Estado de las mascotas hoy</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {PET_ORDER.map((state) => {
            const meta = PET_STATE_META[state];
            return (
              <div key={state} className="surface-card p-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg" aria-hidden>
                    {meta.emoji}
                  </span>
                  <p className="type-label truncate text-muted-foreground">{meta.label}</p>
                </div>
                <p className="mt-1.5 font-display text-2xl font-extrabold text-foreground">{countState(state)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="En proceso ahora"
          description={`${inProcess.length} mascotas siendo atendidas`}
          className="lg:col-span-2"
          actions={
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/citas">Ver citas</Link>
            </Button>
          }
        >
          {inProcess.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Nada en proceso"
              description="Cuando una mascota entre al flujo de servicio aparecerá aquí en tiempo real."
            />
          ) : (
            <ul className="divide-y divide-border">
              {inProcess.map((a) => {
                const pet = findPet(a.petId);
                return (
                  <li key={a.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-xl">
                      {pet?.photo}
                    </span>
                    <div className="min-w-0">
                      <Link
                        to="/app/mascotas/$petId"
                        params={{ petId: a.petId }}
                        className="block truncate font-semibold text-foreground hover:text-primary"
                      >
                        {pet?.name}
                      </Link>
                      <p className="type-caption truncate">
                        {findService(a.serviceId)?.name} · {findCustomer(a.customerId)?.name} ·{" "}
                        {employees.find((e) => e.id === a.employeeId)?.name}
                      </p>
                    </div>
                    <PetStateBadge state={a.petState} />
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Citas de hoy" description="Estado administrativo de cada cita">
          <ul className="space-y-2.5">
            {APPT_ORDER.map((s) => (
              <li key={s} className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
                <ApptStateBadge state={s} />
                <span className="font-display text-lg font-extrabold text-foreground">{countAppt(s)}</span>
              </li>
            ))}
          </ul>
          <p className="type-caption mt-3">
            El estado de la cita es independiente del estado de la mascota: una cita confirmada puede tener a la mascota
            en cualquier etapa del proceso.
          </p>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Listas para recoger"
          description={`${ready.length} clientes ya fueron notificados por WhatsApp`}
        >
          {ready.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Ninguna mascota lista"
              description="Cuando un peluquero marque una mascota como Lista, el cliente recibe un WhatsApp automático."
            />
          ) : (
            <ul className="space-y-2.5">
              {ready.map((a) => (
                <li
                  key={a.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-state-ready-foreground/20 bg-state-ready/60 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {findPet(a.petId)?.photo} {findPet(a.petId)?.name}
                    </p>
                    <p className="type-caption truncate">
                      {findCustomer(a.customerId)?.name} · {findCustomer(a.customerId)?.phone}
                    </p>
                  </div>
                  <PetStateBadge state="lista" />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Esperando turno" description={`${waiting.length} mascotas en recepción`}>
          {waiting.length === 0 ? (
            <EmptyState icon={PawPrint} title="Sin cola" description="No hay mascotas esperando en recepción." />
          ) : (
            <ul className="space-y-2.5">
              {waiting.map((a) => (
                <li
                  key={a.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {findPet(a.petId)?.photo} {findPet(a.petId)?.name} · {a.time}
                    </p>
                    <p className="type-caption truncate">
                      {findService(a.serviceId)?.name} · {employees.find((e) => e.id === a.employeeId)?.name}
                    </p>
                  </div>
                  <PetStateBadge state="esperando" />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {isOwner && (
        <>
          <section>
            <h2 className="eyebrow mb-2.5 text-muted-foreground">Estadísticas rápidas del día</h2>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                label="Mascotas atendidas"
                value={today.filter((a) => a.petState === "recogida" || a.petState === "lista").length}
                hint="Servicio completado o listo"
                icon={PawPrint}
                tone="primary"
              />
              <StatCard label="Clientes nuevos" value={1} hint="Registrados hoy" icon={Users} tone="info" />
              <StatCard label="Ingresos" value={`$${revenue}`} hint="Citas no canceladas" icon={DollarSign} tone="success" />
              <StatCard
                label="Servicios realizados"
                value={today.filter((a) => a.status === "completada").length}
                hint="Cerrados en el día"
                icon={Scissors}
                tone="warning"
              />
            </div>
          </section>

          <SectionCard
            title="Equipo de hoy"
            description="Carga de trabajo por peluquero"
            actions={
              <Button asChild variant="ghost" size="sm">
                <Link to="/app/empleados">Gestionar</Link>
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-semibold text-muted-foreground">Peluquero</th>
                    <th className="pb-2 font-semibold text-muted-foreground">Mascotas asignadas hoy</th>
                    <th className="pb-2 font-semibold text-muted-foreground">Servicios realizados</th>
                    <th className="pb-2 font-semibold text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {employees
                    .filter((e) => e.role === "peluquero")
                    .map((e) => (
                      <tr key={e.id} className="border-b border-border/60 last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-bold text-primary">
                              {e.initials}
                            </span>
                            <span className="font-semibold text-foreground">{e.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {today.filter((a) => a.employeeId === e.id).length}
                        </td>
                        <td className="py-3 text-muted-foreground">{e.servicesDone}</td>
                        <td className="py-3">
                          <span
                            className={
                              e.active
                                ? "rounded-full bg-success/12 px-2.5 py-1 text-xs font-semibold text-success"
                                : "rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                            }
                          >
                            {e.active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      )}

      {!isOwner && (
        <SectionCard title="Accesos rápidos" description="Las 3 acciones más usadas en recepción">
          <div className="grid gap-3 sm:grid-cols-3">
            <NewAppointmentDialog
              trigger={
                <Button className="h-14 justify-start text-base">
                  <CalendarPlus className="mr-2 h-5 w-5" /> Nueva cita
                </Button>
              }
            />
            <NewCustomerDialog
              trigger={
                <Button variant="outline" className="h-14 justify-start text-base">
                  <UserPlus className="mr-2 h-5 w-5" /> Nuevo cliente
                </Button>
              }
            />
            <NewPetDialog
              trigger={
                <Button variant="outline" className="h-14 justify-start text-base">
                  <PawPrint className="mr-2 h-5 w-5" /> Nueva mascota
                </Button>
              }
            />
          </div>
          <p className="type-caption mt-3">
            {customers.length} clientes registrados · {appointments.length} citas en el sistema
          </p>
        </SectionCard>
      )}
    </div>
  );
}
