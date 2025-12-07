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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {DynamicOSMenu, defaultOSMenuConfig, MenuConfig} from "@/components/os/DynamicMenu";
import {Flex, Theme} from "@radix-ui/themes";
import {LucideMaximize2, LucideMinimize2, LucideMinus, LucideX} from "lucide-react";
import {cn} from "@/lib/utils";
import {useState, useCallback} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export type WindowState = 'open' | 'minimized' | 'maximized' | 'closed';

export interface OSWindowProps {
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
  osType?: 'mac' | 'others';
  className?: string;
}

export function OSWindow({
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
  osType = 'mac',
  className,
}: OSWindowProps) {
  const [windowState, setWindowState] = useState<WindowState>(open ? 'open' : 'closed');
  const [currentOsType, setCurrentOsType] = useState<'mac' | 'others'>(osType);

  // Handle window state changes
  const handleClose = useCallback(() => {
    // setWindowState('closed');
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);

  const handleMinimize = useCallback(() => {
    setWindowState('minimized');
    onMinimize?.();
  }, [onMinimize]);

  const handleMaximize = useCallback(() => {
    setWindowState(windowState === 'maximized' ? 'open' : 'maximized');
    onMaximize?.();
  }, [windowState, onMaximize]);

  const handleOpen = useCallback(() => {
    setWindowState('open');
    onOpenChange?.(true);
  }, [onOpenChange]);

  // Toggle OS type for demonstration
  const toggleOsType = useCallback(() => {
    setCurrentOsType(prev => prev === 'mac' ? 'others' : 'mac');
  }, []);

  const defaultTrigger = (
    <Button variant="outline" onClick={handleOpen}>
      Open Window
    </Button>
  );

  return (
    <AlertDialog
      // open={windowState !== 'closed'} onOpenChange={(open) => {
      //   if (!open) handleClose();
      // }}
    >
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent className={cn(
        "transition-all duration-300 ease-in-out",
        windowState === 'maximized'
          ? "min-w-[calc(100vw-4rem)] h-[calc(100vh-8rem)] -mt-8"
          : "max-w-4xl",
        className
      )}>
        <AlertDialogHeader className="p-0">
          <AlertDialogFooter className={'p-0! justify-start!'}>
            <Theme className={'w-full'}>
              <Flex
                className={cn(
                  "w-full cursor-move select-none",
                  currentOsType === 'others' ? 'flex-row-reverse' : 'flex-row justify-between'
                )}
                gap={'2'}
                // onDoubleClick={toggleOsType}
              >
                <Flex
                  className={cn(currentOsType === 'others' ? 'flex-row-reverse flex-1' : '')}
                  align={'center'}
                  gapX={'2'}
                  pl={'0'}
                >
                  <AlertDialogCancel className={'p-0 border-0 outline-0 ring-0! bg-transparent!'}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className={cn(
                            'size-4 transition-colors',
                            windowState === 'minimized' ? 'bg-gray-400!' : 'bg-[tomato]! text-black'
                          )}
                          size={'icon'}
                          onClick={handleClose}
                        >
                          <LucideX className={'size-2.5'} strokeWidth={4} />
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
                          'size-4 transition-colors',
                          windowState === 'minimized' ? 'bg-gray-400!' : 'bg-amber-400! text-black'
                        )}
                        size={'icon'}
                        onClick={handleMinimize}
                      >
                        <LucideMinus className={'size-2.5'} strokeWidth={4} />
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
                          'size-4 transition-colors',
                          windowState === 'maximized' ? 'bg-green-600!' : 'bg-green-500! text-black'
                        )}
                        size={'icon'}
                        onClick={handleMaximize}
                      >
                        {windowState === 'maximized'
                          ? <LucideMinimize2 className={'size-2'} strokeWidth={4} />
                          : <LucideMaximize2 className={'size-2'} strokeWidth={4} />
                        }
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{windowState === 'maximized' ? 'Restore' : 'Maximize'}</span>
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
              <p className="text-muted-foreground">
                Dynamic window content goes here. This window supports:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Dynamic menu configuration</li>
                <li>• Window state management (minimize, maximize, close)</li>
                <li>• Custom content rendering</li>
                <li>• OS-specific styling (double-click title bar to toggle)</li>
                <li>• Configurable triggers and callbacks</li>
              </ul>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
