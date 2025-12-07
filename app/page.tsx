"use client";

import {OSWindow} from "@/components/os/Window";

export default function Home() {
  return (
    <div className="min-h-screen">
      <OSWindow
        title="My Window"
        description="Description"
      >
        Content here
      </OSWindow>
    </div>
  );
}
