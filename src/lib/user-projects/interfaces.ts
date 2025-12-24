
import { ProgrammingLanguages, ProjectCategories } from "../project/interfaces";


export type UserProgrammingLanguages = ProgrammingLanguages | "Custom";
export type UserProjectCategories = ProjectCategories | "Custom";

export interface UserProjectTemplate {
  name: string,
  author: string,
  createdAt: string,
  updatedAt: string,
  size: number,
  category: UserProjectCategories | null,
  language: UserProgrammingLanguages,
}

export const mockUserProjects: Array<UserProjectTemplate> = [
  {
    name: "hello-c",
    author: "Matheus",
    createdAt: "2024-10-01T10:12:00Z",
    updatedAt: "2024-10-01T10:12:00Z",
    size: 12_288, // 12 KB
    category: ProjectCategories.Console_Terminal,
    language: ProgrammingLanguages.C,
  },
  {
    name: "raycaster",
    author: "Matheus",
    createdAt: "2024-09-18T14:40:21Z",
    updatedAt: "2024-10-05T09:11:03Z",
    size: 1_572_864, // 1.5 MB
    category: ProjectCategories.Games,
    language: ProgrammingLanguages.CPP,
  },
  {
    name: "tiny-http",
    author: "Matheus",
    createdAt: "2024-08-02T08:00:00Z",
    updatedAt: "2024-08-15T18:22:10Z",
    size: 524_288, // 512 KB
    category: ProjectCategories.ServerApplication,
    language: ProgrammingLanguages.Rust,
  },
  {
    name: "gtk-playground",
    author: "Matheus",
    createdAt: "2024-07-10T11:30:45Z",
    updatedAt: "2024-09-01T16:05:00Z",
    size: 3_145_728, // 3 MB
    category: ProjectCategories.Gui,
    language: ProgrammingLanguages.Zig,
  },
  {
    name: "software-renderer",
    author: "Matheus",
    createdAt: "2024-06-21T19:55:00Z",
    updatedAt: "2024-07-03T21:12:44Z",
    size: 2_097_152, // 2 MB
    category: ProjectCategories.Graphics,
    language: ProgrammingLanguages.Assembly,
  },
  {
    name: "legacy-toolchain",
    author: "Matheus",
    createdAt: "2023-12-01T09:00:00Z",
    updatedAt: "2024-01-10T12:45:30Z",
    size: 8_192, // 8 KB
    category: "Custom",
    language: "Custom",
  },
];
