import { useState } from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { Clock, MessageCircle, PawPrint, Undo2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import {
  PET_STATE_META,
  findCustomer,
  findPet,
  findService,
  prevPetState,
  type Appointment,
} from "@/lib/groomsync-data";
import { useGroom } from "@/lib/groomsync-store";
import { PetStateBadge } from "./badges";

export function PetActionCard({ appt, compact = false }: { appt: Appointment; compact?: boolean }) {
  const { setPetState, employees, currentEmployeeId, claimAppointment, releaseAppointment, role } = useGroom();
  const [confirmReady, setConfirmReady] = useState(false);
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);

  const pet = findPet(appt.petId);
  const owner = findCustomer(appt.customerId);
  const service = findService(appt.serviceId);
  const meta = PET_STATE_META[appt.petState];
  const back = prevPetState(appt.petState);
  const assignee = employees.find((e) => e.id === appt.employeeId);
  const isMine = appt.employeeId === currentEmployeeId;
  const isGroomer = role === "peluquero";

  if (!pet) return null;

  const advance = () => {
    if (!meta.next) return;
    if (meta.next === "lista") {
      setConfirmReady(true);
      return;
    }
    setPetState(appt.id, meta.next);
    toast.success(`${pet.name} → ${PET_STATE_META[meta.next].label}`);
  };

  return (
    <article className="surface-card flex flex-col gap-4 p-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-2xl">
          {pet.photo}
        </span>
        <div className="min-w-0">
          <Link
            to="/app/mascotas/$petId"
            params={{ petId: pet.id }}
            className="type-h3 block truncate text-foreground hover:text-primary"
          >
            {pet.name}
          </Link>
          <p className="type-caption truncate">
            {pet.breed} · {owner?.name}
          </p>
        </div>
        <PetStateBadge state={appt.petState} />
      </div>

      <dl className="grid grid-cols-2 gap-3 rounded-xl bg-muted/60 p-3 text-sm">
        <div className="min-w-0">
          <dt className="type-caption flex items-center gap-1">
            <PawPrint className="h-3 w-3" /> Servicio
          </dt>
          <dd className="truncate font-semibold text-foreground">{service?.name}</dd>
        </div>
        <div className="min-w-0">
          <dt className="type-caption flex items-center gap-1">
            <Clock className="h-3 w-3" /> Entrada
          </dt>
          <dd className="font-semibold text-foreground">{appt.time}</dd>
        </div>
        {!compact && (
          <div className="col-span-2 min-w-0">
            <dt className="type-caption flex items-center gap-1">
              <User className="h-3 w-3" /> Notas importantes
            </dt>
            <dd className="text-foreground">{pet.notes || "Sin notas"}</dd>
          </div>
        )}
      </dl>

      {appt.notified && appt.petState !== "recogida" && (
        <p className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-xs font-semibold text-success">
          <MessageCircle className="h-3.5 w-3.5" /> Notificación enviada al cliente por WhatsApp
        </p>
      )}

      {isGroomer && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3 py-2">
          <p className="type-caption">
            {assignee ? (
              <>
                Asignada a <span className="font-semibold text-foreground">{isMine ? "ti" : assignee.name}</span>
              </>
            ) : (
              "Sin asignar"
            )}
          </p>
          {!assignee ? (
            <Button
              size="sm"
              className="h-9"
              onClick={() => {
                claimAppointment(appt.id, currentEmployeeId);
                toast.success(`Te asignaste a ${pet.name}`);
              }}
            >
              Asignármela
            </Button>
          ) : isMine ? (
            <Button
              size="sm"
              variant="outline"
              className="h-9"
              onClick={() => {
                releaseAppointment(appt.id);
                toast.info(`Liberaste a ${pet.name}. Otro compañero puede asignársela.`);
              }}
            >
              Liberar
            </Button>
          ) : (
            <span className="type-caption">Ya tomada por otro compañero</span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {meta.next ? (
          <Button className="h-11 flex-1 min-w-[180px]" onClick={advance}>
            {meta.nextLabel}
          </Button>
        ) : (
          <Button className="h-11 flex-1 min-w-[180px]" variant="outline" disabled>
            Servicio finalizado
          </Button>
        )}
        {back && (
          <Button
            variant="outline"
            className="h-11"
            onClick={() => {
              setPetState(appt.id, back);
              toast.info(`${pet.name} volvió a ${PET_STATE_META[back].label}`);
            }}
          >
            <Undo2 className="mr-1.5 h-4 w-4" /> Volver a {PET_STATE_META[back].label}
          </Button>
        )}
        {appt.petState === "incidencia" && (
          <Button
            variant="outline"
            className="h-11"
            onClick={() => {
              setPetState(appt.id, "esperando");
              toast.success(`Incidencia resuelta. ${pet.name} volvió a Esperando.`);
            }}
          >
            <Undo2 className="mr-1.5 h-4 w-4" /> Resolver incidencia
          </Button>
        )}
        <Button variant="outline" className="h-11" onClick={() => setNoteOpen(true)}>
          Observación
        </Button>
        <Button
          variant="outline"
          className="h-11 border-state-issue-foreground/30 text-state-issue-foreground"
          onClick={() => {
            setPetState(appt.id, "incidencia");
            toast.warning(`Incidencia reportada en ${pet.name}. Recepción fue avisada.`);
          }}
        >
          ⚠️ Incidencia
        </Button>
      </div>

      {noteOpen && (
        <div className="space-y-2 rounded-xl border border-border p-3">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Observación sobre ${pet.name}...`}
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setNoteOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setNoteOpen(false);
                setNote("");
                toast.success("Observación guardada en el historial de la mascota");
              }}
            >
              Guardar
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={confirmReady} onOpenChange={setConfirmReady}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Marcar a {pet.name} como Lista</AlertDialogTitle>
            <AlertDialogDescription>
              Se enviará automáticamente una notificación por WhatsApp a {owner?.name} ({owner?.phone}) avisando que
              puede recoger a su mascota.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setPetState(appt.id, "lista");
                toast.success("Notificación enviada al cliente", {
                  description: `${owner?.name} fue avisado por WhatsApp para recoger a ${pet.name}.`,
                  icon: "🟢",
                });
              }}
            >
              Confirmar y notificar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
