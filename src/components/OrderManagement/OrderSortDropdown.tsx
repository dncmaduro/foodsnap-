
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = 'time_newest' | 'time_oldest' | 'amount_high' | 'amount_low';

interface OrderSortDropdownProps {
  onSortChange: (sort: SortOption) => void;
}

export function OrderSortDropdown({ onSortChange }: OrderSortDropdownProps) {
  return (
    <Select defaultValue="time_newest" onValueChange={(value) => onSortChange(value as SortOption)}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Sắp xếp theo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="time_newest">Thời gian (Mới nhất)</SelectItem>
        <SelectItem value="time_oldest">Thời gian (Cũ nhất)</SelectItem>
        <SelectItem value="amount_high">Tổng tiền (Cao → Thấp)</SelectItem>
        <SelectItem value="amount_low">Tổng tiền (Thấp → Cao)</SelectItem>
      </SelectContent>
    </Select>
  );
}
