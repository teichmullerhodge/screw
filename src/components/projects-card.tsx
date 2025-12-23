import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProjectTemplate } from "@/lib/project/interfaces"
import { memo, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { Spinner } from "./ui/spinner"
import { toast } from "sonner"



async function handleNewProject(project: ProjectTemplate, name: string){
  const obj = project.manifest;
  obj.name = name;
  const res = await invoke("new_project", { payload: JSON.stringify(obj)}) as boolean;
  return res 
}

interface ProjectsCardProps {
  project: ProjectTemplate
}

export const ProjectsCard = memo((props: ProjectsCardProps) => {

  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false); 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <button
            type="button"
            className="
              w-full flex items-center gap-3
              rounded-md border p-3
              cursor-pointer
              hover:bg-accent transition
              text-left
            "
          >
            <img
              src={props.project.imagePath}
              loading="lazy"
              decoding="async"
              draggable={false}
              alt=""
              className="w-8 h-8 object-cover rounded bg-white"
            />

            <span className="text-sm font-medium truncate">
              {props.project.title}
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5">
            <div className="flex items-center gap-3">
              <img
                src={props.project.imagePath}
                alt=""
                className="w-10 h-10 rounded bg-white"
              />

              <div className="flex flex-col">
                <DialogTitle className="text-base">
                  {props.project.title}
                </DialogTitle>

                <DialogDescription className="text-xs leading-snug">
                  {props.project.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-5 py-4 grid gap-4">
            <div className="flex gap-2 flex-wrap text-xs">
              <span className="px-2 py-1 rounded bg-muted">
                Language: {props.project.language}
              </span>

              <span className="px-2 py-1 rounded bg-muted">
                Category: {props.project.category}
              </span> 
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs">
                Project name
              </Label>
              <Input
                id="name"
                onChange={(v) => setName(v.target.value)}
                placeholder={`${props.project.title}-project`}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="px-5 py-4 bg-muted/40">
            <DialogClose asChild>
              <Button variant="ghost">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" onClick={async () => {
                if(name.trim() === "") {
                  toast.message("Type a name for your project.");
                  return;
                }
                setLoading(true);
                const res = await handleNewProject(props.project, name);

                if (!res) {
                  toast.error("Error creating your project.", { description: "Try again later." });
                  setLoading(false);
                  return;
                }

                toast.message("Project successfully created.");
                setLoading(false);
                setOpen(false);
            }}>
              Create project {loading && <Spinner/>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
});

