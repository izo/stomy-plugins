/**
 * Theme Manager Settings Component
 * Configuration screen for Theme Manager plugin
 */

import { useState, useEffect } from 'react'
import { Palette, Settings, Save, Upload, Download, Plus } from '@/utils/icons'
import { pluginManager } from '@/plugins'
import type { ThemeManagerSettings as ThemeManagerSettingsType, Theme } from './types'
import { builtInThemes } from './themes'

export function ThemeManagerSettings() {
  const [settings, setSettings] = useState<ThemeManagerSettingsType>({
    currentTheme: 'nord',
    isDarkMode: false,
    autoSwitchDarkMode: true,
    customCss: '',
    enableTransitions: true,
    transitionDuration: 200,
    highContrast: false,
    reducedMotion: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const plugin = pluginManager.getPlugin('theme-manager')
      if (plugin?.settings) {
        setSettings(plugin.settings as ThemeManagerSettingsType)
      }
    } catch (error) {
      console.error('Failed to load theme manager settings:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await pluginManager.setPluginSettings('theme-manager', settings)
      // Apply theme
      console.log('Theme Manager settings saved')
    } catch (error) {
      console.error('Failed to save theme manager settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleThemeSelect = (themeId: string) => {
    setSettings({ ...settings, currentTheme: themeId })
    setPreviewTheme(themeId)
  }

  const themesList = Object.values(builtInThemes)

  return (
    <div className="p-6 space-y-6">
      {/* Theme Selection */}
      <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-separator)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-separator)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Selection
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Choose from {themesList.length} built-in themes
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {themesList.map((theme: Theme) => {
              const isSelected = settings.currentTheme === theme.id
              const isPreviewing = previewTheme === theme.id

              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all
                    ${
                      isSelected
                        ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10'
                        : 'border-[var(--color-separator)] hover:border-[var(--color-accent-blue)]/50'
                    }
                  `}
                >
                  {/* Theme Preview */}
                  <div className="flex gap-1 mb-3">
                    {Object.values(theme.colors).slice(0, 5).map((color, idx) => (
                      <div
                        key={idx}
                        className="h-8 flex-1 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Theme Name */}
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {theme.name}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {theme.description}
                  </p>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--color-accent-blue)] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Dark Mode Settings */}
      <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-separator)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-separator)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Dark Mode
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                Auto-switch Dark Mode
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Follow system preference for dark/light mode
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSwitchDarkMode}
              onChange={(e) =>
                setSettings({ ...settings, autoSwitchDarkMode: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
            />
          </div>

          {!settings.autoSwitchDarkMode && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                  Dark Mode
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Manually enable or disable dark mode
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.isDarkMode}
                onChange={(e) => setSettings({ ...settings, isDarkMode: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-separator)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-separator)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Accessibility
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                High Contrast
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Increase contrast for better visibility
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => setSettings({ ...settings, highContrast: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                Reduced Motion
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Minimize animations and transitions
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => setSettings({ ...settings, reducedMotion: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
            />
          </div>

          {!settings.reducedMotion && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                  Enable Transitions
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Smooth animations between states
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableTransitions}
                onChange={(e) =>
                  setSettings({ ...settings, enableTransitions: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS */}
      <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-separator)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-separator)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Custom CSS
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Advanced: Override theme styles with custom CSS
          </p>
        </div>

        <div className="p-6">
          <textarea
            value={settings.customCss || ''}
            onChange={(e) => setSettings({ ...settings, customCss: e.target.value })}
            placeholder="/* Enter custom CSS here */
:root {
  --custom-color: #ff0000;
}"
            className="w-full h-48 px-3 py-2 bg-[var(--color-muted)] border border-[var(--color-separator)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)] font-mono"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => loadSettings()}
          className="px-6 py-2 bg-[var(--color-secondary)] text-[var(--color-text-primary)] text-sm rounded-lg hover:bg-[var(--color-sidebar-hover)] macos-button-hover"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-[var(--color-accent-blue)] text-white text-sm rounded-lg hover:opacity-90 macos-button-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
