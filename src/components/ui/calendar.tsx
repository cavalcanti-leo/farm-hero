import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalendarProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate = new Date(),
  onSelectDate,
  className,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div
      className={cn(
        "p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold text-white capitalize">
          {currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const isSelected =
            selectedDate.getDate() === dayNum &&
            selectedDate.getMonth() === currentMonth.getMonth();
          return (
            <button
              key={dayNum}
              onClick={() =>
                onSelectDate?.(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum),
                )
              }
              className={cn(
                "h-9 w-9 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors mx-auto",
                isSelected
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md"
                  : "text-slate-200 hover:bg-slate-800",
              )}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};
