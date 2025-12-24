import { JSX } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export interface ViewSelectionProps {
  onValueChange: (view: string) => void,
    viewsIcon: Array<JSX.Element>,
    views: Array<string>,
    defaultValue: string // member of views.
}

export default function ViewSelection(props: ViewSelectionProps) {

   return (
    <Select onValueChange={(v) => props.onValueChange(v)} defaultValue={props.defaultValue}>
      <SelectTrigger className="focus:ring-0 focus:ring-offset-0 w-[150px]">
        <SelectValue placeholder="View" />
      </SelectTrigger>

      <SelectContent
        position="popper"
        side="bottom"
        sideOffset={4}
        className="max-h-60"
      >
      {props.views.map((c, idx) => (
          <SelectItem key={c} value={c}>
            {props.viewsIcon[idx]} {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


