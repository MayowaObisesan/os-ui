"use client";

import React from "react";
import { useWindowManagement } from "@/lib/store";
import { IconX, IconArrowsMaximize } from "@tabler/icons-react";
import {useDockItems} from "@/lib/store/WindowStoreProvider";
import { getWindowIcon } from "@/lib/utils/window-icons";

/**
 * DockWindowManager component that integrates minimized windows with the FloatingDock
 * This component provides dock items for all minimized windows and handles restore/close actions
 */
export function DockWindowManager() {
  const { dockItems } = useDockItems();
  const { restoreWindowFromDock, closeWindowFromDock } = useWindowManagement();

  // Convert dock items to the format expected by FloatingDock
  const dockItemsForFloatingDock = React.useMemo(() => {
    return dockItems.map((window: { title: any; icon: any; id: string; type?: string; }) => ({
      title: window.title,
      icon: getWindowIcon(window.icon, window.type),
      onClick: () => restoreWindowFromDock(window.id),
      contextMenuItems: [
        {
          title: "Restore",
          onClick: (e: { stopPropagation: () => void; }) => {
            e.stopPropagation();
            restoreWindowFromDock(window.id);
          },
          icon: <IconArrowsMaximize className="h-4 w-4" />,
        },
        {
          title: "Close",
          onClick: (e: { stopPropagation: () => void; }) => {
            e.stopPropagation();
            closeWindowFromDock(window.id);
          },
          icon: <IconX className="h-4 w-4" />,
        },
      ],
    }));
  }, [dockItems, restoreWindowFromDock, closeWindowFromDock]);

  return {
    dockItems: dockItemsForFloatingDock,
  };
}

/**
 * Hook that provides dock items for minimized windows
 * @returns {Object} Object containing dockItems array ready for FloatingDock
 */
export function useMinimizedWindowDockItems() {
  const { dockItems } = useDockItems();
  const { restoreWindowFromDock, closeWindowFromDock } = useWindowManagement();

  return React.useMemo(() => {
    return dockItems.map((window: { title: any; icon: any; id: string; type?: string; }) => ({
      title: window.title,
      icon: getWindowIcon(window.icon, window.type),
      onClick: () => restoreWindowFromDock(window.id),
      // Additional metadata for context menus if needed
      windowId: window.id,
      restoreWindow: () => restoreWindowFromDock(window.id),
      closeWindow: () => closeWindowFromDock(window.id),
    }));
  }, [dockItems, restoreWindowFromDock, closeWindowFromDock]);
}
