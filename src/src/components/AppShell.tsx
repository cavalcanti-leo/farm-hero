import { Link, useRouterState } from "@tanstack/react-router";
import { Home, User, HeartPulse, Gamepad2, Menu } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Início", icon: Home },
  { to: "/avatar", label: "Avatar", icon: User },
  { to: "/saude", label: "Saúde", icon: HeartPulse },
  { to: "/jogos", label: "Jogos", icon: Gamepad2 },
  { to: "/mais", label: "Mais", icon: Menu },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <ul className="sticker flex items-stretch justify-between rounded-full bg-card px-2 py-1.5">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1 text-[10px] font-extrabold transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-2xl transition-all",
                    active &&
                    "-translate-y-1 border-2 border-ink bg-gradient-primary text-primary-foreground shadow-sticker",
                  )}
                >
                  <Icon className="size-5" strokeWidth={2.8} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-background bg-confetti pb-32">
      {children}
      <BottomNav />
    </div>
  );
}

export function ScreenHeader({
  title,
  emoji,
  variant = "primary",
  back = true,
  right,
}: {
  title: string;
  emoji?: string;
  variant?: "primary" | "water" | "food" | "med" | "move" | "femme";
  back?: boolean;
  right?: ReactNode;
}) {
  const bg = {
    primary: "bg-gradient-primary",
    water: "bg-gradient-water",
    food: "bg-gradient-food",
    med: "bg-gradient-med",
    move: "bg-gradient-move",
    femme: "bg-gradient-med",
  }[variant];

  return (
    <header
      className={cn(
        bg,
        "sticky top-0 z-30 flex items-center gap-3 rounded-b-[2rem] border-b-3 border-ink px-4 py-4 text-primary-foreground shadow-pop",
      )}
    >
      {back && (
        <Link
          to="/saude"
          aria-label="Voltar"
          className="flex size-9 items-center justify-center rounded-full border-2 border-ink bg-card/30 text-lg font-extrabold text-primary-foreground active:scale-95"
        >
          ←
        </Link>
      )}
      <h1 className="flex-1 text-center text-2xl font-extrabold drop-shadow-[2px_2px_0_var(--ink)]">
        {title}
      </h1>
      <span className="flex size-9 animate-wiggle items-center justify-center text-2xl">
        {right ?? emoji}
      </span>
    </header>
  );
}

