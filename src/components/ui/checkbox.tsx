import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onCheckedChange, className }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-md border border-slate-700 ring-offset-background focus-visible:outline-none flex items-center justify-center transition-all",
      checked ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-900",
      className
    )}
  >
    {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
  </button>
);
