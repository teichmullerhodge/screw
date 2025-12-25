import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useRef, useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export interface EditFiltersModalProps {
 open: boolean 
 onOpenChange: (v: boolean) => void 
 onSubmit: (name: string, image: File | null) => void
 title: string | undefined,
 defaultName: string 
}

export default function EditFiltersModal(props: EditFiltersModalProps){

  const nameRef = useRef<string>(props.defaultName);
  const imageRef = useRef<File | null>(null);
  const [tick, setTick] = useState<number>(0);

  return(
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit {props.title}</DialogTitle>
      <DialogDescription>
        Change name and image
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      <div>
        <Label className="mb-2">Name</Label>
        <Input
          value={nameRef.current}
          onChange={(e) => { 
            nameRef.current = e.target.value;
            setTick(tick == 0 ? 1 : 0);
          }}
        />
      </div>

      <div>
        <Label className="mb-2">Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => { 
            imageRef.current = e.target.files?.[0] ?? null;
            setTick(tick == 0 ? 1 : 0);
          }}
        />
      </div>
    </div>

    <DialogFooter>
      <Button variant="ghost" onClick={() => props.onOpenChange(false)}>
        Cancel
      </Button>
      <Button onClick={() => props.onSubmit(nameRef.current, imageRef.current)}>
        Save
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

  )

}
