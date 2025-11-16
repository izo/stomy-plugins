/**
 * Built-in Themes
 * Collection of popular color themes adapted for Stomy
 */

import type { Theme, ColorPalette, Typography } from './types';

/**
 * Default typography settings (shared across most themes)
 *
 * NOTE: Each theme can have its own custom typography by creating a
 * new Typography object instead of using defaultTypography.
 * See cyberpunkTypography for an example.
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
 * Custom typography for Cyberpunk themes
 * Uses wider letter spacing and slightly different sizes for a futuristic feel
 */
const cyberpunkTypography: Typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMono: '"Fira Code", "JetBrains Mono", "Cascadia Code", "SF Mono", Monaco, monospace',

  fontSizeXs: '0.75rem',   // 12px
  fontSizeSm: '0.875rem',  // 14px
  fontSizeMd: '1rem',      // 16px
  fontSizeLg: '1.125rem',  // 18px
  fontSizeXl: '1.375rem',  // 22px (slightly larger)
  fontSize2xl: '1.75rem',  // 28px (slightly larger)
  fontSize3xl: '2.25rem',  // 36px (larger for impact)

  lineHeightTight: '1.2',  // Tighter for compact feel
  lineHeightNormal: '1.5',
  lineHeightRelaxed: '1.75',

  fontWeightNormal: '400',
  fontWeightMedium: '500',
  fontWeightSemibold: '600',
  fontWeightBold: '700',

  letterSpacingTight: '0',
  letterSpacingNormal: '0.025em',  // Wider for cyberpunk aesthetic
  letterSpacingWide: '0.075em',    // Extra wide
};

// ============================================================================
// NORD THEME
// ============================================================================

/**
 * Nord Theme
 * An arctic, north-bluish color palette
 *
 * @author Arctic Ice Studio
 * @source https://www.nordtheme.com/
 * @license MIT
 *
 * Color Palette:
 * - Polar Night (dark): #2e3440, #3b4252, #434c5e, #4c566a
 * - Snow Storm (light): #d8dee9, #e5e9f0, #eceff4
 * - Frost (blue): #8fbcbb, #88c0d0, #81a1c1, #5e81ac
 * - Aurora (accent): #bf616a (red), #d08770 (orange), #ebcb8b (yellow), #a3be8c (green), #b48ead (purple)
 */

const nordLightPalette: ColorPalette = {
  primary: '#5e81ac',
  primaryDark: '#81a1c1',
  primaryLight: '#88c0d0',
  background: '#eceff4',
  backgroundAlt: '#e5e9f0',
  backgroundElevated: '#ffffff',
  foreground: '#2e3440',
  foregroundAlt: '#3b4252',
  foregroundMuted: '#4c566a',
  surface: '#d8dee9',
  surfaceAlt: '#e5e9f0',
  surfaceHover: '#d8dee9',
  accent: '#88c0d0',
  accentAlt: '#8fbcbb',
  success: '#a3be8c',
  warning: '#ebcb8b',
  error: '#bf616a',
  info: '#81a1c1',
  border: '#d8dee9',
  borderAlt: '#4c566a',
  highlight: '#ebcb8b',
  shadow: 'rgba(46, 52, 64, 0.1)',
};

const nordDarkPalette: ColorPalette = {
  primary: '#88c0d0',
  primaryDark: '#5e81ac',
  primaryLight: '#8fbcbb',
  background: '#2e3440',
  backgroundAlt: '#3b4252',
  backgroundElevated: '#434c5e',
  foreground: '#eceff4',
  foregroundAlt: '#e5e9f0',
  foregroundMuted: '#d8dee9',
  surface: '#3b4252',
  surfaceAlt: '#434c5e',
  surfaceHover: '#4c566a',
  accent: '#88c0d0',
  accentAlt: '#8fbcbb',
  success: '#a3be8c',
  warning: '#ebcb8b',
  error: '#bf616a',
  info: '#81a1c1',
  border: '#4c566a',
  borderAlt: '#d8dee9',
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

// ============================================================================
// DRACULA THEME
// ============================================================================

/**
 * Dracula Theme
 * A dark theme with vibrant colors
 *
 * @author Zeno Rocha
 * @source https://draculatheme.com/
 * @license MIT
 *
 * Official Color Palette:
 * - Background: #282a36, Current Line: #44475a
 * - Foreground: #f8f8f2, Comment: #6272a4
 * - Cyan: #8be9fd, Green: #50fa7b, Orange: #ffb86c
 * - Pink: #ff79c6, Purple: #bd93f9, Red: #ff5555, Yellow: #f1fa8c
 */

const draculaLightPalette: ColorPalette = {
  primary: '#bd93f9',
  primaryDark: '#9373c9',
  primaryLight: '#ddb3ff',
  background: '#f8f8f2',
  backgroundAlt: '#e7e7e1',
  backgroundElevated: '#ffffff',
  foreground: '#282a36',
  foregroundAlt: '#44475a',
  foregroundMuted: '#6272a4',
  surface: '#e7e7e1',
  surfaceAlt: '#d7d7d1',
  surfaceHover: '#c7c7c1',
  accent: '#ff79c6',
  accentAlt: '#bd93f9',
  success: '#50fa7b',
  warning: '#f1fa8c',
  error: '#ff5555',
  info: '#8be9fd',
  border: '#d7d7d1',
  borderAlt: '#6272a4',
  highlight: '#ffb86c',
  shadow: 'rgba(40, 42, 54, 0.1)',
};

const draculaDarkPalette: ColorPalette = {
  primary: '#bd93f9',
  primaryDark: '#9373c9',
  primaryLight: '#ddb3ff',
  background: '#282a36',
  backgroundAlt: '#21222c',
  backgroundElevated: '#44475a',
  foreground: '#f8f8f2',
  foregroundAlt: '#e0e0e0',
  foregroundMuted: '#6272a4',
  surface: '#44475a',
  surfaceAlt: '#343746',
  surfaceHover: '#4d4f68',
  accent: '#ff79c6',
  accentAlt: '#bd93f9',
  success: '#50fa7b',
  warning: '#f1fa8c',
  error: '#ff5555',
  info: '#8be9fd',
  border: '#44475a',
  borderAlt: '#6272a4',
  highlight: '#ffb86c',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const draculaTheme: Theme = {
  id: 'dracula',
  name: 'Dracula',
  description: 'A dark theme with vibrant colors',
  author: 'Zeno Rocha',
  version: '1.0.0',
  light: draculaLightPalette,
  dark: draculaDarkPalette,
  typography: defaultTypography,
  tags: ['dark', 'vibrant', 'purple', 'popular'],
};

// ============================================================================
// CATPPUCCIN FRAPPÉ THEME
// ============================================================================

/**
 * Catppuccin Frappé Theme
 * Soothing pastel theme with subdued colors
 *
 * @author Catppuccin
 * @source https://github.com/catppuccin/catppuccin
 * @license MIT
 *
 * Official Frappé Palette (26 colors):
 * Base: #303446, Mantle: #292c3c, Crust: #232634
 * Text: #c6d0f5, Subtext: #b5bfe2, #a5adce
 * Blue: #8caaee, Lavender: #babbf1, Sky: #99d1db
 * Teal: #81c8be, Green: #a6d189, Yellow: #e5c890
 * Peach: #ef9f76, Red: #e78284, Mauve: #ca9ee6, Pink: #f4b8e4
 */

const catppuccinLightPalette: ColorPalette = {
  primary: '#8caaee',
  primaryDark: '#7c9ade',
  primaryLight: '#9cbaff',
  background: '#eff1f5',
  backgroundAlt: '#e6e9ef',
  backgroundElevated: '#ffffff',
  foreground: '#4c4f69',
  foregroundAlt: '#5c5f77',
  foregroundMuted: '#6c6f85',
  surface: '#ccd0da',
  surfaceAlt: '#bcc0cc',
  surfaceHover: '#acb0be',
  accent: '#ea76cb',
  accentAlt: '#8839ef',
  success: '#40a02b',
  warning: '#df8e1d',
  error: '#d20f39',
  info: '#1e66f5',
  border: '#ccd0da',
  borderAlt: '#9ca0b0',
  highlight: '#fe640b',
  shadow: 'rgba(76, 79, 105, 0.1)',
};

const catppuccinDarkPalette: ColorPalette = {
  primary: '#8caaee',
  primaryDark: '#7c9ade',
  primaryLight: '#9cbaff',
  background: '#303446',
  backgroundAlt: '#292c3c',
  backgroundElevated: '#414559',
  foreground: '#c6d0f5',
  foregroundAlt: '#b5bfe2',
  foregroundMuted: '#a5adce',
  surface: '#414559',
  surfaceAlt: '#51576d',
  surfaceHover: '#626880',
  accent: '#f4b8e4',
  accentAlt: '#ca9ee6',
  success: '#a6d189',
  warning: '#e5c890',
  error: '#e78284',
  info: '#99d1db',
  border: '#51576d',
  borderAlt: '#949cbb',
  highlight: '#ef9f76',
  shadow: 'rgba(0, 0, 0, 0.2)',
};

export const catppuccinTheme: Theme = {
  id: 'catppuccin-frappe',
  name: 'Catppuccin Frappé',
  description: 'Soothing pastel theme with subdued colors',
  author: 'Catppuccin',
  version: '1.0.0',
  light: catppuccinLightPalette,
  dark: catppuccinDarkPalette,
  typography: defaultTypography,
  tags: ['pastel', 'soothing', 'purple', 'popular'],
};

// ============================================================================
// ATOM ONE LIGHT THEME
// ============================================================================

/**
 * Atom One Light Theme
 * Clean and professional light theme
 *
 * @author GitHub/Atom
 * @source https://github.com/atom/one-light-syntax
 * @license MIT
 *
 * Official Palette:
 * Background: #FAFAFA, Foreground: #383A42
 * Blue: #4078F2, Purple: #A626A4, Green: #50A14F
 * Red: #E45649, Cyan: #0184BC, Orange: #986801
 */

const atomOneLightPalette: ColorPalette = {
  primary: '#4078F2',
  primaryDark: '#3068E2',
  primaryLight: '#5088FF',
  background: '#FAFAFA',
  backgroundAlt: '#F0F0F0',
  backgroundElevated: '#FFFFFF',
  foreground: '#383A42',
  foregroundAlt: '#494B57',
  foregroundMuted: '#696C77',
  surface: '#E5E5E6',
  surfaceAlt: '#DBDBDC',
  surfaceHover: '#D1D1D2',
  accent: '#526FFF',
  accentAlt: '#4078F2',
  success: '#50A14F',
  warning: '#C18401',
  error: '#E45649',
  info: '#0184BC',
  border: '#CECECE',
  borderAlt: '#A0A1A7',
  highlight: '#986801',
  shadow: 'rgba(56, 58, 66, 0.1)',
};

const atomOneDarkPalette: ColorPalette = {
  primary: '#61AFEF',
  primaryDark: '#4090DF',
  primaryLight: '#81CFFF',
  background: '#282C34',
  backgroundAlt: '#21252B',
  backgroundElevated: '#2C323C',
  foreground: '#ABB2BF',
  foregroundAlt: '#9DA5B3',
  foregroundMuted: '#5C6370',
  surface: '#3E4451',
  surfaceAlt: '#2C323C',
  surfaceHover: '#4E5666',
  accent: '#C678DD',
  accentAlt: '#61AFEF',
  success: '#98C379',
  warning: '#E5C07B',
  error: '#E06C75',
  info: '#56B6C2',
  border: '#3E4451',
  borderAlt: '#5C6370',
  highlight: '#D19A66',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const atomOneTheme: Theme = {
  id: 'atom-one',
  name: 'Atom One',
  description: 'Clean and professional theme from Atom',
  author: 'GitHub/Atom',
  version: '1.0.0',
  light: atomOneLightPalette,
  dark: atomOneDarkPalette,
  typography: defaultTypography,
  tags: ['professional', 'clean', 'popular'],
};

// ============================================================================
// MATERIAL THEME
// ============================================================================

/**
 * Material Theme
 * Based on Google's Material Design
 *
 * @author Mattia Astorino (Community maintained)
 * @source https://github.com/material-theme/vsc-material-theme
 * @license MIT
 *
 * Official Palette:
 * Background: #263238, Foreground: #EEFFFF
 * Accent: #009688, Blue: #82aaff, Purple: #c792ea
 * Green: #c3e88d, Yellow: #ffcb6b, Red: #f07178, Orange: #f78c6c
 */

const materialLightPalette: ColorPalette = {
  primary: '#009688',
  primaryDark: '#00786C',
  primaryLight: '#00B8A4',
  background: '#FAFAFA',
  backgroundAlt: '#F5F5F5',
  backgroundElevated: '#FFFFFF',
  foreground: '#263238',
  foregroundAlt: '#37474F',
  foregroundMuted: '#546E7A',
  surface: '#F5F5F5',
  surfaceAlt: '#EEEEEE',
  surfaceHover: '#E0E0E0',
  accent: '#FF5722',
  accentAlt: '#009688',
  success: '#91B859',
  warning: '#F6A434',
  error: '#E53935',
  info: '#6182B8',
  border: '#E0E0E0',
  borderAlt: '#B0BEC5',
  highlight: '#FFB62C',
  shadow: 'rgba(38, 50, 56, 0.1)',
};

const materialDarkPalette: ColorPalette = {
  primary: '#009688',
  primaryDark: '#00786C',
  primaryLight: '#00B8A4',
  background: '#263238',
  backgroundAlt: '#1E272C',
  backgroundElevated: '#2E3C43',
  foreground: '#EEFFFF',
  foregroundAlt: '#B0BEC5',
  foregroundMuted: '#546E7A',
  surface: '#2E3C43',
  surfaceAlt: '#32424A',
  surfaceHover: '#3C4C53',
  accent: '#FF5370',
  accentAlt: '#009688',
  success: '#c3e88d',
  warning: '#ffcb6b',
  error: '#f07178',
  info: '#82aaff',
  border: '#2A373E',
  borderAlt: '#546E7A',
  highlight: '#f78c6c',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const materialTheme: Theme = {
  id: 'material',
  name: 'Material',
  description: 'Based on Google\'s Material Design',
  author: 'Mattia Astorino',
  version: '1.0.0',
  light: materialLightPalette,
  dark: materialDarkPalette,
  typography: defaultTypography,
  tags: ['material-design', 'google', 'teal', 'popular'],
};

// ============================================================================
// VUE THEME
// ============================================================================

/**
 * Vue Theme
 * Inspired by Vue.js branding
 *
 * @author Mario Rodeghiero
 * @source https://github.com/mariorodeghiero/vue-theme-vscode
 * @license MIT
 *
 * Official Palette:
 * Background: #002b36, Green: #19f9d8, Cyan: #09cbdd
 * Pink: #f48fb1, Red: #ee475e, Yellow: #ffcc95, Orange: #ff5622
 */

const vueLightPalette: ColorPalette = {
  primary: '#42b883',
  primaryDark: '#35996e',
  primaryLight: '#4fcd98',
  background: '#FFFFFF',
  backgroundAlt: '#F5F5F5',
  backgroundElevated: '#FFFFFF',
  foreground: '#2c3e50',
  foregroundAlt: '#34495e',
  foregroundMuted: '#7f8c8d',
  surface: '#ECF0F1',
  surfaceAlt: '#E0E4E5',
  surfaceHover: '#D4D8D9',
  accent: '#42b883',
  accentAlt: '#35996e',
  success: '#42b883',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db',
  border: '#DADFE1',
  borderAlt: '#95a5a6',
  highlight: '#f39c12',
  shadow: 'rgba(44, 62, 80, 0.1)',
};

const vueDarkPalette: ColorPalette = {
  primary: '#19f9d8',
  primaryDark: '#09cbdd',
  primaryLight: '#29ffe8',
  background: '#002b36',
  backgroundAlt: '#00212b',
  backgroundElevated: '#003541',
  foreground: '#e6e6e6',
  foregroundAlt: '#d6d6d6',
  foregroundMuted: '#8a8787',
  surface: '#003541',
  surfaceAlt: '#00404c',
  surfaceHover: '#004a57',
  accent: '#f48fb1',
  accentAlt: '#19f9d8',
  success: '#19f9d8',
  warning: '#ffcc95',
  error: '#ee475e',
  info: '#09cbdd',
  border: '#004a57',
  borderAlt: '#19f9d8',
  highlight: '#ff5622',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const vueTheme: Theme = {
  id: 'vue',
  name: 'Vue',
  description: 'Inspired by Vue.js branding',
  author: 'Mario Rodeghiero',
  version: '1.0.0',
  light: vueLightPalette,
  dark: vueDarkPalette,
  typography: defaultTypography,
  tags: ['vue', 'green', 'cyan', 'framework'],
};

// ============================================================================
// LUMON THEME
// ============================================================================

/**
 * Lumon Theme
 * Inspired by the Severance TV show aesthetic
 *
 * @author Conner Luzier
 * @source https://marketplace.visualstudio.com/items?itemName=cluzier.lumon
 * @license MIT
 *
 * Cold, sterile corporate aesthetic with teal-tinted screens
 */

const lumonLightPalette: ColorPalette = {
  primary: '#1a8a8a',
  primaryDark: '#156e6e',
  primaryLight: '#1fa6a6',
  background: '#f0f4f8',
  backgroundAlt: '#e1e8ed',
  backgroundElevated: '#ffffff',
  foreground: '#2c3e50',
  foregroundAlt: '#34495e',
  foregroundMuted: '#546e7a',
  surface: '#d4dfe6',
  surfaceAlt: '#c5d0d7',
  surfaceHover: '#b6c1c8',
  accent: '#17a2b8',
  accentAlt: '#1a8a8a',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
  border: '#b6c1c8',
  borderAlt: '#78909c',
  highlight: '#00bcd4',
  shadow: 'rgba(44, 62, 80, 0.08)',
};

const lumonDarkPalette: ColorPalette = {
  primary: '#00bcd4',
  primaryDark: '#0097a7',
  primaryLight: '#00e1ff',
  background: '#0d1b2a',
  backgroundAlt: '#1b263b',
  backgroundElevated: '#253447',
  foreground: '#d4dfe6',
  foregroundAlt: '#b8c5d0',
  foregroundMuted: '#78909c',
  surface: '#1b263b',
  surfaceAlt: '#253447',
  surfaceHover: '#2f4253',
  accent: '#00e1ff',
  accentAlt: '#00bcd4',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#00bcd4',
  border: '#2f4253',
  borderAlt: '#546e7a',
  highlight: '#00e1ff',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

export const lumonTheme: Theme = {
  id: 'lumon',
  name: 'Lumon',
  description: 'Cold, sterile corporate aesthetic inspired by Severance',
  author: 'Conner Luzier',
  version: '1.0.0',
  light: lumonLightPalette,
  dark: lumonDarkPalette,
  typography: defaultTypography,
  tags: ['severance', 'corporate', 'teal', 'cold'],
};

// ============================================================================
// CYBERPUNK 2077 THEME
// ============================================================================

/**
 * Cyberpunk 2077 - Breach Protocol Theme
 * Inspired by the Cyberpunk 2077 video game
 *
 * @author Endormi (vscode-2077-theme)
 * @source https://github.com/endormi/vscode-2077-theme
 * @license MIT
 *
 * Neon pink, cyan, and yellow against dark backgrounds
 * Colors: #ff2592 (pink), #ffd400 (yellow), #00d7e2 (cyan), #4d8bee (blue)
 */

const cyberpunk2077LightPalette: ColorPalette = {
  primary: '#4d8bee',
  primaryDark: '#3d6bce',
  primaryLight: '#5d9bff',
  background: '#f5f5f7',
  backgroundAlt: '#e8e8ea',
  backgroundElevated: '#ffffff',
  foreground: '#1a1a2e',
  foregroundAlt: '#2a2a3e',
  foregroundMuted: '#5a5a6e',
  surface: '#d8d8da',
  surfaceAlt: '#c8c8ca',
  surfaceHover: '#b8b8ba',
  accent: '#ff2592',
  accentAlt: '#ff2e97',
  success: '#00ffa3',
  warning: '#ffd400',
  error: '#ff2e97',
  info: '#00d7e2',
  border: '#c8c8ca',
  borderAlt: '#8a8a9e',
  highlight: '#ffd400',
  shadow: 'rgba(26, 26, 46, 0.1)',
};

const cyberpunk2077DarkPalette: ColorPalette = {
  primary: '#4d8bee',
  primaryDark: '#3d6bce',
  primaryLight: '#5d9bff',
  background: '#030d22',
  backgroundAlt: '#0a0631',
  backgroundElevated: '#0d0931',
  foreground: '#ffffff',
  foregroundAlt: '#e0e0ff',
  foregroundMuted: '#9090b0',
  surface: '#0d0931',
  surfaceAlt: '#1a0f41',
  surfaceHover: '#271551',
  accent: '#ff2592',
  accentAlt: '#a83dff',
  success: '#00ffa3',
  warning: '#ffd400',
  error: '#ff2e97',
  info: '#00d7e2',
  border: '#1a0f41',
  borderAlt: '#a83dff',
  highlight: '#ffd400',
  shadow: 'rgba(0, 0, 0, 0.5)',
};

export const cyberpunk2077Theme: Theme = {
  id: 'cyberpunk-2077',
  name: 'Cyberpunk 2077',
  description: 'Neon-infused theme inspired by Cyberpunk 2077',
  author: 'Endormi',
  version: '1.0.0',
  light: cyberpunk2077LightPalette,
  dark: cyberpunk2077DarkPalette,
  typography: cyberpunkTypography,
  tags: ['cyberpunk', 'neon', 'futuristic', 'gaming'],
};

// ============================================================================
// NEON CYBERPUNK THEME
// ============================================================================

/**
 * Neon Cyberpunk Theme
 * High-contrast neon theme
 *
 * @author Various (Community Cyberpunk Neon themes)
 * @source https://github.com/Roboron3042/Cyberpunk-Neon
 * @license GPL-3.0
 *
 * Extended colorscheme with vibrant neons
 * Dark: #000b1e, Blue: #091833/#133e7c, Cyan: #0abdc6, Pink: #ea00d9
 */

const neonCyberpunkLightPalette: ColorPalette = {
  primary: '#6300ff',
  primaryDark: '#5000df',
  primaryLight: '#7310ff',
  background: '#f0f0f5',
  backgroundAlt: '#e0e0ea',
  backgroundElevated: '#ffffff',
  foreground: '#1a1a2e',
  foregroundAlt: '#2a2a3e',
  foregroundMuted: '#4a4a5e',
  surface: '#d0d0da',
  surfaceAlt: '#c0c0ca',
  surfaceHover: '#b0b0ba',
  accent: '#cc11f0',
  accentAlt: '#ff008d',
  success: '#00ff9f',
  warning: '#ffcc00',
  error: '#ff0055',
  info: '#00d0ff',
  border: '#b0b0ba',
  borderAlt: '#7a7a8e',
  highlight: '#ff008d',
  shadow: 'rgba(26, 26, 46, 0.12)',
};

const neonCyberpunkDarkPalette: ColorPalette = {
  primary: '#6300ff',
  primaryDark: '#5000df',
  primaryLight: '#7310ff',
  background: '#000b1e',
  backgroundAlt: '#091833',
  backgroundElevated: '#133e7c',
  foreground: '#0abdc6',
  foregroundAlt: '#057583',
  foregroundMuted: '#012f3f',
  surface: '#091833',
  surfaceAlt: '#0b2956',
  surfaceHover: '#133e7c',
  accent: '#ea00d9',
  accentAlt: '#cc11f0',
  success: '#00ff9f',
  warning: '#ffcc00',
  error: '#ff0055',
  info: '#0abdc6',
  border: '#0b2956',
  borderAlt: '#ea00d9',
  highlight: '#ff008d',
  shadow: 'rgba(0, 0, 0, 0.6)',
};

export const neonCyberpunkTheme: Theme = {
  id: 'neon-cyberpunk',
  name: 'Neon Cyberpunk',
  description: 'High-contrast neon cyberpunk theme',
  author: 'Roboron3042',
  version: '1.0.0',
  light: neonCyberpunkLightPalette,
  dark: neonCyberpunkDarkPalette,
  typography: cyberpunkTypography,
  tags: ['cyberpunk', 'neon', 'vibrant', 'high-contrast'],
};

// ============================================================================
// THEME REGISTRY
// ============================================================================

/**
 * Default theme (Nord)
 */
export const DEFAULT_THEME = nordTheme;

/**
 * Built-in themes (hardcoded in the plugin)
 */
export const BUILTIN_THEMES: Theme[] = [
  nordTheme,
  draculaTheme,
  catppuccinTheme,
  atomOneTheme,
  materialTheme,
  vueTheme,
  lumonTheme,
  cyberpunk2077Theme,
  neonCyberpunkTheme,
];

/**
 * Custom themes (loaded from user's AppData directory)
 * This array is populated dynamically on plugin load
 */
let customThemes: Theme[] = [];

/**
 * All available themes (built-in + custom)
 */
export let THEMES: Theme[] = [...BUILTIN_THEMES];

/**
 * Set custom themes (called after loading from files)
 */
export function setCustomThemes(themes: Theme[]): void {
  customThemes = themes;
  THEMES = [...BUILTIN_THEMES, ...customThemes];
  console.log(`[ThemeRegistry] Updated THEMES: ${BUILTIN_THEMES.length} built-in + ${customThemes.length} custom`);
}

/**
 * Get all custom themes
 */
export function getCustomThemes(): Theme[] {
  return customThemes;
}

/**
 * Check if a theme is custom (not built-in)
 */
export function isCustomTheme(themeId: string): boolean {
  return customThemes.some(theme => theme.id === themeId);
}

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

/**
 * Get themes by tag
 */
export function getThemesByTag(tag: string): Theme[] {
  return THEMES.filter(theme => theme.tags?.includes(tag));
}
