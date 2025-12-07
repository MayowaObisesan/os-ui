"use client";

import {OSWindow} from "@/components/os/Window";
import {OSDraggableWindow} from "@/components/os/DraggableWindow";

export default function Home() {
  return (
    <div className="min-h-screen">
      <OSWindow
        title="My Window"
        description="Description"
      >
        Content here
      </OSWindow>

      <OSDraggableWindow
        title="My Window"
        description="Description"
      >
        Content here
      </OSDraggableWindow>
    </div>
  );
}
