/**
 * Base Plugin Types
 * Re-exported from main Stomy app for use in plugin development
 */

import type { Book } from '../../../types/models';

export type PluginContext = 'library' | 'book' | 'settings' | 'global';

export type PluginEvent =
  | 'plugin:registered'
  | 'plugin:unregistered'
  | 'plugin:enabled'
  | 'plugin:disabled'
  | 'plugin:updated'
  | 'plugin:error';

export type PluginPermission =
  | 'fs:read'
  | 'fs:write'
  | 'db:read'
  | 'db:write'
  | 'network:fetch'
  | 'shell:execute'
  | 'notification:send';

export interface PluginAction {
  id: string;
  label: string;
  icon?: string;
  context: PluginContext | PluginContext[];
  onClick: (data?: { bookId?: number; [key: string]: unknown }) => Promise<void> | void;
}

export interface PluginSidebar {
  id: string;
  label: string;
  icon: string;
  position?: 'top' | 'bottom';
  color?: string;
  component: string;
}

export interface PluginSetting {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'password';
  description?: string;
  defaultValue?: string | number | boolean;
  options?: Array<{ label: string; value: string | number }>;
  required?: boolean;
  placeholder?: string;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon?: string;
  enabled?: boolean;
  permissions?: PluginPermission[];
  actions?: PluginAction[];
  sidebar?: PluginSidebar;
  settings?: PluginSetting[];
  
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
  onUpdate?: (oldVersion: string, newVersion: string) => Promise<void>;
}

export interface ExportPlugin extends Plugin {
  export: (books: Book[], outputPath: string) => Promise<void>;
}
