import { cn } from "@/lib/utils";
import { APPT_STATE_META, PET_STATE_META, type ApptState, type PetState } from "@/lib/groomsync-data";

export function PetStateBadge({
  state,
  size = "md",
  className,
}: {
  state: PetState;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const meta = PET_STATE_META[state];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border font-semibold",
        size === "sm" && "px-2 py-0.5 text-[11px]",
        size === "md" && "px-2.5 py-1 text-xs",
        size === "lg" && "px-3.5 py-1.5 text-sm",
        meta.className,
        className,
      )}
    >
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}

export function ApptStateBadge({ state, className }: { state: ApptState; className?: string }) {
  const meta = APPT_STATE_META[state];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        meta.className,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {meta.label}
    </span>
  );
}

export function PetStateTimeline({ state }: { state: PetState }) {
  const flow: PetState[] = ["esperando", "bano", "secado", "grooming", "lista", "recogida"];
  const activeIndex = flow.indexOf(state);
  return (
    <ol className="flex flex-wrap items-center gap-1.5">
      {flow.map((step, i) => {
        const meta = PET_STATE_META[step];
        const done = activeIndex >= i && activeIndex !== -1;
        return (
          <li key={step} className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-colors",
                done ? meta.className : "border-border bg-muted text-muted-foreground",
              )}
            >
              <span aria-hidden>{meta.emoji}</span>
              <span className="hidden sm:inline">{meta.label}</span>
            </span>
            {i < flow.length - 1 && <span className="h-px w-3 bg-border" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
