"use client";

import React from "react";
import {
  IconCalculator,
  IconFileText,
  IconBrowser,
  IconWindow,
  IconCode,
  IconNotebook,
  IconTerminal,
  IconSettings,
  IconPencil,
  IconLayoutDashboard, IconFileTypePdf, IconFileTypeDoc
} from "@tabler/icons-react";

/**
 * Get default icon for a window based on its type
 * @param type Window type
 * @returns React.ReactNode Icon component
 */
export function getDefaultWindowIcon(type?: string): React.ReactNode {
  if (!type) return <IconWindow className="h-full w-full text-neutral-500 dark:text-neutral-300" />;

  const iconMap: Record<string, React.ReactNode> = {
    calculator: <IconCalculator className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    browser: <IconBrowser className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    editor: <IconFileText className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    text: <IconFileText className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    code: <IconCode className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    terminal: <IconTerminal className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    notebook: <IconNotebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    note: <IconNotebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    settings: <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    file: <IconFileTypePdf className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    document: <IconFileTypeDoc className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    draw: <IconPencil className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    paint: <IconPencil className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    dashboard: <IconLayoutDashboard className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    // Add more window types as needed
  };

  return iconMap[type] || <IconWindow className="h-full w-full text-neutral-500 dark:text-neutral-300" />;
}

/**
 * Get window icon with fallback to default based on type
 * @param icon Custom icon (optional)
 * @param type Window type for default icon
 * @returns React.ReactNode Icon component
 */
export function getWindowIcon(icon?: React.ReactNode, type?: string): React.ReactNode {
  return icon || getDefaultWindowIcon(type);
}
