import { ApplicationCategories } from "@/lib/common-interfaces";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


export interface CategoriesSelectionProps {
  onValueChange: (v: string) => void
}

export function CategoriesSelection(props: CategoriesSelectionProps) {
  const categories = Object.values(ApplicationCategories);

  return (
    <Select onValueChange={(v) => props.onValueChange(v)}>
      <SelectTrigger className="focus:ring-0 focus:ring-offset-0 w-[150px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>

      <SelectContent
        position="popper"
        side="bottom"
        sideOffset={4}
        className="max-h-60"
      >
      <SelectItem key={"all"} value={"all"}>
          All
      </SelectItem>
      {categories.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


