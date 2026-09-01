import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, SectionCard, EmptyState } from "@/components/gs/primitives";
import { NewCustomerDialog } from "@/components/gs/appointment-dialog";
import { useGroom } from "@/lib/groomsync-store";

export const Route = createFileRoute("/app/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes — GroomSync" },
      { name: "description", content: "Base de clientes con teléfono, mascotas y última visita." },
      { property: "og:title", content: "Clientes — GroomSync" },
      { property: "og:description", content: "Gestiona la información de contacto y el historial de tus clientes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientesPage,
});

function ClientesPage() {
  const { customers } = useGroom();
  const [query, setQuery] = useState("");
  const rows = customers.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query),
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Clientes"
        subtitle={`${customers.length} clientes registrados`}
        actions={
          <NewCustomerDialog
            trigger={
              <Button className="h-10">
                <UserPlus className="mr-1.5 h-4 w-4" /> Nuevo cliente
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
            placeholder="Buscar por nombre o teléfono"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={Users} title="Sin resultados" description="No encontramos clientes con esa búsqueda." />
      ) : (
        <>
          <SectionCard title="Listado" description="Tabla de clientes" className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    {["Nombre", "Teléfono", "Mascotas", "Última visita", "Acciones"].map((h) => (
                      <th key={h} className="pb-2 font-semibold text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id} className="border-b border-border/60 last:border-0">
                      <td className="py-3 font-semibold text-foreground">{c.name}</td>
                      <td className="py-3 text-muted-foreground">{c.phone}</td>
                      <td className="py-3 text-muted-foreground">{c.petIds.length}</td>
                      <td className="py-3 text-muted-foreground">{c.lastVisit}</td>
                      <td className="py-3">
                        <Button asChild variant="outline" size="sm">
                          <Link to="/app/clientes/$customerId" params={{ customerId: c.id }}>
                            Ver detalle
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div className="grid gap-3 md:hidden">
            {rows.map((c) => (
              <Link
                key={c.id}
                to="/app/clientes/$customerId"
                params={{ customerId: c.id }}
                className="surface-card block p-4"
              >
                <p className="font-display font-bold text-foreground">{c.name}</p>
                <p className="type-caption">{c.phone}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {c.petIds.length} mascotas · última visita {c.lastVisit}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
