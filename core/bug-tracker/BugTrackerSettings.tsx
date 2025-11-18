/**
 * Bug Tracker Settings Component
 * Configuration screen for Bug Tracker plugin
 */

import { useState, useEffect } from 'react'
import { BugReport, Settings, Github, Info, Save } from '@/utils/icons'
import { pluginManager } from '@/plugins'
import type { BugTrackerSettings as BugTrackerSettingsType } from './types'

export function BugTrackerSettings() {
  const [settings, setSettings] = useState<BugTrackerSettingsType>({
    enabled: true,
    githubRepo: '',
    githubToken: '',
    autoAssign: false,
    defaultLabels: ['bug'],
    includeSystemInfo: true,
    includeScreenshot: true,
    collectSystemInfo: true,
    showInSidebar: false,
    sidebarPosition: 'bottom',
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const plugin = pluginManager.getPlugin('bug-tracker')
      if (plugin?.settings) {
        setSettings(plugin.settings as BugTrackerSettingsType)
      }
    } catch (error) {
      console.error('Failed to load bug tracker settings:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await pluginManager.setPluginSettings('bug-tracker', settings)
      // Show success notification
      console.log('Bug Tracker settings saved')
    } catch (error) {
      console.error('Failed to save bug tracker settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Bug Tracker Configuration */}
      <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-separator)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-separator)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <BugReport className="w-5 h-5" />
            Bug Tracker Configuration
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Configure GitHub integration for bug reporting
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* GitHub Repository */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              GitHub Repository
            </label>
            <div className="flex items-center gap-2">
              <Github className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <input
                type="text"
                value={settings.githubRepo}
                onChange={(e) => setSettings({ ...settings, githubRepo: e.target.value })}
                placeholder="owner/repository"
                className="flex-1 px-3 py-2 bg-[var(--color-muted)] border border-[var(--color-separator)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]"
              />
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Format: owner/repository (e.g., anthropics/stomy)
            </p>
          </div>

          {/* GitHub Token (Optional) */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              GitHub Token (Optional)
            </label>
            <input
              type="password"
              value={settings.githubToken || ''}
              onChange={(e) => setSettings({ ...settings, githubToken: e.target.value })}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 bg-[var(--color-muted)] border border-[var(--color-separator)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]"
            />
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Required for private repositories or higher rate limits
            </p>
          </div>

          {/* Default Labels */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Default Labels
            </label>
            <input
              type="text"
              value={settings.defaultLabels.join(', ')}
              onChange={(e) => setSettings({
                ...settings,
                defaultLabels: e.target.value.split(',').map(l => l.trim()).filter(Boolean)
              })}
              placeholder="bug, needs-triage"
              className="w-full px-3 py-2 bg-[var(--color-muted)] border border-[var(--color-separator)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]"
            />
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Comma-separated list of labels to apply to new issues
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                  Include System Information
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Attach OS, version, and environment details to bug reports
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.includeSystemInfo}
                onChange={(e) => setSettings({ ...settings, includeSystemInfo: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                  Include Screenshot
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Automatically capture and attach screenshots to bug reports
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.includeScreenshot}
                onChange={(e) => setSettings({ ...settings, includeScreenshot: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]"
              />
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                Les rapports de bugs sont soumis via l'API GitHub. Assurez-vous que le dépôt spécifié existe et que vous avez les permissions nécessaires.
              </span>
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving || !settings.githubRepo}
              className="flex items-center gap-2 px-6 py-2 bg-[var(--color-accent-blue)] text-white text-sm rounded-lg hover:opacity-90 macos-button-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
