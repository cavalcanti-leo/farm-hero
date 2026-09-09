import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className }) => {
  const [show, setShow] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-semibold text-white border border-slate-700 shadow-xl whitespace-nowrap z-50 animate-in fade-in duration-150",
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
