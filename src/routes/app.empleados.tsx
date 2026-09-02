import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Role } from "@/lib/groomsync-data";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader, SectionCard } from "@/components/gs/primitives";
import { useGroom } from "@/lib/groomsync-store";
import { ROLE_LABEL, TODAY } from "@/lib/groomsync-data";

export const Route = createFileRoute("/app/empleados")({
  head: () => ({
    meta: [
      { title: "Empleados — GroomSync" },
      { name: "description", content: "Gestiona peluqueros y recepción: crear, editar, activar o desactivar." },
      { property: "og:title", content: "Empleados — GroomSync" },
      { property: "og:description", content: "Equipo de la sucursal con carga de trabajo y servicios realizados." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EmpleadosPage,
});

function EmpleadosPage() {
  const { employees, appointments, toggleEmployee, addEmployee, role } = useGroom();
  const canManage = role === "dueno" || role === "admin";
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newRole, setNewRole] = useState<Role>("peluquero");

  const submit = () => {
    if (!name.trim()) {
      toast.error("Escribe el nombre del empleado");
      return;
    }
    addEmployee({ name: name.trim(), phone: phone.trim() || "—", role: newRole, active: true });
    toast.success(`${name.trim()} agregado al equipo`);
    setName("");
    setPhone("");
    setNewRole("peluquero");
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Empleados"
        subtitle={`${employees.filter((e) => e.active).length} activos de ${employees.length}`}
        actions={
          canManage ? (
            <Button className="h-10" onClick={() => setOpen(true)}>
              <UserPlus className="mr-1.5 h-4 w-4" /> Nuevo empleado
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {employees.map((e) => (
          <article key={e.id} className="surface-card space-y-3 p-4">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                {e.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display font-bold text-foreground">{e.name}</p>
                <p className="type-caption truncate">{ROLE_LABEL[e.role]}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-3 text-sm">
              <div>
                <dt className="type-caption">Asignadas hoy</dt>
                <dd className="font-semibold">{appointments.filter((a) => a.employeeId === e.id && a.date === TODAY).length}</dd>
              </div>
              <div>
                <dt className="type-caption">Servicios totales</dt>
                <dd className="font-semibold">{e.servicesDone}</dd>
              </div>
            </dl>
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Switch
                  checked={e.active}
                  onCheckedChange={() => {
                    toggleEmployee(e.id);
                    toast.success(`${e.name} ${e.active ? "desactivado" : "activado"}`);
                  }}
                />
                {e.active ? "Activo" : "Inactivo"}
              </label>
              <Button variant="outline" size="sm" onClick={() => toast.info(`Editar ${e.name}`)}>
                Editar
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo empleado</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="emp-name">Nombre completo</Label>
              <Input id="emp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Laura Méndez" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-phone">Teléfono</Label>
              <Input id="emp-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+507 6000-0000" />
            </div>
            <div className="space-y-1.5">
              <Label>Rol</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="peluquero">{ROLE_LABEL.peluquero}</SelectItem>
                  <SelectItem value="admin">{ROLE_LABEL.admin}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submit}>Crear empleado</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
