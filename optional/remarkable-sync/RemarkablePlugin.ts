/**
 * reMarkable Sync Plugin
 * Enables synchronization with reMarkable e-paper tablets via USB or SSH
 */

import { invoke } from '@tauri-apps/api/core';
import type { Plugin } from '../../types';
import type { Book } from '../../types/models';
import { libraryService } from '@/services/libraryService';
import { notificationService } from '@/services/notificationService';
import type {
  RemarkableDevice,
  RemarkablePluginSettings,
  SyncResult,
  UploadResult,
  StorageInfo,
  DeviceDetectionResult,
  BatchSyncConfig,
  BookSyncStatus,
  UploadProgress,
} from './types';

export const remarkablePlugin: Plugin = {
  id: 'remarkable-sync',
  name: 'reMarkable Sync',
  description:
    'Synchronize your ebook library with reMarkable e-paper tablets via USB or SSH. Supports EPUB and PDF formats natively.',
  version: '1.0.0',
  author: 'Stomy Team',
  icon: 'TabletRegular',
  enabled: false, // Optional plugin - enable if you use reMarkable devices

  permissions: ['fs:read', 'fs:write', 'tauri:*', 'http:*'],

  settings: {
    // Connection settings
    connectionMethod: 'usb',
    usbWebInterfaceEnabled: true,
    sshHost: '10.11.99.1',
    sshPort: 22,
    sshUsername: 'root',
    sshPassword: '',

    // Upload settings
    targetFolder: '/',
    createLibraryFolders: true,
    libraryFolderPrefix: 'Stomy-',

    // File handling
    maxFileSize: 100, // MB
    convertEpubToPdf: false,
    compressLargePdfs: false,

    // Sync options
    syncMetadata: true,
    autoSync: false,
    syncOnlySelected: false,

    // UI settings
    showNotifications: true,
    showUploadProgress: true,
    confirmBeforeSync: true,

    // Advanced
    enableSshFallback: false,
    debugMode: false,
  } as RemarkablePluginSettings,

  // Lifecycle hooks
  onInstall: async () => {
    console.log('[RemarkablePlugin] Plugin installed');
    await notificationService.notify({
      title: 'reMarkable Sync Installed',
      body: 'Enable USB Web Interface on your reMarkable: Settings > Storage',
    });
  },

  onUninstall: async () => {
    console.log('[RemarkablePlugin] Plugin uninstalled');
  },

  onEnable: async () => {
    console.log('[RemarkablePlugin] Plugin enabled');
    await notificationService.notify({
      title: 'reMarkable Sync Enabled',
      body: 'Connect your reMarkable tablet via USB to start syncing',
    });
  },

  onDisable: async () => {
    console.log('[RemarkablePlugin] Plugin disabled');
  },

  // Actions exposed in the UI
  actions: [
    {
      id: 'detect-remarkable',
      label: 'Detect reMarkable Tablet',
      icon: 'SearchRegular',
      context: 'global',
      onClick: async () => {
        try {
          const result = await detectRemarkable();

          if (result.found && result.device) {
            await notificationService.notify({
              title: 'reMarkable Detected',
              body: `Connected: ${result.device.model}`,
            });
            return result.device;
          } else {
            await notificationService.notify({
              title: 'No reMarkable Found',
              body: result.error || 'Check USB connection and Web Interface settings',
            });
            throw new Error(result.error || 'Device not found');
          }
        } catch (error) {
          console.error('[RemarkablePlugin] Detection failed:', error);
          throw error;
        }
      },
    },
    {
      id: 'sync-to-remarkable',
      label: 'Sync to reMarkable',
      icon: 'ArrowSyncRegular',
      context: 'book',
      onClick: async (data?: any) => {
        if (!data?.bookId) {
          throw new Error('No book selected');
        }

        try {
          console.log('[RemarkablePlugin] Syncing book:', data.bookId);

          // Detect device first
          const detection = await detectRemarkable();
          if (!detection.found || !detection.device) {
            throw new Error('reMarkable device not found. Connect via USB and enable Web Interface.');
          }

          // Get book details
          const book = await libraryService.getBookById(data.bookId);
          if (!book) {
            throw new Error('Book not found');
          }

          // Check file format
          const format = book.filePath.split('.').pop()?.toLowerCase();
          if (!['epub', 'pdf'].includes(format || '')) {
            throw new Error(`Unsupported format: ${format}. reMarkable supports EPUB and PDF only.`);
          }

          // Check file size
          const settings = remarkablePlugin.settings as RemarkablePluginSettings;
          const fileSize = await getFileSize(book.filePath);
          if (fileSize > settings.maxFileSize * 1024 * 1024) {
            throw new Error(
              `File too large (${(fileSize / 1024 / 1024).toFixed(1)}MB). USB API limit: ${settings.maxFileSize}MB`
            );
          }

          // Upload book
          await notificationService.notify({
            title: 'Uploading to reMarkable',
            body: `"${book.title}"...`,
          });

          const result = await uploadBookToRemarkable(
            book,
            detection.device,
            settings
          );

          if (result.success) {
            await notificationService.notify({
              title: 'Upload Complete',
              body: `"${book.title}" synced to reMarkable`,
            });
            return result;
          } else {
            throw new Error(result.error || 'Upload failed');
          }
        } catch (error) {
          console.error('[RemarkablePlugin] Sync error:', error);
          await notificationService.notify({
            title: 'Sync Failed',
            body: error instanceof Error ? error.message : String(error),
          });
          throw error;
        }
      },
    },
    {
      id: 'batch-sync-remarkable',
      label: 'Batch Sync to reMarkable',
      icon: 'ArrowSyncRegular',
      context: 'library',
      onClick: async (data?: any) => {
        try {
          console.log('[RemarkablePlugin] Batch sync triggered', data);

          // Get selected books (this would come from the UI selection)
          const selectedBookIds: number[] = data?.bookIds || [];

          if (selectedBookIds.length === 0) {
            await notificationService.notify({
              title: 'No Books Selected',
              body: 'Please select books to sync',
            });
            return;
          }

          // Detect device
          const detection = await detectRemarkable();
          if (!detection.found || !detection.device) {
            throw new Error('reMarkable device not found');
          }

          // Start batch sync
          await notificationService.notify({
            title: 'Batch Sync Started',
            body: `Syncing ${selectedBookIds.length} books to reMarkable...`,
          });

          const config: BatchSyncConfig = {
            bookIds: selectedBookIds,
            targetDevice: detection.device.id,
            onProgress: (status: BookSyncStatus) => {
              console.log('[RemarkablePlugin] Progress:', status);
            },
          };

          const result = await batchSyncToRemarkable(config, detection.device);

          await notificationService.notify({
            title: 'Batch Sync Complete',
            body: `Synced: ${result.booksSynced}, Failed: ${result.booksFailed}`,
          });

          return result;
        } catch (error) {
          console.error('[RemarkablePlugin] Batch sync error:', error);
          await notificationService.notify({
            title: 'Batch Sync Failed',
            body: String(error),
          });
          throw error;
        }
      },
    },
    {
      id: 'check-remarkable-storage',
      label: 'Check Storage',
      icon: 'DatabaseRegular',
      context: 'global',
      onClick: async () => {
        try {
          const detection = await detectRemarkable();
          if (!detection.found || !detection.device) {
            throw new Error('Device not found');
          }

          const storage = await getRemarkableStorage(detection.device);

          await notificationService.notify({
            title: 'reMarkable Storage',
            body: `Free: ${(storage.free / 1024 / 1024 / 1024).toFixed(2)}GB / ${(storage.total / 1024 / 1024 / 1024).toFixed(2)}GB (${storage.percentUsed}% used)`,
          });

          return storage;
        } catch (error) {
          console.error('[RemarkablePlugin] Storage check failed:', error);
          throw error;
        }
      },
    },
    {
      id: 'open-remarkable-web-ui',
      label: 'Open reMarkable Web Interface',
      icon: 'GlobeRegular',
      context: 'settings',
      onClick: async () => {
        try {
          // Open USB web interface in browser
          await invoke('open_url', { url: 'http://10.11.99.1' });
        } catch (error) {
          console.error('[RemarkablePlugin] Failed to open web UI:', error);
          await notificationService.notify({
            title: 'Cannot Open Web Interface',
            body: 'Make sure your reMarkable is connected via USB',
          });
        }
      },
    },
  ],

  // Menu items
  menuItems: [
    {
      id: 'remarkable-settings',
      label: 'reMarkable Settings',
      icon: 'SettingsRegular',
      action: async () => {
        console.log('[RemarkablePlugin] Opening settings');
        // This would open the plugin settings dialog
      },
    },
  ],
};

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Detect connected reMarkable tablet
 */
export async function detectRemarkable(): Promise<DeviceDetectionResult> {
  try {
    const device = await invoke<RemarkableDevice | null>('detect_remarkable_device');

    if (device) {
      return {
        found: true,
        device,
        webInterfaceEnabled: true,
      };
    }

    return {
      found: false,
      error: 'Device not detected. Check USB connection and enable Web Interface.',
    };
  } catch (error) {
    console.error('[RemarkablePlugin] Detection error:', error);
    return {
      found: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Upload a single book to reMarkable
 */
export async function uploadBookToRemarkable(
  book: Book,
  device: RemarkableDevice,
  settings: RemarkablePluginSettings
): Promise<UploadResult> {
  try {
    const startTime = Date.now();

    // Determine target path
    const fileName = sanitizeFileName(`${book.title}.${book.filePath.split('.').pop()}`);
    const targetFolder = settings.createLibraryFolders && book.libraryName
      ? `${settings.targetFolder}${settings.libraryFolderPrefix}${book.libraryName}/`
      : settings.targetFolder;

    // Upload file via Rust backend
    const result = await invoke<UploadResult>('upload_to_remarkable', {
      filePath: book.filePath,
      fileName,
      targetFolder,
      deviceUrl: device.baseUrl,
    });

    const duration = Date.now() - startTime;
    console.log(`[RemarkablePlugin] Upload completed in ${duration}ms`);

    return {
      ...result,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[RemarkablePlugin] Upload error:', error);
    return {
      success: false,
      fileName: book.title,
      fileSize: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Batch sync multiple books to reMarkable
 */
export async function batchSyncToRemarkable(
  config: BatchSyncConfig,
  device: RemarkableDevice
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    booksSynced: 0,
    booksSkipped: 0,
    booksFailed: 0,
    totalSize: 0,
    duration: 0,
    errors: [],
  };

  const startTime = Date.now();
  const settings = remarkablePlugin.settings as RemarkablePluginSettings;

  try {
    for (const bookId of config.bookIds) {
      try {
        const book = await libraryService.getBookById(bookId);
        if (!book) {
          result.booksSkipped++;
          continue;
        }

        // Check format
        const format = book.filePath.split('.').pop()?.toLowerCase();
        if (!['epub', 'pdf'].includes(format || '')) {
          result.booksSkipped++;
          result.errors.push(`${book.title}: Unsupported format (${format})`);

          if (config.onProgress) {
            config.onProgress({
              bookId,
              title: book.title,
              status: 'skipped',
              progress: 0,
              error: `Unsupported format: ${format}`,
            });
          }
          continue;
        }

        // Check file size
        const fileSize = await getFileSize(book.filePath);
        if (fileSize > settings.maxFileSize * 1024 * 1024) {
          result.booksSkipped++;
          result.errors.push(
            `${book.title}: File too large (${(fileSize / 1024 / 1024).toFixed(1)}MB)`
          );

          if (config.onProgress) {
            config.onProgress({
              bookId,
              title: book.title,
              status: 'skipped',
              progress: 0,
              error: 'File too large',
            });
          }
          continue;
        }

        // Update progress: uploading
        if (config.onProgress) {
          config.onProgress({
            bookId,
            title: book.title,
            status: 'uploading',
            progress: 0,
          });
        }

        // Upload book
        const uploadResult = await uploadBookToRemarkable(book, device, settings);

        if (uploadResult.success) {
          result.booksSynced++;
          result.totalSize += uploadResult.fileSize;

          if (config.onProgress) {
            config.onProgress({
              bookId,
              title: book.title,
              status: 'completed',
              progress: 100,
              syncedAt: uploadResult.uploadedAt,
            });
          }
        } else {
          result.booksFailed++;
          result.errors.push(`${book.title}: ${uploadResult.error}`);

          if (config.onProgress) {
            config.onProgress({
              bookId,
              title: book.title,
              status: 'failed',
              progress: 0,
              error: uploadResult.error,
            });
          }
        }
      } catch (error) {
        result.booksFailed++;
        result.errors.push(`Book ${bookId}: ${error}`);
        console.error('[RemarkablePlugin] Book sync error:', error);
      }
    }

    result.duration = Date.now() - startTime;
    result.success = result.booksFailed === 0;

    if (config.onComplete) {
      config.onComplete(result);
    }

    return result;
  } catch (error) {
    console.error('[RemarkablePlugin] Batch sync error:', error);
    result.success = false;
    result.duration = Date.now() - startTime;
    result.errors.push(String(error));
    return result;
  }
}

/**
 * Get storage information from reMarkable
 */
export async function getRemarkableStorage(device: RemarkableDevice): Promise<StorageInfo> {
  try {
    const storage = await invoke<StorageInfo>('get_remarkable_storage', {
      deviceUrl: device.baseUrl,
    });
    return storage;
  } catch (error) {
    console.error('[RemarkablePlugin] Storage check error:', error);
    // Return default values if command fails
    return {
      total: 0,
      used: 0,
      free: 0,
      percentUsed: 0,
    };
  }
}

/**
 * Get file size in bytes
 */
async function getFileSize(filePath: string): Promise<number> {
  try {
    const size = await invoke<number>('get_file_size', { filePath });
    return size;
  } catch (error) {
    console.error('[RemarkablePlugin] File size error:', error);
    return 0;
  }
}

/**
 * Sanitize filename for reMarkable
 */
function sanitizeFileName(fileName: string): string {
  // Remove or replace invalid characters
  return fileName
    .replace(/[/\\:*?"<>|]/g, '-') // Replace invalid chars with dash
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .replace(/-+/g, '-') // Collapse multiple dashes
    .replace(/_+/g, '_') // Collapse multiple underscores
    .trim();
}

/**
 * Check if USB Web Interface is enabled
 */
export async function checkWebInterfaceStatus(): Promise<boolean> {
  try {
    const response = await invoke<boolean>('check_remarkable_web_interface');
    return response;
  } catch {
    return false;
  }
}

/**
 * Get reMarkable device information
 */
export async function getRemarkableInfo(deviceUrl: string): Promise<RemarkableDevice | null> {
  try {
    const device = await invoke<RemarkableDevice>('get_remarkable_info', { deviceUrl });
    return device;
  } catch (error) {
    console.error('[RemarkablePlugin] Failed to get device info:', error);
    return null;
  }
}

export default remarkablePlugin;
