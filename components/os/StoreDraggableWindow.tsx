"use client";

import React, { memo, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DynamicOSMenu, defaultOSMenuConfig, MenuConfig } from "@/components/os/DynamicMenu";
import { MenuRegistryProvider, useMenuRegistry } from "@/components/os/MenuRegistryContext";
import { Flex, Theme } from "@radix-ui/themes";
import { LucideMaximize2, LucideMinimize2, LucideMinus, LucideX } from "lucide-react";
import { cn } from "@/lib/utils";
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
  enableMenuRegistry?: boolean;
}

interface WindowContentProps {
  windowId?: string;
  createdWindowId: string | null;
  title: string;
  description: string;
  menuConfig: MenuConfig[];
  currentOsType: "mac" | "others";
  window: any;
  windowState: string;
  draggableRef: React.RefObject<HTMLDivElement>;
  defaultPosition: { x: number; y: number };
  className?: string;
  handleClose: () => void;
  handleMinimize: () => void;
  handleMaximize: () => void;
  handleWindowClick: () => void;
  handleDrag: (e: any, data: { x: number; y: number }) => void;
  handleStop: (e: any, data: { x: number; y: number }) => void;
  mergedMenuConfig: MenuConfig[];
  children: React.ReactNode;
}

// Memoized window content component to prevent unnecessary re-renders
const WindowContent = memo(function WindowContent({
  title,
  description,
  currentOsType,
  window,
  windowState,
  draggableRef,
  defaultPosition,
  className,
  handleClose,
  handleMinimize,
  handleMaximize,
  handleWindowClick,
  handleDrag,
  handleStop,
  mergedMenuConfig,
  children,
}: WindowContentProps) {
  return (
    <Flex align={"center"} className={""} justify={"center"}>
      <Draggable
        handle=".window-drag-handle"
        bounds={"body"}
        position={window?.position || defaultPosition}
        onDrag={handleDrag}
        onStop={handleStop}
        disabled={windowState === "closed" || windowState === "minimized"}
        nodeRef={draggableRef}
      >
        <div
          ref={draggableRef}
          style={{ zIndex: window?.zIndex || 100, position: "absolute" }}
        >
          <Card
            className={cn(
              "p-4 pt-2 w-2xl max-w-4xl h-auto max-h-[calc(100vh-8rem)] gap-1",
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
                  <DynamicOSMenu menus={mergedMenuConfig} className="flex-1" />
                </Flex>
              </Theme>
            </CardFooter>
            <CardHeader hidden className={"p-0"}>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className={"p-0 overflow-y-auto"}>{children}</CardContent>
          </Card>
        </div>
      </Draggable>
    </Flex>
  );
});

// Content wrapper component that receives all necessary props
interface ContentWrapperProps extends WindowContentProps {
  mergedMenuConfig: MenuConfig[];
}

const ContentWrapper = memo(function ContentWrapper({
  windowId,
  createdWindowId,
  title,
  description,
  menuConfig,
  currentOsType,
  window,
  windowState,
  draggableRef,
  defaultPosition,
  className,
  handleClose,
  handleMinimize,
  handleMaximize,
  handleWindowClick,
  handleDrag,
  handleStop,
  mergedMenuConfig,
  children,
}: ContentWrapperProps) {
  return (
    <WindowContent
      windowId={windowId}
      createdWindowId={createdWindowId}
      title={title}
      description={description}
      menuConfig={menuConfig}
      currentOsType={currentOsType}
      window={window}
      windowState={windowState}
      draggableRef={draggableRef}
      defaultPosition={defaultPosition}
      className={className}
      handleClose={handleClose}
      handleMinimize={handleMinimize}
      handleMaximize={handleMaximize}
      handleWindowClick={handleWindowClick}
      handleDrag={handleDrag}
      handleStop={handleStop}
      mergedMenuConfig={mergedMenuConfig}
    >
      {children}
    </WindowContent>
  );
});

// Component to handle menu registry context
function ContentWrapperWithMenu({
  windowId,
  createdWindowId,
  title,
  description,
  menuConfig,
  currentOsType,
  window,
  windowState,
  draggableRef,
  defaultPosition,
  className,
  handleClose,
  handleMinimize,
  handleMaximize,
  handleWindowClick,
  handleDrag,
  handleStop,
  children,
}: WindowContentProps & { mergedMenuConfig: MenuConfig[] }) {
  const { getMergedMenu } = useMenuRegistry();

  const finalMergedMenuConfig = useMemo(() => {
    return getMergedMenu(menuConfig);
  }, [getMergedMenu, menuConfig]);

  return (
    <ContentWrapper
      windowId={windowId}
      createdWindowId={createdWindowId}
      title={title}
      description={description}
      menuConfig={menuConfig}
      currentOsType={currentOsType}
      window={window}
      windowState={windowState}
      draggableRef={draggableRef}
      defaultPosition={defaultPosition}
      className={className}
      handleClose={handleClose}
      handleMinimize={handleMinimize}
      handleMaximize={handleMaximize}
      handleWindowClick={handleWindowClick}
      handleDrag={handleDrag}
      handleStop={handleStop}
      mergedMenuConfig={finalMergedMenuConfig}
    >
      {children}
    </ContentWrapper>
  );
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
  enableMenuRegistry = true,
}: StoreDraggableWindowProps) {
  const { createWindow, updateWindow, closeWindow, bringToFront } = useWindowManagement();
  const { getWindowById, windowCount } = useWindowState();
  const [currentOsType, setCurrentOsType] = React.useState<"mac" | "others">(osType);
  const draggableRef = useRef<HTMLDivElement>(null);

  // Track the window ID created by this component
  const [createdWindowId, setCreatedWindowId] = React.useState<string | null>(null);

  // Get current window state from store
  const effectiveWindowId = windowId || createdWindowId;
  const window = effectiveWindowId ? getWindowById(effectiveWindowId) : null;
  const windowState = window?.state || (open ? "open" : "closed");

  // Handle window state changes - memoized to prevent recreation
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

  // Handle drag events - memoized to prevent recreation
  const handleDrag = useCallback(
    (_e: any, _data: { x: number; y: number }) => {
      // Only update local position during drag for smooth performance
      // Store will be updated on stop
    },
    []
  );

  const handleStop = useCallback(
    (_e: any, data: { x: number; y: number }) => {
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

  // Bring window to front when clicked - memoized
  const handleWindowClick = useCallback(() => {
    const effectiveWindowId = windowId || createdWindowId;
    if (effectiveWindowId) {
      const currentWindow = getWindowById(effectiveWindowId);
      // Check if window is already at front (zIndex === nextZIndex - 1)
      if (!currentWindow || currentWindow.zIndex !== windowCount - 1) {
        bringToFront(effectiveWindowId);
      }
    }
  }, [windowId, createdWindowId, bringToFront, getWindowById, windowCount]);

  const defaultTrigger = useMemo(() => (
    <Button variant="outline" onClick={handleTriggerClick}>
      Open Window
    </Button>
  ), [handleTriggerClick]);

  // Common props for window content
  const windowContentProps = {
    windowId,
    createdWindowId,
    title,
    description,
    menuConfig,
    currentOsType,
    window,
    windowState,
    draggableRef,
    defaultPosition,
    className,
    handleClose,
    handleMinimize,
    handleMaximize,
    handleWindowClick,
    handleDrag,
    handleStop,
    children,
  } as WindowContentProps;

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
      {trigger || defaultTrigger}

      {enableMenuRegistry ? (
        <MenuRegistryProvider
          defaultMenuConfig={menuConfig}
          enableMenuRegistry={enableMenuRegistry}
        >
          <ContentWrapperWithMenu {...windowContentProps} />
        </MenuRegistryProvider>
      ) : (
        <ContentWrapper {...windowContentProps} mergedMenuConfig={menuConfig} />
      )}
    </>
  );
}
