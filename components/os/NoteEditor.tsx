"use client"; // this registers <Editor> as a Client Component

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useMenuRegistry } from "@/components/os/MenuRegistryContext";
import { useState, useCallback, useEffect, useRef } from "react";
import type { BlockNoteEditor } from "@blocknote/core";
import { MenuConfig } from "@/components/os/DynamicMenu";
import { Badge } from "@/components/ui/badge";
import {Flex} from "@radix-ui/themes";
import {cn} from "@/lib/utils";

// Our <Editor> component with integrated menu system - PHASE 2 Enhanced (Fixed)
export default function Editor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote();
  const [isModified, setIsModified] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [recentDocuments, setRecentDocuments] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { registerMenu, unregisterMenu } = useMenuRegistry();

  // Helper functions - MOVED TO TOP LEVEL to fix React hook violations

  const saveToLocalStorage = useCallback(() => {
    if (!editor) return;

    const content = editor.document;
    const timestamp = new Date().toISOString();
    const documentData = {
      content,
      timestamp,
      wordCount
    };

    localStorage.setItem(`blocknote-doc-${timestamp}`, JSON.stringify(documentData));

    // Update recent documents
    const recent = JSON.parse(localStorage.getItem('recentDocuments') || '[]');
    recent.unshift(timestamp);
    const uniqueRecent = [...new Set(recent)].slice(0, 5);
    localStorage.setItem('recentDocuments', JSON.stringify(uniqueRecent));
    setRecentDocuments(uniqueRecent);

    setIsModified(false);
    console.log('Document saved to local storage');
  }, [editor, wordCount]);

  const loadFromLocalStorage = useCallback((timestamp: string) => {
    if (!editor) return;

    const data = localStorage.getItem(`blocknote-doc-${timestamp}`);
    if (data) {
      const documentData = JSON.parse(data);
      editor.replaceBlocks(editor.document, documentData.content);
      setIsModified(false);
      console.log('Document loaded from local storage');
    }
  }, [editor]);

  const importFromFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json' && editor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          editor.replaceBlocks(editor.document, content);
          setIsModified(false);
          console.log('Document imported successfully');
        } catch (error) {
          console.error('Failed to import document:', error);
          alert('Failed to import document. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [editor]);

  const insertImage = useCallback((file: File) => {
    if (!editor || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      editor.insertBlocks([
        {
          type: 'image',
          props: {
            url: imageUrl,
            caption: file.name,
          },
        },
      ]);
    };
    reader.readAsDataURL(file);
  }, [editor]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (error) {
        console.error('Failed to exit fullscreen:', error);
      }
    }
  }, []);

  // Modern clipboard operations
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, []);

  const pasteFromClipboard = useCallback(async (): Promise<string> => {
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
      return '';
    }
  }, []);

  // Load recent documents on mount
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentDocuments') || '[]');
    setRecentDocuments(recent);
  }, []);

  // Track document modifications and word count
  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      setIsModified(true);

      // Calculate word count
      const text = editor.document
        .map(block => block.content?.map(item => item.text || '').join('') || '')
        .join(' ');
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    };

    editor.onChange(handleChange);
    return () => {
      editor.onChange(() => {}); // Cleanup listener
    };
  }, [editor]);

  // PHASE 2: Enhanced BlockNote-specific menu configuration
  useEffect(() => {
    if (!editor) return;

    const noteEditorMenu: MenuConfig[] = [
      {
        label: 'File',
        content: [
          {
            type: 'item',
            label: 'New Document',
            shortcut: { keys: '⌘N' },
            onClick: () => {
              editor.replaceBlocks(editor.document, []);
              setIsModified(false);
              console.log('New document created');
            }
          },
          {
            type: 'item',
            label: 'Import JSON',
            onClick: () => {
              fileInputRef.current?.click();
            }
          },
          {
            type: 'item',
            label: 'Export JSON',
            shortcut: { keys: '⌘S' },
            disabled: !isModified,
            onClick: () => {
              const content = editor.document;
              const json = JSON.stringify(content, null, 2);
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `document-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
              setIsModified(false);
              console.log('Document exported as JSON');
            }
          },
          { type: 'separator' },
          {
            type: 'item',
            label: 'Save to Local Storage',
            onClick: saveToLocalStorage
          },
          ...(recentDocuments.length > 0 ? [
            {
              type: 'separator' as const
            },
            {
              type: 'submenu' as const,
              label: 'Recent Documents',
              children: recentDocuments.map(timestamp => ({
                type: 'item' as const,
                label: new Date(timestamp).toLocaleString(),
                onClick: () => loadFromLocalStorage(timestamp)
              }))
            }
          ] : []),
          { type: 'separator' },
          {
            type: 'item',
            label: 'Select All',
            shortcut: { keys: '⌘A' },
            onClick: () => {
              // Select all content using BlockNote API
              if (editor.document.length > 0) {
                editor.setSelection(editor.document[0], editor.document[editor.document.length - 1]);
              }
            }
          }
        ]
      },
      {
        label: 'Edit',
        content: [
          {
            type: 'item',
            label: 'Undo',
            shortcut: { keys: '⌘Z' },
            onClick: () => {
              editor.undo();
            }
          },
          {
            type: 'item',
            label: 'Redo',
            shortcut: { keys: '⇧⌘Z' },
            onClick: () => {
              editor.redo();
            }
          },
          { type: 'separator' },
          {
            type: 'item',
            label: 'Cut',
            shortcut: { keys: '⌘X' },
            onClick: async () => {
              // Get selected text and copy to clipboard, then delete
              const selectedText = editor.getSelectedText();
              if (selectedText) {
                await copyToClipboard(selectedText);
                // Note: BlockNote doesn't have a direct delete selected text method
                // This would need more complex implementation
              }
            }
          },
          {
            type: 'item',
            label: 'Copy',
            shortcut: { keys: '⌘C' },
            onClick: async () => {
              const selectedText = editor.getSelectedText();
              if (selectedText) {
                await copyToClipboard(selectedText);
              }
            }
          },
          {
            type: 'item',
            label: 'Paste',
            shortcut: { keys: '⌘V' },
            onClick: async () => {
              const clipboardText = await pasteFromClipboard();
              if (clipboardText) {
                // Insert text at current cursor position
                editor.insertInlineContent(clipboardText);
              }
            }
          },
          { type: 'separator' },
          {
            type: 'item',
            label: 'Find',
            shortcut: { keys: '⌘F' },
            onClick: () => {
              console.log('Find functionality - to be implemented in Phase 3');
            }
          }
        ]
      },
      {
        label: 'Insert',
        content: [
          {
            type: 'item',
            label: 'Image',
            onClick: () => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) insertImage(file);
              };
              input.click();
            }
          },
          {
            type: 'item',
            label: 'Table',
            onClick: () => {
              console.log('Table insertion - to be implemented in Phase 3');
            }
          },
          {
            type: 'item',
            label: 'Divider',
            onClick: () => {
              if (editor.document.length > 0) {
                editor.insertBlocks([
                  {
                    type: 'divider',
                  },
                ], editor.document[editor.document.length - 1]);
              }
            }
          },
          {
            type: 'item',
            label: 'Callout',
            onClick: () => {
              editor.insertBlocks([
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: '💡 This is a callout block' }],
                  props: {
                    backgroundColor: 'yellow',
                    textAlignment: 'left'
                  }
                },
              ]);
            }
          }
        ]
      },
      {
        label: 'Format',
        content: [
          {
            type: 'item',
            label: 'Bold',
            shortcut: { keys: '⌘B' },
            onClick: () => {
              editor.toggleStyles({ bold: true });
            }
          },
          {
            type: 'item',
            label: 'Italic',
            shortcut: { keys: '⌘I' },
            onClick: () => {
              editor.toggleStyles({ italic: true });
            }
          },
          {
            type: 'item',
            label: 'Underline',
            shortcut: { keys: '⌘U' },
            onClick: () => {
              editor.toggleStyles({ underline: true });
            }
          },
          {
            type: 'item',
            label: 'Strikethrough',
            shortcut: { keys: '⌘⇧S' },
            onClick: () => {
              editor.toggleStyles({ strike: true });
            }
          },
          {
            type: 'item',
            label: 'Highlight',
            onClick: () => {
              editor.toggleStyles({ backgroundColor: 'yellow' });
            }
          },
          { type: 'separator' },
          {
            type: 'item',
            label: 'Heading 1',
            onClick: () => {
              if (editor.document.length > 0) {
                editor.updateBlock(editor.document[0], { type: 'heading', props: { level: 1 } });
              }
            }
          },
          {
            type: 'item',
            label: 'Heading 2',
            onClick: () => {
              if (editor.document.length > 0) {
                editor.updateBlock(editor.document[0], { type: 'heading', props: { level: 2 } });
              }
            }
          },
          {
            type: 'item',
            label: 'Heading 3',
            onClick: () => {
              if (editor.document.length > 0) {
                editor.updateBlock(editor.document[0], { type: 'heading', props: { level: 3 } });
              }
            }
          },
          {
            type: 'item',
            label: 'Paragraph',
            onClick: () => {
              if (editor.document.length > 0) {
                editor.updateBlock(editor.document[0], { type: 'paragraph' });
              }
            }
          },
          { type: 'separator' },
          {
            type: 'item',
            label: 'Bullet List',
            onClick: () => {
              if (editor.document.length > 0) {
                editor.updateBlock(editor.document[0], { type: 'bulletListItem' });
              }
            }
          },
          {
            type: 'item',
            label: 'Numbered List',
            onClick: () => {
              if (editor.document.length > 0) {
                editor.updateBlock(editor.document[0], { type: 'numberedListItem' });
              }
            }
          },
          {
            type: 'item',
            label: 'Todo List',
            onClick: () => {
              if (editor.document.length > 0) {
                editor.updateBlock(editor.document[0], { type: 'checkListItem', props: { checked: false } });
              }
            }
          },
          { type: 'separator' },
          {
            type: 'item',
            label: 'Code Block',
            onClick: () => {
              if (editor.document.length > 0) {
                editor.updateBlock(editor.document[0], { type: 'codeBlock' });
              }
            }
          },
          {
            type: 'item',
            label: 'Quote',
            onClick: () => {
              if (editor.document.length > 0) {
                editor.updateBlock(editor.document[0], { type: 'quote' });
              }
            }
          }
        ]
      },
      {
        label: 'View',
        content: [
          {
            type: 'checkbox',
            label: 'Dark Theme',
            checked: isDarkTheme,
            onCheckedChange: (checked: any) => {
              setIsDarkTheme(checked);
              // Apply theme class to document body
              document.documentElement.classList.toggle('dark', checked);
            }
          },
          {
            type: 'item',
            label: 'Fullscreen',
            shortcut: { keys: '⌘⇧F' },
            onClick: toggleFullscreen
          },
          { type: 'separator' },
          {
            type: 'checkbox',
            label: 'Show Word Count',
            checked: true,
            onCheckedChange: (checked: any) => {
              console.log('Word count display:', checked ? 'shown' : 'hidden');
            }
          },
          {
            type: 'item',
            label: 'Editor Settings',
            onClick: () => {
              console.log('Editor settings - to be implemented');
            }
          }
        ]
      }
    ];

    // Register menu with MenuRegistryContext
    registerMenu('note-editor-menu', noteEditorMenu, {
      componentName: 'NoteEditor',
      priority: 'normal',
      mergeStrategy: 'append',
      exclusive: true,
    });

    // Cleanup on unmount
    return () => {
      unregisterMenu('note-editor-menu');
    };
  }, [editor, isModified, isDarkTheme, isFullscreen, wordCount, recentDocuments, registerMenu, unregisterMenu, saveToLocalStorage, loadFromLocalStorage, toggleFullscreen, copyToClipboard, pasteFromClipboard, insertImage]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Hidden file input for import functionality
  const hiddenFileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="application/json"
      style={{ display: 'none' }}
      onChange={importFromFile}
    />
  );

  return (
    <div className={`note-editor-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Hidden file input */}
      {hiddenFileInput}

      {/* The actual BlockNote editor */}
      <BlockNoteView
        editor={editor}
        style={{ minHeight: '160px', height: 'auto' }}
      />

      {/* Status Bar */}
      <Flex align={'center'} justify={'between'} className="pt-4 bg-card text-sm">
        <Flex align={'center'} gap={'2'}>
          <span className={cn("text-muted-foreground", wordCount > 0 && "font-medium transition-all")}>
            Words: {wordCount}
          </span>
        </Flex>
        <Flex align={'center'} gap={'2'}>
          {isModified && <Badge variant="destructive" className="text-xs">Modified</Badge>}
          {isFullscreen && (
            <Badge variant="outline" className="text-xs">Fullscreen</Badge>
          )}
          <span className="text-muted-foreground">
            {new Date().toLocaleTimeString()}
          </span>
        </Flex>
      </Flex>
    </div>
  );
}
