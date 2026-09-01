import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  appointments as seedAppointments,
  BRANCHES,
  customers as seedCustomers,
  employees as seedEmployees,
  pets as seedPets,
  services as seedServices,
  type Appointment,
  type ApptState,
  type Customer,
  type Employee,
  type PetState,
  type Role,
  type Service,
} from "./groomsync-data";

const ROLE_KEY = "groomsync.role";
const USER_KEY = "groomsync.user";

export function readRole(): Role | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(ROLE_KEY);
  return value === "dueno" || value === "admin" || value === "peluquero" ? value : null;
}

export function readUserName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(USER_KEY) ?? "";
}

export function signIn(role: Role, name: string) {
  window.localStorage.setItem(ROLE_KEY, role);
  window.localStorage.setItem(USER_KEY, name);
}

export function signOut() {
  window.localStorage.removeItem(ROLE_KEY);
  window.localStorage.removeItem(USER_KEY);
}

type Ctx = {
  role: Role;
  userName: string;
  branch: string;
  setBranch: (b: string) => void;
  appointments: Appointment[];
  customers: Customer[];
  pets: typeof seedPets;
  employees: Employee[];
  services: Service[];
  currentEmployeeId: string;
  setPetState: (appointmentId: string, state: PetState) => void;
  setApptState: (appointmentId: string, state: ApptState) => void;
  addAppointment: (a: Omit<Appointment, "id" | "notified">) => void;
  addCustomer: (c: Omit<Customer, "id" | "petIds" | "since" | "lastVisit">) => void;
  toggleEmployee: (id: string) => void;
  toggleService: (id: string) => void;
  addService: (s: Omit<Service, "id">) => void;
};

const GroomContext = createContext<Ctx | null>(null);

export function GroomProvider({
  role,
  userName,
  children,
}: {
  role: Role;
  userName: string;
  children: ReactNode;
}) {
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
  const [services, setServices] = useState<Service[]>(seedServices);

  const setPetState = useCallback((id: string, state: PetState) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              petState: state,
              notified: state === "lista" ? true : a.notified,
              status: state === "recogida" ? "completada" : a.status,
            }
          : a,
      ),
    );
  }, []);

  const setApptState = useCallback((id: string, state: ApptState) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: state } : a)));
  }, []);

  const addAppointment = useCallback((a: Omit<Appointment, "id" | "notified">) => {
    setAppointments((prev) => [...prev, { ...a, id: `a${prev.length + 1}${Date.now() % 1000}`, notified: false }]);
  }, []);

  const addCustomer = useCallback((c: Omit<Customer, "id" | "petIds" | "since" | "lastVisit">) => {
    setCustomers((prev) => [
      ...prev,
      { ...c, id: `c${prev.length + 1}${Date.now() % 1000}`, petIds: [], since: "2026-09-01", lastVisit: "—" },
    ]);
  }, []);

  const toggleEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e)));
  }, []);

  const toggleService = useCallback((id: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  }, []);

  const addService = useCallback((s: Omit<Service, "id">) => {
    setServices((prev) => [...prev, { ...s, id: `s${prev.length + 1}${Date.now() % 1000}` }]);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      role,
      userName,
      branch,
      setBranch,
      appointments,
      customers,
      pets: seedPets,
      employees,
      services,
      currentEmployeeId: "e1",
      setPetState,
      setApptState,
      addAppointment,
      addCustomer,
      toggleEmployee,
      toggleService,
      addService,
    }),
    [
      role,
      userName,
      branch,
      appointments,
      customers,
      employees,
      services,
      setPetState,
      setApptState,
      addAppointment,
      addCustomer,
      toggleEmployee,
      toggleService,
      addService,
    ],
  );

  return <GroomContext.Provider value={value}>{children}</GroomContext.Provider>;
}

export function useGroom() {
  const ctx = useContext(GroomContext);
  if (!ctx) throw new Error("useGroom debe usarse dentro de GroomProvider");
  return ctx;
}
