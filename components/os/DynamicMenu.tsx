import React from 'react'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

// Type definitions for dynamic menu configuration
export interface MenuShortcut {
  keys: string
}

export interface MenuItem {
  type: 'item' | 'separator'
  label?: string
  shortcut?: MenuShortcut
  disabled?: boolean
  inset?: boolean
  onClick?: () => void
}

export interface MenuSeparator {
  type: 'separator'
}

export interface MenuCheckboxItem {
  type: 'checkbox'
  label: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export interface MenuRadioItem {
  type: 'radio'
  value: string
  label: string
}

export interface MenuRadioGroup {
  type: 'radioGroup'
  value: string
  items: MenuRadioItem[]
  onValueChange?: (value: string) => void
}

export interface MenuSubmenu {
  type: 'submenu'
  label: string
  children: MenuItem[]
}

export type MenuContentItem =
  | MenuItem
  | MenuSeparator
  | MenuCheckboxItem
  | MenuRadioGroup
  | MenuSubmenu

export interface MenuConfig {
  label: string
  content: MenuContentItem[]
}

export interface DynamicMenuProps {
  menus: MenuConfig[]
  className?: string
}

// Component to render individual menu items based on their type
const MenuItemRenderer: React.FC<{ item: MenuContentItem }> = ({ item }) => {
  switch (item.type) {
    case 'separator':
      return <MenubarSeparator />

    case 'checkbox':
      return (
        <MenubarCheckboxItem
          checked={item.checked}
          onCheckedChange={item.onCheckedChange}
        >
          {item.label}
        </MenubarCheckboxItem>
      )

    case 'radioGroup':
      return (
        <MenubarRadioGroup
          value={item.value}
          onValueChange={item.onValueChange}
        >
          {item.items.map((radioItem, index) => (
            <MenubarRadioItem
              key={index}
              value={radioItem.value}
            >
              {radioItem.label}
            </MenubarRadioItem>
          ))}
        </MenubarRadioGroup>
      )

    case 'submenu':
      return (
        <MenubarSub>
          <MenubarSubTrigger>{item.label}</MenubarSubTrigger>
          <MenubarSubContent>
            {item.children.map((child, index) => (
              <MenuItemRenderer key={index} item={child} />
            ))}
          </MenubarSubContent>
        </MenubarSub>
      )

    case 'item':
    default:
      return (
        <MenubarItem
          disabled={item.disabled}
          inset={item.inset}
          onClick={item.onClick}
        >
          {item.label}
          {item.shortcut && (
            <MenubarShortcut>{item.shortcut.keys}</MenubarShortcut>
          )}
        </MenubarItem>
      )
  }
}

// Main dynamic menu component
export function DynamicOSMenu({ menus, className }: DynamicMenuProps) {
  return (
    <Menubar className={className}>
      {menus.map((menu, menuIndex) => (
        <MenubarMenu key={menuIndex}>
          <MenubarTrigger>{menu.label}</MenubarTrigger>
          <MenubarContent>
            {menu.content.map((item, itemIndex) => (
              <MenuItemRenderer key={itemIndex} item={item} />
            ))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  )
}

// Example configuration that matches the original OSMenu
export const defaultOSMenuConfig: MenuConfig[] = [
  {
    label: 'File',
    content: [
      { type: 'item', label: 'New Tab', shortcut: { keys: '⌘T' } },
      { type: 'item', label: 'New Window', shortcut: { keys: '⌘N' } },
      { type: 'item', label: 'New Incognito Window', disabled: true },
      { type: 'separator' },
      {
        type: 'submenu',
        label: 'Share',
        children: [
          { type: 'item', label: 'Email link' },
          { type: 'item', label: 'Messages' },
          { type: 'item', label: 'Notes' },
        ]
      },
      { type: 'separator' },
      { type: 'item', label: 'Print...', shortcut: { keys: '⌘P' } },
    ]
  },
  {
    label: 'Edit',
    content: [
      { type: 'item', label: 'Undo', shortcut: { keys: '⌘Z' } },
      { type: 'item', label: 'Redo', shortcut: { keys: '⇧⌘Z' } },
      { type: 'separator' },
      {
        type: 'submenu',
        label: 'Find',
        children: [
          { type: 'item', label: 'Search the web' },
          { type: 'separator' },
          { type: 'item', label: 'Find...' },
          { type: 'item', label: 'Find Next' },
          { type: 'item', label: 'Find Previous' },
        ]
      },
      { type: 'separator' },
      { type: 'item', label: 'Cut' },
      { type: 'item', label: 'Copy' },
      { type: 'item', label: 'Paste' },
    ]
  },
  {
    label: 'View',
    content: [
      { type: 'checkbox', label: 'Always Show Bookmarks Bar' },
      { type: 'checkbox', label: 'Always Show Full URLs', checked: true },
      { type: 'separator' },
      { type: 'item', label: 'Reload', shortcut: { keys: '⌘R' }, inset: true },
      { type: 'item', label: 'Force Reload', shortcut: { keys: '⇧⌘R' }, disabled: true, inset: true },
      { type: 'separator' },
      { type: 'item', label: 'Toggle Fullscreen', inset: true },
      { type: 'separator' },
      { type: 'item', label: 'Hide Sidebar', inset: true },
    ]
  },
  {
    label: 'Profiles',
    content: [
      {
        type: 'radioGroup',
        value: 'benoit',
        items: [
          { type: 'radio', value: 'andy', label: 'Andy' },
          { type: 'radio', value: 'benoit', label: 'Benoit' },
          { type: 'radio', value: 'Luis', label: 'Luis' },
        ]
      },
      { type: 'separator' },
      { type: 'item', label: 'Edit...', inset: true },
      { type: 'separator' },
      { type: 'item', label: 'Add Profile...', inset: true },
    ]
  }
]
