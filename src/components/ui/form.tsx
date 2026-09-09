import * as React from "react";
import { cn } from "@/lib/utils";

export const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = ({ className, ...props }) => (
  <form className={cn("space-y-4", className)} {...props} />
);

export const FormItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("space-y-2", className)} {...props} />
);

export const FormLabel: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
  <label className={cn("text-xs font-bold text-slate-300 uppercase tracking-wider block", className)} {...props} />
);

export const FormControl: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("relative", className)} {...props} />
);

export const FormMessage: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => {
  if (!children) return null;
  return <p className={cn("text-xs font-semibold text-red-400 mt-1", className)} {...props}>{children}</p>;
};
