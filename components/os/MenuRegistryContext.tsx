"use client";

import React, { createContext, useContext, useCallback, useState, useEffect, ReactNode } from 'react';
import { MenuConfig, MenuContentItem } from '@/components/os/DynamicMenu';

// Extended menu configuration with registration metadata
export interface RegisteredMenuConfig extends MenuConfig {
  id: string;
  componentName: string;
  priority: 'high' | 'normal' | 'low';
  mergeStrategy: 'append' | 'prepend' | 'replace';
  timestamp: number;
  exclusive?: boolean; // New: indicates this menu should be exclusive
}

// Menu registry context type
export interface MenuRegistryContextType {
  // Registration methods
  registerMenu: (id: string, config: MenuConfig[], options?: {
    componentName?: string;
    priority?: 'high' | 'normal' | 'low';
    mergeStrategy?: 'append' | 'prepend' | 'replace';
    exclusive?: boolean; // New: exclusive menu control
  }) => void;
  
  unregisterMenu: (id: string) => void;
  unregisterComponentMenus: (componentName: string) => void; // New: unregister all menus for a component
  updateMenu: (id: string, config: MenuConfig[]) => void;
  
  // Query methods
  getRegisteredMenus: () => RegisteredMenuConfig[];
  getMergedMenu: (overrideConfig?: MenuConfig[]) => MenuConfig[];
  getMenuByComponent: (componentName: string) => RegisteredMenuConfig[];
  
  // State
  isMenuRegistryEnabled: boolean;
  setMenuRegistryEnabled: (enabled: boolean) => void;
}

// Create the context
const MenuRegistryContext = createContext<MenuRegistryContextType | null>(null);

// Graceful fallback implementation when not in context
const createNoOpMenuRegistry = (defaultMenuConfig: MenuConfig[] = []): MenuRegistryContextType => ({
  registerMenu: () => {
    // Intentionally empty - no-op when not in context
  },
  unregisterMenu: () => {
    // Intentionally empty - no-op when not in context
  },
  unregisterComponentMenus: () => {
    // Intentionally empty - no-op when not in context
  },
  updateMenu: () => {
    // Intentionally empty - no-op when not in context
  },
  getRegisteredMenus: () => {
    return []; // Return empty array when not in context
  },
  getMergedMenu: (overrideConfig?: MenuConfig[]) => {
    // Return the provided config or default when not in context
    return overrideConfig || defaultMenuConfig;
  },
  getMenuByComponent: () => {
    return []; // Return empty array when not in context
  },
  isMenuRegistryEnabled: false,
  setMenuRegistryEnabled: () => {
    // Intentionally empty - no-op when not in context
  },
});

// Provider component
export interface MenuRegistryProviderProps {
  children: ReactNode;
  enableMenuRegistry?: boolean;
  defaultMenuConfig?: MenuConfig[];
  onMenuChange?: (menus: RegisteredMenuConfig[]) => void;
}

export function MenuRegistryProvider({
  children,
  enableMenuRegistry = true,
  defaultMenuConfig = [],
  onMenuChange
}: MenuRegistryProviderProps) {
  const [registeredMenus, setRegisteredMenus] = useState<RegisteredMenuConfig[]>([]);
  const [isMenuRegistryEnabled, setMenuRegistryEnabled] = useState(enableMenuRegistry);

  // Registration methods
  const registerMenu = useCallback((
    id: string, 
    config: MenuConfig[], 
    options: {
      componentName?: string;
      priority?: 'high' | 'normal' | 'low';
      mergeStrategy?: 'append' | 'prepend' | 'replace';
      exclusive?: boolean;
    } = {}
  ) => {
    if (!isMenuRegistryEnabled || !config.length) return;

    const { 
      componentName = 'Unknown', 
      priority = 'normal', 
      mergeStrategy = 'append',
      exclusive = false // Default to non-exclusive
    } = options;
    
    // Create menu entries for each menu config
    const newMenuEntries: RegisteredMenuConfig[] = config.map((menuConfig, index) => {
      const menuId = config.length === 1 ? id : `${id}-${index + 1}`;
      return {
        id: menuId,
        componentName,
        priority,
        mergeStrategy,
        timestamp: Date.now() + index, // Slight offset to preserve order
        exclusive,
        ...menuConfig,
      };
    });

    setRegisteredMenus(prev => {
      // Remove existing menus for this component and base ID
      const filtered = prev.filter(menu => 
        menu.componentName !== componentName && 
        !menu.id.startsWith(id)
      );
      
      const newMenus = [...filtered, ...newMenuEntries];
      
      // Sort by priority (high > normal > low) and then by timestamp
      const sortedMenus = newMenus.sort((a, b) => {
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return a.timestamp - b.timestamp;
      });

      onMenuChange?.(sortedMenus);
      return sortedMenus;
    });
  }, [isMenuRegistryEnabled, onMenuChange]);

  const unregisterMenu = useCallback((id: string) => {
    setRegisteredMenus(prev => {
      const filtered = prev.filter(menu => menu.id !== id);
      onMenuChange?.(filtered);
      return filtered;
    });
  }, [onMenuChange]);

  // New: Unregister all menus for a specific component
  const unregisterComponentMenus = useCallback((componentName: string) => {
    setRegisteredMenus(prev => {
      const filtered = prev.filter(menu => menu.componentName !== componentName);
      onMenuChange?.(filtered);
      return filtered;
    });
  }, [onMenuChange]);

  const updateMenu = useCallback((id: string, config: MenuConfig[]) => {
    setRegisteredMenus(prev => {
      const menuIndex = prev.findIndex(menu => menu.id === id);
      if (menuIndex === -1) return prev;

      const updatedMenu = { ...prev[menuIndex], ...config[0] };
      const newMenus = [...prev];
      newMenus[menuIndex] = updatedMenu;

      onMenuChange?.(newMenus);
      return newMenus;
    });
  }, [onMenuChange]);

  // Query methods
  const getRegisteredMenus = useCallback(() => {
    return registeredMenus;
  }, [registeredMenus]);

  const getMenuByComponent = useCallback((componentName: string) => {
    return registeredMenus.filter(menu => menu.componentName === componentName);
  }, [registeredMenus]);

  const getMergedMenu = useCallback((overrideConfig?: MenuConfig[]) => {
    if (!isMenuRegistryEnabled) {
      return overrideConfig || defaultMenuConfig;
    }

    // Check if any component has registered an exclusive menu
    const hasExclusiveMenus = registeredMenus.some(menu => menu.exclusive);
    
    // If no menus are registered, return the default
    if (registeredMenus.length === 0) {
      return overrideConfig || defaultMenuConfig;
    }

    // If there are exclusive menus, only show registered menus (no default merge)
    if (hasExclusiveMenus) {
      const mergedConfig: MenuConfig[] = [];

      // Group menus by label for intelligent merging
      const menuGroups = new Map<string, RegisteredMenuConfig[]>();
      
      registeredMenus.forEach(menu => {
        const existing = menuGroups.get(menu.label) || [];
        menuGroups.set(menu.label, [...existing, menu]);
      });

      // Merge menus with the same label
      menuGroups.forEach((menusWithSameLabel, label) => {
        if (menusWithSameLabel.length === 1) {
          // Single menu with this label, add it
          const { id, componentName, priority, mergeStrategy, timestamp, exclusive, ...menuConfig } = menusWithSameLabel[0];
          mergedConfig.push(menuConfig);
        } else {
          // Multiple menus with same label, merge their content
          const allContent: MenuContentItem[] = [];
          
          menusWithSameLabel.forEach(menu => {
            const { content, mergeStrategy } = menu;
            
            switch (mergeStrategy) {
              case 'prepend':
                allContent.unshift(...content);
                break;
              case 'replace':
                // Replace existing content, but keep first occurrence
                if (allContent.length === 0) {
                  allContent.push(...content);
                }
                break;
              case 'append':
              default:
                allContent.push(...content);
                break;
            }
          });

          // Remove duplicate separators
          const filteredContent = allContent.filter((item, index, arr) => {
            if (item.type === 'separator') {
              // Keep separator only if next item is not a separator
              return index === 0 || arr[index + 1]?.type !== 'separator';
            }
            return true;
          });

          const mergedMenu: MenuConfig = {
            label,
            content: filteredContent
          };

          mergedConfig.push(mergedMenu);
        }
      });

      return mergedConfig;
    }

    // If no exclusive menus, merge with default (original behavior)
    let mergedConfig: MenuConfig[] = overrideConfig ? [...overrideConfig] : [...defaultMenuConfig];

    // Group menus by label for intelligent merging
    const menuGroups = new Map<string, RegisteredMenuConfig[]>();
    
    registeredMenus.forEach(menu => {
      const existing = menuGroups.get(menu.label) || [];
      menuGroups.set(menu.label, [...existing, menu]);
    });

    // Merge menus with the same label
    menuGroups.forEach((menusWithSameLabel, label) => {
      if (menusWithSameLabel.length === 1) {
        // Single menu with this label, add it
        const { id, componentName, priority, mergeStrategy, timestamp, exclusive, ...menuConfig } = menusWithSameLabel[0];
        mergedConfig.push(menuConfig);
      } else {
        // Multiple menus with same label, merge their content
        const allContent: MenuContentItem[] = [];
        
        menusWithSameLabel.forEach(menu => {
          const { content, mergeStrategy } = menu;
          
          switch (mergeStrategy) {
            case 'prepend':
              allContent.unshift(...content);
              break;
            case 'replace':
              // Replace existing content, but keep first occurrence
              if (allContent.length === 0) {
                allContent.push(...content);
              }
              break;
            case 'append':
            default:
              allContent.push(...content);
              break;
          }
        });

        // Remove duplicate separators
        const filteredContent = allContent.filter((item, index, arr) => {
          if (item.type === 'separator') {
            // Keep separator only if next item is not a separator
            return index === 0 || arr[index + 1]?.type !== 'separator';
          }
          return true;
        });

        const mergedMenu: MenuConfig = {
          label,
          content: filteredContent
        };

        // Check if menu with this label already exists
        const existingIndex = mergedConfig.findIndex(menu => menu.label === label);
        if (existingIndex >= 0) {
          mergedConfig[existingIndex] = mergedMenu;
        } else {
          mergedConfig.push(mergedMenu);
        }
      }
    });

    return mergedConfig;
  }, [registeredMenus, isMenuRegistryEnabled, defaultMenuConfig]);

  const contextValue: MenuRegistryContextType = {
    registerMenu,
    unregisterMenu,
    unregisterComponentMenus, // New method
    updateMenu,
    getRegisteredMenus,
    getMergedMenu,
    getMenuByComponent,
    isMenuRegistryEnabled,
    setMenuRegistryEnabled,
  };

  return (
    <MenuRegistryContext.Provider value={contextValue}>
      {children}
    </MenuRegistryContext.Provider>
  );
}

// Hook to use the menu registry
export function useMenuRegistry(defaultMenuConfig?: MenuConfig[]) {
  const context = useContext(MenuRegistryContext);
  
  if (!context) {
    // Return graceful fallback instead of throwing error
    return createNoOpMenuRegistry(defaultMenuConfig);
  }
  
  return context;
}

// Higher-order component to automatically register menu for a component
export function withMenuRegistration<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  menuConfig: MenuConfig | ((props: P) => MenuConfig),
  options: {
    menuId?: string;
    priority?: 'high' | 'normal' | 'low';
    mergeStrategy?: 'append' | 'prepend' | 'replace';
    exclusive?: boolean; // New: exclusive menu control
  } = {}
) {
  const { menuId, priority = 'normal', mergeStrategy = 'append', exclusive = false } = options;
  
  function MenuRegisteredComponent(props: P) {
    const { registerMenu, unregisterMenu, unregisterComponentMenus } = useMenuRegistry();
    const componentName = WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent';
    
    useEffect(() => {
      const config = typeof menuConfig === 'function' ? menuConfig(props) : menuConfig;
      const configs = Array.isArray(config) ? config : [config];
      const id = menuId || `${componentName.toLowerCase()}-menu`;
      
      registerMenu(id, configs, {
        componentName,
        priority,
        mergeStrategy,
        exclusive,
      });

      return () => {
        // Use the new method to clean up all component menus
        unregisterComponentMenus(componentName);
      };
    }, [props, registerMenu, unregisterComponentMenus, componentName, menuId, priority, mergeStrategy, exclusive]);

    return <WrappedComponent {...props} />;
  }

  // Set display name inside the function scope
  MenuRegisteredComponent.displayName = `withMenuRegistration(${WrappedComponent.displayName || WrappedComponent.name || 'UnknownComponent'})`;

  return MenuRegisteredComponent;
}

// Cleanup effect for unmounted components
export function useMenuCleanup(menuId: string) {
  const { unregisterMenu } = useMenuRegistry();
  
  useEffect(() => {
    return () => {
      unregisterMenu(menuId);
    };
  }, [menuId, unregisterMenu]);
}
