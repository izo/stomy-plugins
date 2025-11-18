/**
 * Bug Tracker Plugin
 * Allows users to submit bug reports directly from the app to GitHub Issues
 */

import { invoke } from '@tauri-apps/api/core';
import type { Plugin } from '../types';
import { notificationService } from '../../../../services/notificationService';
import type {
  BugReport,
  SystemContext,
  GitHubIssue,
  BugTrackerSettings,
  GitHubAuthStatus,
  BugSubmissionResult,
} from './types';

/**
 * Collect system context information
 */
function collectSystemContext(): SystemContext {
  const nav = window.navigator;
  const screen = window.screen;

  // Parse user agent
  const userAgent = nav.userAgent;
  let browser = 'Unknown';
  let browserVersion = '';
  let isWebView = false;

  if (userAgent.includes('Tauri')) {
    isWebView = true;
    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      browserVersion = match ? match[1] : '';
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
      const match = userAgent.match(/Version\/(\d+)/);
      browserVersion = match ? match[1] : '';
    }
  } else if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    browserVersion = match ? match[1] : '';
  }

  // Detect OS
  let os = 'Unknown';
  let osVersion = '';
  if (userAgent.includes('Win')) {
    os = 'Windows';
    const match = userAgent.match(/Windows NT (\d+\.\d+)/);
    osVersion = match ? match[1] : '';
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
    const match = userAgent.match(/Mac OS X (\d+[._]\d+[._]\d+)/);
    osVersion = match ? match[1].replace(/_/g, '.') : '';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  }

  // Connection info (if available)
  const connection = (nav as any).connection || (nav as any).mozConnection || (nav as any).webkitConnection;

  return {
    userAgent,
    browser: isWebView ? `${browser} (WebView)` : browser,
    browserVersion,
    isWebView,
    os,
    osVersion,
    platform: nav.platform,
    arch: (nav as any).userAgentData?.platform || 'unknown',
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    language: nav.language,
    languages: Array.from(nav.languages),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connectionType: connection?.type,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
  };
}

/**
 * Capture screenshot of the current page
 */
async function captureScreenshot(): Promise<string | undefined> {
  try {
    // Use html2canvas if available, otherwise return undefined
    // In production, this should be imported from a library
    const html2canvas = (window as any).html2canvas;
    if (!html2canvas) {
      console.warn('[BugTrackerPlugin] html2canvas not available');
      return undefined;
    }

    const canvas = await html2canvas(document.body, {
      scale: 1,
      logging: false,
      useCORS: true,
    });

    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error('[BugTrackerPlugin] Screenshot capture failed:', error);
    return undefined;
  }
}

/**
 * Format bug report as GitHub issue markdown
 */
function formatGitHubIssue(
  report: BugReport,
  context: SystemContext,
  appVersion?: string
): GitHubIssue {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('fr-FR');

  let body = `${report.description}\n\n---\n\n`;

  // Context section
  body += `## Contexte\n\n`;
  body += `**Catégorie**: ${report.category}\n`;
  body += `**Sévérité**: ${report.severity}\n`;
  if (report.page) body += `**Page**: ${report.page}\n`;
  if (report.url) body += `**URL**: ${report.url}\n`;
  body += `**Date**: ${dateStr} ${timeStr}\n`;
  body += `**Source**: Bug Tracker interne (Application Desktop)\n\n`;

  // Environment section
  body += `## Environnement utilisateur\n\n`;
  body += `**Navigateur**: ${context.browser} ${context.browserVersion}${context.isWebView ? ' (WebView)' : ''}\n`;
  body += `**OS**: ${context.os} ${context.osVersion}\n`;
  body += `**Platform**: ${context.platform}\n`;
  body += `**Résolution écran**: ${context.screenWidth}x${context.screenHeight}\n`;
  body += `**Viewport**: ${context.viewportWidth}x${context.viewportHeight}\n`;
  body += `**Pixel ratio**: ${context.pixelRatio}\n`;
  body += `**Langue**: ${context.language}\n`;
  body += `**Timezone**: ${context.timezone}\n`;
  if (context.connectionType) body += `**Connexion**: ${context.effectiveType || context.connectionType}\n`;
  if (context.downlink) body += `**Débit**: ${context.downlink} Mbps\n`;
  if (appVersion) body += `**Version App**: ${appVersion}\n`;

  // Screenshot section
  if (report.screenshot) {
    body += `\n## Screenshot\n\n`;
    body += `![Screenshot](${report.screenshot})\n`;
  }

  // Labels
  const labels = [report.category];
  if (report.severity) labels.push(`severity:${report.severity}`);
  labels.push('auto-reported');

  return {
    title: report.title,
    body,
    labels,
  };
}

/**
 * Check GitHub authentication status
 */
async function checkGitHubAuth(): Promise<GitHubAuthStatus> {
  try {
    const result = await invoke<GitHubAuthStatus>('github_auth_status');
    return result;
  } catch (error) {
    console.error('[BugTrackerPlugin] GitHub auth check failed:', error);
    return { authenticated: false };
  }
}

/**
 * Create GitHub issue
 */
async function createGitHubIssue(
  repo: string,
  issue: GitHubIssue,
  assignee?: string
): Promise<BugSubmissionResult> {
  try {
    const result = await invoke<{ url: string; number: number }>('github_create_issue', {
      repo,
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
      assignee,
    });

    return {
      success: true,
      issueUrl: result.url,
      issueNumber: result.number,
    };
  } catch (error) {
    console.error('[BugTrackerPlugin] GitHub issue creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export const bugTrackerPlugin: Plugin = {
  id: 'bug-tracker',
  name: 'Bug Tracker',
  description:
    'Système de feedback intégré permettant de soumettre des bugs directement depuis l\'application vers GitHub Issues.',
  version: '1.0.0',
  author: 'Stomy Team',
  icon: 'BugRegular',
  enabled: false,

  permissions: ['tauri:*', 'shell:*'],

  settings: {
    enabled: true,
    githubRepo: '', // Format: "owner/repo"
    autoAssign: false,
    assignee: '',
    defaultLabels: ['bug', 'auto-reported'],
    autoScreenshot: true,
    collectSystemInfo: true,
    showInSidebar: true,
    sidebarPosition: 'bottom',
  } as BugTrackerSettings,

  // Sidebar integration
  sidebar: {
    id: 'bug-tracker-tab',
    label: 'Bug Tracker',
    icon: 'BugRegular',
    position: 'bottom', // Position above footer
    color: '#ef4444', // Red color (Tailwind red-500)
    component: 'BugTrackerPanel', // Component name to render
  },

  // Lifecycle hooks
  onInstall: async () => {
    console.log('[BugTrackerPlugin] Plugin installed');
    await notificationService.notify({
      title: 'Bug Tracker',
      body: 'Plugin installé. Configurez le dépôt GitHub dans les paramètres.',
    });
  },

  onUninstall: async () => {
    console.log('[BugTrackerPlugin] Plugin uninstalled');
  },

  onEnable: async () => {
    console.log('[BugTrackerPlugin] Plugin enabled');

    // Check GitHub authentication
    const authStatus = await checkGitHubAuth();
    if (!authStatus.authenticated) {
      await notificationService.notify({
        title: 'Bug Tracker',
        body: 'Attention: GitHub CLI non authentifié. Exécutez "gh auth login".',
      });
    } else {
      console.log('[BugTrackerPlugin] GitHub authenticated as:', authStatus.user);
    }
  },

  onDisable: async () => {
    console.log('[BugTrackerPlugin] Plugin disabled');
  },

  // Actions exposed in the UI
  actions: [
    {
      id: 'check-github-auth',
      label: 'Vérifier authentification GitHub',
      icon: 'CheckmarkCircleRegular',
      context: 'settings',
      onClick: async function () {
        try {
          const authStatus = await checkGitHubAuth();

          if (authStatus.authenticated) {
            await notificationService.notify({
              title: 'Bug Tracker',
              body: `Authentifié en tant que ${authStatus.user || 'utilisateur inconnu'}`,
            });

            alert(
              `✅ GitHub CLI authentifié\n\nUtilisateur: ${authStatus.user || 'N/A'}\nScopes: ${authStatus.scopes?.join(', ') || 'N/A'}`
            );
          } else {
            await notificationService.notify({
              title: 'Bug Tracker',
              body: 'Non authentifié. Exécutez "gh auth login" dans le terminal.',
            });

            alert(
              '❌ GitHub CLI non authentifié\n\nVeuillez exécuter dans votre terminal:\ngh auth login\n\nPuis accordez les permissions:\ngh auth refresh -s repo -s write:project'
            );
          }
        } catch (error) {
          console.error('[BugTrackerPlugin] Auth check failed:', error);
          await notificationService.notify({
            title: 'Bug Tracker',
            body: `Erreur: ${error}`,
          });
        }
      },
    },
    {
      id: 'submit-test-bug',
      label: 'Tester soumission de bug',
      icon: 'SendRegular',
      context: 'settings',
      onClick: async function () {
        try {
          const settings = bugTrackerPlugin.settings as BugTrackerSettings;

          if (!settings.githubRepo) {
            alert('Veuillez configurer le dépôt GitHub dans les paramètres.');
            return;
          }

          // Collect context
          const context = collectSystemContext();

          // Capture screenshot
          let screenshot: string | undefined;
          if (settings.autoScreenshot) {
            await notificationService.notify({
              title: 'Bug Tracker',
              body: 'Capture d\'écran en cours...',
            });
            screenshot = await captureScreenshot();
          }

          // Create test report
          const report: BugReport = {
            title: '[TEST] Bug test depuis Bug Tracker',
            description:
              'Ceci est un bug de test soumis depuis le Bug Tracker intégré de l\'application.',
            category: 'bug',
            severity: 'low',
            page: 'Bug Tracker Settings',
            url: window.location.href,
            screenshot,
          };

          // Format as GitHub issue
          const issue = formatGitHubIssue(report, context);

          // Add assignee if configured
          if (settings.autoAssign && settings.assignee) {
            issue.assignees = [settings.assignee];
          }

          // Submit to GitHub
          await notificationService.notify({
            title: 'Bug Tracker',
            body: 'Soumission en cours...',
          });

          const result = await createGitHubIssue(settings.githubRepo, issue, settings.assignee);

          if (result.success) {
            await notificationService.notify({
              title: 'Bug Tracker',
              body: `Issue créée: #${result.issueNumber}`,
            });

            alert(
              `✅ Bug test soumis avec succès!\n\nIssue #${result.issueNumber}\nURL: ${result.issueUrl}`
            );

            console.log('[BugTrackerPlugin] Test bug submitted:', result);
          } else {
            await notificationService.notify({
              title: 'Bug Tracker',
              body: `Échec: ${result.error}`,
            });

            alert(`❌ Échec de la soumission\n\nErreur: ${result.error}`);
          }
        } catch (error) {
          console.error('[BugTrackerPlugin] Test submission failed:', error);
          await notificationService.notify({
            title: 'Bug Tracker',
            body: `Erreur: ${error}`,
          });
        }
      },
    },
  ],

  menuItems: [
    {
      id: 'bug-tracker-settings',
      label: 'Paramètres Bug Tracker',
      icon: 'SettingsRegular',
      action: async () => {
        console.log('[BugTrackerPlugin] Opening settings');
      },
    },
  ],
};

// Export helper functions for programmatic use
export async function submitBugReport(report: BugReport): Promise<BugSubmissionResult> {
  const settings = bugTrackerPlugin.settings as BugTrackerSettings;

  if (!settings.githubRepo) {
    return {
      success: false,
      error: 'GitHub repository not configured',
    };
  }

  // Collect context
  const context = collectSystemContext();

  // Capture screenshot if not provided and auto-screenshot is enabled
  if (!report.screenshot && settings.autoScreenshot) {
    report.screenshot = await captureScreenshot();
  }

  // Format as GitHub issue
  const issue = formatGitHubIssue(report, context);

  // Add assignee if configured
  const assignee = settings.autoAssign && settings.assignee ? settings.assignee : undefined;

  // Submit to GitHub
  return await createGitHubIssue(settings.githubRepo, issue, assignee);
}

export { collectSystemContext, captureScreenshot, formatGitHubIssue, checkGitHubAuth };

export default bugTrackerPlugin;
