import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { memo, useState } from "react"
import { UserProjectTemplate } from "@/lib/user-projects/interfaces"

import { formatSize } from "@/helpers/formatter"
import { solveImageFromCategory, solveImageFromLanguage } from "@/lib/project/utils"
import { Spinner } from "../ui/spinner"


interface UserProjectsCardProps {
  project: UserProjectTemplate
}

export const UserProjectsCard = memo((props: UserProjectsCardProps) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false); 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
<DialogTrigger asChild>
  <button
    type="button"
    className="
      w-full flex items-start gap-3
      rounded-md border p-3
      cursor-pointer text-left
      hover:bg-accent transition
    "
  >
    <img
      src={solveImageFromLanguage(props.project.language) || undefined}
      loading="lazy"
      decoding="async"
      draggable={false}
      alt=""
      className="w-9 h-9 object-cover rounded bg-white shrink-0"
    />

    <div className="flex flex-col gap-1 min-w-0 flex-1">
      <span className="text-sm font-medium truncate">
        {props.project.name}
      </span>

      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
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

      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
        <span>{formatSize(props.project.size)}</span>
        <span>•</span>
        <span>
          Updated at{" "}
          {new Date(props.project.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  </button>
  </DialogTrigger>        
    <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5">
            <div className="flex items-center gap-3">
              <img
                src={solveImageFromLanguage(props.project.language) || undefined}
                alt=""
                className="w-10 h-10 rounded bg-white"
              />

              <div className="flex flex-col">
                <DialogTitle className="text-base">
                  {props.project.name}
                </DialogTitle>

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
          </div>

          <DialogFooter className="px-5 py-4 bg-muted/40">
            <DialogClose asChild>
              <Button variant="ghost">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" onClick={async () => {}}>
              Open project {loading && <Spinner/>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
});

