/**
 * Kobo Sync Plugin
 * Enables synchronization with Kobo e-reader devices via USB
 */

import { invoke } from '@tauri-apps/api/core';
import type { Plugin } from '../../types';
import type { Book } from '../../types/models';
import { libraryService } from '@/services/libraryService';
import { notificationService } from '@/services/notificationService';
import type {
  KoboDevice,
  KoboInfo,
  KoboPluginSettings,
  SyncResult,
  KoboBook,
  KoboEvent,
  KoboBookmark,
  KoboVocabulary,
  KoboLibraryData,
  KoboSyncStats,
} from './types';

export const koboPlugin: Plugin = {
  id: 'kobo-sync',
  name: 'Kobo Sync',
  description:
    'Synchronize your ebook library with Kobo e-reader devices via USB. Import reading progress, annotations, and vocabulary from KoboReader.sqlite database.',
  version: '2.0.0',
  author: 'Stomy Team',
  icon: 'BookOpen',
  enabled: false, // Optional plugin - enable if you use Kobo devices

  permissions: ['fs:read', 'fs:write', 'tauri:*'],

  settings: {
    targetFolder: 'Stomy',
    showNotifications: true,
    autoEject: false,
    syncMetadata: true,
    syncReadingProgress: true,
    syncAnnotations: true,
    syncVocabulary: false,
    useLibraryFolders: true, // Create a subfolder per library
    libraryFolderPrefix: '', // No prefix by default
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
    {
      id: 'import-reading-progress',
      label: 'Import Reading Progress from Kobo',
      icon: 'CloudDownload',
      context: 'global',
      onClick: async () => {
        try {
          console.log('[KoboPlugin] Importing reading progress...');
          const devices = await detectKoboDevices();

          if (devices.length === 0) {
            await notificationService.notify({
              title: 'No Kobo Detected',
              body: 'Please connect your Kobo device via USB',
            });
            throw new Error('No Kobo device detected');
          }

          // Start sync with progress updates
          const devicePath = devices[0].path;

          await notificationService.notify({
            title: 'Kobo Sync Started',
            body: `Syncing from ${devices[0].model}...`,
          });

          const stats = await syncReadingProgress(devicePath, (progress) => {
            console.log('[KoboPlugin] Progress:', progress);
          });

          return stats;
        } catch (error) {
          console.error('[KoboPlugin] Failed to import reading progress:', error);
          await notificationService.notify({
            title: 'Sync Error',
            body: String(error),
          });
          throw error;
        }
      },
    },
    {
      id: 'view-annotations',
      label: 'View Kobo Annotations',
      icon: 'TextQuote',
      context: 'global',
      onClick: async () => {
        try {
          const devices = await detectKoboDevices();

          if (devices.length === 0) {
            throw new Error('No Kobo device detected');
          }

          const bookmarks = await getKoboBookmarks(devices[0].path);
          console.log('[KoboPlugin] Found', bookmarks.length, 'annotations');
          return bookmarks;
        } catch (error) {
          console.error('[KoboPlugin] Failed to get annotations:', error);
          throw error;
        }
      },
    },
    {
      id: 'sync-vocabulary',
      label: 'Import Vocabulary from Kobo',
      icon: 'Book',
      context: 'global',
      onClick: async () => {
        try {
          const devices = await detectKoboDevices();

          if (devices.length === 0) {
            throw new Error('No Kobo device detected');
          }

          const vocabulary = await getKoboVocabulary(devices[0].path);
          console.log('[KoboPlugin] Found', vocabulary.length, 'vocabulary words');
          return vocabulary;
        } catch (error) {
          console.error('[KoboPlugin] Failed to get vocabulary:', error);
          throw error;
        }
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
 * Get target folder path for a library on Kobo
 */
export function getLibraryFolderPath(
  koboDevicePath: string,
  settings: KoboPluginSettings,
  libraryName?: string
): string {
  const basePath = `${koboDevicePath}/${settings.targetFolder}`;

  // If library folders are disabled, return base path
  if (!settings.useLibraryFolders || !libraryName) {
    return basePath;
  }

  // Create library-specific folder
  const prefix = settings.libraryFolderPrefix || '';
  const libraryFolder = `${prefix}${libraryName}`.replace(/[/\\:*?"<>|]/g, '-'); // Sanitize folder name

  return `${basePath}/${libraryFolder}`;
}

/**
 * Sync a book to Kobo (with multi-library support)
 */
export async function syncBookToKobo(
  bookPath: string,
  bookTitle: string,
  koboDevicePath: string,
  settings: KoboPluginSettings,
  libraryName?: string
): Promise<SyncResult> {
  try {
    // Get target folder (may include library subfolder)
    const targetFolder = getLibraryFolderPath(koboDevicePath, settings, libraryName);

    // Create library folder if needed
    if (settings.useLibraryFolders && libraryName) {
      await invoke('create_directory', { path: targetFolder });
    }

    // Copy book to target folder
    await copyFileToKobo(bookPath, targetFolder, bookTitle);

    return {
      success: true,
      booksSynced: 1,
      libraryName,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      libraryName,
    };
  }
}

// ============================================================================
// Database Reading Functions
// ============================================================================

/**
 * Get all books from Kobo database
 */
export async function getKoboBooks(devicePath: string): Promise<KoboBook[]> {
  try {
    return await invoke<KoboBook[]>('get_kobo_books', { devicePath });
  } catch (error) {
    console.error('[KoboPlugin] Failed to get books:', error);
    return [];
  }
}

/**
 * Get reading events from Kobo database
 */
export async function getKoboEvents(devicePath: string): Promise<KoboEvent[]> {
  try {
    return await invoke<KoboEvent[]>('get_kobo_events', { devicePath });
  } catch (error) {
    console.error('[KoboPlugin] Failed to get events:', error);
    return [];
  }
}

/**
 * Get bookmarks and annotations from Kobo database
 */
export async function getKoboBookmarks(devicePath: string): Promise<KoboBookmark[]> {
  try {
    return await invoke<KoboBookmark[]>('get_kobo_bookmarks', { devicePath });
  } catch (error) {
    console.error('[KoboPlugin] Failed to get bookmarks:', error);
    return [];
  }
}

/**
 * Get vocabulary words from Kobo database
 */
export async function getKoboVocabulary(devicePath: string): Promise<KoboVocabulary[]> {
  try {
    return await invoke<KoboVocabulary[]>('get_kobo_vocabulary', { devicePath });
  } catch (error) {
    console.error('[KoboPlugin] Failed to get vocabulary:', error);
    return [];
  }
}

/**
 * Get all Kobo library data at once (optimized)
 */
export async function getKoboLibraryData(devicePath: string): Promise<KoboLibraryData> {
  return await invoke<KoboLibraryData>('get_kobo_library_data', { devicePath });
}

/**
 * Get reading progress for a specific book
 */
export async function getBookProgress(
  devicePath: string,
  isbn?: string,
  title?: string
): Promise<KoboBook | null> {
  try {
    return await invoke<KoboBook | null>('get_book_progress', {
      devicePath,
      isbn: isbn || null,
      title: title || null,
    });
  } catch (error) {
    console.error('[KoboPlugin] Failed to get book progress:', error);
    return null;
  }
}

// ============================================================================
// Book Matching Functions
// ============================================================================

/**
 * Match a Kobo book to a Stomy library book
 */
function matchBook(koboBook: KoboBook, stomyBooks: Book[]): Book | null {
  // Try matching by ISBN first (most reliable)
  if (koboBook.isbn) {
    const byIsbn = stomyBooks.find(
      (b) => b.isbn && b.isbn.toLowerCase() === koboBook.isbn!.toLowerCase()
    );
    if (byIsbn) return byIsbn;
  }

  // Try matching by title + author
  if (koboBook.title && koboBook.attribution) {
    const normalizeStr = (s: string) =>
      s.toLowerCase().replace(/[^\w\s]/g, '').trim();

    const koboTitle = normalizeStr(koboBook.title);
    const koboAuthor = normalizeStr(koboBook.attribution);

    const byTitleAuthor = stomyBooks.find((b) => {
      const stomyTitle = normalizeStr(b.title || '');
      const stomyAuthor = normalizeStr(b.author || '');

      return stomyTitle === koboTitle && stomyAuthor === koboAuthor;
    });

    if (byTitleAuthor) return byTitleAuthor;
  }

  // Try fuzzy matching by title only (70% similarity)
  if (koboBook.title) {
    const koboTitleWords = koboBook.title.toLowerCase().split(/\s+/);

    const fuzzyMatch = stomyBooks.find((b) => {
      if (!b.title) return false;

      const stomyTitleWords = b.title.toLowerCase().split(/\s+/);
      const matchingWords = koboTitleWords.filter((word) =>
        stomyTitleWords.includes(word)
      );

      const similarity = matchingWords.length / Math.max(koboTitleWords.length, stomyTitleWords.length);
      return similarity >= 0.7;
    });

    if (fuzzyMatch) return fuzzyMatch;
  }

  return null;
}

// ============================================================================
// Sync Utility Functions
// ============================================================================

/**
 * Sync reading progress from Kobo to Stomy library
 */
export async function syncReadingProgress(
  devicePath: string,
  onProgress?: (stats: KoboSyncStats) => void
): Promise<KoboSyncStats> {
  const stats: KoboSyncStats = {
    booksFound: 0,
    booksUpdated: 0,
    progressSynced: 0,
    annotationsSynced: 0,
    vocabularySynced: 0,
    errors: 0,
  };

  try {
    // Get all data from Kobo
    const libraryData = await getKoboLibraryData(devicePath);
    stats.booksFound = libraryData.books.length;

    // Get all books from Stomy library
    const stomyBooks = await libraryService.getBooks();

    console.log('[KoboPlugin] Starting sync:', {
      koboBooks: libraryData.books.length,
      stomyBooks: stomyBooks.length,
    });

    // Sync each Kobo book
    for (const koboBook of libraryData.books) {
      try {
        // Skip system books (ContentType 6 = regular books)
        if (koboBook.contentType !== '6') continue;

        // Find matching book in Stomy library
        const stomyBook = matchBook(koboBook, stomyBooks);

        if (!stomyBook) {
          console.log('[KoboPlugin] No match found for:', koboBook.title);
          continue;
        }

        // Update reading progress
        const updated = await updateBookProgress(stomyBook, koboBook);

        if (updated) {
          stats.booksUpdated++;
          stats.progressSynced++;
          console.log('[KoboPlugin] Updated:', stomyBook.title);
        }

        // Update progress callback
        if (onProgress) {
          onProgress(stats);
        }
      } catch (error) {
        console.error('[KoboPlugin] Error syncing book:', koboBook.title, error);
        stats.errors++;
      }
    }

    // Sync annotations if enabled
    const settings = koboPlugin.settings as KoboPluginSettings;
    if (settings.syncAnnotations && libraryData.bookmarks.length > 0) {
      const annotationsImported = await syncAnnotations(libraryData.bookmarks, stomyBooks);
      stats.annotationsSynced = annotationsImported;
    }

    // Sync vocabulary if enabled
    if (settings.syncVocabulary && libraryData.vocabulary.length > 0) {
      const vocabularyImported = await syncVocabulary(libraryData.vocabulary);
      stats.vocabularySynced = vocabularyImported;
    }

    // Show notification
    await notificationService.notify({
      title: 'Kobo Sync Complete',
      body: `Updated ${stats.booksUpdated} books, ${stats.annotationsSynced} annotations`,
    });

    console.log('[KoboPlugin] Sync complete:', stats);

    return stats;
  } catch (error) {
    console.error('[KoboPlugin] Failed to sync reading progress:', error);
    stats.errors++;

    await notificationService.notify({
      title: 'Kobo Sync Failed',
      body: String(error),
    });

    return stats;
  }
}

/**
 * Update a Stomy book with Kobo reading progress
 */
async function updateBookProgress(stomyBook: Book, koboBook: KoboBook): Promise<boolean> {
  try {
    // Prepare update data
    const updates: Partial<Book> = {};

    // Update reading progress (percent read)
    if (koboBook.percentRead > 0) {
      updates.readingProgress = koboBook.percentRead;
    }

    // Update read status
    if (koboBook.readStatus === 2) {
      updates.readStatus = 'finished';
    } else if (koboBook.readStatus === 1 && koboBook.percentRead > 0) {
      updates.readStatus = 'reading';
    }

    // Update time spent reading (convert minutes to seconds for Stomy)
    if (koboBook.timeSpentReading > 0) {
      updates.timeSpentReading = koboBook.timeSpentReading * 60;
    }

    // Update last read date
    if (koboBook.dateLastRead) {
      updates.lastReadDate = koboBook.dateLastRead;
    }

    // Only update if there are changes
    if (Object.keys(updates).length === 0) {
      return false;
    }

    // Update in database
    await libraryService.updateBook(stomyBook.id, updates);

    return true;
  } catch (error) {
    console.error('[KoboPlugin] Failed to update book progress:', error);
    return false;
  }
}

/**
 * Sync annotations and highlights to Stomy
 */
async function syncAnnotations(bookmarks: KoboBookmark[], stomyBooks: Book[]): Promise<number> {
  let count = 0;

  for (const bookmark of bookmarks) {
    try {
      // Find the book this annotation belongs to
      const book = stomyBooks.find((b) =>
        bookmark.volumeID.includes(b.title || '') ||
        bookmark.volumeID.includes(b.isbn || '')
      );

      if (!book) continue;

      // Store annotation in Stomy database
      // Note: This assumes libraryService has an addAnnotation method
      // If not available, this can be stored in a separate annotations table
      await libraryService.addAnnotation({
        bookId: book.id,
        text: bookmark.text,
        note: bookmark.annotation,
        location: bookmark.chapterProgress,
        createdAt: bookmark.dateCreated,
        type: bookmark.type,
      });

      count++;
    } catch (error) {
      console.error('[KoboPlugin] Failed to sync annotation:', error);
    }
  }

  return count;
}

/**
 * Sync vocabulary words to Stomy
 */
async function syncVocabulary(vocabulary: KoboVocabulary[]): Promise<number> {
  let count = 0;

  for (const word of vocabulary) {
    try {
      // Store vocabulary in Stomy database
      // Note: This assumes libraryService has an addVocabulary method
      // If not available, this can be stored in a separate vocabulary table
      await libraryService.addVocabulary({
        word: word.text,
        context: word.volumeID,
        lookedUpAt: word.dateCreated,
      });

      count++;
    } catch (error) {
      console.error('[KoboPlugin] Failed to sync vocabulary:', error);
    }
  }

  return count;
}

/**
 * Format reading time in human-readable format
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours < 24) {
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

/**
 * Get read status label
 */
export function getReadStatusLabel(status: number): string {
  switch (status) {
    case 0:
      return 'Unread';
    case 1:
      return 'Reading';
    case 2:
      return 'Finished';
    default:
      return 'Unknown';
  }
}

export default koboPlugin;
