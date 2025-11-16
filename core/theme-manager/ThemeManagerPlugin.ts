/**
 * Theme Manager Plugin
 * Manages color themes and typography for the entire application
 */

import type { Plugin } from '../types';
import { notificationService } from '@/services/notificationService';
import type { Theme, ColorPalette, Typography, ThemeManagerSettings } from './types';
import { THEMES, DEFAULT_THEME, getThemeById, setCustomThemes, isCustomTheme as isThemeCustom } from './themes';
import {
  loadAllCustomThemes,
  saveCustomTheme,
  deleteCustomTheme,
  exportThemeToJson,
} from './customThemes';

const LOG_PREFIX = '[ThemeManager]';

/**
 * Current settings version
 */
const SETTINGS_VERSION = 1;

/**
 * Global cleanup function for dark mode listener
 */
let darkModeCleanup: (() => void) | null = null;

/**
 * Track analytics/telemetry events (optional, can be extended)
 * Currently logs to console, but can be extended to send to analytics service
 */
function trackEvent(event: string, data?: Record<string, any>): void {
  const timestamp = new Date().toISOString();
  const eventData = {
    event,
    timestamp,
    ...data,
  };

  // Log to console (can be disabled in production)
  console.log(`${LOG_PREFIX} [Analytics]`, eventData);

  // Future: Send to analytics service
  // if (window.analytics) {
  //   window.analytics.track(event, eventData);
  // }
}

/**
 * Migrate settings from old versions to current version
 */
function migrateSettings(settings: any): ThemeManagerSettings {
  const version = settings.settingsVersion || 0;

  console.log(`${LOG_PREFIX} Migrating settings from version ${version} to ${SETTINGS_VERSION}`);

  let migrated = { ...settings };

  // Migration from version 0 to 1
  if (version < 1) {
    // Add settingsVersion field
    migrated.settingsVersion = 1;

    // Ensure all required fields exist with defaults
    migrated.currentTheme = migrated.currentTheme || 'nord';
    migrated.isDarkMode = migrated.isDarkMode ?? false;
    migrated.autoSwitchDarkMode = migrated.autoSwitchDarkMode ?? true;
    migrated.customCss = migrated.customCss || '';
    migrated.enableTransitions = migrated.enableTransitions ?? true;
    migrated.transitionDuration = migrated.transitionDuration ?? 200;
    migrated.highContrast = migrated.highContrast ?? false;
    migrated.reducedMotion = migrated.reducedMotion ?? false;

    console.log(`${LOG_PREFIX} Migrated from v0 to v1`);
  }

  // Future migrations would go here
  // Example:
  // if (version < 2) {
  //   migrated.newField = defaultValue;
  //   migrated.settingsVersion = 2;
  // }

  return migrated as ThemeManagerSettings;
}

/**
 * Throttle function to limit callback execution frequency
 */
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecuted = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted;

    const execute = () => {
      lastExecuted = now;
      func(...args);
    };

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (timeSinceLastExecution >= delay) {
      execute();
    } else {
      timeoutId = setTimeout(execute, delay - timeSinceLastExecution);
    }
  };
}

/**
 * Apply color palette to CSS variables
 */
function applyColorPalette(palette: ColorPalette, isDark: boolean): void {
  const root = document.documentElement;

  // Primary colors
  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-primary-dark', palette.primaryDark);
  root.style.setProperty('--color-primary-light', palette.primaryLight);

  // Background colors
  root.style.setProperty('--color-background', palette.background);
  root.style.setProperty('--color-background-alt', palette.backgroundAlt);
  root.style.setProperty('--color-background-elevated', palette.backgroundElevated);

  // Foreground/Text colors
  root.style.setProperty('--color-foreground', palette.foreground);
  root.style.setProperty('--color-foreground-alt', palette.foregroundAlt);
  root.style.setProperty('--color-foreground-muted', palette.foregroundMuted);

  // Surface colors
  root.style.setProperty('--color-surface', palette.surface);
  root.style.setProperty('--color-surface-alt', palette.surfaceAlt);
  root.style.setProperty('--color-surface-hover', palette.surfaceHover);

  // Accent colors
  root.style.setProperty('--color-accent', palette.accent);
  root.style.setProperty('--color-accent-alt', palette.accentAlt);

  // Semantic colors
  root.style.setProperty('--color-success', palette.success);
  root.style.setProperty('--color-warning', palette.warning);
  root.style.setProperty('--color-error', palette.error);
  root.style.setProperty('--color-info', palette.info);

  // Border colors
  root.style.setProperty('--color-border', palette.border);
  root.style.setProperty('--color-border-alt', palette.borderAlt);

  // Special colors
  root.style.setProperty('--color-highlight', palette.highlight);
  root.style.setProperty('--color-shadow', palette.shadow);

  // Update dark mode attribute
  if (isDark) {
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
  } else {
    root.setAttribute('data-theme', 'light');
    root.classList.remove('dark');
  }
}

/**
 * Apply typography settings to CSS variables
 */
function applyTypography(typography: Typography): void {
  const root = document.documentElement;

  // Font families
  root.style.setProperty('--font-family', typography.fontFamily);
  root.style.setProperty('--font-family-mono', typography.fontFamilyMono);

  // Font sizes
  root.style.setProperty('--font-size-xs', typography.fontSizeXs);
  root.style.setProperty('--font-size-sm', typography.fontSizeSm);
  root.style.setProperty('--font-size-md', typography.fontSizeMd);
  root.style.setProperty('--font-size-lg', typography.fontSizeLg);
  root.style.setProperty('--font-size-xl', typography.fontSizeXl);
  root.style.setProperty('--font-size-2xl', typography.fontSize2xl);
  root.style.setProperty('--font-size-3xl', typography.fontSize3xl);

  // Line heights
  root.style.setProperty('--line-height-tight', typography.lineHeightTight);
  root.style.setProperty('--line-height-normal', typography.lineHeightNormal);
  root.style.setProperty('--line-height-relaxed', typography.lineHeightRelaxed);

  // Font weights
  root.style.setProperty('--font-weight-normal', typography.fontWeightNormal);
  root.style.setProperty('--font-weight-medium', typography.fontWeightMedium);
  root.style.setProperty('--font-weight-semibold', typography.fontWeightSemibold);
  root.style.setProperty('--font-weight-bold', typography.fontWeightBold);

  // Letter spacing
  root.style.setProperty('--letter-spacing-tight', typography.letterSpacingTight);
  root.style.setProperty('--letter-spacing-normal', typography.letterSpacingNormal);
  root.style.setProperty('--letter-spacing-wide', typography.letterSpacingWide);
}

/**
 * Apply a complete theme
 */
function applyTheme(theme: Theme, isDarkMode: boolean): void {
  console.log(`${LOG_PREFIX} Applying theme: ${theme.name} (${isDarkMode ? 'dark' : 'light'})`);

  // Select the appropriate palette
  const palette = isDarkMode ? theme.dark : theme.light;

  // Apply colors and typography
  applyColorPalette(palette, isDarkMode);
  applyTypography(theme.typography);

  // Store theme info on document
  document.documentElement.setAttribute('data-theme-id', theme.id);
  document.documentElement.setAttribute('data-theme-name', theme.name);

  // Track theme change
  trackEvent('theme_applied', {
    themeId: theme.id,
    themeName: theme.name,
    isDarkMode,
  });
}

/**
 * Apply transition settings
 */
function applyTransitionSettings(enabled: boolean, duration: number): void {
  const root = document.documentElement;

  if (enabled) {
    root.style.setProperty('--theme-transition-duration', `${duration}ms`);
    root.classList.add('theme-transitions-enabled');
  } else {
    root.style.setProperty('--theme-transition-duration', '0ms');
    root.classList.remove('theme-transitions-enabled');
  }
}

/**
 * Apply accessibility settings
 */
function applyAccessibilitySettings(highContrast: boolean, reducedMotion: boolean): void {
  const root = document.documentElement;

  if (highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  if (reducedMotion) {
    root.classList.add('reduced-motion');
  } else {
    root.classList.remove('reduced-motion');
  }
}

/**
 * Validate and sanitize custom CSS
 * Blocks dangerous patterns that could lead to XSS or security issues
 */
function validateCustomCss(css: string): { valid: boolean; error?: string } {
  // Block dangerous patterns
  const dangerousPatterns = [
    { pattern: /@import/i, message: '@import is not allowed for security reasons' },
    { pattern: /expression\s*\(/i, message: 'CSS expressions are not allowed' },
    { pattern: /javascript:/i, message: 'JavaScript URLs are not allowed' },
    { pattern: /behavior\s*:/i, message: 'CSS behaviors are not allowed' },
    { pattern: /-moz-binding/i, message: 'XBL bindings are not allowed' },
    { pattern: /\<script/i, message: 'Script tags are not allowed' },
  ];

  for (const { pattern, message } of dangerousPatterns) {
    if (pattern.test(css)) {
      return { valid: false, error: message };
    }
  }

  return { valid: true };
}

/**
 * Apply custom CSS
 */
function applyCustomCss(css?: string): void {
  // Remove existing custom CSS
  const existing = document.getElementById('theme-custom-css');
  if (existing) {
    existing.remove();
  }

  // Add new custom CSS if provided
  if (css && css.trim()) {
    // Validate CSS before applying
    const validation = validateCustomCss(css);
    if (!validation.valid) {
      console.error(`${LOG_PREFIX} Custom CSS blocked: ${validation.error}`);
      return;
    }

    const style = document.createElement('style');
    style.id = 'theme-custom-css';
    style.textContent = css;
    document.head.appendChild(style);
  }
}

/**
 * Listen for system dark mode changes
 * Returns cleanup function to remove the listener
 */
function setupDarkModeListener(callback: (isDark: boolean) => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Throttle callback to prevent excessive updates (200ms delay)
  const throttledCallback = throttle((e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches);
  }, 200);

  const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
    throttledCallback(e);
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  }
  // Safari < 14
  else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleChange);
  }

  // Initial call (without throttle for immediate response)
  callback(mediaQuery.matches);

  // Return cleanup function
  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.removeListener) {
      mediaQuery.removeListener(handleChange);
    }
  };
}

/**
 * Get current system dark mode preference
 */
function getSystemDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Validate theme settings
 * Returns sanitized settings with invalid values corrected
 */
function validateSettings(settings: ThemeManagerSettings): ThemeManagerSettings {
  const validated = { ...settings };

  // Validate theme exists
  if (!getThemeById(validated.currentTheme)) {
    console.warn(`${LOG_PREFIX} Theme '${validated.currentTheme}' not found, using default`);
    validated.currentTheme = DEFAULT_THEME.id;
  }

  // Validate transition duration (0-2000ms)
  if (validated.transitionDuration < 0 || validated.transitionDuration > 2000) {
    console.warn(`${LOG_PREFIX} Invalid transitionDuration: ${validated.transitionDuration}, using 200ms`);
    validated.transitionDuration = 200;
  }

  // Ensure booleans are actual booleans
  validated.isDarkMode = Boolean(validated.isDarkMode);
  validated.autoSwitchDarkMode = Boolean(validated.autoSwitchDarkMode);
  validated.enableTransitions = Boolean(validated.enableTransitions);
  validated.highContrast = Boolean(validated.highContrast);
  validated.reducedMotion = Boolean(validated.reducedMotion);

  // Validate custom CSS if present
  if (validated.customCss) {
    const validation = validateCustomCss(validated.customCss);
    if (!validation.valid) {
      console.warn(`${LOG_PREFIX} Custom CSS invalid: ${validation.error}, removing it`);
      validated.customCss = '';
    }
  }

  return validated;
}

/**
 * Apply all settings
 */
function applyAllSettings(settings: ThemeManagerSettings): void {
  // Validate settings first
  const validatedSettings = validateSettings(settings);

  // Get theme
  const theme = getThemeById(validatedSettings.currentTheme) || DEFAULT_THEME;

  // Determine dark mode
  const isDark = validatedSettings.autoSwitchDarkMode
    ? getSystemDarkMode()
    : validatedSettings.isDarkMode;

  // Apply theme
  applyTheme(theme, isDark);

  // Apply transitions
  applyTransitionSettings(validatedSettings.enableTransitions, validatedSettings.transitionDuration);

  // Apply accessibility
  applyAccessibilitySettings(validatedSettings.highContrast, validatedSettings.reducedMotion);

  // Apply custom CSS
  applyCustomCss(validatedSettings.customCss);
}

/**
 * Preview a theme temporarily without persisting
 * Automatically reverts to original theme after specified duration
 */
function previewTheme(
  themeId: string,
  isDarkMode: boolean,
  duration: number = 5000
): { cancel: () => void } {
  // Store original settings
  const originalSettings = { ...themeManagerPlugin.settings } as ThemeManagerSettings;

  // Apply preview theme
  const previewThemeObj = getThemeById(themeId);
  if (previewThemeObj) {
    applyTheme(previewThemeObj, isDarkMode);
    console.log(`${LOG_PREFIX} Previewing theme: ${themeId} for ${duration}ms`);
  } else {
    console.warn(`${LOG_PREFIX} Preview theme '${themeId}' not found`);
    return { cancel: () => {} };
  }

  // Schedule revert
  const timeoutId = setTimeout(() => {
    applyAllSettings(originalSettings);
    console.log(`${LOG_PREFIX} Preview ended, reverted to original theme`);
  }, duration);

  // Return cancel function
  return {
    cancel: () => {
      clearTimeout(timeoutId);
      applyAllSettings(originalSettings);
      console.log(`${LOG_PREFIX} Preview cancelled, reverted to original theme`);
    },
  };
}

/**
 * Import theme from JSON string
 * Validates, saves to file, and updates theme registry
 */
async function importTheme(jsonString: string): Promise<{
  success: boolean;
  error?: string;
  theme?: Theme;
  isDarkMode?: boolean;
}> {
  try {
    const data = JSON.parse(jsonString);

    // Validate structure
    if (!data.theme) {
      return { success: false, error: 'Invalid theme export: missing theme object' };
    }

    const theme = data.theme as Theme;

    // Validate required theme properties
    const requiredProps = ['id', 'name', 'description', 'author', 'version', 'light', 'dark', 'typography'];
    for (const prop of requiredProps) {
      if (!(prop in theme)) {
        return { success: false, error: `Invalid theme: missing ${prop}` };
      }
    }

    // Validate color palettes
    const requiredColorProps = ['primary', 'background', 'foreground', 'success', 'error', 'border'];
    for (const prop of requiredColorProps) {
      if (!(prop in theme.light) || !(prop in theme.dark)) {
        return { success: false, error: `Invalid theme: missing ${prop} in color palette` };
      }
    }

    // Validate typography
    const requiredTypographyProps = ['fontFamily', 'fontSizeMd', 'lineHeightNormal'];
    for (const prop of requiredTypographyProps) {
      if (!(prop in theme.typography)) {
        return { success: false, error: `Invalid theme: missing ${prop} in typography` };
      }
    }

    // Save theme to file
    const saveResult = await saveCustomTheme(theme);
    if (!saveResult.success) {
      return { success: false, error: `Failed to save theme: ${saveResult.error}` };
    }

    // Reload custom themes to update the registry
    await reloadCustomThemes();

    return {
      success: true,
      theme,
      isDarkMode: data.isDarkMode ?? false,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Reload custom themes from file system and update registry
 */
async function reloadCustomThemes(): Promise<void> {
  try {
    const customThemes = await loadAllCustomThemes();
    setCustomThemes(customThemes);
    console.log(`${LOG_PREFIX} Reloaded ${customThemes.length} custom themes`);
  } catch (error) {
    console.error(`${LOG_PREFIX} Error reloading custom themes:`, error);
  }
}

export const themeManagerPlugin: Plugin = {
  // === Metadata ===
  id: 'theme-manager',
  name: 'Theme Manager',
  description: '9 thèmes populaires + import/export de thèmes personnalisés. Modes clair/sombre, prévisualisation, et CSS custom.',
  version: '3.0.0',
  author: 'Stomy Team',
  icon: 'ColorRegular',
  repository: 'https://github.com/izo/stomy-plugins',

  // === Configuration ===
  enabled: false,
  permissions: [],

  settings: {
    settingsVersion: SETTINGS_VERSION,
    currentTheme: 'nord',
    isDarkMode: false,
    autoSwitchDarkMode: true,
    customCss: '',
    enableTransitions: true,
    transitionDuration: 200,
    highContrast: false,
    reducedMotion: false,
  } as ThemeManagerSettings,

  // === Sidebar Integration ===
  sidebar: {
    id: 'theme-manager-tab',
    label: 'Thèmes',
    icon: 'ColorRegular',
    position: 'bottom',
    color: '#b48ead', // Nord purple (Aurora)
    component: 'ThemeManagerPanel',
  },

  // === Lifecycle Hooks ===
  async onInstall() {
    console.log(`${LOG_PREFIX} Plugin installed`);

    await notificationService.notify({
      title: 'Theme Manager',
      body: 'Plugin installé! Personnalisez l\'apparence de votre application.',
    });
  },

  async onEnable() {
    console.log(`${LOG_PREFIX} Plugin enabled`);

    // Load custom themes from file system
    await reloadCustomThemes();

    // Migrate settings if needed
    const settings = migrateSettings(themeManagerPlugin.settings);
    themeManagerPlugin.settings = settings;

    // Track plugin enable with current settings
    trackEvent('plugin_enabled', {
      currentTheme: settings.currentTheme,
      isDarkMode: settings.isDarkMode,
      autoSwitchDarkMode: settings.autoSwitchDarkMode,
      enableTransitions: settings.enableTransitions,
      highContrast: settings.highContrast,
      reducedMotion: settings.reducedMotion,
    });

    // Apply current settings
    applyAllSettings(settings);

    // Setup dark mode listener if auto-switch is enabled
    if (settings.autoSwitchDarkMode) {
      darkModeCleanup = setupDarkModeListener((isDark) => {
        console.log(`${LOG_PREFIX} System dark mode changed: ${isDark}`);

        trackEvent('dark_mode_auto_switched', { isDark });

        const theme = getThemeById(settings.currentTheme) || DEFAULT_THEME;
        const palette = isDark ? theme.dark : theme.light;
        applyColorPalette(palette, isDark);
      });
    }

    await notificationService.notify({
      title: 'Theme Manager',
      body: `Thème ${settings.currentTheme} appliqué`,
    });
  },

  async onDisable() {
    console.log(`${LOG_PREFIX} Plugin disabled`);

    // Cleanup dark mode listener
    if (darkModeCleanup) {
      darkModeCleanup();
      darkModeCleanup = null;
    }

    // Reset to default styles
    const root = document.documentElement;
    root.removeAttribute('data-theme');
    root.removeAttribute('data-theme-id');
    root.removeAttribute('data-theme-name');
    root.classList.remove('dark', 'theme-transitions-enabled', 'high-contrast', 'reduced-motion');

    // Remove custom CSS
    applyCustomCss();

    await notificationService.notify({
      title: 'Theme Manager',
      body: 'Thèmes désactivés',
    });
  },

  async onUninstall() {
    console.log(`${LOG_PREFIX} Plugin uninstalled`);
  },

  // === Actions ===
  actions: [
    {
      id: 'toggle-dark-mode',
      label: 'Basculer mode sombre',
      icon: 'WeatherMoonRegular',
      context: 'global',
      onClick: async function () {
        try {
          const settings = themeManagerPlugin.settings as ThemeManagerSettings;

          // Toggle dark mode
          settings.isDarkMode = !settings.isDarkMode;

          // Disable auto-switch when manually toggling
          if (settings.autoSwitchDarkMode) {
            settings.autoSwitchDarkMode = false;
            console.log(`${LOG_PREFIX} Auto-switch disabled (manual toggle)`);
          }

          // Apply settings
          applyAllSettings(settings);

          const mode = settings.isDarkMode ? 'sombre' : 'clair';
          console.log(`${LOG_PREFIX} Dark mode toggled: ${settings.isDarkMode}`);

          await notificationService.notify({
            title: 'Theme Manager',
            body: `Mode ${mode} activé`,
          });
        } catch (error) {
          console.error(`${LOG_PREFIX} Error toggling dark mode:`, error);
          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Erreur lors du basculement du mode sombre',
          });
        }
      },
    },
    {
      id: 'list-themes',
      label: 'Liste des thèmes',
      icon: 'AppsListRegular',
      context: 'global',
      onClick: async () => {
        try {
          const themeList = THEMES.map(
            (theme, index) => `${index + 1}. ${theme.name} - ${theme.description}`
          ).join('\n');

          console.log(`${LOG_PREFIX} Available themes:`, THEMES.map(t => t.id));

          await notificationService.notify({
            title: 'Thèmes disponibles',
            body: `${THEMES.length} thèmes: ${THEMES.map(t => t.name).join(', ')}`,
          });
        } catch (error) {
          console.error(`${LOG_PREFIX} Error listing themes:`, error);
          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Erreur lors de la liste des thèmes',
          });
        }
      },
    },
    {
      id: 'apply-nord-theme',
      label: 'Appliquer Nord',
      icon: 'ColorRegular',
      context: 'settings',
      onClick: async function () {
        try {
          const settings = themeManagerPlugin.settings as ThemeManagerSettings;

          settings.currentTheme = 'nord';
          applyAllSettings(settings);

          console.log(`${LOG_PREFIX} Applied Nord theme`);

          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Thème Nord appliqué',
          });
        } catch (error) {
          console.error(`${LOG_PREFIX} Error applying Nord theme:`, error);
          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Erreur lors de l\'application du thème Nord',
          });
        }
      },
    },
    {
      id: 'toggle-transitions',
      label: 'Activer/désactiver transitions',
      icon: 'SlideTransitionRegular',
      context: 'settings',
      onClick: async function () {
        try {
          const settings = themeManagerPlugin.settings as ThemeManagerSettings;

          settings.enableTransitions = !settings.enableTransitions;
          applyTransitionSettings(settings.enableTransitions, settings.transitionDuration);

          console.log(`${LOG_PREFIX} Transitions: ${settings.enableTransitions}`);

          await notificationService.notify({
            title: 'Theme Manager',
            body: settings.enableTransitions
              ? 'Transitions activées'
              : 'Transitions désactivées',
          });
        } catch (error) {
          console.error(`${LOG_PREFIX} Error toggling transitions:`, error);
          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Erreur lors du changement des transitions',
          });
        }
      },
    },
    {
      id: 'toggle-high-contrast',
      label: 'Contraste élevé',
      icon: 'ContrastRegular',
      context: 'settings',
      onClick: async function () {
        try {
          const settings = themeManagerPlugin.settings as ThemeManagerSettings;

          settings.highContrast = !settings.highContrast;
          applyAccessibilitySettings(settings.highContrast, settings.reducedMotion);

          console.log(`${LOG_PREFIX} High contrast: ${settings.highContrast}`);

          await notificationService.notify({
            title: 'Theme Manager',
            body: settings.highContrast
              ? 'Contraste élevé activé'
              : 'Contraste élevé désactivé',
          });
        } catch (error) {
          console.error(`${LOG_PREFIX} Error toggling high contrast:`, error);
          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Erreur lors du changement du contraste',
          });
        }
      },
    },
    {
      id: 'export-current-theme',
      label: 'Exporter le thème actuel',
      icon: 'ArrowExportRegular',
      context: 'settings',
      onClick: async () => {
        try {
          const settings = themeManagerPlugin.settings as ThemeManagerSettings;
          const theme = getThemeById(settings.currentTheme) || DEFAULT_THEME;

          const json = exportThemeToJson(theme, settings.isDarkMode);

          // Copy to clipboard
          try {
            await navigator.clipboard.writeText(json);

            await notificationService.notify({
              title: 'Theme Manager',
              body: 'Thème copié dans le presse-papiers',
            });

            console.log(`${LOG_PREFIX} Theme exported:`, theme.name);
          } catch (error) {
            console.error(`${LOG_PREFIX} Failed to copy to clipboard:`, error);

            // Fallback: log to console instead of blocking UI with alert
            console.log(`${LOG_PREFIX} Theme export (copy manually):\n`, json);

            await notificationService.notify({
              title: 'Theme Manager',
              body: 'Impossible de copier. Voir la console pour le JSON exporté.',
            });
          }
        } catch (error) {
          console.error(`${LOG_PREFIX} Error exporting theme:`, error);
          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Erreur lors de l\'export du thème',
          });
        }
      },
    },
    {
      id: 'import-theme-from-clipboard',
      label: 'Importer un thème (presse-papiers)',
      icon: 'ArrowImportRegular',
      context: 'settings',
      onClick: async () => {
        try {
          // Read from clipboard
          const json = await navigator.clipboard.readText();

          if (!json || !json.trim()) {
            await notificationService.notify({
              title: 'Theme Manager',
              body: 'Presse-papiers vide',
            });
            return;
          }

          // Import theme
          const result = await importTheme(json);

          if (result.success && result.theme) {
            await notificationService.notify({
              title: 'Theme Manager',
              body: `Thème "${result.theme.name}" importé avec succès`,
            });

            trackEvent('theme_imported', {
              themeId: result.theme.id,
              themeName: result.theme.name,
            });
          } else {
            await notificationService.notify({
              title: 'Theme Manager',
              body: `Erreur: ${result.error}`,
            });
          }
        } catch (error) {
          console.error(`${LOG_PREFIX} Error importing theme:`, error);
          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Erreur lors de l\'import du thème',
          });
        }
      },
    },
    {
      id: 'delete-custom-theme',
      label: 'Supprimer le thème actuel (si personnalisé)',
      icon: 'DeleteRegular',
      context: 'settings',
      onClick: async () => {
        try {
          const settings = themeManagerPlugin.settings as ThemeManagerSettings;
          const themeId = settings.currentTheme;

          // Check if it's a custom theme
          if (!isThemeCustom(themeId)) {
            await notificationService.notify({
              title: 'Theme Manager',
              body: 'Impossible de supprimer un thème intégré',
            });
            return;
          }

          // Confirm deletion
          const confirmed = confirm(`Supprimer définitivement le thème "${themeId}" ?`);
          if (!confirmed) {
            return;
          }

          // Delete theme file
          const result = await deleteCustomTheme(themeId);

          if (result.success) {
            // Switch to default theme
            settings.currentTheme = DEFAULT_THEME.id;
            applyAllSettings(settings);

            // Reload custom themes
            await reloadCustomThemes();

            await notificationService.notify({
              title: 'Theme Manager',
              body: `Thème "${themeId}" supprimé`,
            });

            trackEvent('theme_deleted', { themeId });
          } else {
            await notificationService.notify({
              title: 'Theme Manager',
              body: `Erreur: ${result.error}`,
            });
          }
        } catch (error) {
          console.error(`${LOG_PREFIX} Error deleting theme:`, error);
          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Erreur lors de la suppression du thème',
          });
        }
      },
    },
  ],

  // === Menu Items ===
  menuItems: [
    {
      id: 'open-theme-settings',
      label: 'Paramètres des thèmes',
      icon: 'SettingsRegular',
      action: async () => {
        try {
          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Consultez la sidebar pour gérer les thèmes',
          });
        } catch (error) {
          console.error(`${LOG_PREFIX} Error opening theme settings:`, error);
        }
      },
    },
    {
      id: 'reset-theme',
      label: 'Réinitialiser le thème',
      icon: 'ArrowResetRegular',
      action: async function () {
        try {
          const settings = themeManagerPlugin.settings as ThemeManagerSettings;

          // Reset to defaults
          settings.currentTheme = 'nord';
          settings.isDarkMode = false;
          settings.autoSwitchDarkMode = true;
          settings.customCss = '';
          settings.enableTransitions = true;
          settings.transitionDuration = 200;
          settings.highContrast = false;
          settings.reducedMotion = false;

          applyAllSettings(settings);

          console.log(`${LOG_PREFIX} Theme reset to defaults`);

          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Thème réinitialisé',
          });
        } catch (error) {
          console.error(`${LOG_PREFIX} Error resetting theme:`, error);
          await notificationService.notify({
            title: 'Theme Manager',
            body: 'Erreur lors de la réinitialisation du thème',
          });
        }
      },
    },
  ],
};

// Export helper functions for programmatic use
export {
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
};

export default themeManagerPlugin;
