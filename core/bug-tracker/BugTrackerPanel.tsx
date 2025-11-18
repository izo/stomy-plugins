/**
 * Bug Tracker Panel
 * Affiche la liste des bugs GitHub et permet d'en soumettre de nouveaux
 */

import { useState, useEffect } from 'react'
import { Bug, ExternalLink, RefreshCw, CheckCircle, AlertCircle, Clock, Search } from '@/utils/icons'
import { BugSubmitModal } from './BugSubmitModal'
import { invoke } from '@tauri-apps/api/core'
import { pluginManager } from '@/plugins'
import type { BugTrackerSettings } from './types'

interface GitHubIssue {
  number: number
  title: string
  state: 'OPEN' | 'CLOSED'
  createdAt: string
  updatedAt: string
  url: string
  labels: Array<{ name: string; color: string }>
  author: {
    login: string
  }
}

export function BugTrackerPanel() {
  const [issues, setIssues] = useState<GitHubIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterState, setFilterState] = useState<'all' | 'open' | 'closed'>('all')

  // Get plugin settings
  const settings = pluginManager.getPluginSettings('bug-tracker') as BugTrackerSettings

  useEffect(() => {
    loadIssues()
  }, [])

  const loadIssues = async () => {
    if (!settings?.githubRepo) {
      setError('GitHub repository not configured. Please configure in Settings > Plugins > Bug Tracker.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch issues from GitHub using gh CLI
      const response = await invoke<string>('github_list_issues', {
        repo: settings.githubRepo,
        state: 'all',
        labels: ['auto-reported'],
      })

      const issuesData: GitHubIssue[] = JSON.parse(response)
      setIssues(issuesData)
    } catch (err) {
      console.error('[BugTrackerPanel] Failed to load issues:', err)
      setError(`Failed to load issues: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredIssues = issues
    .filter(issue => {
      if (filterState !== 'all' && issue.state.toLowerCase() !== filterState) return false
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return issue.title.toLowerCase().includes(query) ||
               issue.number.toString().includes(query)
      }
      return true
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
    return `Il y a ${Math.floor(diffDays / 365)} ans`
  }

  const getStateIcon = (state: string) => {
    if (state.toUpperCase() === 'OPEN') {
      return <AlertCircle className="w-4 h-4 text-green-500" />
    }
    return <CheckCircle className="w-4 h-4 text-purple-500" />
  }

  const getStateText = (state: string) => {
    return state.toUpperCase() === 'OPEN' ? 'Ouvert' : 'Fermé'
  }

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-separator)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Bug Tracker</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {settings?.githubRepo ? `Repository: ${settings.githubRepo}` : 'No repository configured'}
            </p>
          </div>
          <button
            onClick={loadIssues}
            disabled={loading}
            className="p-2 hover:bg-[var(--color-sidebar-hover)] rounded-lg macos-transition"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-5 h-5 text-[var(--color-text-secondary)] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Rechercher par titre ou numéro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--color-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-separator)] focus:outline-none focus:ring-2 focus:ring-red-500/30 macos-transition"
            />
          </div>

          <div className="flex items-center gap-2 bg-[var(--color-input)] rounded-lg p-1 border border-[var(--color-separator)]">
            <button
              onClick={() => setFilterState('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md macos-transition ${
                filterState === 'all'
                  ? 'bg-[var(--color-accent-blue)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)]'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterState('open')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md macos-transition ${
                filterState === 'open'
                  ? 'bg-green-500 text-white'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)]'
              }`}
            >
              Ouverts
            </button>
            <button
              onClick={() => setFilterState('closed')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md macos-transition ${
                filterState === 'closed'
                  ? 'bg-purple-500 text-white'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-hover)]'
              }`}
            >
              Fermés
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[var(--color-text-secondary)]">Chargement des bugs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md p-6">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Erreur de chargement
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">{error}</p>
              <button
                onClick={loadIssues}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 macos-button-hover"
              >
                Réessayer
              </button>
            </div>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md p-6">
              <Bug className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                Aucun bug trouvé
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {searchQuery ? 'Aucun résultat pour votre recherche' : 'Aucun bug n\'a été signalé pour le moment'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-3">
            {filteredIssues.map((issue) => (
              <div
                key={issue.number}
                className="p-4 bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-separator)] hover:border-[var(--color-accent-blue)]/30 macos-transition"
              >
                <div className="flex items-start gap-3">
                  {getStateIcon(issue.state)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                          {issue.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                          <span className="flex items-center gap-1">
                            #{issue.number}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(issue.createdAt)}
                          </span>
                          <span>{getStateText(issue.state)}</span>
                          {issue.author && (
                            <span>par {issue.author.login}</span>
                          )}
                        </div>
                      </div>
                      <a
                        href={issue.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/10 rounded-lg macos-transition"
                        title="Voir sur GitHub"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Labels */}
                    {issue.labels && issue.labels.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {issue.labels.slice(0, 3).map((label) => (
                          <span
                            key={label.name}
                            className="px-2 py-0.5 text-xs font-medium rounded"
                            style={{
                              backgroundColor: `#${label.color}20`,
                              color: `#${label.color}`,
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                        {issue.labels.length > 3 && (
                          <span className="px-2 py-0.5 text-xs text-[var(--color-text-secondary)]">
                            +{issue.labels.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowSubmitModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl macos-transition flex items-center justify-center z-50"
        title="Signaler un bug"
      >
        <Bug className="w-6 h-6" />
      </button>

      {/* Submit Modal */}
      <BugSubmitModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSuccess={(issueUrl) => {
          console.log('[BugTrackerPanel] Bug submitted:', issueUrl)
          loadIssues() // Refresh the list
        }}
      />
    </div>
  )
}
