
import { ProgrammingLanguages, ProjectCategories } from "../project/interfaces";


export type UserProgrammingLanguages = ProgrammingLanguages | "Custom";
export type UserProjectCategories = ProjectCategories | "Custom";

export interface UserProjectTemplate {
  name: string,
  author: string,
  created_at: string,
  updated_at: string,
  size: number,
  category: UserProjectCategories | null,
  language: UserProgrammingLanguages,
}

