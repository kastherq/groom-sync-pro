import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, Mail, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signIn } from "@/lib/groomsync-store";
import { HOME_BY_ROLE } from "@/components/gs/nav";
import { ROLE_LABEL, type Role } from "@/lib/groomsync-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — GroomSync" },
      { name: "description", content: "Accede a GroomSync con las credenciales entregadas por tu peluquería." },
      { property: "og:title", content: "Iniciar sesión — GroomSync" },
      { property: "og:description", content: "Acceso al panel de gestión de tu peluquería canina." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

const DEMO_USERS: { role: Role; name: string; email: string }[] = [
  { role: "dueno", name: "Patricia Herrera", email: "duena@groomsync.app" },
  { role: "admin", name: "Andrés Gómez", email: "recepcion@groomsync.app" },
  { role: "peluquero", name: "Laura Méndez", email: "laura@groomsync.app" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("dueno");
  const selected = DEMO_USERS.find((u) => u.role === role) ?? DEMO_USERS[0]!;
  const [email, setEmail] = useState(selected.email);
  const [password, setPassword] = useState("groomsync");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    signIn(role, selected.name);
    setTimeout(() => navigate({ to: HOME_BY_ROLE[role] }), 300);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Volver al sitio
        </Link>

        <div className="mx-auto w-full max-w-md">
          <span className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-primary-foreground">
            <PawPrint className="h-6 w-6" />
          </span>
          <h1 className="type-h2 mt-5">Inicia sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Usa las credenciales entregadas por el equipo de GroomSync. Si no tienes acceso, contacta al dueño de tu
            sucursal.
          </p>

          <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/50 p-3">
            <p className="eyebrow mb-2 text-muted-foreground">Demo: elige un rol para explorar</p>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.role}
                  type="button"
                  onClick={() => {
                    setRole(u.role);
                    setEmail(u.email);
                  }}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-xs font-semibold transition-colors",
                    role === u.role
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {ROLE_LABEL[u.role].split(" / ")[0]}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-9"
                  placeholder="tu@peluqueria.com"
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
              <Link to="/recuperar-password" className="text-sm font-semibold text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? "Ingresando…" : "Iniciar sesión"}
            </Button>
          </form>

          <p className="type-caption mt-6">
            GroomSync se entrega configurado por nuestro equipo. No existe registro público de negocios.
          </p>
        </div>
      </div>

      <aside className="relative hidden flex-col justify-between bg-sidebar p-12 lg:flex">
        <div className="gradient-brand absolute inset-0 opacity-30" aria-hidden />
        <div className="relative">
          <p className="eyebrow text-sidebar-foreground/60">GroomSync · Plataforma operativa</p>
          <h2 className="mt-4 max-w-sm font-display text-3xl font-extrabold leading-tight text-sidebar-foreground">
            Toda la peluquería en una sola pantalla, en tiempo real.
          </h2>
        </div>
        <div className="relative space-y-3">
          {[
            { emoji: "⏳", label: "Esperando", value: "2 mascotas" },
            { emoji: "🛁", label: "En baño", value: "1 mascota" },
            { emoji: "✂️", label: "Grooming", value: "1 mascota" },
            { emoji: "🟢", label: "Listas para recoger", value: "1 mascota" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-xl border border-sidebar-border bg-sidebar-accent/50 px-4 py-3"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-sidebar-foreground">
                <span aria-hidden>{row.emoji}</span> {row.label}
              </span>
              <span className="text-sm text-sidebar-foreground/70">{row.value}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
