import { ProjectsCard } from "@/components/projects-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProgrammingLanguages, ProjectCategories, ProjectTemplate } from "@/lib/project/interfaces";
import { useRef, useState } from "react";
import { Grid2x2, Grid3X3, List, TableProperties } from "lucide-react";
import { Input } from "@/components/ui/input";
import filterNothing from "/assets/filter_nothing.png";
import commonTemplates from "@/manifests/common.json" 


interface ViewSelectionProps {
  onValueChange: (view: string) => void 
}

function ViewSelection(props: ViewSelectionProps) {
   const views: Array<string> = PROJECT_VIEWS;
   const viewsIcon = [<List/>, <Grid2x2/>, <Grid3X3/>, <TableProperties/>]; 

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

const PROJECT_VIEWS = ["List", "Grid 2x2", "Grid 3x3", "Grid 4x4"];
const CSS_VIEW_RECORD: Record<string, string> = {
  [PROJECT_VIEWS[0]]: "grid grid-cols-1",
  [PROJECT_VIEWS[1]]: "grid grid-cols-2",
  [PROJECT_VIEWS[2]]: "grid grid-cols-3",
  [PROJECT_VIEWS[3]]: "grid grid-cols-4",
}


interface ProjectFilters {
  language: string, 
  category: string 
}

export default function NewProject(){
  const templates = commonTemplates as Array<ProjectTemplate>;
  const [view, setView] = useState<string>("grid grid-cols-4"); 
  const [projects, setProjects] = useState<Array<ProjectTemplate>>(templates);
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
      setProjects(templates)
      return;
    }
    if(f.language === "all") return setProjects(templates.filter((p) => p.category === f.category));
    if(f.category === "all") return setProjects(templates.filter((p) => p.language === f.language));
    return setProjects(templates.filter((p) => p.category === f.category && p.language === f.language));
  }


  return (
          <div className="flex flex-col m-2 overflow-hidden h-[80vh]">
            <h2 className="m-2">Select a template</h2>
            <div className="justify-between flex flex-row gap-2 m-2">
              <Input type="search" placeholder="Search..." className="w-[150px]" onChange={(v) => { 
                const search = v.target.value.trim();
                if(search === "") return applyFilters();
                applyFilters();
                setProjects(prev => prev.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))); 
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
            <div className={`${projects.length !== 0 && view} ${projects.length === 0 && "grid grid-cols-1"} gap-2 overflow-x-hidden overflow-y-auto m-2`}>
              {projects.length === 0 ? (<NothingFound message="No template found that match the filters." imagePath={filterNothing}/>) : projects.map((project) => <ProjectsCard project={project}/>)}
            </div>
          </div>)
}
