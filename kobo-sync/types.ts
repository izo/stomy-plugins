/**
 * Types for Kobo Sync Plugin
 */

export interface KoboDevice {
  name: string;
  path: string;
  model: string;
  serialNumber?: string;
  freeSpace: number;
  totalSpace: number;
}

export interface KoboInfo {
  device: KoboDevice;
  koboPath: string;
  bookCount: number;
  supportedFormats: string[];
}

export interface KoboPluginSettings {
  targetFolder: string; // Default: .kobo folder
  showNotifications: boolean;
  autoEject: boolean;
  syncMetadata: boolean;
}

export interface SyncResult {
  success: boolean;
  booksSynced?: number;
  error?: string;
}
