// Example component with its own menu registration
import React, {useState} from "react";
import {useMenuRegistry} from "@/components/os/MenuRegistryContext";
import {Badge} from "@/components/ui/badge";

export function TextEditor() {
  const [content, setContent] = useState("Hello, world!");
  const [isModified, setIsModified] = useState(false);
  const { registerMenu, unregisterMenu } = useMenuRegistry();

  React.useEffect(() => {
    const editorMenu = [
      {
        label: 'Editor',
        content: [
          {
            type: 'item',
            label: 'New Document',
            shortcut: { keys: '⌘N' },
            onClick: () => {
              setContent('');
              setIsModified(false);
              console.log('New document created');
            }
          },
          {
            type: 'item',
            label: 'Save',
            shortcut: { keys: '⌘S' },
            disabled: !isModified,
            onClick: () => {
              console.log('Document saved:', content);
              setIsModified(false);
            }
          },
          { type: 'separator' },
          {
            type: 'checkbox',
            label: 'Auto Save',
            checked: true,
            onCheckedChange: (checked: any) => {
              console.log('Auto save:', checked ? 'enabled' : 'disabled');
            }
          }
        ]
      },
      {
        label: 'Format',
        content: [
          {
            type: 'item',
            label: 'Clear All',
            onClick: () => {
              setContent('');
              setIsModified(false);
            }
          },
          {
            type: 'item',
            label: 'Uppercase',
            onClick: () => {
              setContent(content.toUpperCase());
              setIsModified(true);
            }
          },
          {
            type: 'item',
            label: 'Lowercase',
            onClick: () => {
              setContent(content.toLowerCase());
              setIsModified(true);
            }
          }
        ]
      }
    ];

    // @ts-ignore
    registerMenu('text-editor-menu', editorMenu, {
      componentName: 'TextEditor',
      priority: 'normal',
      mergeStrategy: 'append',
      exclusive: true,
    });

    return () => {
      unregisterMenu('text-editor-menu');
    };
  }, [content, isModified, registerMenu, unregisterMenu]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {/*<h3 className="text-lg font-semibold">Simple Text Editor</h3>*/}
        {isModified && <Badge variant="destructive">Modified</Badge>}
      </div>
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsModified(true);
        }}
        className="w-full h-40 border-0 outline-0 bg-card rounded-md resize-none"
        placeholder="Start typing..."
      />
      <div className="text-sm text-gray-500">
        Characters: {content.length} | Words: {content.split(/\s+/).filter(w => w).length}
      </div>
    </div>
  );
}
