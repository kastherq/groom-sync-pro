import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signIn } from "@/lib/groomsync-store";
import { HOME_BY_ROLE } from "@/components/gs/nav";
import type { Role } from "@/lib/groomsync-data";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/groomsync-logo.png.asset.json";
import dogAsset from "@/assets/login-dog.jpg.asset.json";

const DEMO_USERS: { role: Role; name: string; label: string; suffix: string }[] = [
  { role: "dueno", name: "Patricia Herrera", label: "Dueño", suffix: "" },
  { role: "admin", name: "Andrés Gómez", label: "Administración", suffix: ".admin" },
  { role: "peluquero", name: "Laura Méndez", label: "Peluquería", suffix: ".laura" },
];

export function LoginView({ salon = "petfashion" }: { salon?: string }) {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("dueno");
  const selected = DEMO_USERS.find((u) => u.role === role) ?? DEMO_USERS[0]!;
  const [username, setUsername] = useState(salon);
  const [password, setPassword] = useState("groomsync");
  const [contactOpen, setContactOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(role, selected.name);
    navigate({ to: HOME_BY_ROLE[role] });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Volver al sitio
        </Link>

        <div className="mx-auto w-full max-w-md">
          <img src={logoAsset.url} alt="GroomSync" className="h-16 w-16 object-contain" />
          <h1 className="type-h1 mt-4">GroomSync</h1>
          <p className="mt-1 text-sm font-semibold text-primary">{salon}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Usa las credenciales entregadas por el equipo de GroomSync. Si no tienes acceso, contacta al dueño de tu
            sucursal.
          </p>

          <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/50 p-3">
            <p className="eyebrow mb-2 text-muted-foreground">ELIGE UN ROL PARA EMPEZAR</p>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.role}
                  type="button"
                  onClick={() => {
                    setRole(u.role);
                    setUsername(`${salon}${u.suffix}`);
                  }}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-xs font-semibold transition-colors",
                    role === u.role
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 pl-9"
                  placeholder="petfashion"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox defaultChecked /> Recordarme
              </label>
              {role === "dueno" ? (
                <Link to="/recuperar-password" className="text-sm font-semibold text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>

            <Button type="submit" className="h-11 w-full">
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>

      <aside className="relative hidden flex-col justify-end overflow-hidden lg:flex">
        <img src={dogAsset.url} alt="Perro recién bañado en una peluquería canina" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar/90 via-sidebar/30 to-transparent" aria-hidden />
        <div className="relative p-12">
          <p className="eyebrow text-sidebar-foreground/70">GroomSync · Pet Grooming Software</p>
          <h2 className="mt-4 max-w-sm font-display text-3xl font-extrabold leading-tight text-sidebar-foreground">
            Toda la peluquería en una sola pantalla, en tiempo real.
          </h2>
        </div>
      </aside>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Recuperación de acceso</DialogTitle>
            <DialogDescription>Contáctate con el dueño para restablecer tu acceso al sistema</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="w-full" onClick={() => setContactOpen(false)}>
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
