"use client";

import React from "react";
import { DesktopIcon } from "./DesktopIcon";
import {
  IconCalculator,
  IconFileTextFilled,
  IconFileTextSpark,
  IconGlobe,
  IconAppWindow,
  IconIcons
} from "@tabler/icons-react";

export interface DesktopApp {
  id: string;
  title: string;
  icon: React.ReactNode;
  type: string;
  url?: string;
}

interface DesktopProps {
  onLaunch: (app: DesktopApp) => void;
}

export function Desktop({ onLaunch }: DesktopProps) {
  const desktopApps: DesktopApp[] = [
    {
      id: "calculator",
      title: "Calculator",
      icon: <IconCalculator className="w-full h-full" />,
      type: "calculator",
    },
    {
      id: "text-editor",
      title: "Text Editor",
      icon: <IconFileTextFilled className="w-full h-full" />,
      type: "text-editor",
    },
    {
      id: "note-editor",
      title: "Note Editor",
      icon: <IconFileTextSpark className="w-full h-full" />,
      type: "note-editor",
    },
    {
      id: "portfolio",
      title: "My Portfolio",
      icon: <IconAppWindow className="w-full h-full" />,
      type: "browser",
      url: "https://my-portfolio-rho-two-89.vercel.app/",
    },
    {
      id: "icons",
      title: "Phosphor Icons",
      icon: <IconIcons className="w-full h-full" />,
      type: "browser",
      url: "https://phosphoricons.com/",
    },
  ];

  return (
    <div className="fixed inset-0 z-0 p-6 pointer-events-none">
      <div className="relative w-full h-full pointer-events-auto">
        {desktopApps.map((app, index) => {
          const col = Math.floor(index / 6);
          const row = index % 6;
          return (
            <DesktopIcon
              key={app.id}
              title={app.title}
              icon={app.icon}
              defaultPosition={{
                x: col * 100,
                y: row * 120
              }}
              onDoubleClick={() => onLaunch(app)}
            />
          );
        })}
      </div>
    </div>
  );
}
