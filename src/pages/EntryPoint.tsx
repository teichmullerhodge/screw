import { Link } from "react-router-dom";
import sketchLogo from "/assets/sketch_logo.png";

export default function EntryPoint() {
  return (
    <div className="flex h-full w-full items-center justify-center select-none mt-30">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        
        <img
          src={sketchLogo}
          alt="Sketch logo"
          width={160}
          height={160}
          className="opacity-50"
          draggable={false}
        />

        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-medium text-zinc-700">
            Sketch
          </h1>

          <p className="text-sm leading-relaxed text-zinc-500 text-left">
            Sketch is a lightweight environment for quickly creating, organizing,
            and starting new projects. <Link to={"/new-project"} className="font-medium text-black underline"> Create a new project now.</Link>
          </p>
        </div>

        <div className="mt-2 flex flex-col gap-1 text-xs text-zinc-400 text-left">
          <span>• Ready-to-use templates for C, C++, Rust, OpenGL, and more</span>
          <span>• Automatic project structure generation</span>
          <span>• Designed for speed and simplicity</span>
        </div>

      </div>
    </div>
  );
}

