export enum ProgrammingLanguages {
  C = "C",
  CPP = "C++",
  Assembly = "Assembly x86",
  Ada = "Ada",
  Rust = "Rust",
  Zig = "Zig",
}

export enum ProjectCategories {
  Console_Terminal = "Console/Terminal",
  ServerApplication = "Server application",
  Gui = "Gui", 
  Games = "Games",
  Graphics = "Graphics",
}

export enum OSActions {
  Mkdir, 
  CreateFile,
  WriteToFile 
}

export interface ProjectStep {
  action: OSActions,
  path: string, 
  value: string, // string or filepath 
  isFilePath?: boolean
}

export interface ProjectManifest {
  name: string,
  language: string,
  category: string,
  steps: Array<ProjectStep>
}
 
export interface ProjectTemplate {
  identifier: string 
  title: string, 
  description: string,
  imagePath: string, 
  manifest: ProjectManifest,
  category: ProjectCategories | null,
  language: ProgrammingLanguages,
}




