"use client";

import React, { useState } from "react";
import { StoreDraggableWindow } from "@/components/os/StoreDraggableWindow";
import { Calculator } from "@/components/os/Calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useMenuRegistry } from "@/components/os/MenuRegistryContext";
import {TextEditor} from "@/components/os/TextEditor";

// Example component that adds menu items to existing menus
function SettingsPanel() {
  const { registerMenu } = useMenuRegistry();

  React.useEffect(() => {
    const settingsMenu = [
      {
        label: 'Settings',
        content: [
          {
            type: 'item',
            label: 'Preferences',
            onClick: () => console.log('Opening preferences')
          },
          {
            type: 'item',
            label: 'Keyboard Shortcuts',
            onClick: () => console.log('Opening shortcuts')
          },
          { type: 'separator' },
          {
            type: 'checkbox',
            label: 'Dark Mode',
            checked: true,
            onCheckedChange: (checked: boolean | undefined) => {
              console.log('Dark mode:', checked ? 'enabled' : 'disabled');
              document.documentElement.classList.toggle('dark', checked);
            }
          }
        ]
      }
    ];

    // @ts-ignore
    registerMenu('settings-panel-menu', settingsMenu, {
      componentName: 'SettingsPanel',
      priority: 'low',
      mergeStrategy: 'append',
      exclusive: true,
    });
  }, [registerMenu]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Settings Panel</h3>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input type="checkbox" defaultChecked />
          <span>Enable notifications</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" defaultChecked />
          <span>Auto-start application</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>Send usage analytics</span>
        </label>
      </div>
    </div>
  );
}

export function MenuRegistryDemo() {
  const [activeTab, setActiveTab] = useState("calculator");
  const { getRegisteredMenus } = useMenuRegistry();
  const [showDebug, setShowDebug] = useState(false);

  const registeredMenus = getRegisteredMenus();

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Menu Registry System Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            This demo showcases the dynamic menu registration system where multiple components
            can contribute their own menus that get merged into a single, functional menu bar.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? 'Hide' : 'Show'} Debug Info
            </Button>
          </div>
        </div>

        {/* Debug Panel */}
        {showDebug && (
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔍 Debug Information
                <Badge variant="secondary">{registeredMenus.length} menus registered</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Registered Menus:</h4>
                  <div className="grid gap-2">
                    {registeredMenus.map((menu) => (
                      <div key={menu.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <span className="font-mono text-sm">{menu.label}</span>
                          <span className="text-gray-500 ml-2">({menu.componentName})</span>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {menu.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {menu.mergeStrategy}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Windows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Window */}
          <StoreDraggableWindow
            title="Calculator with Dynamic Menu"
            description="Calculator that registers its own menu items"
            type="calculator"
            defaultPosition={{ x: 50, y: 50 }}
            enableMenuRegistry={true}
          >
            <Calculator />
          </StoreDraggableWindow>

          {/* Multi-Component Window */}
          <StoreDraggableWindow
            title="Multi-Component Menu Demo"
            description="Window with multiple components registering menus"
            type="draggable"
            defaultPosition={{ x: 400, y: 50 }}
            enableMenuRegistry={true}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="editor">Text Editor</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="mt-4">
                <TextEditor />
              </TabsContent>

              <TabsContent value="settings" className="mt-4">
                <SettingsPanel />
              </TabsContent>

              <TabsContent value="info" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">How It Works</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Each component registers its menu when it mounts</p>
                    <p>• Menu items are automatically merged by label</p>
                    <p>• Menu actions have full access to component state</p>
                    <p>• Priority and merge strategies control how menus combine</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </StoreDraggableWindow>
        </div>

        {/* Legacy Window (without menu registry) */}
        <StoreDraggableWindow
          title="Legacy Window (No Registry)"
          description="This window uses the old static menu approach"
          type="basic"
          defaultPosition={{ x: 225, y: 400 }}
          enableMenuRegistry={false}
          menuConfig={[
            {
              label: 'Static Menu',
              content: [
                { type: 'item', label: 'Static Action 1' },
                { type: 'item', label: 'Static Action 2' },
                { type: 'separator' },
                { type: 'checkbox', label: 'Static Option', checked: true }
              ]
            }
          ]}
        >
          <Card>
            <CardHeader>
              <CardTitle>Legacy Implementation</CardTitle>
              <CardDescription>
                This window uses the old approach where menus are passed as props.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Menu is static and doesn't change</p>
                <p>• No component-based menu registration</p>
                <p>• Limited flexibility compared to registry system</p>
              </div>
            </CardContent>
          </Card>
        </StoreDraggableWindow>
      </div>
    </div>
  );
}
