import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, SectionCard } from "@/components/gs/primitives";
import { BRANCHES } from "@/lib/groomsync-data";
import { useGroom } from "@/lib/groomsync-store";

export const Route = createFileRoute("/app/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración — GroomSync" },
      { name: "description", content: "Datos de la sucursal, horarios y notificaciones por WhatsApp." },
      { property: "og:title", content: "Configuración — GroomSync" },
      { property: "og:description", content: "Ajustes de la sucursal y de las notificaciones automáticas." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfigPage,
});

function ConfigPage() {
  const { branch, setBranch } = useGroom();

  return (
    <div className="space-y-5">
      <PageHeader title="Configuración" subtitle="Sucursal, horarios y notificaciones" />

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Sucursal" description="Preparado para multi-sucursal">
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>Sucursal activa</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="name">Nombre del negocio</Label>
              <Input id="name" className="h-11" defaultValue="Peluquería Canina Happy Paws" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Teléfono de contacto</Label>
              <Input id="phone" className="h-11" defaultValue="+507 200-1234" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notificaciones WhatsApp" description="Mensajes automáticos al cliente">
          <ul className="space-y-3">
            {[
              ["Mascota lista para recoger", true],
              ["Recordatorio de cita (24h antes)", true],
              ["Confirmación al crear la cita", false],
              ["Aviso de incidencia", true],
            ].map(([label, on]) => (
              <li key={String(label)} className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
                <span className="min-w-0 truncate text-sm font-semibold text-foreground">{label}</span>
                <Switch defaultChecked={Boolean(on)} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Horario de atención">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="open">Apertura</Label>
              <Input id="open" type="time" className="h-11" defaultValue="08:00" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="close">Cierre</Label>
              <Input id="close" type="time" className="h-11" defaultValue="18:00" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Suscripción" description="Plan por sucursal">
          <p className="font-display text-3xl font-extrabold text-foreground">
            $49<span className="text-base font-semibold text-muted-foreground">/mes</span>
          </p>
          <p className="type-caption mt-1">Próxima facturación: 1 de octubre, 2026 · Sucursal {branch}</p>
        </SectionCard>
      </div>

      <div className="flex justify-end">
        <Button className="h-11" onClick={() => toast.success("Configuración guardada")}>
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
