import {
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  PawPrint,
  Scissors,
  Settings,
  TrendingUp,
  Users,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LinkProps } from "@tanstack/react-router";
import type { Role } from "@/lib/groomsync-data";

export type NavItem = { label: string; to: NonNullable<LinkProps["to"]>; icon: LucideIcon };

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  dueno: [
    { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard },
    { label: "Citas", to: "/app/citas", icon: CalendarDays },
    { label: "Mascotas", to: "/app/mascotas", icon: PawPrint },
    { label: "Clientes", to: "/app/clientes", icon: Users },
    { label: "Empleados", to: "/app/empleados", icon: UsersRound },
    { label: "Servicios", to: "/app/servicios", icon: Scissors },
    { label: "Estadísticas", to: "/app/estadisticas", icon: TrendingUp },
    { label: "Configuración", to: "/app/configuracion", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard },
    { label: "Citas", to: "/app/citas", icon: CalendarDays },
    { label: "Agenda", to: "/app/agenda", icon: CalendarRange },
    { label: "Mascotas", to: "/app/mascotas", icon: PawPrint },
    { label: "Clientes", to: "/app/clientes", icon: Users },
    { label: "Empleados", to: "/app/empleados", icon: UsersRound },
  ],
  peluquero: [
    { label: "Citas de hoy", to: "/app/mis-citas", icon: CalendarDays },
    { label: "Mascotas del día", to: "/app/mis-mascotas", icon: PawPrint },
  ],
};

export const HOME_BY_ROLE: Record<Role, string> = {
  dueno: "/app/dashboard",
  admin: "/app/dashboard",
  peluquero: "/app/mis-citas",
};
