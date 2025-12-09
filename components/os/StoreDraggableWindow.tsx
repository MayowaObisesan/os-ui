"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DynamicOSMenu, defaultOSMenuConfig, MenuConfig } from "@/components/os/DynamicMenu";
import { Flex, Theme } from "@radix-ui/themes";
import { LucideMaximize2, LucideMinimize2, LucideMinus, LucideX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback, useRef, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Draggable from "react-draggable";
import { useWindowManagement, useWindowState } from "@/lib/store";

export interface StoreDraggableWindowProps {
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
  onTriggerClick?: () => void;
  osType?: "mac" | "others";
  className?: string;
  type?: "basic" | "draggable" | "calculator" | string;
  defaultPosition?: { x: number; y: number };
}

export function StoreDraggableWindow({
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
  onTriggerClick,
  osType = "mac",
  className,
  type = "draggable",
  defaultPosition = { x: 0, y: 0 },
}: StoreDraggableWindowProps) {
  const { createWindow, updateWindow, closeWindow, bringToFront } = useWindowManagement();
  const { getWindowById, nextZIndex } = useWindowState();
  const [currentOsType, setCurrentOsType] = useState<"mac" | "others">(osType);
  const [bounds, setBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
  const draggableRef = useRef<HTMLDivElement>(null);

  // Track the window ID created by this component
  const [createdWindowId, setCreatedWindowId] = useState<string | null>(null);

  // Update bounds on window resize
  /*useEffect(() => {
    const updateBounds = () => {
      console.log("Store Draggable...", window, typeof window);
      if (typeof window?.innerWidth !== "undefined") {
        const padding = 20;
        setBounds({
          left: -window.innerWidth / 2 + padding,
          top: -window.innerHeight / 2 + padding,
          right: window.innerWidth / 2 - padding,
          bottom: window.innerHeight / 2 - padding,
        });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);*/

  // Get current window state from store
  const effectiveWindowId = windowId || createdWindowId;
  const window = effectiveWindowId ? getWindowById(effectiveWindowId) : null;
  const windowState = window?.state || (open ? "open" : "closed");

  // Handle window state changes
  const handleClose = useCallback(() => {
    const effectiveWindowId = windowId || createdWindowId;
    if (effectiveWindowId) {
      closeWindow(effectiveWindowId);
      setCreatedWindowId(null); // Reset created window ID
    }
    onClose?.();
    onOpenChange?.(false);
  }, [windowId, createdWindowId, closeWindow, onClose, onOpenChange]);

  const handleMinimize = useCallback(() => {
    const effectiveWindowId = windowId || createdWindowId;
    if (effectiveWindowId) {
      updateWindow(effectiveWindowId, { state: "minimized" });
    }
    onMinimize?.();
  }, [windowId, createdWindowId, updateWindow, onMinimize]);

  const handleMaximize = useCallback(() => {
    const effectiveWindowId = windowId || createdWindowId;
    if (effectiveWindowId) {
      const newState = windowState === "maximized" ? "open" : "maximized";
      updateWindow(effectiveWindowId, { state: newState });
    }
    onMaximize?.();
  }, [windowId, createdWindowId, windowState, updateWindow, onMaximize]);

  const handleOpen = useCallback(() => {
    if (windowId) {
      // If windowId is provided, just update the existing window
      updateWindow(windowId, { state: "open" });
      bringToFront(windowId);
    } else if (!createdWindowId) {
      // If no windowId and no createdWindowId, create a new window
      const newWindowId = createWindow({
        title,
        type,
        state: "open",
        position: defaultPosition,
      });
      setCreatedWindowId(newWindowId);
      console.log("Created new draggable window with ID:", newWindowId);
    } else {
      // If we have a createdWindowId, update the existing window
      updateWindow(createdWindowId, { state: "open" });
      bringToFront(createdWindowId);
    }
    onOpenChange?.(true);
  }, [windowId, createdWindowId, createWindow, title, type, defaultPosition, updateWindow, bringToFront, onOpenChange]);

  // Handle trigger click - merges custom onClick with window opening
  const handleTriggerClick = useCallback(() => {
    onTriggerClick?.();
    handleOpen();
  }, [onTriggerClick, handleOpen]);

  // Handle drag events - only update store on stop for better performance
  const handleDrag = useCallback(
    (e: any, data: { x: number; y: number }) => {
      // Only update local position during drag for smooth performance
      // Store will be updated on stop
    },
    []
  );

  const handleStop = useCallback(
    (e: any, data: { x: number; y: number }) => {
      const effectiveWindowId = windowId || createdWindowId;
      if (effectiveWindowId) {
        updateWindow(effectiveWindowId, { position: { x: data.x, y: data.y } });
      }
    },
    [windowId, createdWindowId, updateWindow]
  );

  // Toggle OS type for demonstration
  const toggleOsType = useCallback(() => {
    setCurrentOsType((prev) => (prev === "mac" ? "others" : "mac"));
  }, []);

  // Bring window to front when clicked - only if not already at front
  const handleWindowClick = useCallback(() => {
    const effectiveWindowId = windowId || createdWindowId;
    if (effectiveWindowId) {
      const currentWindow = getWindowById(effectiveWindowId);
      // Check if window is already at front (zIndex === nextZIndex - 1)
      if (!currentWindow || currentWindow.zIndex !== nextZIndex - 1) {
        bringToFront(effectiveWindowId);
      }
    }
  }, [windowId, createdWindowId, bringToFront, getWindowById, nextZIndex]);

  const defaultTrigger = (
    <Button variant="outline" onClick={handleTriggerClick}>
      Open Window
    </Button>
  );

  // If window is closed, only show trigger
  if (windowState === "closed") {
    if (trigger) {
      // Clone the custom trigger and merge onClick handlers
      return React.cloneElement(trigger as React.ReactElement, {
        onClick: handleTriggerClick
      });
    }
    return defaultTrigger;
  }

  return (
    <>
      <>
        {trigger || defaultTrigger}
      </>

      <Flex align={"center"} className={"bg-orange-400"} justify={"center"}>
        <Draggable
          handle=".window-drag-handle"
          bounds={"body"}
          position={window?.position || defaultPosition}
          onDrag={handleDrag}
          onStop={handleStop}
          disabled={windowState === "closed" || windowState === "minimized"}
          nodeRef={draggableRef}
        >
          <div ref={draggableRef}>
            <Card
              className={cn(
                "absolute p-4 pt-2 w-2xl max-w-4xl h-auto",
                windowState === "closed" ? "card-animate--exit" : "card-animate",
                "transition-all duration-800 ease-in-out",
                windowState === "maximized" &&
                  "w-[calc(100vw-4rem)] max-w-[calc(100vw-4rem)] h-[calc(100vh-8rem)] -mt-8",
                className
              )}
              onClick={handleWindowClick}
            >
              <CardFooter className={"p-0"}>
                <Theme className={"w-full"}>
                  <Flex
                    className={cn(
                      "w-full cursor-move select-none window-drag-handle",
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className={cn(
                              "size-4 transition-colors",
                              windowState === "minimized" ? "bg-gray-400!" : "bg-[tomato]! text-black",
                              windowState !== "open" ? "pointer-events-none" : "pointer-events-auto"
                            )}
                            size={"icon"}
                            onClick={handleClose}
                            tabIndex={-1}
                          >
                            <LucideX className={"size-2.5"} strokeWidth={4} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>Close</span>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className={cn(
                              "size-4 transition-colors",
                              windowState === "minimized" ? "bg-gray-400!" : "bg-amber-400! text-black"
                            )}
                            size={"icon"}
                            onClick={handleMinimize}
                            tabIndex={-1}
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
                            tabIndex={-1}
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
              </CardFooter>
              <CardHeader className={"p-0"}>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent className={"p-0"}>{children}</CardContent>
            </Card>
          </div>
        </Draggable>
      </Flex>
    </>
  );
}
