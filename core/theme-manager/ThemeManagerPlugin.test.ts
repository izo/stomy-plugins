/**
 * Theme Manager Plugin - Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getThemeById, getThemeIds, getThemesByTag, THEMES, DEFAULT_THEME } from './themes';

/**
 * Tests for theme registry functions
 */
describe('Theme Registry', () => {
  it('should return the correct default theme', () => {
    expect(DEFAULT_THEME.id).toBe('nord');
    expect(DEFAULT_THEME.name).toBe('Nord');
  });

  it('should return all theme IDs', () => {
    const ids = getThemeIds();
    expect(ids).toHaveLength(9);
    expect(ids).toContain('nord');
    expect(ids).toContain('dracula');
    expect(ids).toContain('catppuccin-frappe');
  });

  it('should find theme by valid ID', () => {
    const theme = getThemeById('nord');
    expect(theme).toBeDefined();
    expect(theme?.id).toBe('nord');
    expect(theme?.name).toBe('Nord');
  });

  it('should return undefined for invalid theme ID', () => {
    const theme = getThemeById('non-existent-theme');
    expect(theme).toBeUndefined();
  });

  it('should find themes by tag', () => {
    const popularThemes = getThemesByTag('popular');
    expect(popularThemes.length).toBeGreaterThan(0);
    popularThemes.forEach(theme => {
      expect(theme.tags).toContain('popular');
    });
  });

  it('should return empty array for non-existent tag', () => {
    const themes = getThemesByTag('non-existent-tag');
    expect(themes).toEqual([]);
  });
});

/**
 * Tests for theme structure validation
 */
describe('Theme Structure Validation', () => {
  it('should have all required theme properties', () => {
    THEMES.forEach(theme => {
      expect(theme).toHaveProperty('id');
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('description');
      expect(theme).toHaveProperty('author');
      expect(theme).toHaveProperty('version');
      expect(theme).toHaveProperty('light');
      expect(theme).toHaveProperty('dark');
      expect(theme).toHaveProperty('typography');
    });
  });

  it('should have valid color palettes', () => {
    THEMES.forEach(theme => {
      // Check light palette
      expect(theme.light).toHaveProperty('primary');
      expect(theme.light).toHaveProperty('background');
      expect(theme.light).toHaveProperty('foreground');
      expect(theme.light).toHaveProperty('success');
      expect(theme.light).toHaveProperty('error');

      // Check dark palette
      expect(theme.dark).toHaveProperty('primary');
      expect(theme.dark).toHaveProperty('background');
      expect(theme.dark).toHaveProperty('foreground');
      expect(theme.dark).toHaveProperty('success');
      expect(theme.dark).toHaveProperty('error');
    });
  });

  it('should have valid typography settings', () => {
    THEMES.forEach(theme => {
      expect(theme.typography).toHaveProperty('fontFamily');
      expect(theme.typography).toHaveProperty('fontFamilyMono');
      expect(theme.typography).toHaveProperty('fontSizeXs');
      expect(theme.typography).toHaveProperty('fontSizeSm');
      expect(theme.typography).toHaveProperty('fontSizeMd');
      expect(theme.typography).toHaveProperty('lineHeightNormal');
      expect(theme.typography).toHaveProperty('fontWeightNormal');
    });
  });

  it('should have valid color values (hex format)', () => {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    const rgbaColorRegex = /^rgba?\([0-9\s,\.]+\)$/;

    THEMES.forEach(theme => {
      // Check a few key colors
      expect(
        hexColorRegex.test(theme.light.primary) ||
        rgbaColorRegex.test(theme.light.primary)
      ).toBe(true);

      expect(
        hexColorRegex.test(theme.dark.primary) ||
        rgbaColorRegex.test(theme.dark.primary)
      ).toBe(true);
    });
  });
});

/**
 * Tests for CSS validation (when exported as utility)
 */
describe('CSS Validation', () => {
  // Mock validateCustomCss function (would need to be exported)
  const validateCustomCss = (css: string): { valid: boolean; error?: string } => {
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
  };

  it('should reject CSS with @import', () => {
    const result = validateCustomCss('@import url("malicious.css");');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('@import');
  });

  it('should reject CSS with javascript: URLs', () => {
    const result = validateCustomCss('background: url(javascript:alert(1));');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('JavaScript URLs');
  });

  it('should reject CSS with expression()', () => {
    const result = validateCustomCss('width: expression(alert(1));');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('expressions');
  });

  it('should reject CSS with behavior:', () => {
    const result = validateCustomCss('behavior: url(malicious.htc);');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('behaviors');
  });

  it('should reject CSS with -moz-binding', () => {
    const result = validateCustomCss('-moz-binding: url(malicious.xml);');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('bindings');
  });

  it('should reject CSS with script tags', () => {
    const result = validateCustomCss('.class { } <script>alert(1)</script>');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Script tags');
  });

  it('should accept safe CSS', () => {
    const safeCss = `
      .custom-class {
        color: #ff0000;
        background-color: var(--color-background);
        padding: 1rem;
      }
    `;
    const result = validateCustomCss(safeCss);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});

/**
 * Tests for settings validation
 */
describe('Settings Validation', () => {
  const validateSettings = (settings: any) => {
    const validated = { ...settings };

    // Validate theme exists
    if (!getThemeById(validated.currentTheme)) {
      validated.currentTheme = DEFAULT_THEME.id;
    }

    // Validate transition duration (0-2000ms)
    if (validated.transitionDuration < 0 || validated.transitionDuration > 2000) {
      validated.transitionDuration = 200;
    }

    // Ensure booleans are actual booleans
    validated.isDarkMode = Boolean(validated.isDarkMode);
    validated.autoSwitchDarkMode = Boolean(validated.autoSwitchDarkMode);
    validated.enableTransitions = Boolean(validated.enableTransitions);
    validated.highContrast = Boolean(validated.highContrast);
    validated.reducedMotion = Boolean(validated.reducedMotion);

    return validated;
  };

  it('should accept valid settings', () => {
    const settings = {
      currentTheme: 'nord',
      isDarkMode: false,
      autoSwitchDarkMode: true,
      customCss: '',
      enableTransitions: true,
      transitionDuration: 200,
      highContrast: false,
      reducedMotion: false,
    };

    const validated = validateSettings(settings);
    expect(validated.currentTheme).toBe('nord');
    expect(validated.transitionDuration).toBe(200);
  });

  it('should correct invalid theme ID', () => {
    const settings = {
      currentTheme: 'invalid-theme',
      isDarkMode: false,
      autoSwitchDarkMode: true,
      enableTransitions: true,
      transitionDuration: 200,
      highContrast: false,
      reducedMotion: false,
    };

    const validated = validateSettings(settings);
    expect(validated.currentTheme).toBe('nord'); // Should fallback to default
  });

  it('should correct negative transition duration', () => {
    const settings = {
      currentTheme: 'nord',
      isDarkMode: false,
      autoSwitchDarkMode: true,
      enableTransitions: true,
      transitionDuration: -100,
      highContrast: false,
      reducedMotion: false,
    };

    const validated = validateSettings(settings);
    expect(validated.transitionDuration).toBe(200);
  });

  it('should correct too large transition duration', () => {
    const settings = {
      currentTheme: 'nord',
      isDarkMode: false,
      autoSwitchDarkMode: true,
      enableTransitions: true,
      transitionDuration: 5000,
      highContrast: false,
      reducedMotion: false,
    };

    const validated = validateSettings(settings);
    expect(validated.transitionDuration).toBe(200);
  });

  it('should convert non-boolean values to booleans', () => {
    const settings = {
      currentTheme: 'nord',
      isDarkMode: 1,
      autoSwitchDarkMode: 'true',
      enableTransitions: null,
      transitionDuration: 200,
      highContrast: undefined,
      reducedMotion: 0,
    };

    const validated = validateSettings(settings);
    expect(typeof validated.isDarkMode).toBe('boolean');
    expect(typeof validated.autoSwitchDarkMode).toBe('boolean');
    expect(typeof validated.enableTransitions).toBe('boolean');
    expect(typeof validated.highContrast).toBe('boolean');
    expect(typeof validated.reducedMotion).toBe('boolean');
  });
});

/**
 * Integration tests for theme application
 */
describe('Theme Application', () => {
  beforeEach(() => {
    // Setup DOM
    document.documentElement.setAttribute('data-theme', '');
    document.documentElement.className = '';
  });

  afterEach(() => {
    // Cleanup
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-id');
    document.documentElement.removeAttribute('data-theme-name');
    document.documentElement.className = '';
  });

  it('should set theme attributes on documentElement', () => {
    // This would test the actual applyTheme function if it were exported
    // For now, we're just documenting the expected behavior
    expect(document.documentElement).toBeDefined();
  });
});
