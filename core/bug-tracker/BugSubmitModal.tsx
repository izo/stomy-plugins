/**
 * Bug Submit Modal
 * Modale pour soumettre un nouveau bug via le Bug Tracker plugin
 */

import { useState } from 'react'
import { X } from '@/utils/icons'
import { submitBugReport } from './BugTrackerPlugin'
import { notificationService } from '@/services/notificationService'

interface BugSubmitModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (issueUrl: string) => void
}

export function BugSubmitModal({ isOpen, onClose, onSuccess }: BugSubmitModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'bug' | 'feature' | 'question' | 'enhancement'>('bug')
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      await notificationService.error('Le titre et la description sont requis')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitBugReport({
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        page: document.title || 'Unknown',
        url: window.location.href,
      })

      if (result.success) {
        await notificationService.notify({
          title: 'Bug Tracker',
          body: `Bug soumis avec succès ! Issue #${result.issueNumber}`,
        })

        // Reset form
        setTitle('')
        setDescription('')
        setCategory('bug')
        setSeverity('medium')

        // Call success callback
        if (onSuccess && result.issueUrl) {
          onSuccess(result.issueUrl)
        }

        onClose()
      } else {
        await notificationService.error(`Échec de la soumission: ${result.error}`)
      }
    } catch (error) {
      console.error('[BugSubmitModal] Submission failed:', error)
      await notificationService.error(`Erreur: ${error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] modal-backdrop p-4">
      <div className="relative z-[10000] bg-white dark:bg-[#1c1c1e] rounded-xl w-full max-w-2xl shadow-2xl border border-[var(--color-separator)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-separator)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Signaler un bug
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md macos-transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="bug-title" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Titre du bug *
            </label>
            <input
              id="bug-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: L'application plante lors de l'import de fichiers"
              className="w-full px-4 py-2.5 bg-[var(--color-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-separator)] focus:outline-none focus:ring-2 focus:ring-red-500/30 macos-transition"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="bug-description" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Description détaillée *
            </label>
            <textarea
              id="bug-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le problème en détail : ce que vous faisiez, ce qui s'est passé, ce que vous attendiez..."
              rows={6}
              className="w-full px-4 py-2.5 bg-[var(--color-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-separator)] focus:outline-none focus:ring-2 focus:ring-red-500/30 macos-transition resize-none"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Category and Severity */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="bug-category" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Catégorie
              </label>
              <select
                id="bug-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[var(--color-input)] text-[var(--color-text-primary)] rounded-lg border border-[var(--color-separator)] focus:outline-none focus:ring-2 focus:ring-red-500/30 macos-transition"
                disabled={isSubmitting}
              >
                <option value="bug">🐛 Bug</option>
                <option value="feature">✨ Feature Request</option>
                <option value="question">❓ Question</option>
                <option value="enhancement">🚀 Enhancement</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label htmlFor="bug-severity" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Sévérité
              </label>
              <select
                id="bug-severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[var(--color-input)] text-[var(--color-text-primary)] rounded-lg border border-[var(--color-separator)] focus:outline-none focus:ring-2 focus:ring-red-500/30 macos-transition"
                disabled={isSubmitting}
              >
                <option value="low">🟢 Faible</option>
                <option value="medium">🟡 Moyen</option>
                <option value="high">🟠 Élevé</option>
                <option value="critical">🔴 Critique</option>
              </select>
            </div>
          </div>

          {/* Info note */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              ℹ️ Les informations système (OS, navigateur, résolution) et une capture d'écran seront automatiquement ajoutées au rapport.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-[var(--color-separator)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-sidebar-hover)] macos-button-hover disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 macos-button-hover disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Soumettre le bug'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
