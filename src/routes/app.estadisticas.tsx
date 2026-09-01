import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, DollarSign, PawPrint, Scissors, UserPlus, XCircle } from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "@/components/gs/primitives";
import { useGroom } from "@/lib/groomsync-store";
import { serviceUsage, weeklyRevenue } from "@/lib/groomsync-data";

export const Route = createFileRoute("/app/estadisticas")({
  head: () => ({
    meta: [
      { title: "Estadísticas — GroomSync" },
      { name: "description", content: "Ingresos, mascotas atendidas, cancelaciones y servicios más usados." },
      { property: "og:title", content: "Estadísticas — GroomSync" },
      { property: "og:description", content: "Métricas simples para tomar decisiones en tu peluquería." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EstadisticasPage,
});

function EstadisticasPage() {
  const { appointments, employees } = useGroom();

  return (
    <div className="space-y-5">
      <PageHeader title="Estadísticas" subtitle="Últimos 7 días · Costa del Este" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Mascotas atendidas" value={84} icon={PawPrint} tone="primary" />
        <StatCard label="Citas completadas" value={78} icon={CalendarCheck} tone="success" />
        <StatCard label="Cancelaciones" value={6} icon={XCircle} tone="warning" />
        <StatCard label="Clientes nuevos" value={11} icon={UserPlus} tone="info" />
        <StatCard label="Ingresos" value="$2,815" icon={DollarSign} tone="success" />
        <StatCard label="Servicios realizados" value={150} icon={Scissors} tone="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Ingresos por día" description="En dólares">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="ingresos" stroke="var(--color-primary)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Mascotas atendidas por día">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="mascotas" fill="var(--color-primary-glow)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Servicios más utilizados">
          <ul className="space-y-3">
            {serviceUsage.map((s) => (
              <li key={s.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="truncate font-semibold text-foreground">{s.name}</span>
                  <span className="text-muted-foreground">{s.total}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full gradient-brand" style={{ width: `${(s.total / 64) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Servicios por peluquero">
          <ul className="divide-y divide-border">
            {employees
              .filter((e) => e.role === "peluquero")
              .map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                  <span className="truncate font-semibold text-foreground">{e.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {e.servicesDone} servicios · {appointments.filter((a) => a.employeeId === e.id).length} citas
                  </span>
                </li>
              ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
