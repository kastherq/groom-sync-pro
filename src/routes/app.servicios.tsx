import { createFileRoute } from "@tanstack/react-router";
import { Clock, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/gs/primitives";
import { useGroom } from "@/lib/groomsync-store";

export const Route = createFileRoute("/app/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios — GroomSync" },
      { name: "description", content: "Catálogo de servicios con precio, duración estimada y estado." },
      { property: "og:title", content: "Servicios — GroomSync" },
      { property: "og:description", content: "Define baño, grooming y servicios adicionales de tu peluquería." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ServiciosPage,
});

function ServiciosPage() {
  const { services, toggleService } = useGroom();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Servicios"
        subtitle={`${services.filter((s) => s.active).length} servicios activos`}
        actions={
          <Button className="h-10" onClick={() => toast.info("Formulario de nuevo servicio")}>
            <Plus className="mr-1.5 h-4 w-4" /> Nuevo servicio
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((s) => (
          <article key={s.id} className="surface-card flex flex-col gap-3 p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-display font-bold text-foreground">{s.name}</h3>
                <p className="type-caption">{s.description}</p>
              </div>
              <span className="shrink-0 font-display text-xl font-extrabold text-primary">${s.price}</span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {s.minutes} min estimados
            </p>
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Switch
                  checked={s.active}
                  onCheckedChange={() => {
                    toggleService(s.id);
                    toast.success(`${s.name} ${s.active ? "desactivado" : "activado"}`);
                  }}
                />
                {s.active ? "Activo" : "Inactivo"}
              </label>
              <Button variant="outline" size="sm" onClick={() => toast.info(`Editar ${s.name}`)}>
                Editar
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
