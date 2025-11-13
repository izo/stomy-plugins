/**
 * Kobo Sync Plugin
 * Enables synchronization with Kobo e-reader devices via USB
 */

import { invoke } from '@tauri-apps/api/core';
import type { Plugin } from '../../types';
import type {
  KoboDevice,
  KoboInfo,
  KoboPluginSettings,
  SyncResult,
} from './types';

export const koboPlugin: Plugin = {
  id: 'kobo-sync',
  name: 'Kobo Sync',
  description:
    'Synchronize your ebook library with Kobo e-reader devices via USB. Native support for EPUB format.',
  version: '1.0.0',
  author: 'Stomy Team',
  icon: 'BookOpen',
  enabled: true, // Enabled by default since it's the primary device

  permissions: ['fs:read', 'fs:write', 'tauri:*'],

  settings: {
    targetFolder: '.kobo',
    showNotifications: true,
    autoEject: false,
    syncMetadata: true,
  } as KoboPluginSettings,

  // Lifecycle hooks
  onInstall: async () => {
    console.log('[KoboPlugin] Plugin installed');
  },

  onUninstall: async () => {
    console.log('[KoboPlugin] Plugin uninstalled');
  },

  onEnable: async () => {
    console.log('[KoboPlugin] Plugin enabled');
  },

  onDisable: async () => {
    console.log('[KoboPlugin] Plugin disabled');
  },

  // Actions exposed in the UI
  actions: [
    {
      id: 'detect-kobo',
      label: 'Detect Kobo Devices',
      icon: 'Search',
      context: 'global',
      onClick: async () => {
        try {
          const devices = await invoke<KoboDevice[]>('detect_kobo_devices');
          console.log('[KoboPlugin] Detected Kobo devices:', devices);
          return devices;
        } catch (error) {
          console.error('[KoboPlugin] Failed to detect Kobo devices:', error);
          throw error;
        }
      },
    },
    {
      id: 'sync-to-kobo',
      label: 'Sync to Kobo',
      icon: 'Download',
      context: 'library',
      onClick: async (data?: any) => {
        console.log('[KoboPlugin] Sync to Kobo triggered', data);
        // This will be implemented in the SyncService integration
      },
    },
  ],

  // Menu items
  menuItems: [
    {
      id: 'kobo-settings',
      label: 'Kobo Settings',
      icon: 'Settings',
      action: async () => {
        console.log('[KoboPlugin] Opening Kobo settings');
        // This would open a settings dialog
      },
    },
  ],
};

/**
 * Detect connected Kobo devices
 */
export async function detectKoboDevices(): Promise<KoboDevice[]> {
  try {
    return await invoke<KoboDevice[]>('detect_kobo_devices');
  } catch (error) {
    console.error('[KoboPlugin] Failed to detect Kobo devices:', error);
    return [];
  }
}

/**
 * Get detailed information about a Kobo device
 */
export async function getKoboInfo(devicePath: string): Promise<KoboInfo> {
  return await invoke<KoboInfo>('get_kobo_info', { devicePath });
}

/**
 * Copy a file to Kobo device
 */
export async function copyFileToKobo(
  sourcePath: string,
  koboPath: string,
  filename: string
): Promise<string> {
  return await invoke<string>('copy_file_to_device', {
    sourcePath,
    devicePath: koboPath,
    filename,
  });
}

/**
 * Sync a book to Kobo
 */
export async function syncBookToKobo(
  bookPath: string,
  bookTitle: string,
  koboDevicePath: string,
  settings: KoboPluginSettings
): Promise<SyncResult> {
  try {
    // Kobo natively supports EPUB, PDF, and other formats
    await copyFileToKobo(bookPath, koboDevicePath, bookTitle);

    return { success: true, booksSynced: 1 };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default koboPlugin;
