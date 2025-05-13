
import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DateFilterType = 'today' | 'this_week' | 'this_month' | 'custom';

interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

interface OrderDateFilterProps {
  onDateFilterChange: (filterType: DateFilterType, dateRange?: DateRange) => void;
}

export function OrderDateFilter({ onDateFilterChange }: OrderDateFilterProps) {
  const [filterType, setFilterType] = useState<DateFilterType>('this_week');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const handleFilterTypeChange = (value: string) => {
    const newFilterType = value as DateFilterType;
    setFilterType(newFilterType);
    onDateFilterChange(newFilterType, dateRange);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range.from && range.to) {
      onDateFilterChange('custom', range);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select defaultValue={filterType} onValueChange={handleFilterTypeChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Chọn thời gian" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hôm nay</SelectItem>
          <SelectItem value="this_week">Tuần này</SelectItem>
          <SelectItem value="this_month">Tháng này</SelectItem>
          <SelectItem value="custom">Tùy chỉnh</SelectItem>
        </SelectContent>
      </Select>

      {filterType === 'custom' && (
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Chọn ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
                locale={vi}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
