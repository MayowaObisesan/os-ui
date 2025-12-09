"use client";

import {OSWindow} from "@/components/os/Window";
import {OSDraggableWindow} from "@/components/os/DraggableWindow";
import {Calculator} from "@/components/os/Calculator";

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

      <OSDraggableWindow
        title="Calculator Window"
        description="This is the OS default Calculator"
      >
        <Calculator />
      </OSDraggableWindow>
    </div>
  );
}
