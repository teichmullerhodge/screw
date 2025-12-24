import { ArrowLeftToLine, ArrowRightToLine, FileDown, Inbox, Info, ListFilterPlus, LucideProps, Plus, Settings  } from "lucide-react"
import react, { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import sketchLogo from "/assets/sketch_logo.png"
import { Button } from "./ui/button";

interface SidebarOptions {
  title: string, 
  url: string,
  active: boolean,
  icon: react.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
}

const items: Array<SidebarOptions> = [
  {
    title: "Project",
    url: "/new-project",
    icon: Plus,
    active: true,
  },
  {
    title: "Open",
    url: "/projects",
    icon: Inbox,
    active: true,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: FileDown,
    active: false,
  },
  {
    title: "Filters",
    url: "/filters",
    icon: ListFilterPlus,
    active: true,
  }, 
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    active: true,
  },
  {
    title: "About",
    url: "/about",
    icon: Info,
    active: true,
  },
 ]

export function AppSidebar() {
  const navigator = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(localStorage.getItem("collapsed-sidebar") === "T");

  const handleNavigation = (item: SidebarOptions) => {
      if(item.active) return navigator(item.url);
      toast.message(`${item.title} not implemented.`);
  }


  return (
    <div className={`transition-all flex flex-col m-2 ${collapsed ? "w-[5vw]" : "w-[20vw]"}`}>
          <div className="flex flex-row items-center mb-4 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
            <img src={sketchLogo} width={30} height={30}/>
            {!collapsed && (<span className="text-sm">Sketch</span>)}
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col">
             <TooltipProvider delayDuration={300}>
  
             {items.map((item) => {
    
               const content = (
          <Button
            variant="ghost"
            className={`cursor-pointer p-0 m-0 flex flex-row justify-start items-center ${collapsed && "w-[40px]"}`} 
            asChild
            onClick={() => handleNavigation(item)}
            >
        {item.active ? (
          <div
            className={`flex items-center transition-all
              ${location.pathname === item.url ? "bg-primary/7" : ""}`}
          >
            <item.icon />
            {!collapsed && <span>{item.title}</span>}
          </div>
        ) : (
          <div className="flex items-center opacity-50">
            <item.icon />
            {!collapsed && <span>{item.title}</span>}
          </div>
        )}
      </Button>
    )

    if (!collapsed) {
      return <div key={item.title}>{content}</div>
    }

    return (
      <Tooltip key={item.title}>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          {item.title}
        </TooltipContent>
      </Tooltip>
    )
  })}
    </TooltipProvider>
              <Button
                onClick={() => setCollapsed(!collapsed)}
                className={`${collapsed && "w-[40px]"} cursor-pointer p-0 m-0 flex flex-row justify-start`} variant={"ghost"}>{collapsed ? (<ArrowRightToLine/>) : (<ArrowLeftToLine/>) }
        
              </Button>
            </div>
          </div>
    </div>
  )
}












