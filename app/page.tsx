"use client";

import {OSWindow, MenuConfig} from "@/components/os/Window";
import {Button} from "@/components/ui/button";
import {useState} from "react";

// Custom menu configuration for demo
const customMenuConfig: MenuConfig[] = [
  {
    label: 'Application',
    content: [
      { type: 'item', label: 'New Document', shortcut: { keys: '⌘N' } },
      { type: 'item', label: 'Open...', shortcut: { keys: '⌘O' } },
      { type: 'separator' },
      { type: 'item', label: 'Save', shortcut: { keys: '⌘S' } },
      { type: 'item', label: 'Save As...', shortcut: { keys: '⇧⌘S' } },
    ]
  },
  {
    label: 'Edit',
    content: [
      { type: 'item', label: 'Undo', shortcut: { keys: '⌘Z' } },
      { type: 'item', label: 'Redo', shortcut: { keys: '⇧⌘Z' } },
      { type: 'separator' },
      { type: 'checkbox', label: 'Auto-save', checked: true },
    ]
  },
  {
    label: 'View',
    content: [
      { type: 'checkbox', label: 'Show Toolbar' },
      { type: 'checkbox', label: 'Show Status Bar', checked: true },
      { type: 'separator' },
      { type: 'item', label: 'Zoom In', shortcut: { keys: '⌘+' } },
      { type: 'item', label: 'Zoom Out', shortcut: { keys: '⌘-' } },
    ]
  }
];

export default function Home() {
  const [windowOpen, setWindowOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("Dynamic Application Window");

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <main hidden className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* Basic Window Example */}
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl font-semibold">Basic Window</h2>
          <OSWindow
            title="Simple Window"
            description="This is a basic window with default configuration."
          />
        </div>

        {/* Window with Custom Menu */}
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl font-semibold">Custom Menu Window</h2>
          <OSWindow
            title="Custom Application"
            description="This window has a custom menu configuration."
            menuConfig={customMenuConfig}
            className="max-w-2xl"
          />
        </div>

        {/* Window with Custom Content */}
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl font-semibold">Custom Content Window</h2>
          <OSWindow
            title="Rich Content Window"
            description="This window demonstrates custom content rendering."
          >
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-blue-900">Custom Window Content</h3>
                <p className="text-blue-700 mt-2">
                  This content is completely customizable. You can put any React components here.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded border">
                  <h4 className="font-medium text-green-900">Feature 1</h4>
                  <p className="text-sm text-green-700">Dynamic configuration</p>
                </div>
                <div className="bg-purple-50 p-3 rounded border">
                  <h4 className="font-medium text-purple-900">Feature 2</h4>
                  <p className="text-sm text-purple-700">State management</p>
                </div>
              </div>
            </div>
          </OSWindow>
        </div>

        {/* Controlled Window */}
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl font-semibold">Controlled Window</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setWindowOpen(true)}
              disabled={windowOpen}
            >
              Open Controlled Window
            </Button>
            <Button
              variant="outline"
              onClick={() => setCustomTitle(`Window ${Date.now()}`)}
            >
              Change Title
            </Button>
          </div>
          <OSWindow
            title={customTitle}
            description="This window is controlled by parent component state."
            open={windowOpen}
            onOpenChange={setWindowOpen}
            onClose={() => console.log('Window closed')}
            onMinimize={() => console.log('Window minimized')}
            onMaximize={() => console.log('Window maximized')}
          >
            <div className="text-center py-8">
              <p className="text-lg mb-4">🎉 Hello from controlled window!</p>
              <p className="text-sm text-muted-foreground">
                This window is managed by parent state. Try the window controls!
              </p>
            </div>
          </OSWindow>
        </div>

        {/* Multiple Windows */}
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl font-semibold">Multiple Windows</h2>
          <div className="flex gap-2 flex-wrap justify-center">
            <OSWindow
              title="Window 1"
              description="First window with Mac OS style"
              osType="mac"
              trigger={<Button>Open Mac Window</Button>}
            />
            <OSWindow
              title="Window 2"
              description="Second window with Windows style"
              osType="others"
              trigger={<Button variant="outline">Open Windows Window</Button>}
            />
          </div>
        </div>
      </main>

      <OSWindow
        title="Simple Window"
        description="This is a basic window with default configuration."
      />
    </div>
  );
}
