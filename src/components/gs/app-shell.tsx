import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Building2, ChevronDown, LogOut, Menu, PawPrint, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BRANCHES, ROLE_LABEL } from "@/lib/groomsync-data";
import { signOut, useGroom } from "@/lib/groomsync-store";
import { NAV_BY_ROLE } from "./nav";
import { cn } from "@/lib/utils";

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { role } = useGroom();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = NAV_BY_ROLE[role];

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { role, branch } = useGroom();
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground">
          <PawPrint className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-extrabold text-sidebar-foreground">GroomSync</p>
          <p className="truncate text-[11px] text-sidebar-foreground/60">{branch}</p>
        </div>
      </div>
      <div className="mx-3 mb-2 rounded-xl bg-sidebar-accent/60 px-3 py-2">
        <p className="eyebrow text-sidebar-foreground/50">Rol activo</p>
        <p className="truncate text-xs font-semibold text-sidebar-foreground">{ROLE_LABEL[role]}</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="border-t border-sidebar-border p-4">
        <p className="text-[11px] leading-relaxed text-sidebar-foreground/50">
          Plan Sucursal · $49/mes
          <br />
          Soporte: soporte@groomsync.app
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { role, userName, branch, setBranch } = useGroom();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border lg:block">
        <SidebarBody />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 border-sidebar-border p-0">
                  <SheetTitle className="sr-only">Navegación</SheetTitle>
                  <SidebarBody onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>

              {role === "dueno" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="hidden max-w-[140px] truncate sm:inline">{branch}</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Sucursal</DropdownMenuLabel>
                    {BRANCHES.map((b) => (
                      <DropdownMenuItem key={b} onClick={() => setBranch(b)}>
                        {b}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar mascota, cliente o cita..."
                className="h-9 w-full pl-9"
                aria-label="Buscar"
              />
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <Button variant="ghost" size="icon" aria-label="Notificaciones" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-2 transition-colors hover:bg-accent">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                      {initials || "GS"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <span className="block truncate">{userName || "Usuario"}</span>
                    <span className="type-caption block">{ROLE_LABEL[role]}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      signOut();
                      navigate({ to: "/login" });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 space-y-5 px-3 py-5 sm:px-5 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
