/**
 * Fake Sync Plugin
 * Simulates synchronization with various e-reader devices for development and testing
 */

import type { Plugin } from '../types';
import { notificationService } from '../../../../services/notificationService';
import type {
  FakeDevice,
  FakeSyncSettings,
  DeviceType,
  SyncProgress,
  FakeSyncResult,
  FakeKoboLibraryData,
  FakeKoboBook,
  FakeKoboEvent,
  FakeKoboBookmark,
  FakeKoboVocabulary,
} from './types';
import { DEVICE_MODELS } from './types';
import {
  generateFakeKoboLibrary,
  generateFakeKoboProgress,
} from './FakeKoboDataGenerator';

// Global state for the fake device
let currentFakeDevice: FakeDevice | null = null;
let isSyncing = false;

// Global state for fake Kobo library data
let fakeKoboLibraryData: FakeKoboLibraryData | null = null;

/**
 * Generate a random serial number
 */
function generateSerialNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let serial = '';
  for (let i = 0; i < 12; i++) {
    serial += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return serial;
}

/**
 * Create a fake device based on the selected type
 */
function createFakeDevice(deviceType: DeviceType): FakeDevice | null {
  if (deviceType === 'none') return null;

  const models = DEVICE_MODELS[deviceType];
  const selectedModel = models[Math.floor(Math.random() * models.length)];
  const usedSpace = Math.floor(selectedModel.capacity * (0.1 + Math.random() * 0.4)); // 10-50% used

  return {
    id: `fake-${deviceType}-${Date.now()}`,
    name: selectedModel.model,
    type: deviceType,
    model: selectedModel.model,
    serialNumber: generateSerialNumber(),
    mountPath: `/Volumes/${selectedModel.model.replace(/\s+/g, '_')}`,
    capacity: selectedModel.capacity,
    usedSpace,
    supportedFormats: selectedModel.formats,
  };
}

/**
 * Simulate device detection with delay
 */
async function simulateDeviceDetection(
  deviceType: DeviceType,
  simulateDelays: boolean
): Promise<FakeDevice | null> {
  if (simulateDelays) {
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));
  }

  return createFakeDevice(deviceType);
}

/**
 * Simulate file synchronization with progress
 */
async function simulateSync(
  device: FakeDevice,
  bookCount: number,
  settings: FakeSyncSettings,
  onProgress?: (progress: SyncProgress) => void
): Promise<FakeSyncResult> {
  const startTime = Date.now();
  isSyncing = true;

  try {
    // Simulate connection phase
    if (onProgress) {
      onProgress({
        current: 0,
        total: bookCount,
        status: 'connecting',
      });
    }

    if (settings.simulateDelays) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Simulate random failure if configured
    if (settings.failureRate > 0 && Math.random() * 100 < settings.failureRate) {
      throw new Error('Simulated sync failure: Device disconnected unexpectedly');
    }

    // Simulate syncing each book
    let bytesTransferred = 0;
    for (let i = 0; i < bookCount; i++) {
      if (onProgress) {
        onProgress({
          current: i,
          total: bookCount,
          currentBook: `Book ${i + 1} of ${bookCount}`,
          status: 'syncing',
        });
      }

      // Simulate transfer time
      const bookSize = 1 + Math.random() * 10; // 1-11 MB
      bytesTransferred += bookSize * 1024 * 1024;

      if (settings.simulateDelays) {
        const delay = Math.min(settings.syncDuration / bookCount, 2000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Completion
    if (onProgress) {
      onProgress({
        current: bookCount,
        total: bookCount,
        status: 'completed',
      });
    }

    const duration = Date.now() - startTime;

    return {
      success: true,
      deviceName: device.name,
      booksSynced: bookCount,
      bytesTransferred,
      duration,
    };
  } catch (error) {
    return {
      success: false,
      deviceName: device.name,
      booksSynced: 0,
      bytesTransferred: 0,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    isSyncing = false;
  }
}

/**
 * Format bytes for display
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get device icon based on type
 */
function getDeviceIcon(deviceType: DeviceType): string {
  switch (deviceType) {
    case 'kobo':
      return 'BookOpenRegular';
    case 'kindle':
      return 'BookmarkRegular';
    case 'usb':
      return 'UsbStickRegular';
    default:
      return 'StorageRegular';
  }
}

export const fakeSyncPlugin: Plugin = {
  id: 'fake-sync',
  name: 'Fake Sync (Dev Tool)',
  description:
    'Simulates synchronization with e-reader devices (Kobo, Kindle, USB) for development and testing purposes.',
  version: '1.0.0',
  author: 'Stomy Team',
  icon: 'BeakerRegular',
  enabled: false,

  permissions: [],

  settings: {
    deviceType: 'none' as DeviceType,
    autoConnect: false,
    simulateDelays: true,
    syncDuration: 5000,
    failureRate: 0,
    showNotifications: true,
    verboseMode: false,
  } as FakeSyncSettings,

  // Lifecycle hooks
  onInstall: async () => {
    console.log('[FakeSyncPlugin] Plugin installed');
    await notificationService.notify({
      title: 'Fake Sync Plugin',
      body: 'Dev tool installed. Configure a device type in settings.',
    });
  },

  onUninstall: async () => {
    console.log('[FakeSyncPlugin] Plugin uninstalled');
    currentFakeDevice = null;
  },

  onEnable: async () => {
    console.log('[FakeSyncPlugin] Plugin enabled');
  },

  onDisable: async () => {
    console.log('[FakeSyncPlugin] Plugin disabled');
    currentFakeDevice = null;
    isSyncing = false;
  },

  // Actions exposed in the UI
  actions: [
    {
      id: 'detect-fake-device',
      label: 'Detect Fake Device',
      icon: 'SearchRegular',
      context: 'global',
      onClick: async function () {
        try {
          const settings = fakeSyncPlugin.settings as FakeSyncSettings;

          if (settings.deviceType === 'none') {
            await notificationService.notify({
              title: 'Fake Sync',
              body: 'Please configure a device type in plugin settings first.',
            });
            return;
          }

          if (settings.showNotifications) {
            await notificationService.notify({
              title: 'Fake Sync',
              body: `Detecting ${settings.deviceType} device...`,
            });
          }

          currentFakeDevice = await simulateDeviceDetection(
            settings.deviceType,
            settings.simulateDelays
          );

          if (currentFakeDevice) {
            const freeSpace = currentFakeDevice.capacity - currentFakeDevice.usedSpace;
            const message = settings.verboseMode
              ? `Device: ${currentFakeDevice.name}\nSerial: ${currentFakeDevice.serialNumber}\nCapacity: ${formatBytes(currentFakeDevice.capacity * 1024 * 1024)}\nFree: ${formatBytes(freeSpace * 1024 * 1024)}\nFormats: ${currentFakeDevice.supportedFormats.join(', ')}`
              : `${currentFakeDevice.name} detected!`;

            await notificationService.notify({
              title: 'Fake Sync',
              body: message,
            });

            console.log('[FakeSyncPlugin] Fake device created:', currentFakeDevice);
          }
        } catch (error) {
          console.error('[FakeSyncPlugin] Detection failed:', error);
          await notificationService.notify({
            title: 'Fake Sync',
            body: `Error: ${error}`,
          });
        }
      },
    },
    {
      id: 'disconnect-fake-device',
      label: 'Disconnect Device',
      icon: 'DismissCircleRegular',
      context: 'global',
      onClick: async function () {
        if (!currentFakeDevice) {
          await notificationService.notify({
            title: 'Fake Sync',
            body: 'No device connected.',
          });
          return;
        }

        const deviceName = currentFakeDevice.name;
        currentFakeDevice = null;

        await notificationService.notify({
          title: 'Fake Sync',
          body: `${deviceName} disconnected.`,
        });

        console.log('[FakeSyncPlugin] Fake device disconnected');
      },
    },
    {
      id: 'sync-to-fake-device',
      label: 'Sync to Fake Device',
      icon: 'ArrowDownloadRegular',
      context: 'library',
      onClick: async function (data?: any) {
        try {
          const settings = fakeSyncPlugin.settings as FakeSyncSettings;

          if (!currentFakeDevice) {
            await notificationService.notify({
              title: 'Fake Sync',
              body: 'No device connected. Detect a device first.',
            });
            return;
          }

          if (isSyncing) {
            await notificationService.notify({
              title: 'Fake Sync',
              body: 'Sync already in progress...',
            });
            return;
          }

          // Simulate syncing a random number of books (or use data if provided)
          const bookCount = data?.bookCount || Math.floor(Math.random() * 10) + 1;

          if (settings.showNotifications) {
            await notificationService.notify({
              title: 'Fake Sync',
              body: `Starting sync of ${bookCount} book(s) to ${currentFakeDevice.name}...`,
            });
          }

          const result = await simulateSync(
            currentFakeDevice,
            bookCount,
            settings,
            (progress) => {
              if (settings.verboseMode) {
                console.log('[FakeSyncPlugin] Sync progress:', progress);
              }
            }
          );

          // Show result notification
          if (result.success) {
            const message = settings.verboseMode
              ? `Synced ${result.booksSynced} book(s)\nTransferred: ${formatBytes(result.bytesTransferred)}\nDuration: ${(result.duration / 1000).toFixed(1)}s`
              : `Synced ${result.booksSynced} book(s) successfully!`;

            await notificationService.notify({
              title: 'Fake Sync Complete',
              body: message,
            });
          } else {
            await notificationService.notify({
              title: 'Fake Sync Failed',
              body: result.error || 'Unknown error',
            });
          }

          console.log('[FakeSyncPlugin] Sync result:', result);
        } catch (error) {
          console.error('[FakeSyncPlugin] Sync failed:', error);
          await notificationService.notify({
            title: 'Fake Sync',
            body: `Error: ${error}`,
          });
        }
      },
    },
    {
      id: 'get-device-info',
      label: 'Get Device Info',
      icon: 'InfoRegular',
      context: 'settings',
      onClick: async function () {
        if (!currentFakeDevice) {
          alert('No device connected. Detect a device first.');
          return;
        }

        const freeSpace = currentFakeDevice.capacity - currentFakeDevice.usedSpace;
        const usedPercent = (
          (currentFakeDevice.usedSpace / currentFakeDevice.capacity) *
          100
        ).toFixed(1);

        const info = `
📱 Device Information

Name: ${currentFakeDevice.name}
Type: ${currentFakeDevice.type.toUpperCase()}
Model: ${currentFakeDevice.model}
Serial: ${currentFakeDevice.serialNumber}
Mount Path: ${currentFakeDevice.mountPath}

💾 Storage
Capacity: ${formatBytes(currentFakeDevice.capacity * 1024 * 1024)}
Used: ${formatBytes(currentFakeDevice.usedSpace * 1024 * 1024)} (${usedPercent}%)
Free: ${formatBytes(freeSpace * 1024 * 1024)}

📚 Supported Formats
${currentFakeDevice.supportedFormats.map((f) => f.toUpperCase()).join(', ')}
        `.trim();

        alert(info);
        console.log('[FakeSyncPlugin] Device info:', currentFakeDevice);
      },
    },
    // ========================================================================
    // Kobo Database Simulation Actions (only for Kobo devices)
    // ========================================================================
    {
      id: 'generate-fake-kobo-library',
      label: 'Generate Fake Kobo Library',
      icon: 'DatabaseRegular',
      context: 'settings',
      onClick: async function () {
        const settings = fakeSyncPlugin.settings as FakeSyncSettings;

        if (settings.deviceType !== 'kobo') {
          await notificationService.notify({
            title: 'Fake Sync',
            body: 'This action is only available for Kobo devices.',
          });
          return;
        }

        try {
          const library = regenerateFakeKoboLibrary({
            bookCount: 7,
            includeBookmarks: true,
            includeVocabulary: true,
          });

          await notificationService.notify({
            title: 'Fake Kobo Library Generated',
            body: `Created ${library.books.length} books, ${library.bookmarks.length} bookmarks, ${library.vocabulary.length} vocabulary words`,
          });

          console.log('[FakeSyncPlugin] Generated library:', library);
        } catch (error) {
          console.error('[FakeSyncPlugin] Failed to generate library:', error);
          await notificationService.notify({
            title: 'Generation Failed',
            body: String(error),
          });
        }
      },
    },
    {
      id: 'import-fake-kobo-progress',
      label: 'Import Reading Progress (Kobo)',
      icon: 'CloudDownloadRegular',
      context: 'global',
      onClick: async function () {
        const settings = fakeSyncPlugin.settings as FakeSyncSettings;

        if (!currentFakeDevice) {
          await notificationService.notify({
            title: 'Fake Sync',
            body: 'No device connected. Detect a Kobo device first.',
          });
          return;
        }

        if (currentFakeDevice.type !== 'kobo') {
          await notificationService.notify({
            title: 'Fake Sync',
            body: 'This action requires a Kobo device.',
          });
          return;
        }

        try {
          await notificationService.notify({
            title: 'Fake Kobo Sync',
            body: 'Importing reading progress from fake Kobo...',
          });

          const libraryData = await getFakeKoboLibraryData(currentFakeDevice.mountPath);

          const message = settings.verboseMode
            ? `Books: ${libraryData.books.length}\nEvents: ${libraryData.events.length}\nBookmarks: ${libraryData.bookmarks.length}\nVocabulary: ${libraryData.vocabulary.length}`
            : `Found ${libraryData.books.length} books with reading data`;

          await notificationService.notify({
            title: 'Fake Kobo Import Complete',
            body: message,
          });

          console.log('[FakeSyncPlugin] Imported library data:', libraryData);
          return libraryData;
        } catch (error) {
          console.error('[FakeSyncPlugin] Import failed:', error);
          await notificationService.notify({
            title: 'Import Failed',
            body: String(error),
          });
        }
      },
    },
    {
      id: 'view-fake-kobo-books',
      label: 'View Kobo Books',
      icon: 'BookOpenRegular',
      context: 'global',
      onClick: async function () {
        if (!currentFakeDevice || currentFakeDevice.type !== 'kobo') {
          await notificationService.notify({
            title: 'Fake Sync',
            body: 'Connect a fake Kobo device first.',
          });
          return;
        }

        try {
          const books = await getFakeKoboBooks(currentFakeDevice.mountPath);
          console.log('[FakeSyncPlugin] Kobo books:', books);

          const booksInfo = books
            .slice(0, 5)
            .map(
              (b) =>
                `${b.title} (${b.percentRead.toFixed(0)}% read, ${b.timeSpentReading}min)`
            )
            .join('\n');

          const message = `Found ${books.length} books:\n\n${booksInfo}${books.length > 5 ? '\n...' : ''}`;

          alert(message);
          return books;
        } catch (error) {
          console.error('[FakeSyncPlugin] Failed to get books:', error);
          throw error;
        }
      },
    },
    {
      id: 'view-fake-kobo-annotations',
      label: 'View Kobo Annotations',
      icon: 'TextQuoteRegular',
      context: 'global',
      onClick: async function () {
        if (!currentFakeDevice || currentFakeDevice.type !== 'kobo') {
          await notificationService.notify({
            title: 'Fake Sync',
            body: 'Connect a fake Kobo device first.',
          });
          return;
        }

        try {
          const bookmarks = await getFakeKoboBookmarks(currentFakeDevice.mountPath);
          console.log('[FakeSyncPlugin] Kobo bookmarks:', bookmarks);

          if (bookmarks.length === 0) {
            alert('No bookmarks found');
            return [];
          }

          const annotationsInfo = bookmarks
            .slice(0, 3)
            .map((b) => `"${b.text.substring(0, 50)}..."${b.annotation ? '\nNote: ' + b.annotation : ''}`)
            .join('\n\n');

          const message = `Found ${bookmarks.length} bookmarks:\n\n${annotationsInfo}${bookmarks.length > 3 ? '\n\n...' : ''}`;

          alert(message);
          return bookmarks;
        } catch (error) {
          console.error('[FakeSyncPlugin] Failed to get bookmarks:', error);
          throw error;
        }
      },
    },
    {
      id: 'view-fake-kobo-vocabulary',
      label: 'View Kobo Vocabulary',
      icon: 'BookRegular',
      context: 'global',
      onClick: async function () {
        if (!currentFakeDevice || currentFakeDevice.type !== 'kobo') {
          await notificationService.notify({
            title: 'Fake Sync',
            body: 'Connect a fake Kobo device first.',
          });
          return;
        }

        try {
          const vocabulary = await getFakeKoboVocabulary(currentFakeDevice.mountPath);
          console.log('[FakeSyncPlugin] Kobo vocabulary:', vocabulary);

          if (vocabulary.length === 0) {
            alert('No vocabulary found');
            return [];
          }

          const vocabInfo = vocabulary
            .slice(0, 10)
            .map((v) => v.text)
            .join(', ');

          const message = `Found ${vocabulary.length} words:\n\n${vocabInfo}${vocabulary.length > 10 ? ', ...' : ''}`;

          alert(message);
          return vocabulary;
        } catch (error) {
          console.error('[FakeSyncPlugin] Failed to get vocabulary:', error);
          throw error;
        }
      },
    },
  ],

  menuItems: [
    {
      id: 'fake-sync-settings',
      label: 'Fake Sync Settings',
      icon: 'SettingsRegular',
      action: async () => {
        console.log('[FakeSyncPlugin] Opening settings (to be implemented in main app)');
      },
    },
  ],
};

// Export helper functions for programmatic use
export async function detectFakeDevice(
  deviceType: DeviceType,
  simulateDelays = true
): Promise<FakeDevice | null> {
  return await simulateDeviceDetection(deviceType, simulateDelays);
}

export function getCurrentFakeDevice(): FakeDevice | null {
  return currentFakeDevice;
}

export function setCurrentFakeDevice(device: FakeDevice | null): void {
  currentFakeDevice = device;
}

export function isSyncInProgress(): boolean {
  return isSyncing;
}

// ============================================================================
// Fake Kobo Database Simulation Functions
// These simulate the Tauri invoke commands used by the real kobo-sync plugin
// ============================================================================

/**
 * Simulate getting all books from Kobo database
 */
export async function getFakeKoboBooks(devicePath: string): Promise<FakeKoboBook[]> {
  if (!fakeKoboLibraryData) {
    fakeKoboLibraryData = generateFakeKoboLibrary();
  }

  console.log('[FakeSyncPlugin] Simulating get_kobo_books:', fakeKoboLibraryData.books.length, 'books');
  return fakeKoboLibraryData.books;
}

/**
 * Simulate getting reading events from Kobo database
 */
export async function getFakeKoboEvents(devicePath: string): Promise<FakeKoboEvent[]> {
  if (!fakeKoboLibraryData) {
    fakeKoboLibraryData = generateFakeKoboLibrary();
  }

  console.log('[FakeSyncPlugin] Simulating get_kobo_events:', fakeKoboLibraryData.events.length, 'events');
  return fakeKoboLibraryData.events;
}

/**
 * Simulate getting bookmarks from Kobo database
 */
export async function getFakeKoboBookmarks(devicePath: string): Promise<FakeKoboBookmark[]> {
  if (!fakeKoboLibraryData) {
    fakeKoboLibraryData = generateFakeKoboLibrary();
  }

  console.log('[FakeSyncPlugin] Simulating get_kobo_bookmarks:', fakeKoboLibraryData.bookmarks.length, 'bookmarks');
  return fakeKoboLibraryData.bookmarks;
}

/**
 * Simulate getting vocabulary from Kobo database
 */
export async function getFakeKoboVocabulary(devicePath: string): Promise<FakeKoboVocabulary[]> {
  if (!fakeKoboLibraryData) {
    fakeKoboLibraryData = generateFakeKoboLibrary();
  }

  console.log('[FakeSyncPlugin] Simulating get_kobo_vocabulary:', fakeKoboLibraryData.vocabulary.length, 'words');
  return fakeKoboLibraryData.vocabulary;
}

/**
 * Simulate getting all Kobo library data at once
 */
export async function getFakeKoboLibraryData(devicePath: string): Promise<FakeKoboLibraryData> {
  if (!fakeKoboLibraryData) {
    fakeKoboLibraryData = generateFakeKoboLibrary();
  }

  console.log('[FakeSyncPlugin] Simulating get_kobo_library_data:', {
    books: fakeKoboLibraryData.books.length,
    events: fakeKoboLibraryData.events.length,
    bookmarks: fakeKoboLibraryData.bookmarks.length,
    vocabulary: fakeKoboLibraryData.vocabulary.length,
  });

  return fakeKoboLibraryData;
}

/**
 * Simulate getting reading progress for a specific book
 */
export async function getFakeBookProgress(
  devicePath: string,
  isbn?: string,
  title?: string
): Promise<FakeKoboBook | null> {
  console.log('[FakeSyncPlugin] Simulating get_book_progress:', { isbn, title });
  return generateFakeKoboProgress(title || undefined, isbn || undefined);
}

/**
 * Regenerate fake Kobo library data (for testing)
 */
export function regenerateFakeKoboLibrary(options?: {
  bookCount?: number;
  includeBookmarks?: boolean;
  includeVocabulary?: boolean;
}): FakeKoboLibraryData {
  fakeKoboLibraryData = generateFakeKoboLibrary(options);
  console.log('[FakeSyncPlugin] Regenerated fake Kobo library:', {
    books: fakeKoboLibraryData.books.length,
    events: fakeKoboLibraryData.events.length,
    bookmarks: fakeKoboLibraryData.bookmarks.length,
    vocabulary: fakeKoboLibraryData.vocabulary.length,
  });
  return fakeKoboLibraryData;
}

export default fakeSyncPlugin;
