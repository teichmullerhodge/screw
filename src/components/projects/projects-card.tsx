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
import { memo, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"
import { BadgeCheck } from "lucide-react"
import { Spinner } from "../ui/spinner"
import { Template } from "@/lib/common-interfaces"
import { solveImageFromCategory } from "@/lib/templates/utils"

enum ManifestOperation {
    Success,
    ErrorInvalidJson,
    ErrorCreatingDir,
    ErrorCreatingFile,
    ErrorWritingToFile,
    ErrorReadingFromFile
}

function collectErrorMessage(error: ManifestOperation){
  switch(error){
    case ManifestOperation.Success: return "";
    case ManifestOperation.ErrorInvalidJson: return "The provided JSON is not a valid manifest.";
    case ManifestOperation.ErrorCreatingDir: return "Error creating directory";
    case ManifestOperation.ErrorCreatingFile: return "Error creating file";
    case ManifestOperation.ErrorWritingToFile: return "Error writing to file";
    case ManifestOperation.ErrorReadingFromFile: return "Error reading from file";
  }
}

async function createNewProject(template: Template, name: string): Promise<[string, ManifestOperation]> {
  const obj = template.manifest;
  obj.name = name;
  const result = await invoke("new_project", { payload: JSON.stringify(obj)}) as [string, ManifestOperation];
  const path = result[0] as string;
  const operation = result[1] as ManifestOperation;
  if(operation === ManifestOperation.Success) {
    const shouldOpenProject = localStorage.getItem("open-project-after-creation") === "T";
    if(shouldOpenProject) await invoke("open_project_folder", { path: path });
    return [path, operation];
  }

  return [path, operation] 
}

interface ProjectsCardProps {
  template: Template
  isListView: boolean 
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
            className={`
              w-full flex ${props.isListView ? "flex-row" : "flex-col"} gap-3
              rounded-md border p-2
              cursor-pointer
              hover:bg-accent transition
              text-left
            `}
          >
          <div className="text-left flex flex-row items-center gap-2">
              <img
                src={props.template.imagePath}
                loading="lazy"
                decoding="async"
                draggable={false}
                alt=""
                className="w-8 h-8 object-cover rounded bg-transparent"
              />

              <span className="text-sm font-medium truncate">
                {props.template.title}
              </span>
            </div>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
        <span className="px-1.5 py-0.5 rounded bg-muted">
          {props.template.language}
        </span>

        {props.template.category && (
          <div className="px-1.5 py-0.5 rounded bg-muted flex flex-row gap-2 items-center justify-center">
            {props.template.category}
              <img
                src={solveImageFromCategory(props.template.category) || undefined}
                loading="lazy"
                decoding="async"
                draggable={false}
                alt=""
                className="w-6 h-6 object-cover rounded bg-transparent shrink-0"
              />
          </div>
        )}
        </div>



          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5">
            <div className="flex items-center gap-3">
              <img
                src={props.template.imagePath}
                alt=""
                className="w-10 h-10 rounded bg-transparent"
              />

              <div className="flex flex-col">
                <DialogTitle className="text-base">
                  {props.template.title}
                </DialogTitle>

                <DialogDescription className="text-xs leading-snug">
                  {props.template.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-5 py-4 grid gap-4">
            <div className="flex gap-2 flex-wrap text-xs">
              {props.template.metadata && (
                <div className="px-2 py-1 rounded bg-muted flex flex-row">
                  <span>Author: {props.template.metadata.author}</span>
                  {props.template.metadata.verified === true && (<BadgeCheck fill="#0047AB" className="text-white" size={12}/>)}
                </div>
              )}
              <span className="px-2 py-1 rounded bg-muted">
                language: {props.template.language}
              </span>

              <div className="px-2 py-1 rounded bg-muted flex flex-row items-center justify-center gap-1">
                Category: {props.template.category}
              <img
                src={solveImageFromCategory(props.template.category) || undefined}
                loading="lazy"
                decoding="async"
                draggable={false}
                alt=""
                className="w-4 h-4 object-cover rounded bg-transparent shrink-0"
              />
              </div> 
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs">
                Project name
              </Label>
              <Input
                id="name"
                onChange={(v) => setName(v.target.value)}
                placeholder={`${props.template.title}-project`}
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
                const result = await createNewProject(props.template, name);
                const operation = result[1];
                if (operation !== ManifestOperation.Success) {
                  const err = collectErrorMessage(operation);
                  toast.error("Error creating your project.", { description: err});
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

