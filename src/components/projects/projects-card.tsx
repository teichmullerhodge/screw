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
import { toast } from "sonner"
import { solveImageFromCategory } from "@/lib/project/utils"
import { BadgeCheck } from "lucide-react"
import { Spinner } from "../ui/spinner"

enum ManifestResult {
    ProjectOk,
    ErrorInvalidJson,
    ErrorCreatingDir,
    ErrorCreatingFile,
    ErrorWritingToFile,
    ErrorReadingFromFile
}

function collectErrorMessage(error: ManifestResult){
  switch(error){
    case ManifestResult.ProjectOk: return "ok???";
    case ManifestResult.ErrorInvalidJson: return "The provided JSON is not a valid manifest.";
    case ManifestResult.ErrorCreatingDir: return "Error creating directory";
    case ManifestResult.ErrorCreatingFile: return "Error creating file";
    case ManifestResult.ErrorWritingToFile: return "Error writing to file";
    case ManifestResult.ErrorReadingFromFile: return "Error reading from file";
  }
}

async function handleNewProject(project: ProjectTemplate, name: string): Promise<ManifestResult> {
  const obj = project.manifest;
  obj.name = name;
  const res = await invoke("new_project", { payload: JSON.stringify(obj)}) as ManifestResult;
  return res 
}

interface ProjectsCardProps {
  project: ProjectTemplate
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
                src={props.project.imagePath}
                loading="lazy"
                decoding="async"
                draggable={false}
                alt=""
                className="w-8 h-8 object-cover rounded bg-transparent"
              />

              <span className="text-sm font-medium truncate">
                {props.project.title}
              </span>
            </div>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
        <span className="px-1.5 py-0.5 rounded bg-muted">
          {props.project.language}
        </span>

        {props.project.category && (
          <div className="px-1.5 py-0.5 rounded bg-muted flex flex-row gap-2 items-center justify-center">
            {props.project.category}
              <img
                src={solveImageFromCategory(props.project.category) || undefined}
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
                src={props.project.imagePath}
                alt=""
                className="w-10 h-10 rounded bg-transparent"
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
              {props.project.metadata && (
                <div className="px-2 py-1 rounded bg-muted flex flex-row">
                  <span>Author: {props.project.metadata.author}</span>
                  {props.project.metadata.verified === true && (<BadgeCheck fill="#0047AB" className="text-white" size={12}/>)}
                </div>
              )}
              <span className="px-2 py-1 rounded bg-muted">
                language: {props.project.language}
              </span>

              <div className="px-2 py-1 rounded bg-muted flex flex-row items-center justify-center gap-1">
                Category: {props.project.category}
              <img
                src={solveImageFromCategory(props.project.category) || undefined}
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

                if (res !== ManifestResult.ProjectOk) {
                  const err = collectErrorMessage(res);
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

