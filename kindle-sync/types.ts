/**
 * Types for Kindle plugin
 */

export interface KindleDevice {
  name: string;
  path: string;
  model: string;
  serialNumber?: string;
  freeSpace: number;
  totalSpace: number;
}

export interface KindleInfo {
  deviceName: string;
  model: string;
  firmwareVersion?: string;
  documentsPath: string;
  freeSpace: number;
  totalSpace: number;
}

export interface ConversionResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

export interface KindlePluginSettings {
  autoConvert: boolean;
  deleteAfterConvert: boolean;
  preferredFormat: 'mobi' | 'azw3';
  targetFolder: string;
  showNotifications: boolean;
}

export interface ConversionJob {
  id: string;
  bookId: string;
  sourcePath: string;
  targetPath: string;
  status: 'pending' | 'converting' | 'completed' | 'failed';
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export interface KindleSyncResult {
  success: boolean;
  converted: number;
  copied: number;
  skipped: number;
  failed: number;
  errors: string[];
}
