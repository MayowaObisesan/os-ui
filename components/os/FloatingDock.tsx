"use client";

import React, { useState } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX, IconCalculator,
  IconExchange,
  IconHome,
  IconNewSection,
  IconSettings,
  IconTerminal2,
  IconLockOff, IconLock
} from "@tabler/icons-react";
import {DockOptions} from "@/components/Dock/DockOptions";
import {ModeToggle} from "@/components/mode-toggle";
import { OSWindow } from "@/components/os/Window";
import { Calculator } from "@/components/os/Calculator";
import {StoreDraggableWindow} from "@/components/os/StoreDraggableWindow";

export function OSDock() {
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Products",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Aceternity UI",
      icon: (
        <img
          src="https://assets.aceternity.com/logo-dark.png"
          width={20}
          height={20}
          alt="Aceternity Logo"
        />
      ),
      href: "#",
    },
    {
      title: "Changelog",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Calculator",
      icon: (
        <IconCalculator className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => setCalculatorOpen(true)
    },

    // {
    //   title: "Twitter",
    //   icon: (
    //     <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    //   ),
    //   href: "#",
    // },
    // {
    //   title: "GitHub",
    //   icon: (
    //     <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    //   ),
    //   href: "#",
    // },
    {
      title: "Theme",
      icon: (
        <ModeToggle />
      ),
      href: "#",
    },
    {
      title: "Options",
      icon: (
        <DockOptions />
      ),
      href: "#",
    },
    {
      title: "Settings",
      icon: (
        <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Lock",
      icon: (
        <IconLock className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <FloatingDock
          mobileClassName="translate-y-20" // only for demo, remove for production
          items={links}
        />
      </div>
      <StoreDraggableWindow
        title="Calculator Window"
        description="A draggable store-managed calculator window"
        type="draggable"
        defaultPosition={{ x: 0, y: 100 }}
        trigger={<div></div>}
        open={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      >
        <Calculator />
      </StoreDraggableWindow>
    </>
  );
}
