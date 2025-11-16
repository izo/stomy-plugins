/**
 * Fake Sync Plugin - Entry Point
 * Simulates e-reader device synchronization for development and testing
 */

export * from './types';
export * from './FakeSyncPlugin';
export * from './FakeKoboDataGenerator';

export {
  fakeSyncPlugin as default,
  detectFakeDevice,
  getCurrentFakeDevice,
  setCurrentFakeDevice,
  isSyncInProgress,
  // Kobo simulation functions
  getFakeKoboBooks,
  getFakeKoboEvents,
  getFakeKoboBookmarks,
  getFakeKoboVocabulary,
  getFakeKoboLibraryData,
  getFakeBookProgress,
  regenerateFakeKoboLibrary,
} from './FakeSyncPlugin';
