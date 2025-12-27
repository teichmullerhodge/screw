export enum ProgrammingLanguages {
  C = "C",
  CPP = "C++",
  Assembly = "Assembly x86",
  Ada = "Ada",
  Rust = "Rust",
  Zig = "Zig",
}

export enum ApplicationCategories {
  Terminal = "Terminal",
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


export interface OSActionStep {
  action: OSActions,
  path: string,
  value: string, 
  is_file_path?: boolean 
} 

export interface TemplateManifest {
  name: string,
  language: string,
  category: string,
  steps: Array<OSActionStep>
}

export interface TemplateMetadata {
  author: string, 
  version: string,
  verified: boolean 
}

export interface Template {
  identifier: string 
  title: string,
  description: string,
  imagePath: string, 
  manifest: TemplateManifest,
  category: ApplicationCategories | null,
  language: ProgrammingLanguages,
  metadata?: TemplateMetadata,
}


export interface CommonFilter {
  name: string,
  image_path: string 
}


export interface CommonFilterPayload {
  name: string,
  image_path: string,
  key: string 
}

export interface Filters {

  languages: Array<CommonFilter>, 
  categories: Array<CommonFilter> 

}

export enum FiltersOperation {
    Success = 0,
    ErrorReadingFromFile = 1,
    ErrorWritingToFile = 2,
    ErrorCreatingFile = 3,
    ErrorParsingJson = 4,
    ErrorSerializingJson = 5,
}








