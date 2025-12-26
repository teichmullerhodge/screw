import { ApplicationCategories, ProgrammingLanguages } from "./common-interfaces";

export type CustomProgrammingLanguages = ProgrammingLanguages | "Custom";
export type CustomApplicationCategories = ApplicationCategories | "Custom";

export interface UserTemplate {
  name: string,
  author: string,
  created_at: string,
  updated_at: string,
  size: number,
  category: CustomApplicationCategories  | null,
  language: CustomProgrammingLanguages,
  path: string,
}

