import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn("sticker rounded-[1.75rem] bg-card p-4", className)} {...rest}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2 flex items-center gap-2 px-1 text-lg font-extrabold text-foreground">
      <span className="inline-block h-4 w-2 rounded-full bg-gradient-fun" />
      {children}
    </h2>
  );
}

export function ProgressBar({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div
      className={cn(
        "h-4 w-full overflow-hidden rounded-full border-2 border-ink bg-muted p-0.5",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full bg-gradient-primary transition-all", barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function PillButton({
  children,
  className,
  variant = "primary",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "water" | "med" | "move" | "soft" | "fun";
}) {
  const styles = {
    primary: "bg-gradient-primary text-primary-foreground",
    water: "bg-gradient-water text-primary-foreground",
    med: "bg-gradient-med text-primary-foreground",
    move: "bg-gradient-move text-move-foreground",
    fun: "bg-gradient-fun text-fun-foreground",
    soft: "bg-secondary text-secondary-foreground",
  }[variant];

  return (
    <button
      className={cn(
        "sticker flex w-full items-center justify-center gap-2 rounded-full px-4 py-3.5 text-base font-extrabold uppercase tracking-wide transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none",
        styles,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}


export function Chip({
  active,
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "rounded-full border-2 border-ink px-3 py-1.5 text-xs font-extrabold transition-transform active:scale-95",
        active
          ? "bg-gradient-primary text-primary-foreground shadow-sticker"
          : "bg-card text-muted-foreground",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full border-2 border-ink bg-muted p-1">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "flex-1 rounded-full px-3 py-2 text-xs font-extrabold transition-all",
            value === o
              ? "bg-gradient-primary text-primary-foreground shadow-soft"
              : "text-muted-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
  emoji,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  emoji: string;
  className?: string;
}) {
  return (
    <div className={cn("sticker rounded-[1.75rem] bg-card p-4 text-center", className)}>
      <div className="text-4xl drop-shadow-sm">{emoji}</div>
      <p className="mt-1 text-sm font-extrabold">{label}</p>
      <p className="text-xl font-extrabold text-primary">{value}</p>
      {hint && <p className="text-[11px] font-bold text-muted-foreground">{hint}</p>}
    </div>
  );
}


export function Disclaimer() {
  return (
    <p className="px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
      As informações do PharmaLife apoiam o autocuidado e o acompanhamento farmacêutico e não
      substituem diagnóstico ou tratamento médico.
    </p>
  );
}
