/**
 * Theme Manager Plugin Types
 */

/**
 * Color palette for a theme
 */
export interface ColorPalette {
  // Primary colors
  primary: string;
  primaryDark: string;
  primaryLight: string;

  // Background colors
  background: string;
  backgroundAlt: string;
  backgroundElevated: string;

  // Foreground/Text colors
  foreground: string;
  foregroundAlt: string;
  foregroundMuted: string;

  // Surface colors
  surface: string;
  surfaceAlt: string;
  surfaceHover: string;

  // Accent colors
  accent: string;
  accentAlt: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Border colors
  border: string;
  borderAlt: string;

  // Special colors
  highlight: string;
  shadow: string;
}

/**
 * Typography settings
 */
export interface Typography {
  // Font families
  fontFamily: string;
  fontFamilyMono: string;

  // Font sizes
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;

  // Line heights
  lineHeightTight: string;
  lineHeightNormal: string;
  lineHeightRelaxed: string;

  // Font weights
  fontWeightNormal: string;
  fontWeightMedium: string;
  fontWeightSemibold: string;
  fontWeightBold: string;

  // Letter spacing
  letterSpacingTight: string;
  letterSpacingNormal: string;
  letterSpacingWide: string;
}

/**
 * Complete theme definition
 */
export interface Theme {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;

  // Color palettes for light and dark modes
  light: ColorPalette;
  dark: ColorPalette;

  // Typography (shared between light/dark)
  typography: Typography;

  // Additional metadata
  preview?: string; // Preview image URL
  tags?: string[];
}

/**
 * Theme manager plugin settings
 */
export interface ThemeManagerSettings {
  // Current theme ID
  currentTheme: string;

  // Dark mode
  isDarkMode: boolean;

  // Auto-switch based on system preference
  autoSwitchDarkMode: boolean;

  // Custom CSS overrides
  customCss?: string;

  // Animation preferences
  enableTransitions: boolean;
  transitionDuration: number; // in milliseconds

  // Accessibility
  highContrast: boolean;
  reducedMotion: boolean;
}

/**
 * Theme export format for sharing
 */
export interface ThemeExport {
  theme: Theme;
  exportedAt: string;
  exportedBy: string;
}
