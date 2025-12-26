import { CustomProgrammingLanguages, CustomApplicationCategories } from "../custom-interfaces";
import { ProgrammingLanguages, ApplicationCategories } from "../common-interfaces";

import ada from "/assets/ada_prog.png";
import asm from "/assets/asm_prog.png";
import c from "/assets/c_prog.png";
import cpp from "/assets/cpp_prog.png";
import rust from "/assets/rust_prog.png";
import zig from "/assets/zig_prog.png";


import gtk from "/assets/gtk_gui.png";
import raylib from "/assets/raylib_graph.png";
import opengl from "/assets/opengl_graph.png";

import terminal from "/assets/terminal_app.png";
import games from "/assets/games_app.png";
import graphical from "/assets/graphical_app.png";
import gui from "/assets/gui_app.png";
import server from "/assets/server_app.png";


export function solveImageFromCategory(category: null | CustomApplicationCategories | ApplicationCategories){
  switch(category) {
    case ApplicationCategories.Terminal: return terminal;
    case ApplicationCategories.ServerApplication: return server;
    case ApplicationCategories.Gui: return gui;
    case ApplicationCategories.Games: return games;
    case ApplicationCategories.Graphics: return graphical;

  }
}

export function solveImageFromLanguage(lang: null | CustomProgrammingLanguages | ProgrammingLanguages){
  
  switch(lang){
    case ProgrammingLanguages.Ada: return ada;
    case ProgrammingLanguages.Assembly: return asm;
    case ProgrammingLanguages.C: return c; 
    case ProgrammingLanguages.CPP: return cpp;
    case ProgrammingLanguages.Rust: return rust; 
    case ProgrammingLanguages.Zig: return zig;
    case "Custom": return null;
  }
}


