/**
 * Nav Tags Plugin
 * Displays tags in the sidebar with sub-tabs for filtering content by tag
 */

import type { Plugin } from '../types';
import { notificationService } from '@/services/notificationService';
import { libraryService } from '@/services/libraryService';
import type { NavTagsSettings, Tag, TagStats } from './types';

const LOG_PREFIX = '[NavTags]';

/**
 * Get all tags from the library with their counts
 */
async function getAllTags(): Promise<Tag[]> {
  try {
    const books = await libraryService.getBooks();
    const tagMap = new Map<string, number>();

    // Count books per tag
    for (const book of books) {
      if (book.tags && Array.isArray(book.tags)) {
        for (const tag of book.tags) {
          const tagName = String(tag).trim();
          if (tagName) {
            tagMap.set(tagName, (tagMap.get(tagName) || 0) + 1);
          }
        }
      }
    }

    // Convert to Tag array
    return Array.from(tagMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
    }));
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to get tags:`, error);
    return [];
  }
}

/**
 * Calculate tag statistics
 */
async function getTagStats(): Promise<TagStats> {
  try {
    const tags = await getAllTags();
    const books = await libraryService.getBooks();

    const totalTags = tags.length;
    const totalBooks = books.length;
    const averageBooksPerTag = totalTags > 0 ? totalBooks / totalTags : 0;

    // Find most used tag
    const mostUsedTag = tags.reduce((max, tag) =>
      tag.count > (max?.count || 0) ? tag : max
    , tags[0]);

    return {
      totalTags,
      totalBooks,
      averageBooksPerTag: Math.round(averageBooksPerTag * 10) / 10,
      mostUsedTag,
    };
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to calculate stats:`, error);
    return {
      totalTags: 0,
      totalBooks: 0,
      averageBooksPerTag: 0,
    };
  }
}

/**
 * Sort tags based on settings
 */
function sortTags(tags: Tag[], settings: NavTagsSettings): Tag[] {
  const sorted = [...tags];

  if (settings.sortBy === 'alphabetical') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Sort by count (descending)
    sorted.sort((a, b) => b.count - a.count);
  }

  // Filter empty tags if needed
  if (!settings.showEmptyTags) {
    return sorted.filter(tag => tag.count > 0);
  }

  return sorted;
}

export const navTagsPlugin: Plugin = {
  // === Metadata ===
  id: 'nav-tags',
  name: 'Nav Tags',
  description: 'Navigation par tags dans la sidebar avec filtrage de contenu',
  version: '1.0.0',
  author: 'Stomy Team',
  icon: 'TagRegular',
  repository: 'https://github.com/izo/stomy-plugins',

  // === Configuration ===
  enabled: false,
  permissions: [],

  settings: {
    showTagCount: true,
    sortBy: 'count',
    showEmptyTags: false,
  } as NavTagsSettings,

  // === Sidebar Integration ===
  sidebar: {
    id: 'nav-tags-tab',
    label: 'Tags',
    icon: 'TagRegular',
    position: 'top',
    color: '#8b5cf6', // Purple
    component: 'NavTagsPanel',
  },

  // === Lifecycle Hooks ===
  async onInstall() {
    console.log(`${LOG_PREFIX} Plugin installed`);

    await notificationService.notify({
      title: 'Nav Tags',
      body: '🏷️ Plugin installé! Activez-le pour naviguer par tags.',
    });
  },

  async onEnable() {
    console.log(`${LOG_PREFIX} Plugin enabled`);

    const tags = await getAllTags();
    console.log(`${LOG_PREFIX} Found ${tags.length} tags`);

    await notificationService.notify({
      title: 'Nav Tags',
      body: `✅ ${tags.length} tags disponibles dans la sidebar`,
    });
  },

  async onDisable() {
    console.log(`${LOG_PREFIX} Plugin disabled`);

    await notificationService.notify({
      title: 'Nav Tags',
      body: 'Navigation par tags désactivée',
    });
  },

  async onUninstall() {
    console.log(`${LOG_PREFIX} Plugin uninstalled`);
  },

  // === Actions ===
  actions: [
    {
      id: 'refresh-tags',
      label: '🔄 Actualiser les tags',
      icon: 'ArrowSyncRegular',
      context: 'global',
      onClick: async () => {
        try {
          console.log(`${LOG_PREFIX} Refreshing tags...`);

          const tags = await getAllTags();
          const settings = navTagsPlugin.settings as NavTagsSettings;
          const sorted = sortTags(tags, settings);

          console.log(`${LOG_PREFIX} Found ${sorted.length} tags:`,
            sorted.slice(0, 5).map(t => `${t.name} (${t.count})`).join(', ')
          );

          await notificationService.notify({
            title: 'Nav Tags',
            body: `${sorted.length} tags actualisés`,
          });
        } catch (error) {
          console.error(`${LOG_PREFIX} Failed to refresh:`, error);

          await notificationService.notify({
            title: 'Nav Tags',
            body: `Erreur: ${error}`,
          });
        }
      },
    },
    {
      id: 'view-tag-stats',
      label: '📊 Statistiques des tags',
      icon: 'ChartMultipleRegular',
      context: 'global',
      onClick: async () => {
        try {
          const stats = await getTagStats();

          const message = `
📊 STATISTIQUES DES TAGS

Total de tags: ${stats.totalTags}
Total de livres: ${stats.totalBooks}
Moyenne: ${stats.averageBooksPerTag} livres/tag
${stats.mostUsedTag ? `\nTag le plus utilisé:\n${stats.mostUsedTag.name} (${stats.mostUsedTag.count} livres)` : ''}
          `.trim();

          alert(message);

          console.log(`${LOG_PREFIX} Tag stats:`, stats);
        } catch (error) {
          console.error(`${LOG_PREFIX} Failed to get stats:`, error);

          await notificationService.notify({
            title: 'Nav Tags',
            body: `Erreur: ${error}`,
          });
        }
      },
    },
    {
      id: 'toggle-sort',
      label: '🔀 Changer le tri',
      icon: 'ArrowSortRegular',
      context: 'settings',
      onClick: async function () {
        const settings = navTagsPlugin.settings as NavTagsSettings;

        // Toggle sort mode
        settings.sortBy = settings.sortBy === 'alphabetical' ? 'count' : 'alphabetical';

        const sortLabel = settings.sortBy === 'alphabetical'
          ? 'alphabétique'
          : 'par nombre';

        console.log(`${LOG_PREFIX} Sort changed to: ${settings.sortBy}`);

        await notificationService.notify({
          title: 'Nav Tags',
          body: `Tri: ${sortLabel}`,
        });
      },
    },
    {
      id: 'toggle-empty-tags',
      label: '👁️ Afficher/masquer tags vides',
      icon: 'EyeRegular',
      context: 'settings',
      onClick: async function () {
        const settings = navTagsPlugin.settings as NavTagsSettings;

        settings.showEmptyTags = !settings.showEmptyTags;

        console.log(`${LOG_PREFIX} Show empty tags: ${settings.showEmptyTags}`);

        await notificationService.notify({
          title: 'Nav Tags',
          body: settings.showEmptyTags
            ? 'Tags vides affichés'
            : 'Tags vides masqués',
        });
      },
    },
  ],

  // === Menu Items ===
  menuItems: [
    {
      id: 'open-tags',
      label: '🏷️ Ouvrir la navigation par tags',
      icon: 'TagRegular',
      action: async () => {
        await notificationService.notify({
          title: 'Nav Tags',
          body: 'Consultez la sidebar pour voir tous les tags',
        });
      },
    },
    {
      id: 'view-all-tags',
      label: '📋 Liste complète des tags',
      icon: 'ListRegular',
      action: async () => {
        try {
          const tags = await getAllTags();
          const settings = navTagsPlugin.settings as NavTagsSettings;
          const sorted = sortTags(tags, settings);

          const tagList = sorted
            .slice(0, 20)
            .map(tag => `  • ${tag.name} (${tag.count})`)
            .join('\n');

          const message = sorted.length > 0
            ? `📋 TAGS (${sorted.length} total)\n\n${tagList}${sorted.length > 20 ? '\n\n... et plus' : ''}`
            : 'Aucun tag trouvé';

          alert(message);
        } catch (error) {
          await notificationService.notify({
            title: 'Nav Tags',
            body: `Erreur: ${error}`,
          });
        }
      },
    },
  ],
};

export default navTagsPlugin;
