import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/recuperar-password")({
  head: () => ({
    meta: [
      { title: "Recuperar contraseña — GroomSync" },
      { name: "description", content: "Recupera el acceso a tu cuenta de GroomSync en pocos pasos." },
      { property: "og:title", content: "Recuperar contraseña — GroomSync" },
      { property: "og:description", content: "Enviamos instrucciones a tu correo para restablecer tu contraseña." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RecoverPage,
});

function RecoverPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center gradient-hero px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Volver al login
        </Link>

        <div className="surface-card p-6 sm:p-8">
          {sent ? (
            <div className="text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-success/12 text-success">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <h1 className="type-h2 mt-4">Instrucciones enviadas</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enviamos un correo a <strong className="text-foreground">{email}</strong> con los pasos para restablecer
                tu contraseña. El enlace expira en 30 minutos.
              </p>
              <div className="mt-6 space-y-2">
                <Button asChild className="h-11 w-full">
                  <Link to="/login">Ir al login</Link>
                </Button>
                <Button variant="ghost" className="h-11 w-full" onClick={() => setSent(false)}>
                  Reenviar instrucciones
                </Button>
              </div>
            </div>
          ) : (
            <>
              <span className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-primary-foreground">
                <PawPrint className="h-6 w-6" />
              </span>
              <h1 className="type-h2 mt-5">Recuperar contraseña</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ingresa el email asociado a tu cuenta y te enviaremos instrucciones para crear una nueva contraseña.
              </p>
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
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
                <Button type="submit" className="h-11 w-full">
                  Enviar instrucciones
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
