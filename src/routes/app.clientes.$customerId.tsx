import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard, EmptyState } from "@/components/gs/primitives";
import { ApptStateBadge, PetStateBadge } from "@/components/gs/badges";
import { useGroom } from "@/lib/groomsync-store";
import { findService } from "@/lib/groomsync-data";
import { PawPrint } from "lucide-react";

export const Route = createFileRoute("/app/clientes/$customerId")({
  head: () => ({
    meta: [
      { title: "Detalle de cliente — GroomSync" },
      { name: "description", content: "Contacto, mascotas e historial de citas del cliente." },
      { property: "og:title", content: "Detalle de cliente — GroomSync" },
      { property: "og:description", content: "Ficha completa del cliente y sus mascotas." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClienteDetail,
});

function ClienteDetail() {
  const { customerId } = Route.useParams();
  const { customers, pets, appointments, employees } = useGroom();
  const customer = customers.find((c) => c.id === customerId);

  if (!customer) {
    return (
      <EmptyState
        icon={PawPrint}
        title="Cliente no encontrado"
        description="Este cliente no existe o fue eliminado."
        action={
          <Button asChild variant="outline">
            <Link to="/app/clientes">Volver a clientes</Link>
          </Button>
        }
      />
    );
  }

  const myPets = pets.filter((p) => p.ownerId === customer.id);
  const history = appointments.filter((a) => a.customerId === customer.id);

  return (
    <div className="space-y-5">
      <Link to="/app/clientes" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Clientes
      </Link>
      <PageHeader title={customer.name} subtitle={`Cliente desde ${customer.since}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Información de contacto">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" /> {customer.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" /> {customer.email}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary" /> {customer.address}
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="Mascotas" description={`${myPets.length} registradas`} className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {myPets.map((p) => {
              const active = history.find((a) => a.petId === p.id && a.petState !== "recogida");
              return (
                <Link
                  key={p.id}
                  to="/app/mascotas/$petId"
                  params={{ petId: p.id }}
                  className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/40"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-xl">
                    {p.photo}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{p.name}</p>
                    <p className="type-caption truncate">{p.breed}</p>
                    {active && <PetStateBadge state={active.petState} size="sm" className="mt-1" />}
                  </div>
                </Link>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Historial de citas" description={`${history.length} citas registradas`}>
        <ul className="divide-y divide-border">
          {history.map((a) => (
            <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0">
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">
                  {a.date} · {a.time} · {findService(a.serviceId)?.name}
                </p>
                <p className="type-caption truncate">
                  {pets.find((p) => p.id === a.petId)?.name} · {employees.find((e) => e.id === a.employeeId)?.name} · ${a.price}
                </p>
              </div>
              <ApptStateBadge state={a.status} />
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
