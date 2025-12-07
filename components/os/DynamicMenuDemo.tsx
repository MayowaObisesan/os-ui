import React from 'react'
import { DynamicOSMenu, defaultOSMenuConfig, MenuConfig } from '@/components/os/DynamicMenu'

// Example 1: Using the default configuration (matches original OSMenu)
export function DefaultDynamicMenuExample() {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Default Dynamic Menu</h2>
      <DynamicOSMenu menus={defaultOSMenuConfig} />
    </div>
  )
}

// Example 2: Custom configuration with event handlers
export function CustomDynamicMenuExample() {
  const handleNewTab = () => {
    console.log('New Tab clicked!')
    // Add your logic here
  }

  const handleCheckboxChange = (checked: boolean) => {
    console.log('Checkbox changed:', checked)
    // Handle checkbox state change
  }

  const handleRadioChange = (value: string) => {
    console.log('Radio changed:', value)
    // Handle radio selection change
  }

  const customMenuConfig: MenuConfig[] = [
    {
      label: 'File',
      content: [
        { type: 'item', label: 'New Tab', shortcut: { keys: '⌘T' }, onClick: handleNewTab },
        { type: 'item', label: 'New Window', shortcut: { keys: '⌘N' } },
        { type: 'separator' },
        {
          type: 'submenu',
          label: 'Export',
          children: [
            { type: 'item', label: 'Export as PDF' },
            { type: 'item', label: 'Export as PNG' },
            { type: 'item', label: 'Export as JSON' },
          ]
        },
      ]
    },
    {
      label: 'Settings',
      content: [
        {
          type: 'checkbox',
          label: 'Enable Notifications',
          checked: true,
          onCheckedChange: handleCheckboxChange
        },
        {
          type: 'checkbox',
          label: 'Enable Dark Mode',
          checked: false,
          onCheckedChange: handleCheckboxChange
        },
        { type: 'separator' },
        {
          type: 'radioGroup',
          value: 'theme',
          items: [
            { type: 'radio', value: 'light', label: 'Light Theme' },
            { type: 'radio', value: 'dark', label: 'Dark Theme' },
            { type: 'radio', value: 'auto', label: 'Auto Theme' },
          ],
          onValueChange: handleRadioChange
        },
      ]
    }
  ]

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Custom Dynamic Menu</h2>
      <DynamicOSMenu menus={customMenuConfig} />
    </div>
  )
}

// Example 3: Dynamic menu generation
export function DynamicGeneratedMenuExample() {
  const generateDynamicMenu = (userPermissions: string[]): MenuConfig[] => {
    const menus: MenuConfig[] = []

    // Always include File menu
    menus.push({
      label: 'File',
      content: [
        { type: 'item', label: 'New Document', shortcut: { keys: '⌘N' } },
        { type: 'item', label: 'Open...', shortcut: { keys: '⌘O' } },
        { type: 'separator' },
        { type: 'item', label: 'Save', shortcut: { keys: '⌘S' } },
      ]
    })

    // Add admin menu if user has admin permissions
    if (userPermissions.includes('admin')) {
      menus.push({
        label: 'Admin',
        content: [
          { type: 'item', label: 'User Management' },
          { type: 'item', label: 'System Settings' },
          { type: 'separator' },
          { type: 'item', label: 'View Logs' },
        ]
      })
    }

    // Add edit menu
    menus.push({
      label: 'Edit',
      content: [
        { type: 'item', label: 'Undo', shortcut: { keys: '⌘Z' } },
        { type: 'item', label: 'Redo', shortcut: { keys: '⇧⌘Z' } },
        { type: 'separator' },
        { type: 'item', label: 'Cut', shortcut: { keys: '⌘X' } },
        { type: 'item', label: 'Copy', shortcut: { keys: '⌘C' } },
        { type: 'item', label: 'Paste', shortcut: { keys: '⌘V' } },
      ]
    })

    return menus
  }

  // Simulate different user roles
  const adminUserMenus = generateDynamicMenu(['user', 'admin'])
  const regularUserMenus = generateDynamicMenu(['user'])

  return (
    <div className="space-y-8">
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-4">Admin User Menu</h2>
        <DynamicOSMenu menus={adminUserMenus} />
      </div>

      <div className="w-full">
        <h2 className="text-lg font-semibold mb-4">Regular User Menu</h2>
        <DynamicOSMenu menus={regularUserMenus} />
      </div>
    </div>
  )
}

// Main component that demonstrates all examples
export default function DynamicMenuDemo() {
  return (
    <div className="p-8 space-y-12">
      <div>
        <h1 className="text-2xl font-bold mb-6">Dynamic Menu Component Examples</h1>
        <p className="text-gray-600 mb-8">
          This demonstrates the new DynamicOSMenu component with various configurations and use cases.
        </p>
      </div>

      <DefaultDynamicMenuExample />
      <CustomDynamicMenuExample />
      <DynamicGeneratedMenuExample />
    </div>
  )
}
