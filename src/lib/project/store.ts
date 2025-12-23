
// programming languages 
import cprog from "../../assets/c_prog.png"
import cppProg from "../../assets/cpp_prog.png"
import asmProg from "../../assets/asm_prog.png"
import adaProg from "../../assets/ada_prog.png" 
import rustProg from "../../assets/rust_prog.png"
import zigProg from "../../assets/zig_prog.png"


// gui 
import gtkGui from "../../assets/gtk_gui.png" 
 
// graphics 
import openGlGraph from "../../assets/opengl_graph.png" 
import raylibGraph from "../../assets/raylib_graph.png" 


import { OSActions, ProgrammingLanguages, ProjectCategories, ProjectManifest, ProjectTemplate } from "./interfaces";


export const PROJECT_MANIFESTS: Record<string, ProjectManifest> =
  {
    "C": {
      name: "app",
      steps: [
        {action: OSActions.Mkdir, path: "build", value: ""},
        {action: OSActions.Mkdir, path: "src", value: ""},
        {action: OSActions.CreateFile, path: "src/main.c", value: ""},
        {
         action: OSActions.WriteToFile, 
         path: "src/main.c", 
         value: `#include <stdio.h>\n\n\nint main(int argc, char **argv) { \n\n(void)argc;\n(void)argv\nprintf("Hello, world!"); } \n\n`
        }
      ] 
    }
  }


export const PROJECT_TEMPLATE: Array<ProjectTemplate> = [
  {
    identifier: "C",
    title: "C Console Project",
    description:
      "A C project focused on console and terminal applications. Includes stdio.h and stdlib.h, a basic main function, argument handling, and a template that prints a message to standard output.",
    imagePath: cprog,
    manifest: PROJECT_MANIFESTS["C"],
    category: ProjectCategories.Console_Terminal,
    language: ProgrammingLanguages.C  
  },

  {
    identifier: "CPP",
    title: "C++ Console Project",
    description:
      "A C++ console project. Includes iostream, a basic main function, standard output usage, and a minimal structure for command-line execution.",
    imagePath: cppProg,
    manifest: PROJECT_MANIFESTS["CPP"],
    category: ProjectCategories.Console_Terminal,
    language: ProgrammingLanguages.CPP
  },

  {
    identifier: "Assembly",
    title: "Assembly Console Program",
    description:
      "An Assembly console program. Includes an entry point, system calls for writing to standard output, and a minimal executable layout.",
    imagePath: asmProg,
    manifest: {name: "", steps: []},
    category: ProjectCategories.Console_Terminal,
    language: ProgrammingLanguages.Assembly
  },

  {
    identifier: "Ada",
    title: "Ada Console Project",
    description:
      "An Ada console project. Includes a main procedure, basic text output, and a minimal program structure for terminal execution.",
    imagePath: adaProg,
    manifest: {name: "", steps: []},
    category: ProjectCategories.Console_Terminal,
    language: ProgrammingLanguages.Ada
  },

  {
    identifier: "Rust",
    title: "Rust Console Project",
    description:
      "A Rust console project. Includes a main function, standard output printing, basic argument access, and a minimal executable structure.",
    imagePath: rustProg,
    manifest: {name: "", steps: []},
    category: ProjectCategories.Console_Terminal,
    language: ProgrammingLanguages.Rust
  },

  {
    identifier: "Zig",
    title: "Zig Console Project",
    description:
      "A Zig console project. Includes a main function, standard output printing, basic error handling, and a minimal build configuration.",
    imagePath: zigProg,
    manifest: {name: "", steps: []},
    category: ProjectCategories.Console_Terminal,
    language: ProgrammingLanguages.Zig
  },

  {
    identifier: "GTK",
    title: "GTK GUI Application",
    description:
      "A GTK-based GUI application. Includes window creation, widget initialization, signal handling, and an active event loop.",
    imagePath: gtkGui,
    manifest: {name: "", steps: []},
    category: ProjectCategories.Gui,
    language: ProgrammingLanguages.C 
  },

  {
    identifier: "OpenGL",
    title: "OpenGL Graphics Project",
    description:
      "An OpenGL graphics project. Includes context creation, a render loop, buffer initialization, and basic frame rendering.",
    imagePath: openGlGraph,
    manifest: {name: "", steps: []},
    category: ProjectCategories.Graphics,
    language: ProgrammingLanguages.C
  },

  {
    identifier: "Raylib",
    title: "Raylib Game Project",
    description:
      "A Raylib graphics project. Includes window initialization, a render loop, basic drawing calls, and frame updates.",
    imagePath: raylibGraph,
    manifest: {name: "", steps: []},
    category: ProjectCategories.Games,
    language: ProgrammingLanguages.C
  },
]

