
import { useEffect, useRef, useState } from "react";
import { Grid2x2, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import filterNothing from "/assets/filter_nothing.png";
import { motion, AnimatePresence } from "framer-motion";
import { UserProjectTemplate } from "@/lib/user-projects/interfaces";
import ViewSelection from "@/components/projects/view-selection";
import { ProgrammingLanguagesSelection } from "@/components/projects/programming-languages-selection";
import { CategoriesSelection } from "@/components/projects/categories-selection";
import NothingFound from "@/components/nothing-found";
import { UserProjectsCard } from "@/components/projects/user-projects-card";
import { invoke } from "@tauri-apps/api/core";

import noProjectYet from "/assets/no_project_yet.png";

import { toast } from "sonner";

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
  const [view, setView] = useState<string>("grid grid-cols-3"); 
  const [userProjects, setUserProjects] = useState<Array<UserProjectTemplate>>([]);
  const projectsRef = useRef<Array<UserProjectTemplate>>([]);
  const filters = useRef<ProjectFilters>(
  {
      "language": "all",
      "category": "all"
  });

  useEffect(() => {
    const collect_projects = async () => {
      const res = await invoke("read_projects") as Array<UserProjectTemplate>;
      setUserProjects(res);
      projectsRef.current = res;
    }
 
   collect_projects();
  
  }, [])

  const handleProjectsFilter = (value: string, key: keyof ProjectFilters) => {
    filters.current[key] = value; 
    return applyFilters();
  }

  const applyFilters = () => {
    const f = filters.current;
    if(f.language === "all" && filters.current.category === "all") {
      setUserProjects(projectsRef.current)
      return;
    }
    if(f.language === "all") return setUserProjects(projectsRef.current.filter((p) => p.category === f.category));
    if(f.category === "all") return setUserProjects(projectsRef.current.filter((p) => p.language === f.language));
    return setUserProjects(projectsRef.current.filter((p) => p.category === f.category && p.language === f.language));
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
                views={PROJECT_VIEWS}
                viewsIcon={[<List/>, <Grid2x2/>, <Grid3X3/>]}
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
          <div className={`${userProjects.length !== 0 && view} ${userProjects.length === 0 && "grid grid-cols-1"} gap-2 overflow-x-hidden overflow-y-auto m-2`}>
            {userProjects.length === 0 ? (
              <NothingFound message={projectsRef.current.length > 0 ? `No project found that match the filters.` : `You don't have projects yet.`} imagePath={ projectsRef.current.length > 0 ? filterNothing : noProjectYet}/>
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
          </div>          
      </div>)
}

