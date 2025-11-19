/**
 * Type definitions for reMarkable Sync Plugin
 */

/**
 * reMarkable device information
 */
export interface RemarkableDevice {
  id: string;
  name: string;
  model: string; // 'reMarkable 1' | 'reMarkable 2' | 'reMarkable Paper Pro'
  manufacturer: string; // 'reMarkable AS'
  softwareVersion?: string;
  serialNumber?: string;
  connected: boolean;
  connectionType: 'usb' | 'ssh' | 'cloud';
  baseUrl: string; // 'http://10.11.99.1' for USB
  totalSpace?: number; // bytes
  freeSpace?: number; // bytes
  bookCount?: number;
  lastSync?: string; // ISO date
}

/**
 * Plugin settings stored in database
 */
export interface RemarkablePluginSettings {
  // Connection settings
  connectionMethod: 'usb' | 'ssh' | 'cloud';
  usbWebInterfaceEnabled: boolean;
  sshHost: string;
  sshPort: number;
  sshUsername: string;
  sshPassword: string; // Should be encrypted in real implementation

  // Upload settings
  targetFolder: string; // Default: '/'
  createLibraryFolders: boolean; // Organize by library name
  libraryFolderPrefix: string; // Prefix for library folders

  // File handling
  maxFileSize: number; // MB, default: 100 (USB API limit)
  convertEpubToPdf: boolean; // Auto-convert EPUB to PDF if needed
  compressLargePdfs: boolean; // Compress PDFs over maxFileSize

  // Sync options
  syncMetadata: boolean; // Sync metadata if possible
  autoSync: boolean; // Auto-sync on device connection
  syncOnlySelected: boolean; // Only sync selected books

  // UI settings
  showNotifications: boolean;
  showUploadProgress: boolean;
  confirmBeforeSync: boolean;

  // Advanced
  enableSshFallback: boolean; // Use SSH if USB fails
  debugMode: boolean;
}

/**
 * File upload result
 */
export interface UploadResult {
  success: boolean;
  fileName: string;
  fileSize: number;
  uploadedAt?: string;
  error?: string;
  devicePath?: string;
}

/**
 * Sync operation result
 */
export interface SyncResult {
  success: boolean;
  booksSynced: number;
  booksSkipped: number;
  booksFailed: number;
  totalSize: number; // bytes
  duration: number; // milliseconds
  errors: string[];
  libraryName?: string;
}

/**
 * Storage information
 */
export interface StorageInfo {
  total: number; // bytes
  used: number; // bytes
  free: number; // bytes
  percentUsed: number;
}

/**
 * Upload progress callback data
 */
export interface UploadProgress {
  fileName: string;
  current: number; // bytes uploaded
  total: number; // total bytes
  percent: number;
  speed?: number; // bytes per second
  eta?: number; // seconds remaining
}

/**
 * Book sync status
 */
export interface BookSyncStatus {
  bookId: number;
  title: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed' | 'skipped';
  progress: number; // 0-100
  error?: string;
  syncedAt?: string;
}

/**
 * reMarkable file metadata (for advanced features)
 */
export interface RemarkableFileMetadata {
  id: string;
  version: number;
  type: 'DocumentType' | 'CollectionType';
  visibleName: string;
  parent: string;
  lastModified: string;
  lastOpened: string;
  lastOpenedPage: number;
  deleted: boolean;
  pinned: boolean;
  synced: boolean;
}

/**
 * Device detection result
 */
export interface DeviceDetectionResult {
  found: boolean;
  device?: RemarkableDevice;
  webInterfaceEnabled?: boolean;
  error?: string;
}

/**
 * Batch sync operation configuration
 */
export interface BatchSyncConfig {
  bookIds: number[];
  targetDevice: string;
  libraryName?: string;
  onProgress?: (status: BookSyncStatus) => void;
  onComplete?: (result: SyncResult) => void;
}

/**
 * SSH connection credentials
 */
export interface SshCredentials {
  host: string;
  port: number;
  username: string;
  password: string;
}

/**
 * HTTP API response (USB Web Interface)
 */
export interface HttpApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}
