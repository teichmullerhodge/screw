import { Button } from "@/components/ui/button";
import { Maximize2, Minus, X } from "lucide-react";
import React from "react";
import { getCurrentWindow } from '@tauri-apps/api/window';
const appWindow = getCurrentWindow();

interface AppHeaderProps {
  title: string;
  children: React.ReactNode;
}

export default function AppHeader(props: AppHeaderProps) {
  return (
    <div className="w-full select-none">
      <div className="flex items-center"
      >
        <div className="flex-1 flex flex-row justify-center tracking-wide titlebar-drag p-1" data-tauri-drag-region>
          <span className="text-gray-600 text-[12px]">{props.title}</span>
        </div>

        <div className="flex items-center gap-1 -webkit-app-region:no-drag">
          <WindowButton onClick={() => appWindow.minimize()}>
            <Minus size={12} />
          </WindowButton>

          <WindowButton onClick={() => appWindow.toggleMaximize()}>
            <Maximize2 size={12} />
          </WindowButton>

          <WindowButton danger onClick={() => appWindow.close()}>
            <X size={12} />
          </WindowButton>
        </div>
      </div>

      <div className="w-full h-[calc(100%-36px)]">
        {props.children}
      </div>
    </div>
  );
}

interface WindowButtonProps {
  children: React.ReactNode,
  onClick: () => void, 
  danger?: boolean 
}

function WindowButton(props: WindowButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={props.onClick}
      className={`
        h-7 w-7 rounded-md p-0
        text-zinc-400
        ${props.danger ? "hover:bg-red-500 hover:text-white" : ""}
      `}
    >
      {props.children}
    </Button>
  );
}

