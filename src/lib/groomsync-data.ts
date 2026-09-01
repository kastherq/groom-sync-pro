export type Role = "dueno" | "admin" | "peluquero";

export const ROLE_LABEL: Record<Role, string> = {
  dueno: "Dueño",
  admin: "Administración / Recepción",
  peluquero: "Peluquero / Bañador",
};

export type PetState = "esperando" | "bano" | "secado" | "grooming" | "lista" | "recogida" | "incidencia";
export type ApptState = "pendiente" | "confirmada" | "cancelada" | "completada";

export const PET_FLOW: PetState[] = ["esperando", "bano", "secado", "grooming", "lista", "recogida"];

export const PET_STATE_META: Record<
  PetState,
  { label: string; emoji: string; className: string; dot: string; next?: PetState; nextLabel?: string }
> = {
  esperando: {
    label: "Esperando",
    emoji: "⏳",
    className: "bg-state-waiting text-state-waiting-foreground border-state-waiting-foreground/15",
    dot: "bg-state-waiting-foreground",
    next: "bano",
    nextLabel: "Iniciar baño",
  },
  bano: {
    label: "Baño",
    emoji: "🛁",
    className: "bg-state-bath text-state-bath-foreground border-state-bath-foreground/15",
    dot: "bg-state-bath-foreground",
    next: "secado",
    nextLabel: "Marcar como Secado",
  },
  secado: {
    label: "Secado",
    emoji: "💨",
    className: "bg-state-dry text-state-dry-foreground border-state-dry-foreground/15",
    dot: "bg-state-dry-foreground",
    next: "grooming",
    nextLabel: "Marcar como Grooming",
  },
  grooming: {
    label: "Grooming",
    emoji: "✂️",
    className: "bg-state-groom text-state-groom-foreground border-state-groom-foreground/15",
    dot: "bg-state-groom-foreground",
    next: "lista",
    nextLabel: "Marcar como Lista",
  },
  lista: {
    label: "Lista",
    emoji: "🟢",
    className: "bg-state-ready text-state-ready-foreground border-state-ready-foreground/20",
    dot: "bg-state-ready-foreground",
    next: "recogida",
    nextLabel: "Marcar como Recogida",
  },
  recogida: {
    label: "Recogida",
    emoji: "🏠",
    className: "bg-state-picked text-state-picked-foreground border-state-picked-foreground/15",
    dot: "bg-state-picked-foreground",
  },
  incidencia: {
    label: "Incidencia",
    emoji: "⚠️",
    className: "bg-state-issue text-state-issue-foreground border-state-issue-foreground/20",
    dot: "bg-state-issue-foreground",
  },
};

export const APPT_STATE_META: Record<ApptState, { label: string; className: string }> = {
  pendiente: { label: "Pendiente", className: "bg-warning/15 text-warning-foreground border-warning/30" },
  confirmada: { label: "Confirmada", className: "bg-info/12 text-info border-info/25" },
  cancelada: { label: "Cancelada", className: "bg-destructive/10 text-destructive border-destructive/25" },
  completada: { label: "Completada", className: "bg-success/12 text-success border-success/25" },
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  since: string;
  lastVisit: string;
  petIds: string[];
};

export type Pet = {
  id: string;
  name: string;
  breed: string;
  sex: "Macho" | "Hembra";
  weight: string;
  age: string;
  ownerId: string;
  notes: string;
  lastVisit: string;
  photo: string;
};

export type Employee = {
  id: string;
  name: string;
  role: Role;
  active: boolean;
  phone: string;
  assigned: number;
  servicesDone: number;
  initials: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  minutes: number;
  active: boolean;
};

export type Appointment = {
  id: string;
  petId: string;
  customerId: string;
  serviceId: string;
  employeeId: string;
  date: string;
  time: string;
  price: number;
  status: ApptState;
  petState: PetState;
  notes: string;
  notified: boolean;
};

export const BRANCHES = ["Costa del Este", "Bella Vista", "Brisas del Golf"];

export const services: Service[] = [
  { id: "s1", name: "Baño", description: "Baño con shampoo hipoalergénico y cepillado.", price: 20, minutes: 45, active: true },
  { id: "s2", name: "Grooming", description: "Corte de pelo según raza y preferencia del dueño.", price: 32, minutes: 60, active: true },
  { id: "s3", name: "Baño + Grooming", description: "Servicio completo: baño, secado y corte.", price: 45, minutes: 90, active: true },
  { id: "s4", name: "Corte de uñas", description: "Corte y limado de uñas.", price: 8, minutes: 15, active: true },
  { id: "s5", name: "Limpieza de oídos", description: "Higiene de oídos con solución especializada.", price: 10, minutes: 15, active: false },
];

export const employees: Employee[] = [
  { id: "e1", name: "Laura Méndez", role: "peluquero", active: true, phone: "+507 6123-4567", assigned: 4, servicesDone: 128, initials: "LM" },
  { id: "e2", name: "Carlos Pérez", role: "peluquero", active: true, phone: "+507 6234-5678", assigned: 3, servicesDone: 96, initials: "CP" },
  { id: "e3", name: "Diana Solís", role: "peluquero", active: true, phone: "+507 6345-6789", assigned: 2, servicesDone: 74, initials: "DS" },
  { id: "e4", name: "Andrés Gómez", role: "admin", active: true, phone: "+507 6456-7890", assigned: 0, servicesDone: 0, initials: "AG" },
  { id: "e5", name: "Rosa Villalba", role: "peluquero", active: false, phone: "+507 6567-8901", assigned: 0, servicesDone: 41, initials: "RV" },
];

export const customers: Customer[] = [
  { id: "c1", name: "María Rodríguez", phone: "+507 6001-1122", email: "maria.r@mail.com", address: "Costa del Este, PH Ocean", since: "2024-03-11", lastVisit: "2026-08-24", petIds: ["p1", "p2"] },
  { id: "c2", name: "Javier Castillo", phone: "+507 6002-3344", email: "jcastillo@mail.com", address: "Bella Vista, Calle 45", since: "2024-07-02", lastVisit: "2026-08-28", petIds: ["p3"] },
  { id: "c3", name: "Ana Beltrán", phone: "+507 6003-5566", email: "ana.beltran@mail.com", address: "San Francisco, Calle 74", since: "2025-01-19", lastVisit: "2026-08-30", petIds: ["p4"] },
  { id: "c4", name: "Luis Ortega", phone: "+507 6004-7788", email: "luis.ortega@mail.com", address: "Brisas del Golf", since: "2025-05-06", lastVisit: "2026-08-31", petIds: ["p5", "p6"] },
  { id: "c5", name: "Carolina Núñez", phone: "+507 6005-9900", email: "caro.nunez@mail.com", address: "Costa del Este, PH Vista", since: "2026-08-20", lastVisit: "2026-08-31", petIds: ["p7"] },
];

export const pets: Pet[] = [
  { id: "p1", name: "Toby", breed: "Schnauzer", sex: "Macho", weight: "8.4 kg", age: "4 años", ownerId: "c1", notes: "Nervioso con la secadora. Usar velocidad baja.", lastVisit: "2026-08-24", photo: "🐶" },
  { id: "p2", name: "Nina", breed: "Poodle Toy", sex: "Hembra", weight: "4.1 kg", age: "2 años", ownerId: "c1", notes: "Alergia a shampoo con perfume.", lastVisit: "2026-07-30", photo: "🐩" },
  { id: "p3", name: "Rocky", breed: "Bulldog Francés", sex: "Macho", weight: "12.7 kg", age: "3 años", ownerId: "c2", notes: "Pliegues faciales requieren secado extra.", lastVisit: "2026-08-28", photo: "🐕" },
  { id: "p4", name: "Luna", breed: "Yorkshire Terrier", sex: "Hembra", weight: "3.2 kg", age: "5 años", ownerId: "c3", notes: "Corte de cara redondeado. Moño rosado.", lastVisit: "2026-08-30", photo: "🐕‍🦺" },
  { id: "p5", name: "Max", breed: "Golden Retriever", sex: "Macho", weight: "31 kg", age: "6 años", ownerId: "c4", notes: "Requiere dos personas para el baño.", lastVisit: "2026-08-31", photo: "🦮" },
  { id: "p6", name: "Kira", breed: "Border Collie", sex: "Hembra", weight: "18.5 kg", age: "1 año", ownerId: "c4", notes: "Primera visita completa. Muy activa.", lastVisit: "—", photo: "🐕" },
  { id: "p7", name: "Coco", breed: "Shih Tzu", sex: "Macho", weight: "6.3 kg", age: "7 años", ownerId: "c5", notes: "Problema de cadera: evitar mesa alta mucho tiempo.", lastVisit: "2026-08-31", photo: "🐶" },
];

export const appointments: Appointment[] = [
  { id: "a1", petId: "p1", customerId: "c1", serviceId: "s3", employeeId: "e1", date: "2026-09-01", time: "09:00", price: 45, status: "confirmada", petState: "bano", notes: "Cliente llega 10 min antes.", notified: false },
  { id: "a2", petId: "p4", customerId: "c3", serviceId: "s2", employeeId: "e1", date: "2026-09-01", time: "09:30", price: 32, status: "confirmada", petState: "secado", notes: "Moño rosado.", notified: false },
  { id: "a3", petId: "p3", customerId: "c2", serviceId: "s1", employeeId: "e2", date: "2026-09-01", time: "10:00", price: 20, status: "confirmada", petState: "grooming", notes: "", notified: false },
  { id: "a4", petId: "p5", customerId: "c4", serviceId: "s3", employeeId: "e2", date: "2026-09-01", time: "10:30", price: 45, status: "pendiente", petState: "esperando", notes: "Confirmar por WhatsApp.", notified: false },
  { id: "a5", petId: "p7", customerId: "c5", serviceId: "s3", employeeId: "e3", date: "2026-09-01", time: "11:00", price: 45, status: "confirmada", petState: "lista", notes: "Cuidado con la cadera.", notified: true },
  { id: "a6", petId: "p2", customerId: "c1", serviceId: "s4", employeeId: "e3", date: "2026-09-01", time: "11:30", price: 8, status: "completada", petState: "recogida", notes: "", notified: true },
  { id: "a7", petId: "p6", customerId: "c4", serviceId: "s1", employeeId: "e1", date: "2026-09-01", time: "13:00", price: 20, status: "pendiente", petState: "esperando", notes: "Primera visita.", notified: false },
  { id: "a8", petId: "p1", customerId: "c1", serviceId: "s4", employeeId: "e1", date: "2026-09-01", time: "14:00", price: 8, status: "cancelada", petState: "esperando", notes: "Cliente reprogramará.", notified: false },
  { id: "a9", petId: "p3", customerId: "c2", serviceId: "s2", employeeId: "e2", date: "2026-09-02", time: "09:00", price: 32, status: "confirmada", petState: "esperando", notes: "", notified: false },
  { id: "a10", petId: "p4", customerId: "c3", serviceId: "s3", employeeId: "e3", date: "2026-09-03", time: "10:00", price: 45, status: "pendiente", petState: "esperando", notes: "", notified: false },
  { id: "a11", petId: "p5", customerId: "c4", serviceId: "s1", employeeId: "e1", date: "2026-09-04", time: "15:00", price: 20, status: "confirmada", petState: "esperando", notes: "", notified: false },
  { id: "a12", petId: "p7", customerId: "c5", serviceId: "s2", employeeId: "e2", date: "2026-09-05", time: "16:00", price: 32, status: "confirmada", petState: "esperando", notes: "", notified: false },
];

export const TODAY = "2026-09-01";

export const findPet = (id: string) => pets.find((p) => p.id === id);
export const findCustomer = (id: string) => customers.find((c) => c.id === id);
export const findService = (id: string) => services.find((s) => s.id === id);
export const findEmployee = (id: string) => employees.find((e) => e.id === id);

export const weeklyRevenue = [
  { day: "Lun", ingresos: 320, mascotas: 9 },
  { day: "Mar", ingresos: 410, mascotas: 12 },
  { day: "Mié", ingresos: 285, mascotas: 8 },
  { day: "Jue", ingresos: 460, mascotas: 14 },
  { day: "Vie", ingresos: 520, mascotas: 16 },
  { day: "Sáb", ingresos: 680, mascotas: 21 },
  { day: "Dom", ingresos: 140, mascotas: 4 },
];

export const serviceUsage = [
  { name: "Baño + Grooming", total: 64 },
  { name: "Baño", total: 41 },
  { name: "Grooming", total: 28 },
  { name: "Corte de uñas", total: 17 },
];
