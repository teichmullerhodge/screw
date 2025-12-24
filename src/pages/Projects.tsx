import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProgrammingLanguages, ProjectCategories } from "@/lib/project/interfaces";
import { useRef, useState } from "react";
import { Grid2x2, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import filterNothing from "/assets/filter_nothing.png";
import { motion, AnimatePresence } from "framer-motion";
import { mockUserProjects, UserProjectTemplate } from "@/lib/user-projects/interfaces";
import { UserProjectsCard } from "@/components/user-projects-card";


interface ViewSelectionProps {
  onValueChange: (view: string) => void 
}

function ViewSelection(props: ViewSelectionProps) {
   const views: Array<string> = PROJECT_VIEWS;
   const viewsIcon = [<List/>, <Grid2x2/>, <Grid3X3/>]; 

   return (
    <Select onValueChange={(v) => props.onValueChange(v)} defaultValue={PROJECT_VIEWS[3]}>
      <SelectTrigger className="focus:ring-0 focus:ring-offset-0 w-[150px]">
        <SelectValue placeholder="View" />
      </SelectTrigger>

      <SelectContent
        position="popper"
        side="bottom"
        sideOffset={4}
        className="max-h-60"
      >
      {views.map((c, idx) => (
          <SelectItem key={c} value={c}>
            {viewsIcon[idx]} {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


interface CategoriesSelectionProps {
  onValueChange: (v: string) => void
}

function CategoriesSelection(props: CategoriesSelectionProps) {
  const categories = Object.values(ProjectCategories);

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

interface ProgrammingLanguagesSelectionProps {
  onValueChange: (v: string) => void
}

function ProgrammingLanguagesSelection(props: ProgrammingLanguagesSelectionProps) {
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

interface NothingFoundProps {
  message: string, 
  imagePath: string 
}

function NothingFound(props: NothingFoundProps) {
  return (
          <div className="flex flex-col items-center justify-center mt-10">
              <img src={props.imagePath} width={250} height={250} className="opacity-50"/>
              <span>{props.message}</span>
          </div>
         )
}

const PROJECT_VIEWS = ["List", "Grid 2x2", "Grid 3x3"];
const CSS_VIEW_RECORD: Record<string, string> = {
  [PROJECT_VIEWS[0]]: "grid grid-cols-1",
  [PROJECT_VIEWS[1]]: "grid grid-cols-2",
  [PROJECT_VIEWS[2]]: "grid grid-cols-3",
}


interface ProjectFilters {
  language: string, 
  category: string 
}

export default function Projects(){
  const templates = mockUserProjects;
  const [view, setView] = useState<string>("grid grid-cols-3"); 
  const [userProjects, setUserProjects] = useState<Array<UserProjectTemplate>>(templates);
  const filters = useRef<ProjectFilters>(
  {
      "language": "all",
      "category": "all"
  });

  const handleProjectsFilter = (value: string, key: keyof ProjectFilters) => {
    filters.current[key] = value; 
    return applyFilters();
  }

  const applyFilters = () => {
    const f = filters.current;
    if(f.language === "all" && filters.current.category === "all") {
      setUserProjects(templates)
      return;
    }
    if(f.language === "all") return setUserProjects(templates.filter((p) => p.category === f.category));
    if(f.category === "all") return setUserProjects(templates.filter((p) => p.language === f.language));
    return setUserProjects(templates.filter((p) => p.category === f.category && p.language === f.language));
  }


  return (
          <div className="flex flex-col m-2 overflow-hidden h-[80vh]">
            <h2 className="m-2">Select a project</h2>
            <div className="justify-between flex flex-row gap-2 m-2">
              <Input type="search" placeholder="Search..." className="w-[150px]" onChange={(v) => { 
                const search = v.target.value.trim();
                if(search === "") return applyFilters();
                applyFilters();
                setUserProjects(prev => prev.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))); 
              }}/>
              <div className="flex flex-row gap-2">
              <ViewSelection 
                onValueChange={(v) => setView(CSS_VIEW_RECORD[v])}
              /> 
              <ProgrammingLanguagesSelection
                onValueChange={(l) => handleProjectsFilter(l, "language")}
              />
              <CategoriesSelection
                onValueChange={(c) => handleProjectsFilter(c, "category")} 
              />
              </div>
            </div>
          <div className={`${userProjects.length !== 0 && view} ${userProjects.length === 0 && "grid grid-cols-1"} gap-2 overflow-x-hidden overflow-y-auto m-2`}>
            {userProjects.length === 0 ? (
              <NothingFound message="No template found that match the filters." imagePath={filterNothing}/>
            ) : (
                <AnimatePresence>
                  {userProjects.map((project, idx) => (
                    <motion.div
                    key={idx} 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                  <UserProjectsCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
  )}
</div>          </div>)
}
