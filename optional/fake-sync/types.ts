/**
 * Fake Sync Plugin Types
 */

export type DeviceType = 'kobo' | 'kindle' | 'usb' | 'none';

export interface FakeDevice {
  id: string;
  name: string;
  type: DeviceType;
  model: string;
  serialNumber: string;
  mountPath: string;
  capacity: number; // in MB
  usedSpace: number; // in MB
  supportedFormats: string[];
}

export interface FakeSyncSettings {
  // Device simulation settings
  deviceType: DeviceType;
  autoConnect: boolean;
  simulateDelays: boolean;
  syncDuration: number; // in milliseconds
  failureRate: number; // 0-100 percentage

  // Notifications
  showNotifications: boolean;
  verboseMode: boolean;
}

export interface SyncProgress {
  current: number;
  total: number;
  currentBook?: string;
  status: 'connecting' | 'syncing' | 'completed' | 'failed';
}

export interface FakeSyncResult {
  success: boolean;
  deviceName: string;
  booksSynced: number;
  bytesTransferred: number;
  duration: number; // in ms
  error?: string;
}

// Common device models for simulation
export const DEVICE_MODELS = {
  kobo: [
    { model: 'Kobo Clara HD', capacity: 8192, formats: ['epub', 'pdf', 'cbz', 'mobi'] },
    { model: 'Kobo Libra 2', capacity: 32768, formats: ['epub', 'pdf', 'cbz', 'mobi'] },
    { model: 'Kobo Sage', capacity: 32768, formats: ['epub', 'pdf', 'cbz', 'mobi'] },
    { model: 'Kobo Nia', capacity: 8192, formats: ['epub', 'pdf', 'cbz'] },
    { model: 'Kobo Elipsa 2E', capacity: 32768, formats: ['epub', 'pdf', 'cbz', 'mobi'] },
  ],
  kindle: [
    { model: 'Kindle Paperwhite (11th Gen)', capacity: 8192, formats: ['mobi', 'azw', 'azw3', 'pdf'] },
    { model: 'Kindle Oasis', capacity: 32768, formats: ['mobi', 'azw', 'azw3', 'pdf'] },
    { model: 'Kindle Basic', capacity: 8192, formats: ['mobi', 'azw', 'azw3', 'pdf'] },
    { model: 'Kindle Scribe', capacity: 16384, formats: ['mobi', 'azw', 'azw3', 'pdf'] },
  ],
  usb: [
    { model: 'USB Drive Generic', capacity: 32768, formats: ['epub', 'pdf', 'mobi', 'azw', 'cbz', 'txt'] },
    { model: 'USB Drive 64GB', capacity: 65536, formats: ['epub', 'pdf', 'mobi', 'azw', 'cbz', 'txt'] },
    { model: 'SD Card 16GB', capacity: 16384, formats: ['epub', 'pdf', 'mobi', 'azw', 'cbz', 'txt'] },
  ],
};

// ============================================================================
// Kobo Database Simulation Types
// ============================================================================

/**
 * Read status enum (same as KoboReadStatus)
 */
export enum FakeKoboReadStatus {
  Unread = 0,
  Reading = 1,
  Finished = 2,
}

/**
 * Bookmark types
 */
export enum FakeKoboBookmarkType {
  Highlight = 'highlight',
  Annotation = 'annotation',
  Bookmark = 'bookmark',
  Dogear = 'dogear',
}

/**
 * Event types for reading activity
 */
export enum FakeKoboEventType {
  StartReadingBook = 3,
  Progress25 = 1011,
  Progress50 = 1013,
  Progress75 = 1014,
  FinishedReadingBook = 5,
  LeaveContent = 1021,
}

/**
 * Book metadata from simulated Kobo's content table
 */
export interface FakeKoboBook {
  // Identifiers
  contentID: string;
  isbn?: string;

  // Metadata
  title: string;
  attribution?: string; // Author
  description?: string;
  publisher?: string;
  language?: string;

  // Reading Progress
  percentRead: number; // 0-100
  readStatus: FakeKoboReadStatus;
  timeSpentReading: number; // Minutes
  dateLastRead?: string; // ISO date string

  // File info
  mimeType: string;
  contentType: string;

  // System
  userID?: string;
}

/**
 * Reading event from Event table
 */
export interface FakeKoboEvent {
  id: number;
  contentID: string;
  eventType: FakeKoboEventType;
  eventCount: number;
  lastOccurrence: string; // ISO date string
  extraData?: string; // Binary blob (base64 encoded)
}

/**
 * Bookmark (highlight or annotation)
 */
export interface FakeKoboBookmark {
  bookmarkID: string;
  volumeID: string; // Book identifier
  contentID: string;

  // Content
  text: string; // Highlighted text
  annotation?: string; // User's note

  // Location
  chapterProgress: number; // 0-1
  startContainerPath?: string;
  startOffset?: number;
  endContainerPath?: string;
  endOffset?: number;

  // Metadata
  dateCreated: string; // ISO date string
  dateModified?: string; // ISO date string

  // Type
  type: FakeKoboBookmarkType;
}

/**
 * Vocabulary word from WordList table
 */
export interface FakeKoboVocabulary {
  text: string;
  volumeID: string; // Book where word was looked up
  dateCreated: string;
}

/**
 * Complete Kobo library data (simulated)
 */
export interface FakeKoboLibraryData {
  books: FakeKoboBook[];
  events: FakeKoboEvent[];
  bookmarks: FakeKoboBookmark[];
  vocabulary: FakeKoboVocabulary[];
  lastSync: string; // ISO date string
}

/**
 * Sync statistics for Kobo import
 */
export interface FakeKoboSyncStats {
  booksFound: number;
  booksUpdated: number;
  progressSynced: number;
  annotationsSynced: number;
  vocabularySynced: number;
  errors: number;
}
