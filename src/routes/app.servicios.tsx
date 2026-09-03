import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/gs/primitives";
import { useGroom } from "@/lib/groomsync-store";
import type { Service } from "@/lib/groomsync-data";

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

type FormState = { name: string; description: string; price: string; minutes: string };
const EMPTY_FORM: FormState = { name: "", description: "", price: "", minutes: "" };

function ServiciosPage() {
  const { services, toggleService, addService, updateService, deleteService } = useGroom();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleting, setDeleting] = useState<Service | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description, price: String(s.price), minutes: String(s.minutes) });
    setDialogOpen(true);
  };

  const submit = () => {
    const price = Number(form.price);
    const minutes = Number(form.minutes);
    if (!form.name.trim()) {
      toast.error("Escribe el nombre del servicio");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Ingresa un precio válido");
      return;
    }
    if (!Number.isFinite(minutes) || minutes <= 0) {
      toast.error("Ingresa una duración válida en minutos");
      return;
    }
    const data = { name: form.name.trim(), description: form.description.trim() || "—", price, minutes };
    if (editing) {
      updateService(editing.id, data);
      toast.success(`${data.name} actualizado`);
    } else {
      addService({ ...data, active: true });
      toast.success(`${data.name} agregado al catálogo`);
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteService(deleting.id);
    toast.success(`${deleting.name} eliminado del catálogo`);
    setDeleting(null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Servicios"
        subtitle={`${services.filter((s) => s.active).length} servicios activos`}
        actions={
          <Button className="h-10" onClick={openCreate}>
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
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                  <Pencil className="mr-1 h-3.5 w-3.5" /> Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setDeleting(s)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Eliminar {s.name}</span>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Editar ${editing.name}` : "Nuevo servicio"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="svc-name">Nombre</Label>
              <Input
                id="svc-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej. Baño medicado"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="svc-desc">Descripción</Label>
              <Input
                id="svc-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Breve descripción del servicio"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="svc-price">Precio (USD)</Label>
                <Input
                  id="svc-price"
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="25"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="svc-minutes">Duración (min)</Label>
                <Input
                  id="svc-minutes"
                  type="number"
                  min="5"
                  step="5"
                  value={form.minutes}
                  onChange={(e) => setForm({ ...form, minutes: e.target.value })}
                  placeholder="60"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submit}>{editing ? "Guardar cambios" : "Crear servicio"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El servicio se quitará del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
