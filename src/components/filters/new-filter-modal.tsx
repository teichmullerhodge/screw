import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Image } from "lucide-react"
import { open } from "@tauri-apps/plugin-dialog"
import { getFileName } from "@/helpers/formatter"

export interface NewFilterModalProps {
 open: boolean 
 onOpenChange: (v: boolean) => void 
 onSubmit: (name: string, image_path: string | null) => void
 selection: "Lang" | "Category" 
}

export default function NewFilterModal(props: NewFilterModalProps) {

  const [name, setName] = useState("");
  const [imagePath, setImagePath] = useState<string | null>(null);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            New {props.selection === "Lang" ? "language" : "category"}
          </DialogTitle>
          <DialogDescription>
            Add a name and image
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-2">Image</Label>
            <Button
              type="button"
              onClick={async () => {
                const path = await open({
                  multiple: false,
                  directory: false,
                  filters: [
                    {
                      name: "Images",
                      extensions: ["png","jpg","jpeg","webp","svg","avif"],
                    }
                  ]
                });

                if (typeof path === "string") {
                  setImagePath(path);
                }
              }}
            >
              <Image />
              {imagePath === null
                ? " No file selected"
                : getFileName(imagePath)}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => props.onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => props.onSubmit(name, imagePath)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

