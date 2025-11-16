/**
 * Theme Manager Plugin - Entry Point
 * Manages color themes and typography for the Stomy application
 */

export * from './types';
export * from './themes';
export * from './ThemeManagerPlugin';
export {
  themeManagerPlugin as default,
  applyTheme,
  applyColorPalette,
  applyTypography,
  getSystemDarkMode,
} from './ThemeManagerPlugin';
