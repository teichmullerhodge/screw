import { ProgrammingLanguages } from "@/lib/common-interfaces";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export interface ProgrammingLanguagesSelectionProps {
  onValueChange: (v: string) => void
}

export function ProgrammingLanguagesSelection(props: ProgrammingLanguagesSelectionProps) {
  const languages = Object.values(ProgrammingLanguages)
   return (
    <Select onValueChange={(v) => props.onValueChange(v)}>
      <SelectTrigger className="focus:ring-0 focus:ring-offset-0 w-[150px]">
        <SelectValue placeholder="Language" />
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
        {languages.map((l) => (
          <SelectItem key={l} value={l}>
            {l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

