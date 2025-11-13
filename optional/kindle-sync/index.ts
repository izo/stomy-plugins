/**
 * Kindle Sync Plugin
 * Export all Kindle plugin functionality
 */

export { kindlePlugin as default, kindlePlugin } from './KindlePlugin';
export * from './types';
export {
  detectKindleDevices,
  getKindleInfo,
  convertEpubToMobi,
  convertMobiToEpub,
  copyFileToKindle,
  convertAndSyncBook,
} from './KindlePlugin';
