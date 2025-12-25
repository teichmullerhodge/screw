import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"



export interface DeleteFiltersModalProps {

  open: boolean, 
  onOpenChange: (v: boolean) => void, 
  title: string | undefined, 
  onDelete: () => void
}

export default function deleteFiltersModal(props: DeleteFiltersModalProps) {

  return (
  <Dialog open={props.open} onOpenChange={props.onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete confirmation</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete{" "}
        <span className="font-medium">
          {props.title}
        </span>
        ?
      </DialogDescription>
    </DialogHeader>

    <DialogFooter>
      <Button variant="ghost" onClick={() => props.onOpenChange(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={props.onDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}
