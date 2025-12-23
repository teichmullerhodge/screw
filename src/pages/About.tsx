import { Button } from "@/components/ui/button";
import githubBrand from "/assets/github_brand.png"
import sketchLogo from "/assets/sketch_logo.png"

export default function About() {
  return (
    <div className="flex flex-col gap-6 m-6">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center">
          <img src={sketchLogo} width={30} height={30}/>
          <h2 className="font-semibold">Sketch</h2>
        </div>
        <span className="text-sm opacity-70">
          Fast project template generator
        </span>
      </div>

      <div className="max-w-3xl text-sm leading-relaxed">
        <p>
          Sketch is a desktop application designed to quickly bootstrap development
          environments for systems, graphics, and low-level projects.
        </p>
        <p className="mt-2">
          It focuses on explicit, minimal, and hackable templates for technologies
          like <strong>C/C++</strong>, <strong>Rust</strong>, <strong>GTK</strong>,
          <strong> OpenGL</strong>, and others, without hiding the build system or
          project structure from the developer.
        </p>
      </div>

      <div className="flex flex-col gap-2 max-w-3xl">
        <h2 className="text-base font-medium">Philosophy</h2>
        <ul className="list-disc ml-5 text-sm space-y-1 opacity-90">
          <li>Zero ceremony, zero lock-in</li>
          <li>Readable structure over abstractions</li>
          <li>Made for developers who like to know what is going on</li>
        </ul>
      </div>

      <div className="flex flex-col gap-2 max-w-3xl">
        <h2 className="text-base font-medium">Built with</h2>
        <ul className="list-disc ml-5 text-sm space-y-1 opacity-90">
          <li>Tauri</li>
          <li>React + TypeScript</li>
          <li>Rust</li>
        </ul>
      </div>

      
      <div className="flex items-center gap-3 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => window.open("https://github.com/your-repo/screw")}
        >
        <img src={githubBrand} width={20} height={20} className="rounded"/>
        Github 
        </Button>

        <span className="text-xs opacity-50">
          © {new Date().getFullYear()} Sketch
        </span>
      </div>
    </div>
  );
}

