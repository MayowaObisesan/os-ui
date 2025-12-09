"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DynamicOSMenu, defaultOSMenuConfig, MenuConfig } from "@/components/os/DynamicMenu";
import { Flex, Theme } from "@radix-ui/themes";
import { LucideMaximize2, LucideMinimize2, LucideMinus, LucideX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWindowManagement, useWindowState } from "@/lib/store";
import { WindowState } from "@/lib/store/window-store";

export interface StoreWindowProps {
  windowId?: string;
  title?: string;
  description?: string;
  menuConfig?: MenuConfig[];
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  osType?: "mac" | "others";
  className?: string;
  type?: "basic" | "draggable" | "calculator" | string;
}

export function StoreWindow({
  windowId,
  title = "Dynamic Window",
  description = "This is a dynamic window with configurable menu and content.",
  menuConfig = defaultOSMenuConfig,
  onClose,
  onMinimize,
  onMaximize,
  children,
  trigger,
  open = false,
  onOpenChange,
  osType = "mac",
  className,
  type = "basic",
}: StoreWindowProps) {
  const { createWindow, updateWindow, closeWindow, bringToFront } = useWindowManagement();
  const { getWindowById } = useWindowState();
  const [currentOsType, setCurrentOsType] = useState<"mac" | "others">(osType);
  const windowRef = useRef<HTMLDivElement>(null);

  // Initialize window - only create if no windowId provided and only once
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!windowId && !initialized) {
      // Create new window if no ID provided and not already initialized
      const newWindowId = createWindow({
        title,
        type,
        state: open ? "open" : "closed",
      });
      setInitialized(true);
      // In a real implementation, you might want to store this ID or pass it back
      console.log("Created new window with ID:", newWindowId);
    }
  }, [windowId, createWindow, title, type, open, initialized]);

  // Get current window state from store
  const window = windowId ? getWindowById(windowId) : null;
  const windowState = window?.state || (open ? "open" : "closed");

  // Handle window state changes
  const handleClose = useCallback(() => {
    if (windowId) {
      closeWindow(windowId);
    }
    onClose?.();
    onOpenChange?.(false);
  }, [windowId, closeWindow, onClose, onOpenChange]);

  const handleMinimize = useCallback(() => {
    if (windowId) {
      updateWindow(windowId, { state: "minimized" });
    }
    onMinimize?.();
  }, [windowId, updateWindow, onMinimize]);

  const handleMaximize = useCallback(() => {
    if (windowId) {
      const newState = windowState === "maximized" ? "open" : "maximized";
      updateWindow(windowId, { state: newState });
    }
    onMaximize?.();
  }, [windowId, windowState, updateWindow, onMaximize]);

  const handleOpen = useCallback(() => {
    if (windowId) {
      updateWindow(windowId, { state: "open" });
      bringToFront(windowId);
    }
    onOpenChange?.(true);
  }, [windowId, updateWindow, bringToFront, onOpenChange]);

  // Toggle OS type for demonstration
  const toggleOsType = useCallback(() => {
    setCurrentOsType((prev) => (prev === "mac" ? "others" : "mac"));
  }, []);

  // Bring window to front when clicked
  const handleWindowClick = useCallback(() => {
    if (windowId) {
      bringToFront(windowId);
    }
  }, [windowId, bringToFront]);

  const defaultTrigger = (
    <Button variant="outline" onClick={handleOpen}>
      Open Window
    </Button>
  );

  // If window is closed, only show trigger
  if (windowState === "closed") {
    return <>{trigger || defaultTrigger}</>;
  }

  return (
    <AlertDialog open={windowState !== "closed"}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent
        className={cn(
          "transition-all duration-300 ease-in-out",
          windowState === "maximized"
            ? "min-w-[calc(100vw-4rem)] h-[calc(100vh-8rem)] -mt-8"
            : "max-w-4xl",
          className
        )}
        onClick={handleWindowClick}
        ref={windowRef}
      >
        <AlertDialogHeader className="p-0">
          <AlertDialogFooter className={"p-0! justify-start!"}>
            <Theme className={"w-full"}>
              <Flex
                className={cn(
                  "w-full cursor-move select-none",
                  currentOsType === "others" ? "flex-row-reverse" : "flex-row justify-between"
                )}
                gap={"2"}
                // onDoubleClick={toggleOsType}
              >
                <Flex
                  className={cn(currentOsType === "others" ? "flex-row-reverse flex-1" : "")}
                  align={"center"}
                  gapX={"2"}
                  pl={"0"}
                >
                  <AlertDialogCancel className={"p-0 border-0 outline-0 ring-0! bg-transparent!"}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className={cn(
                            "size-4 transition-colors",
                            windowState === "minimized" ? "bg-gray-400!" : "bg-[tomato]! text-black"
                          )}
                          size={"icon"}
                          onClick={handleClose}
                        >
                          <LucideX className={"size-2.5"} strokeWidth={4} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Close</span>
                      </TooltipContent>
                    </Tooltip>
                  </AlertDialogCancel>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className={cn(
                          "size-4 transition-colors",
                          windowState === "minimized" ? "bg-gray-400!" : "bg-amber-400! text-black"
                        )}
                        size={"icon"}
                        onClick={handleMinimize}
                      >
                        <LucideMinus className={"size-2.5"} strokeWidth={4} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Minimize</span>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className={cn(
                          "size-4 transition-colors",
                          windowState === "maximized" ? "bg-green-600!" : "bg-green-500! text-black"
                        )}
                        size={"icon"}
                        onClick={handleMaximize}
                      >
                        {windowState === "maximized" ? (
                          <LucideMinimize2 className={"size-2"} strokeWidth={4} />
                        ) : (
                          <LucideMaximize2 className={"size-2"} strokeWidth={4} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{windowState === "maximized" ? "Restore" : "Maximize"}</span>
                    </TooltipContent>
                  </Tooltip>
                </Flex>
                <DynamicOSMenu menus={menuConfig} className="flex-1" />
              </Flex>
            </Theme>
          </AlertDialogFooter>
          <div className="pb-4">
            <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Window Content */}
        <div className="px-6 pb-6">
          {children || (
            <div className="bg-muted/50 rounded-lg p-8 text-center border-2 border-dashed border-muted-foreground/25">
              <p className="text-muted-foreground">Dynamic window content goes here.</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Store-managed window state</li>
                <li>• Centralized window tracking</li>
                <li>• Automatic z-index management</li>
                <li>• Window analytics and monitoring</li>
              </ul>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
