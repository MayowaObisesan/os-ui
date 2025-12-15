"use client";

import {OSWindow} from "@/components/os/Window";
import {OSDraggableWindow} from "@/components/os/DraggableWindow";
import {Calculator} from "@/components/os/Calculator";
import StoreDemo from "@/app/store-demo";
import {StoreDraggableWindow} from "@/components/os/StoreDraggableWindow";
import {WindowTracker} from "@/components/os/WindowTracker";
import {
  IconAppWindow,
  IconCalculator,
  IconFileTextFilled,
  IconFileTextSpark,
  IconGlobe,
  IconIcons
} from "@tabler/icons-react";
import {Button} from "@/components/ui/button";
import {MenuRegistryProvider} from "@/components/os/MenuRegistryContext";
import {MenuRegistryDemo} from "@/components/os/MenuRegistryDemo";
import {TextEditor} from "@/components/os/TextEditor";
import HomeOld from "@/app/page-old";
import {NoteEditor} from "@/components/os/DynamicNoteEditor";
import {Box, Flex, Text} from "@radix-ui/themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {useRouter} from "next/navigation";
import BrowserDemo from "@/components/os/BrowserDemo";
import {BrowserWindow} from "@/components/os/BrowserWindow";
import LinkInterceptor from "@/components/os/LinkInterceptor";
import React from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import posthog from "posthog-js";

export default function Home() {
  const router = useRouter();
  posthog.capture('home_page', { property: 'click' })

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="min-h-screen">
          {/*<WindowTracker />*/}
          <Flex hidden gap={'2'}>
            <OSWindow
              title="My Window"
              description="Description"
            >
              Content here
            </OSWindow>

            <OSDraggableWindow
              title="My Window"
              description="Description"
            >
              Content here
            </OSDraggableWindow>

            <OSDraggableWindow
              title="Calculator Window"
              description="This is the OS default Calculator"
            >
              <Calculator />
            </OSDraggableWindow>

            <StoreDraggableWindow
              title="Demo Draggable Window"
              description="A draggable store-managed window"
              type="draggable"
              defaultPosition={{ x: 0, y: 100 }}
            >
              <div className="space-y-2">
                <p>This is a draggable window managed by the store.</p>
                <ul className="list-disc ml-4">
                  <li>Position is tracked</li>
                  <li>State is centralized</li>
                  <li>Z-index is managed</li>
                </ul>
              </div>
            </StoreDraggableWindow>
          </Flex>

          {/* Profile Card UI */}
          <Box position={'absolute'} top={'2'} right={'2'}>
            <Card className={'bg-background/25 backdrop-blur-sm min-w-80 w-full gap-1.5 px-2 py-2'}>
              <CardHeader className={'flex items-center bg-muted-foreground/15 rounded-lg p-3'}>
                <Flex align={'center'} gap={'2'} width={'100%'}>
                  <Flex direction={'column'} flexGrow={'1'} gap={'2'}>
                    <CardTitle>
                      <Text size={'5'}>
                        Mayowa Obisesan
                      </Text>
                    </CardTitle>
                  </Flex>
                  <CardAction>
                    <BrowserWindow
                      windowId={'my-porfolio-window'}
                      initialUrl="https://my-portfolio-rho-two-89.vercel.app/"
                      title="My Portfolio"
                      defaultPosition={{ x: 200, y: 200 }}
                      trigger={
                        <Avatar className={'size-16'}>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      }
                    />
                  </CardAction>
                </Flex>
              </CardHeader>
              <CardContent className={'px-2'}>
                <Text color={'gray'} size={'3'}>
                  I'm a versatile Software Engineer...
                </Text>
              </CardContent>
            </Card>
          </Box>

          <Flex direction={'column'} gap={'2'} flexGrow={'0'} p={'2'}>
            <StoreDraggableWindow
              title="Calculator Window"
              description="A draggable store-managed calculator window"
              icon={<IconCalculator className="h-full w-full text-neutral-500 dark:text-neutral-300" />}
              type="draggable"
              defaultPosition={{ x: 0, y: 100 }}
              trigger={<Button className={'rounded-2xl'} size={'icon'} variant={'outline'}><IconCalculator /></Button>}
            >
              <Calculator />
            </StoreDraggableWindow>

            <StoreDraggableWindow
              title="Text Editor Window"
              description="A draggable store-managed Text Editor window"
              type="draggable"
              icon={<IconFileTextFilled className="h-full w-full text-neutral-500 dark:text-neutral-300" />}
              defaultPosition={{ x: 20, y: 100 }}
              trigger={<Button className={'rounded-2xl'} size={'icon'} variant={'outline'}><IconFileTextFilled /></Button>}
            >
              <TextEditor />
            </StoreDraggableWindow>

            <StoreDraggableWindow
              title="Note Editor Window"
              description="A draggable store-managed Note Editor window - An Advanced Note Editor that feels like using Notion"
              type="draggable"
              icon={<IconFileTextSpark className="h-full w-full text-neutral-500 dark:text-neutral-300" />}
              defaultPosition={{ x: 20, y: 100 }}
              trigger={<Button className={'rounded-2xl'} size={'icon'} variant={'outline'}><IconFileTextSpark /></Button>}
            >
              <NoteEditor />
            </StoreDraggableWindow>

            <StoreDraggableWindow
              title="Embed Page"
              description="A draggable store-managed embed page window"
              type="draggable"
              icon={<IconGlobe className="h-full w-full text-neutral-500 dark:text-neutral-300" />}
              defaultPosition={{ x: 0, y: 0 }}
              trigger={<Button className={'rounded-2xl'} size={'icon'} variant={'outline'}><IconGlobe /></Button>}
            >
              <HomeOld />
            </StoreDraggableWindow>

            <BrowserWindow
              windowId={'my-porfolio-window'}
              initialUrl="https://my-portfolio-rho-two-89.vercel.app/"
              title="My Portfolio"
              icon={<IconAppWindow className="h-full w-full text-neutral-500 dark:text-neutral-300" />}
              defaultPosition={{ x: 100, y: 100 }}
              trigger={<Button className={'rounded-2xl'} size={'icon'} variant={'outline'}><IconAppWindow /></Button>}
            />

            <BrowserWindow
              initialUrl="https://ai-image-detector-three.vercel.app/"
              title="AFriB Browser"
              defaultPosition={{ x: 100, y: 50 }}
              trigger={<Button className={'rounded-2xl'} size={'icon'} variant={'outline'}>
                <Text color={'grass'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M168,128a40,40,0,1,1-40-40A40,40,0,0,1,168,128Z" opacity="0.2"></path><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,16a88,88,0,0,1,73.72,40H128a48.08,48.08,0,0,0-45.6,33l-23.08-40A87.89,87.89,0,0,1,128,40Zm32,88a32,32,0,1,1-32-32A32,32,0,0,1,160,128Zm-45.28,87A88,88,0,0,1,49.56,88.14L86.43,152c.06.1.13.19.19.28A48,48,0,0,0,137.82,175Zm18,.87L169.57,152c.08-.14.14-.28.22-.42a47.88,47.88,0,0,0-6-55.58H210a88,88,0,0,1-77.29,119.87Z"></path></svg>
                </Text>
              </Button>}
            />

            <BrowserWindow
              initialUrl="https://phosphoricons.com/"
              title="Phosphur icon page"
              icon={<IconIcons className="h-full w-full text-neutral-500 dark:text-neutral-300" />}
              defaultPosition={{ x: 400, y: 50 }}
              trigger={<Button className={'rounded-2xl'} size={'icon'} variant={'outline'}><IconIcons /></Button>}
            />

            {/*<LinkInterceptor>
              <a href="https://www.example.com" className="text-blue-600 hover:underline block">
                Example.com
              </a>
            </LinkInterceptor>*/}
          </Flex>

          {/*<MenuRegistryDemo />*/}

          {/*<StoreDemo />*/}

          {/*<BrowserDemo />*/}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem onClick={() => router.refresh()}>Refresh</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
