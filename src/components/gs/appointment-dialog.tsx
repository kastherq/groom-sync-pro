import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TODAY, type Appointment } from "@/lib/groomsync-data";
import { useGroom } from "@/lib/groomsync-store";

export function NewAppointmentDialog({
  trigger,
  appointment,
}: {
  trigger: ReactNode;
  appointment?: Appointment;
}) {
  const { customers, pets, services, employees, addAppointment } = useGroom();
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState(appointment?.customerId ?? "");
  const [petId, setPetId] = useState(appointment?.petId ?? "");
  const [serviceId, setServiceId] = useState(appointment?.serviceId ?? "");
  const [employeeId, setEmployeeId] = useState(appointment?.employeeId ?? "");
  const [date, setDate] = useState(appointment?.date ?? TODAY);
  const [time, setTime] = useState(appointment?.time ?? "09:00");
  const [notes, setNotes] = useState(appointment?.notes ?? "");

  const selectedService = services.find((s) => s.id === serviceId);
  const price = selectedService?.price ?? 0;
  const customerPets = pets.filter((p) => p.ownerId === customerId);
  const groomers = employees.filter((e) => e.role === "peluquero" && e.active);

  const save = () => {
    if (!customerId || !petId || !serviceId || !employeeId) {
      toast.error("Completa cliente, mascota, servicio y peluquero");
      return;
    }
    addAppointment({
      customerId,
      petId,
      serviceId,
      employeeId,
      date,
      time,
      price,
      status: "pendiente",
      petState: "esperando",
      notes,
    });
    setOpen(false);
    toast.success(appointment ? "Cita actualizada" : "Cita creada", {
      description: `${date} · ${time} · ${selectedService?.name}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{appointment ? "Editar cita" : "Nueva cita"}</DialogTitle>
          <DialogDescription>
            Registra la cita en 4 pasos rápidos: cliente, mascota, servicio y peluquero.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Cliente</Label>
            <Select
              value={customerId}
              onValueChange={(v) => {
                setCustomerId(v);
                setPetId("");
              }}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecciona un cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} · {c.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label>Mascota</Label>
            <Select value={petId} onValueChange={setPetId} disabled={!customerId}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={customerId ? "Selecciona una mascota" : "Elige primero el cliente"} />
              </SelectTrigger>
              <SelectContent>
                {customerPets.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.photo} {p.name} · {p.breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Servicio</Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services
                    .filter((s) => s.active)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} · ${s.price}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Peluquero</Label>
              <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Asignar" />
                </SelectTrigger>
                <SelectContent>
                  {groomers.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" className="h-11" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="time">Hora</Label>
              <Input id="time" type="time" className="h-11" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" className="h-11" value={`$${price}`} readOnly />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="notes">Observaciones</Label>
            <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={save}>{appointment ? "Guardar cambios" : "Crear cita"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NewCustomerDialog({ trigger }: { trigger: ReactNode }) {
  const { addCustomer } = useGroom();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo cliente</DialogTitle>
          <DialogDescription>Solo lo esencial para poder atender hoy mismo.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {(
            [
              ["name", "Nombre completo", "María Rodríguez"],
              ["phone", "Teléfono (WhatsApp)", "+507 6000-0000"],
              ["email", "Email (opcional)", "cliente@mail.com"],
              ["address", "Dirección (opcional)", "Costa del Este"],
            ] as const
          ).map(([key, label, placeholder]) => (
            <div key={key} className="grid gap-1.5">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                className="h-11"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (!form.name || !form.phone) {
                toast.error("Nombre y teléfono son obligatorios");
                return;
              }
              addCustomer(form);
              setOpen(false);
              setForm({ name: "", phone: "", email: "", address: "" });
              toast.success("Cliente registrado");
            }}
          >
            Guardar cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NewPetDialog({ trigger }: { trigger: ReactNode }) {
  const { customers } = useGroom();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva mascota</DialogTitle>
          <DialogDescription>Asocia la mascota a un cliente existente.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Dueño</Label>
            <Select>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecciona el cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="pet-name">Nombre</Label>
              <Input id="pet-name" className="h-11" placeholder="Toby" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pet-breed">Raza</Label>
              <Input id="pet-breed" className="h-11" placeholder="Schnauzer" />
            </div>
            <div className="grid gap-1.5">
              <Label>Sexo</Label>
              <Select>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="macho">Macho</SelectItem>
                  <SelectItem value="hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pet-weight">Peso</Label>
              <Input id="pet-weight" className="h-11" placeholder="8.4 kg" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="pet-notes">Observaciones</Label>
            <Textarea id="pet-notes" rows={3} placeholder="Alergias, comportamiento, preferencias de corte..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              toast.success("Mascota registrada");
            }}
          >
            Guardar mascota
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
