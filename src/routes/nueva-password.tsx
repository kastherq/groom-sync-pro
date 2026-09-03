import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import logoAsset from "@/assets/groomsync-logo.png.asset.json";

export const Route = createFileRoute("/nueva-password")({
  head: () => ({
    meta: [
      { title: "Nueva contraseña — GroomSync" },
      { name: "description", content: "Crea una nueva contraseña para tu cuenta de GroomSync." },
      { property: "og:title", content: "Nueva contraseña — GroomSync" },
      { property: "og:description", content: "Define tu nueva contraseña de acceso a GroomSync." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewPasswordPage,
});

function NewPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center gradient-hero px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Volver al login
        </Link>

        <div className="surface-card p-6 sm:p-8">
          <img src={logoAsset.url} alt="GroomSync" className="h-14 w-14 object-contain" />
          <h1 className="type-h2 mt-4">Nueva contraseña</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresa tu nueva contraseña dos veces para confirmar el cambio.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (password.length < 6) {
                setError("La contraseña debe tener al menos 6 caracteres.");
                return;
              }
              if (password !== confirm) {
                setError("Las contraseñas no coinciden.");
                return;
              }
              setError("");
              setDone(true);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="password">Nueva contraseña</Label>
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

            <div className="space-y-1.5">
              <Label htmlFor="confirm">Repetir contraseña</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="h-11 pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}

            <Button type="submit" className="h-11 w-full">
              Cambiar contraseña
            </Button>
          </form>
        </div>
      </div>

      <Dialog open={done} onOpenChange={setDone}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Contraseña cambiada exitosamente</DialogTitle>
            <DialogDescription>Ya puedes iniciar sesión con tu nueva contraseña.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="w-full" onClick={() => navigate({ to: "/login" })}>
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
