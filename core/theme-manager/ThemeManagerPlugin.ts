/**
 * Theme Manager Plugin
 * Manages color themes and typography for the entire application
 */

import type { Plugin } from '../types';
import { notificationService } from '@/services/notificationService';
import type { Theme, ColorPalette, Typography, ThemeManagerSettings } from './types';
import { THEMES, DEFAULT_THEME, getThemeById } from './themes';

const LOG_PREFIX = '[ThemeManager]';

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
    const style = document.createElement('style');
    style.id = 'theme-custom-css';
    style.textContent = css;
    document.head.appendChild(style);
  }
}

/**
 * Listen for system dark mode changes
 */
function setupDarkModeListener(callback: (isDark: boolean) => void): void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches);
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  }
  // Safari < 14
  else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleChange);
  }

  // Initial call
  handleChange(mediaQuery);
}

/**
 * Get current system dark mode preference
 */
function getSystemDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Apply all settings
 */
function applyAllSettings(settings: ThemeManagerSettings): void {
  // Get theme
  const theme = getThemeById(settings.currentTheme) || DEFAULT_THEME;

  // Determine dark mode
  const isDark = settings.autoSwitchDarkMode
    ? getSystemDarkMode()
    : settings.isDarkMode;

  // Apply theme
  applyTheme(theme, isDark);

  // Apply transitions
  applyTransitionSettings(settings.enableTransitions, settings.transitionDuration);

  // Apply accessibility
  applyAccessibilitySettings(settings.highContrast, settings.reducedMotion);

  // Apply custom CSS
  applyCustomCss(settings.customCss);
}

export const themeManagerPlugin: Plugin = {
  // === Metadata ===
  id: 'theme-manager',
  name: 'Theme Manager',
  description: 'Gestion des thèmes de couleurs et de typographie pour l\'application',
  version: '1.0.0',
  author: 'Stomy Team',
  icon: 'ColorRegular',
  repository: 'https://github.com/izo/stomy-plugins',

  // === Configuration ===
  enabled: false,
  permissions: [],

  settings: {
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

    const settings = themeManagerPlugin.settings as ThemeManagerSettings;

    // Apply current settings
    applyAllSettings(settings);

    // Setup dark mode listener if auto-switch is enabled
    if (settings.autoSwitchDarkMode) {
      setupDarkModeListener((isDark) => {
        console.log(`${LOG_PREFIX} System dark mode changed: ${isDark}`);

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
      },
    },
    {
      id: 'list-themes',
      label: 'Liste des thèmes',
      icon: 'AppsListRegular',
      context: 'global',
      onClick: async () => {
        const themeList = THEMES.map(
          (theme, index) => `${index + 1}. ${theme.name} - ${theme.description}`
        ).join('\n');

        const message = `🎨 THÈMES DISPONIBLES\n\n${themeList}`;
        alert(message);

        console.log(`${LOG_PREFIX} Available themes:`, THEMES.map(t => t.id));
      },
    },
    {
      id: 'apply-nord-theme',
      label: 'Appliquer Nord',
      icon: 'ColorRegular',
      context: 'settings',
      onClick: async function () {
        const settings = themeManagerPlugin.settings as ThemeManagerSettings;

        settings.currentTheme = 'nord';
        applyAllSettings(settings);

        console.log(`${LOG_PREFIX} Applied Nord theme`);

        await notificationService.notify({
          title: 'Theme Manager',
          body: 'Thème Nord appliqué',
        });
      },
    },
    {
      id: 'toggle-transitions',
      label: 'Activer/désactiver transitions',
      icon: 'SlideTransitionRegular',
      context: 'settings',
      onClick: async function () {
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
      },
    },
    {
      id: 'toggle-high-contrast',
      label: 'Contraste élevé',
      icon: 'ContrastRegular',
      context: 'settings',
      onClick: async function () {
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
      },
    },
    {
      id: 'export-current-theme',
      label: 'Exporter le thème actuel',
      icon: 'ArrowExportRegular',
      context: 'settings',
      onClick: async () => {
        const settings = themeManagerPlugin.settings as ThemeManagerSettings;
        const theme = getThemeById(settings.currentTheme) || DEFAULT_THEME;

        const exportData = {
          theme,
          isDarkMode: settings.isDarkMode,
          exportedAt: new Date().toISOString(),
        };

        const json = JSON.stringify(exportData, null, 2);

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

          // Fallback: show in alert
          alert(`THÈME EXPORTÉ\n\n${json}`);
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
        await notificationService.notify({
          title: 'Theme Manager',
          body: 'Consultez la sidebar pour gérer les thèmes',
        });
      },
    },
    {
      id: 'reset-theme',
      label: 'Réinitialiser le thème',
      icon: 'ArrowResetRegular',
      action: async function () {
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
      },
    },
  ],
};

// Export helper functions for programmatic use
export { applyTheme, applyColorPalette, applyTypography, getSystemDarkMode };

export default themeManagerPlugin;
