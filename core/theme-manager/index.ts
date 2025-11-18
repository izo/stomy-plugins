/**
 * Theme Manager Plugin - Entry Point
 * Manages color themes and typography for the Stomy application
 */

export * from './types';
export * from './themes';
export * from './customThemes';
export * from './ThemeManagerPlugin';
export {
  themeManagerPlugin as default,
  applyTheme,
  applyColorPalette,
  applyTypography,
  getSystemDarkMode,
  validateCustomCss,
  validateSettings,
  previewTheme,
  importTheme,
  migrateSettings,
  trackEvent,
  reloadCustomThemes,
} from './ThemeManagerPlugin';

// UI Components
export { ThemeManagerSettings } from './ThemeManagerSettings';
