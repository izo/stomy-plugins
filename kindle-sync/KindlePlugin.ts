/**
 * Kindle Sync Plugin
 * Enables synchronization with Amazon Kindle devices via USB
 */

import { invoke } from '@tauri-apps/api/core';
import type { Plugin } from '../types';
import type {
  KindleDevice,
  KindleInfo,
  ConversionResult,
  KindlePluginSettings,
} from './types';

export const kindlePlugin: Plugin = {
  id: 'kindle-sync',
  name: 'Kindle Sync',
  description:
    'Synchronize your ebook library with Amazon Kindle devices via USB. Automatically converts EPUB to MOBI format.',
  version: '1.0.0',
  author: 'Stomy Team',
  icon: 'BookOpen',
  enabled: false,

  permissions: ['fs:read', 'fs:write', 'tauri:*'],

  settings: {
    autoConvert: true,
    deleteAfterConvert: false,
    preferredFormat: 'mobi',
    targetFolder: 'documents',
    showNotifications: true,
  } as KindlePluginSettings,

  // Lifecycle hooks
  onInstall: async () => {
    console.log('[KindlePlugin] Plugin installed');
  },

  onUninstall: async () => {
    console.log('[KindlePlugin] Plugin uninstalled');
  },

  onEnable: async () => {
    console.log('[KindlePlugin] Plugin enabled');
  },

  onDisable: async () => {
    console.log('[KindlePlugin] Plugin disabled');
  },

  // Actions exposed in the UI
  actions: [
    {
      id: 'detect-kindle',
      label: 'Detect Kindle Devices',
      icon: 'Search',
      context: 'global',
      onClick: async () => {
        try {
          const devices = await invoke<KindleDevice[]>('detect_kindle_devices');
          console.log('[KindlePlugin] Detected Kindle devices:', devices);
          return devices;
        } catch (error) {
          console.error('[KindlePlugin] Failed to detect Kindle devices:', error);
          throw error;
        }
      },
    },
    {
      id: 'sync-to-kindle',
      label: 'Sync to Kindle',
      icon: 'Download',
      context: 'library',
      onClick: async (data?: any) => {
        console.log('[KindlePlugin] Sync to Kindle triggered', data);
        // This will be implemented in the SyncService integration
      },
    },
  ],

  // Menu items
  menuItems: [
    {
      id: 'kindle-settings',
      label: 'Kindle Settings',
      icon: 'Settings',
      action: async () => {
        console.log('[KindlePlugin] Opening Kindle settings');
        // This would open a settings dialog
      },
    },
  ],
};

/**
 * Detect connected Kindle devices
 */
export async function detectKindleDevices(): Promise<KindleDevice[]> {
  try {
    return await invoke<KindleDevice[]>('detect_kindle_devices');
  } catch (error) {
    console.error('[KindlePlugin] Failed to detect Kindle devices:', error);
    return [];
  }
}

/**
 * Get detailed information about a Kindle device
 */
export async function getKindleInfo(devicePath: string): Promise<KindleInfo> {
  return await invoke<KindleInfo>('get_kindle_info', { devicePath });
}

/**
 * Convert EPUB to MOBI format
 */
export async function convertEpubToMobi(
  epubPath: string,
  mobiPath: string
): Promise<ConversionResult> {
  return await invoke<ConversionResult>('convert_epub_to_mobi', {
    epubPath,
    mobiPath,
  });
}

/**
 * Convert MOBI to EPUB format
 */
export async function convertMobiToEpub(
  mobiPath: string,
  epubPath: string
): Promise<ConversionResult> {
  return await invoke<ConversionResult>('convert_mobi_to_epub', {
    mobiPath,
    epubPath,
  });
}

/**
 * Copy a file to Kindle's documents folder
 */
export async function copyFileToKindle(
  sourcePath: string,
  kindlePath: string,
  filename: string
): Promise<string> {
  return await invoke<string>('copy_file_to_kindle', {
    sourcePath,
    kindlePath,
    filename,
  });
}

/**
 * Convert and sync a book to Kindle
 * This is a helper function that combines conversion and copying
 */
export async function convertAndSyncBook(
  bookPath: string,
  bookTitle: string,
  kindleDevicePath: string,
  settings: KindlePluginSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if book is EPUB (needs conversion)
    const isEpub = bookPath.toLowerCase().endsWith('.epub');

    let finalPath = bookPath;
    let finalFilename = bookTitle;

    if (isEpub && settings.autoConvert) {
      // Generate temporary MOBI path
      const mobiPath = bookPath.replace(/\.epub$/i, '.mobi');

      // Convert EPUB to MOBI
      const conversionResult = await convertEpubToMobi(bookPath, mobiPath);

      if (!conversionResult.success) {
        return {
          success: false,
          error: `Conversion failed: ${conversionResult.error}`,
        };
      }

      finalPath = mobiPath;
      finalFilename = bookTitle.replace(/\.epub$/i, '.mobi');
    }

    // Copy to Kindle
    await copyFileToKindle(finalPath, kindleDevicePath, finalFilename);

    // Clean up temporary MOBI file if requested
    if (isEpub && settings.deleteAfterConvert && finalPath !== bookPath) {
      // TODO: Delete temporary file using Tauri fs plugin
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default kindlePlugin;
