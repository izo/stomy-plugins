/**
 * Custom Themes Management
 * Handles saving, loading, and managing user-imported themes as JSON files
 */

import type { Theme } from './types';
import { BaseDirectory, exists, mkdir, readTextFile, writeTextFile, readDir, remove } from '@tauri-apps/plugin-fs';

const LOG_PREFIX = '[ThemeManager:CustomThemes]';
const THEMES_DIR = 'themes';

/**
 * Ensure the themes directory exists
 */
async function ensureThemesDirectory(): Promise<void> {
  try {
    const dirExists = await exists(THEMES_DIR, { baseDir: BaseDirectory.AppData });

    if (!dirExists) {
      await mkdir(THEMES_DIR, { baseDir: BaseDirectory.AppData, recursive: true });
      console.log(`${LOG_PREFIX} Created themes directory`);
    }
  } catch (error) {
    console.error(`${LOG_PREFIX} Error ensuring themes directory:`, error);
    throw error;
  }
}

/**
 * Get file path for a theme
 */
function getThemeFilePath(themeId: string): string {
  return `${THEMES_DIR}/${themeId}.json`;
}

/**
 * Save a custom theme to a JSON file
 */
export async function saveCustomTheme(theme: Theme): Promise<{ success: boolean; error?: string }> {
  try {
    await ensureThemesDirectory();

    const filePath = getThemeFilePath(theme.id);
    const json = JSON.stringify(theme, null, 2);

    await writeTextFile(filePath, json, { baseDir: BaseDirectory.AppData });

    console.log(`${LOG_PREFIX} Saved custom theme: ${theme.id}`);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error saving custom theme:`, error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Load a custom theme from a JSON file
 */
export async function loadCustomTheme(themeId: string): Promise<{ success: boolean; theme?: Theme; error?: string }> {
  try {
    const filePath = getThemeFilePath(themeId);
    const fileExists = await exists(filePath, { baseDir: BaseDirectory.AppData });

    if (!fileExists) {
      return { success: false, error: 'Theme file not found' };
    }

    const json = await readTextFile(filePath, { baseDir: BaseDirectory.AppData });
    const theme = JSON.parse(json) as Theme;

    console.log(`${LOG_PREFIX} Loaded custom theme: ${themeId}`);

    return { success: true, theme };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error loading custom theme:`, error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Load all custom themes from the themes directory
 */
export async function loadAllCustomThemes(): Promise<Theme[]> {
  try {
    await ensureThemesDirectory();

    const dirExists = await exists(THEMES_DIR, { baseDir: BaseDirectory.AppData });
    if (!dirExists) {
      return [];
    }

    const entries = await readDir(THEMES_DIR, { baseDir: BaseDirectory.AppData });
    const themes: Theme[] = [];

    for (const entry of entries) {
      // Only process .json files
      if (entry.isFile && entry.name.endsWith('.json')) {
        const themeId = entry.name.replace('.json', '');
        const result = await loadCustomTheme(themeId);

        if (result.success && result.theme) {
          themes.push(result.theme);
        } else {
          console.warn(`${LOG_PREFIX} Failed to load theme: ${themeId}`, result.error);
        }
      }
    }

    console.log(`${LOG_PREFIX} Loaded ${themes.length} custom themes`);

    return themes;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error loading custom themes:`, error);
    return [];
  }
}

/**
 * Delete a custom theme file
 */
export async function deleteCustomTheme(themeId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = getThemeFilePath(themeId);
    const fileExists = await exists(filePath, { baseDir: BaseDirectory.AppData });

    if (!fileExists) {
      return { success: false, error: 'Theme file not found' };
    }

    await remove(filePath, { baseDir: BaseDirectory.AppData });

    console.log(`${LOG_PREFIX} Deleted custom theme: ${themeId}`);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`${LOG_PREFIX} Error deleting custom theme:`, error);
    return { success: false, error: errorMessage };
  }
}

/**
 * List all custom theme IDs
 */
export async function listCustomThemeIds(): Promise<string[]> {
  try {
    await ensureThemesDirectory();

    const dirExists = await exists(THEMES_DIR, { baseDir: BaseDirectory.AppData });
    if (!dirExists) {
      return [];
    }

    const entries = await readDir(THEMES_DIR, { baseDir: BaseDirectory.AppData });

    return entries
      .filter(entry => entry.isFile && entry.name.endsWith('.json'))
      .map(entry => entry.name.replace('.json', ''));
  } catch (error) {
    console.error(`${LOG_PREFIX} Error listing custom themes:`, error);
    return [];
  }
}

/**
 * Check if a theme is custom (not built-in)
 */
export async function isCustomTheme(themeId: string): Promise<boolean> {
  try {
    const filePath = getThemeFilePath(themeId);
    return await exists(filePath, { baseDir: BaseDirectory.AppData });
  } catch (error) {
    return false;
  }
}

/**
 * Export a theme to JSON string (for sharing)
 */
export function exportThemeToJson(theme: Theme, isDarkMode: boolean): string {
  return JSON.stringify({
    theme,
    isDarkMode,
    exportedAt: new Date().toISOString(),
    exportedBy: 'Stomy Theme Manager',
  }, null, 2);
}
