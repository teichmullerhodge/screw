import { ProjectTemplate } from "@/lib/project/interfaces";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import filterNothing from "/assets/filter_nothing.png";
import commonTemplates from "@/manifests/common.json" 
import { motion, AnimatePresence } from "framer-motion";
import ViewSelection from "@/components/projects/view-selection";
import { ProgrammingLanguagesSelection } from "@/components/projects/programming-languages-selection";
import { CategoriesSelection } from "@/components/projects/categories-selection";
import { Grid2x2, Grid3X3, List, TableProperties } from "lucide-react";
import NothingFound from "@/components/nothing-found";
import { ProjectsCard } from "@/components/projects/projects-card";



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
                viewsIcon={[<List/>, <Grid2x2/>, <Grid3X3/>, <TableProperties/>]}
                views={PROJECT_VIEWS}
                defaultValue={PROJECT_VIEWS[3]}

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
            {projects.length === 0 ? (
              <NothingFound message="No template found that match the filters." imagePath={filterNothing}/>
            ) : (
                <AnimatePresence>
                  {projects.map((project) => (
                    <motion.div
                    key={project.identifier} 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                  <ProjectsCard isListView={view === CSS_VIEW_RECORD[PROJECT_VIEWS[0]]} project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
              )}
          </div>          
        </div>)
}
