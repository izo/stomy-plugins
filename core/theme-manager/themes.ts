/**
 * Built-in Themes
 */

import type { Theme, ColorPalette, Typography } from './types';

/**
 * Default typography settings (shared across all themes)
 */
const defaultTypography: Typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',

  fontSizeXs: '0.75rem',   // 12px
  fontSizeSm: '0.875rem',  // 14px
  fontSizeMd: '1rem',      // 16px
  fontSizeLg: '1.125rem',  // 18px
  fontSizeXl: '1.25rem',   // 20px
  fontSize2xl: '1.5rem',   // 24px
  fontSize3xl: '1.875rem', // 30px

  lineHeightTight: '1.25',
  lineHeightNormal: '1.5',
  lineHeightRelaxed: '1.75',

  fontWeightNormal: '400',
  fontWeightMedium: '500',
  fontWeightSemibold: '600',
  fontWeightBold: '700',

  letterSpacingTight: '-0.025em',
  letterSpacingNormal: '0',
  letterSpacingWide: '0.025em',
};

/**
 * Nord Theme
 * Based on https://www.nordtheme.com/
 *
 * Color Palette:
 * - Polar Night (dark): #2e3440, #3b4252, #434c5e, #4c566a
 * - Snow Storm (light): #d8dee9, #e5e9f0, #eceff4
 * - Frost (blue): #8fbcbb, #88c0d0, #81a1c1, #5e81ac
 * - Aurora (accent): #bf616a (red), #d08770 (orange), #ebcb8b (yellow), #a3be8c (green), #b48ead (purple)
 */

const nordLightPalette: ColorPalette = {
  // Primary colors (Frost blue)
  primary: '#5e81ac',
  primaryDark: '#81a1c1',
  primaryLight: '#88c0d0',

  // Background colors (Snow Storm)
  background: '#eceff4',
  backgroundAlt: '#e5e9f0',
  backgroundElevated: '#ffffff',

  // Foreground/Text colors (Polar Night)
  foreground: '#2e3440',
  foregroundAlt: '#3b4252',
  foregroundMuted: '#4c566a',

  // Surface colors
  surface: '#d8dee9',
  surfaceAlt: '#e5e9f0',
  surfaceHover: '#d8dee9',

  // Accent colors (Frost)
  accent: '#88c0d0',
  accentAlt: '#8fbcbb',

  // Semantic colors (Aurora)
  success: '#a3be8c',
  warning: '#ebcb8b',
  error: '#bf616a',
  info: '#81a1c1',

  // Border colors
  border: '#d8dee9',
  borderAlt: '#4c566a',

  // Special colors
  highlight: '#ebcb8b',
  shadow: 'rgba(46, 52, 64, 0.1)',
};

const nordDarkPalette: ColorPalette = {
  // Primary colors (Frost blue)
  primary: '#88c0d0',
  primaryDark: '#5e81ac',
  primaryLight: '#8fbcbb',

  // Background colors (Polar Night)
  background: '#2e3440',
  backgroundAlt: '#3b4252',
  backgroundElevated: '#434c5e',

  // Foreground/Text colors (Snow Storm)
  foreground: '#eceff4',
  foregroundAlt: '#e5e9f0',
  foregroundMuted: '#d8dee9',

  // Surface colors
  surface: '#3b4252',
  surfaceAlt: '#434c5e',
  surfaceHover: '#4c566a',

  // Accent colors (Frost)
  accent: '#88c0d0',
  accentAlt: '#8fbcbb',

  // Semantic colors (Aurora)
  success: '#a3be8c',
  warning: '#ebcb8b',
  error: '#bf616a',
  info: '#81a1c1',

  // Border colors
  border: '#4c566a',
  borderAlt: '#d8dee9',

  // Special colors
  highlight: '#ebcb8b',
  shadow: 'rgba(0, 0, 0, 0.2)',
};

export const nordTheme: Theme = {
  id: 'nord',
  name: 'Nord',
  description: 'An arctic, north-bluish color palette',
  author: 'Arctic Ice Studio',
  version: '1.0.0',
  light: nordLightPalette,
  dark: nordDarkPalette,
  typography: defaultTypography,
  tags: ['cool', 'blue', 'professional', 'arctic'],
};

/**
 * Default theme (Nord)
 */
export const DEFAULT_THEME = nordTheme;

/**
 * All available themes
 */
export const THEMES: Theme[] = [
  nordTheme,
  // Additional themes can be added here
];

/**
 * Get theme by ID
 */
export function getThemeById(id: string): Theme | undefined {
  return THEMES.find(theme => theme.id === id);
}

/**
 * Get all theme IDs
 */
export function getThemeIds(): string[] {
  return THEMES.map(theme => theme.id);
}
