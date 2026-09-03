import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoAsset from "@/assets/groomsync-logo.png.asset.json";

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
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(600);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!sent) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [sent]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const complete = code.every((c) => c !== "");

  const setDigit = (i: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCode((prev) => prev.map((c, idx) => (idx === i ? digit : c)));
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  return (
    <div className="grid min-h-screen place-items-center gradient-hero px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Volver al login
        </Link>

        <div className="surface-card p-6 sm:p-8">
          {sent ? (
            <div>
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-success/12 text-success">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h1 className="type-h2 mt-4 text-center">Instrucciones enviadas</h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Coloca el código que te llegó al correo <strong className="text-foreground">{email}</strong>.
              </p>

              <div className="mt-6 flex justify-center gap-2">
                {code.map((digit, i) => (
                  <Input
                    key={i}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
                    }}
                    aria-label={`Dígito ${i + 1} del código`}
                    className="h-12 w-11 text-center text-lg font-bold"
                  />
                ))}
              </div>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                El código expira en{" "}
                <strong className="text-foreground">
                  {mm}:{ss}
                </strong>
              </p>

              <Button
                className="mt-6 h-11 w-full"
                disabled={!complete || seconds === 0}
                onClick={() => navigate({ to: "/nueva-password" })}
              >
                Restablecer contraseña
              </Button>
            </div>
          ) : (
            <>
              <img src={logoAsset.url} alt="GroomSync" className="h-14 w-14 object-contain" />
              <h1 className="type-h2 mt-4">Recuperar contraseña</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ingresa el email asociado a tu cuenta y te enviaremos instrucciones para crear una nueva contraseña.
              </p>
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSeconds(600);
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
