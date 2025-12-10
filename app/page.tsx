"use client";

import {OSWindow} from "@/components/os/Window";
import {OSDraggableWindow} from "@/components/os/DraggableWindow";
import {Calculator} from "@/components/os/Calculator";
import StoreDemo from "@/app/store-demo";
import {StoreDraggableWindow} from "@/components/os/StoreDraggableWindow";
import {WindowTracker} from "@/components/os/WindowTracker";
import {IconCalculator, IconFileTextFilled, IconFileTextSpark, IconGlobe} from "@tabler/icons-react";
import {Button} from "@/components/ui/button";
import {MenuRegistryProvider} from "@/components/os/MenuRegistryContext";
import {MenuRegistryDemo} from "@/components/os/MenuRegistryDemo";
import {TextEditor} from "@/components/os/TextEditor";
import HomeOld from "@/app/page-old";
import {NoteEditor} from "@/components/os/DynamicNoteEditor";
import {Flex} from "@radix-ui/themes";

export default function Home() {
  return (
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

      <Flex direction={'column'} gap={'2'} flexGrow={'0'} p={'2'}>
        <StoreDraggableWindow
          title="Calculator Window"
          description="A draggable store-managed calculator window"
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
          defaultPosition={{ x: 20, y: 100 }}
          trigger={<Button className={'rounded-2xl'} size={'icon'} variant={'outline'}><IconFileTextFilled /></Button>}
        >
          <TextEditor />
        </StoreDraggableWindow>

        <StoreDraggableWindow
          title="Note Editor Window"
          description="A draggable store-managed Note Editor window - An Advanced Note Editor that feels like using Notion"
          type="draggable"
          defaultPosition={{ x: 20, y: 100 }}
          trigger={<Button className={'rounded-2xl'} size={'icon'} variant={'outline'}><IconFileTextSpark /></Button>}
        >
          <NoteEditor />
        </StoreDraggableWindow>

        <StoreDraggableWindow
          title="Embed Page"
          description="A draggable store-managed embed page window"
          type="draggable"
          defaultPosition={{ x: 0, y: 0 }}
          trigger={<Button className={'rounded-2xl'} size={'icon'} variant={'outline'}><IconGlobe /></Button>}
        >
          <HomeOld />
        </StoreDraggableWindow>
      </Flex>

      {/*<MenuRegistryDemo />*/}

      {/*<StoreDemo />*/}
    </div>
  );
}
