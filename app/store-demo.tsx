"use client";

import { StoreWindow } from "@/components/os/StoreWindow";
import { StoreDraggableWindow } from "@/components/os/StoreDraggableWindow";
import { WindowTracker } from "@/components/os/WindowTracker";
import { Calculator } from "@/components/os/Calculator";
import { Button } from "@/components/ui/button";
import { useWindowManagement } from "@/lib/store";
import { useState } from "react";

export default function StoreDemo() {
  const { createWindow } = useWindowManagement();
  const [windowIds, setWindowIds] = useState<string[]>([]);
  const [windowCounter, setWindowCounter] = useState(1);

  const handleCreateBasicWindow = () => {
    const windowId = createWindow({
      title: `Basic Window ${windowCounter}`,
      type: "basic",
      state: "open",
    });
    setWindowIds([...windowIds, windowId]);
    setWindowCounter(windowCounter + 1);
  };

  const handleCreateDraggableWindow = () => {
    const windowId = createWindow({
      title: `Draggable Window ${windowCounter}`,
      type: "draggable",
      state: "open",
      position: { x: 100, y: 100 },
    });
    setWindowIds([...windowIds, windowId]);
    setWindowCounter(windowCounter + 1);
  };

  const handleCreateCalculatorWindow = () => {
    const windowId = createWindow({
      title: `Calculator ${windowCounter}`,
      type: "calculator",
      state: "open",
      position: { x: 200, y: 200 },
    });
    setWindowIds([...windowIds, windowId]);
    setWindowCounter(windowCounter + 1);
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Window Store Demo</h1>

      <WindowTracker />

      <div className="flex gap-4 mb-6">
        <Button onClick={handleCreateBasicWindow}>Create Basic Window</Button>
        <Button onClick={handleCreateDraggableWindow}>Create Draggable Window</Button>
        <Button onClick={handleCreateCalculatorWindow}>Create Calculator Window</Button>
      </div>

      <div className="space-y-4">
        {windowIds.map((id) => {
          // In a real implementation, we would store the window type and render accordingly
          // For this demo, we'll just show basic windows
          return (
            <StoreWindow
              key={id}
              windowId={id}
              title="Store-Managed Window"
              description="This window is managed by the centralized store"
            >
              <div className="p-4 bg-muted rounded">
                <p>Window ID: {id}</p>
                <p>This window's state is managed by the centralized store.</p>
                <p>Open the Window Tracker above to see real-time analytics.</p>
              </div>
            </StoreWindow>
          );
        })}
      </div>

      {/* Demo windows */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <StoreWindow
          title="Demo Basic Window"
          description="A basic store-managed window"
          type="basic"
        >
          <div className="space-y-2">
            <p>This is a basic window managed by the store.</p>
            <ul className="list-disc ml-4">
              <li>State is centralized</li>
              <li>Window count is tracked</li>
              <li>Analytics are available</li>
            </ul>
          </div>
        </StoreWindow>

        <StoreDraggableWindow
          title="Demo Draggable Window"
          description="A draggable store-managed window"
          type="draggable"
          // defaultPosition={{ x: 300, y: 100 }}
        >
          <div className="space-y-2">
            <p>This is a draggable window managed by the store.</p>
            <ul className="list-disc ml-4">
              <li>Position is tracked</li>
              <li>State is centralized</li>
              <li>Z-index is managed</li>
            </ul>
          </div>
        </StoreDraggableWindow>
      </div>

      <StoreDraggableWindow
        title="Calculator Window"
        description="Store-managed calculator"
        type="calculator"
        defaultPosition={{ x: 100, y: 300 }}
      >
        <Calculator />
      </StoreDraggableWindow>
    </div>
  );
}
