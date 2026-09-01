import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CalendarDays, LineChart, PawPrint, Scissors, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GroomSync — Software para peluquerías caninas" },
      {
        name: "description",
        content:
          "GroomSync organiza citas, mascotas y clientes de tu peluquería canina, y avisa por WhatsApp cuando la mascota está lista.",
      },
      { property: "og:title", content: "GroomSync — Software para peluquerías caninas" },
      {
        property: "og:description",
        content: "Agenda, estados en tiempo real y avisos automáticos para peluquerías caninas pequeñas y medianas.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: CalendarDays, title: "Agenda clara", text: "Citas por día, hora y peluquero, sin dobles reservas." },
  { icon: PawPrint, title: "Estado en vivo", text: "Esperando, baño, secado, grooming, lista y recogida." },
  { icon: Bell, title: "Avisos WhatsApp", text: "El dueño sabe al instante cuando su mascota está lista." },
  { icon: Users, title: "Clientes y mascotas", text: "Ficha con raza, peso, notas de comportamiento e historial." },
  { icon: Scissors, title: "Servicios y equipo", text: "Precios, duración y carga de trabajo por peluquero." },
  { icon: LineChart, title: "Estadísticas simples", text: "Ingresos, mascotas atendidas y servicios más usados." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-5">
        <span className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="truncate font-display text-lg font-extrabold text-foreground">GroomSync</span>
        </span>
        <Button asChild className="h-10">
          <Link to="/login">Entrar</Link>
        </Button>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 text-center">
          <p className="eyebrow text-primary">Para peluquerías caninas</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
            Toda tu peluquería canina, ordenada en una sola pantalla
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Gestiona citas, mascotas, clientes y equipo con un flujo pensado para el día a día del salón. Simple para
            recepción, rapidísimo para los peluqueros.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-6">
              <Link to="/login">Probar la demo</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6">
              <Link to="/login">Ver roles disponibles</Link>
            </Button>
          </div>
        </section>

        <section className="border-y border-border bg-muted/40 py-14">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="font-display text-2xl font-bold text-foreground">Lo esencial, sin funciones de más</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <article key={f.title} className="surface-card p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-display font-bold text-foreground">{f.title}</h3>
                  <p className="type-caption mt-1">{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">Listo para tu salón</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Entra con un rol de demostración: dueño, administrador o peluquero.
          </p>
          <Button asChild size="lg" className="mt-6 h-12 px-6">
            <Link to="/login">Entrar a GroomSync</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <p className="type-caption text-center">GroomSync · Software de gestión para peluquerías caninas</p>
      </footer>
    </div>
  );
}
