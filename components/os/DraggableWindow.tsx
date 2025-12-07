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
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

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

export function OSDraggableWindow({
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
    setWindowState('closed');
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
    <>
      <>
        {trigger || defaultTrigger}
      </>

      <Flex
        align={'center'}
        className={'h-dvh w-full'}
        justify={'center'}
      >
        <Card className={cn(
          'p-4 pt-2 w-2xl max-w-4xl h-auto',
          windowState === 'closed' ? 'card-animate--exit' : 'card-animate',
          "transition-all duration-800 ease-in-out",
          windowState === 'maximized' && "w-[calc(100vw-4rem)] max-w-[calc(100vw-4rem)] h-[calc(100vh-8rem)] -mt-8",
          className
        )}>
          <CardFooter className={'p-0'}>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className={cn(
                          'size-4 transition-colors',
                          windowState === 'minimized' ? 'bg-gray-400!' : 'bg-[tomato]! text-black',
                          windowState !== 'open' ? 'pointer-events-none' : 'pointer-events-auto'
                        )}
                        size={'icon'}
                        onClick={handleClose}
                        tabIndex={-1}
                      >
                        <LucideX className={'size-2.5'} strokeWidth={4} />
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
                          'size-4 transition-colors',
                          windowState === 'minimized' ? 'bg-gray-400!' : 'bg-amber-400! text-black'
                        )}
                        size={'icon'}
                        onClick={handleMinimize}
                        tabIndex={-1}
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
                        tabIndex={-1}
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
          </CardFooter>
          <CardHeader className={'p-0'}>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className={'p-0'}>
            {children}
          </CardContent>
        </Card>
      </Flex>
    </>
  );
}
