# Stomy Plugins

This repository contains core plugins for [Stomy](https://github.com/izo/Stomy), the cross-platform ebook management application for macOS, Windows, and Linux.

## Available Plugins

### 📚 Plugin Documentation (dummy-plugin)
**Reference plugin and complete documentation.** Contains:
- **PLUGIN_SPEC.md**: Complete API specifications and interface documentation
- **DEVELOPMENT_GUIDE.md**: Step-by-step guide for creating plugins
- **EXAMPLES.md**: 8 complete plugin examples ready to copy
- **BEST_PRACTICES.md**: Code quality, performance, and security guidelines
- Interactive demo actions showcasing all plugin features

This is the **single source of truth** for plugin development. Start here!

### 📊 CSV Export
Export your entire library to a CSV file with all book metadata including title, author, series, format, and file paths. Perfect for backups or external analysis.

### 🏷️ Nav Tags
**NEW!** Navigation by tags in the sidebar. Features:
- Dedicated purple sidebar tab showing all library tags
- Sub-tabs for each tag to filter content
- Tag statistics (total, average, most used)
- Flexible sorting (alphabetical or by popularity)
- Configurable display options

### 📱 Kobo Sync
**Enabled by default.** Synchronize your ebook library with Kobo e-reader devices via USB. Features:
- Automatic Kobo device detection
- Native support for EPUB, PDF, MOBI, CBZ formats
- Smart sync with duplicate detection
- Device storage monitoring

### 📱 Kindle Sync
Synchronize your ebook library with Amazon Kindle devices via USB. Features:
- Automatic Kindle device detection
- EPUB to MOBI conversion using iepub library
- Support for all Kindle models with USB mass storage
- Configurable conversion settings

### 📄 EPUB to PDF
Convert EPUB files to PDF format directly from Stomy. Features:
- Right-click context menu integration
- Batch conversion of multiple books
- Uses Calibre or Pandoc for high-quality conversion
- Flexible output location (desktop, custom folders)
- Configurable page size, margins, and quality settings
- Preserves images, TOC, and formatting

### 🧪 Fake Sync
Development plugin for testing sync functionality without real devices. Features:
- Simulates Kobo, Kindle, and USB devices
- 12 realistic e-reader models
- Configurable sync delays and failure rates
- Progress tracking and device detection simulation

### 🐛 Bug Tracker
Internal tool for reporting bugs with automatic system context collection. Features:
- Red sidebar tab for quick access
- Automatic system info collection (OS, browser, screen)
- Screenshot capture with html2canvas
- GitHub Issues integration via CLI
- Context-aware bug reports

## Plugin Development Guide

### Plugin Structure

Each plugin is a directory containing:
```
my-plugin/
├── index.ts          # Plugin implementation
└── manifest.json     # Plugin metadata (optional)
```

### Basic Plugin Example

```typescript
import type { Plugin } from '../types';

export const myPlugin: Plugin = {
  // Unique identifier (use kebab-case)
  id: 'my-plugin',

  // Display name
  name: 'My Plugin',

  // Short description
  description: 'Does something useful',

  // Version (semver)
  version: '1.0.0',

  // Author information
  author: 'Your Name',

  // Optional repository URL
  repository: 'https://github.com/user/plugin',

  // Optional icon from Fluent UI System Icons
  icon: 'PuzzlePieceRegular',

  // Initial enabled state
  enabled: false,

  // Custom actions shown in UI
  actions: [
    {
      id: 'do-something',
      label: 'Do Something',
      icon: 'Play',
      onClick: async () => {
        // Your action code here
        console.log('Action executed!');
      },
    },
  ],

  // Lifecycle hooks
  onInstall: async () => {
    console.log('Plugin installed');
  },

  onEnable: async () => {
    console.log('Plugin enabled');
  },

  onDisable: async () => {
    console.log('Plugin disabled');
  },

  onUninstall: async () => {
    console.log('Plugin uninstalled');
  },

  onUpdate: async (oldVersion: string, newVersion: string) => {
    console.log(\`Updated from \${oldVersion} to \${newVersion}\`);
  },
};
```

### Plugin API Types

#### Plugin Interface

```typescript
interface Plugin {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Short description
  version: string;               // Semver version
  author: string;                // Author name
  repository?: string;           // Git repository URL
  updateUrl?: string;            // Update check URL
  icon?: string;                 // Fluent UI System Icon name
  enabled: boolean;              // Enabled state
  settings?: Record<string, any>; // Custom settings
  actions?: PluginAction[];      // Custom actions

  // Lifecycle hooks (all optional)
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
  onUpdate?: (oldVersion: string, newVersion: string) => Promise<void>;
}
```

#### PluginAction Interface

```typescript
interface PluginAction {
  id: string;           // Unique action ID
  label: string;        // Button label
  icon?: string;        // Fluent UI System Icon name
  onClick: () => void | Promise<void>; // Action handler
}
```

### Accessing Services

Plugins can access Stomy services:

```typescript
import { dbService } from '@/services';
import { notificationService } from '@/services';

// Database operations
const books = await dbService.getAllBooks();

// System notifications
await notificationService.show({
  title: 'Plugin Action',
  body: 'Action completed successfully',
});
```

### Plugin Settings

Plugins can store custom settings:

```typescript
export const myPlugin: Plugin = {
  // ...
  settings: {
    apiKey: '',
    enabled: true,
    customValue: 'default',
  },
};

// Access settings via PluginManager
import { pluginManager } from '@/plugins';

const settings = pluginManager.getPluginSettings('my-plugin');
await pluginManager.setPluginSettings('my-plugin', {
  apiKey: 'new-key',
});
```

Settings are automatically persisted to the SQLite database.

### Plugin Events

Listen to plugin system events:

```typescript
import { pluginManager } from '@/plugins';

// Listen for plugin events
pluginManager.on('plugin:enabled', (data) => {
  console.log(\`Plugin \${data.pluginId} was enabled\`);
});

pluginManager.on('plugin:disabled', (data) => {
  console.log(\`Plugin \${data.pluginId} was disabled\`);
});

// Available events:
// - plugin:registered
// - plugin:unregistered
// - plugin:enabled
// - plugin:disabled
// - plugin:updated
// - plugin:error
```

### Best Practices

1. **Use descriptive IDs**: Use kebab-case for plugin IDs (e.g., \`csv-export\`)
2. **Semantic versioning**: Follow semver for version numbers
3. **Error handling**: Always wrap async operations in try-catch
4. **Clean up**: Use \`onDisable\`/\`onUninstall\` to clean up resources
5. **Minimal dependencies**: Keep plugins lightweight
6. **Type safety**: Use TypeScript for type checking
7. **User feedback**: Show notifications for long operations

### Icons

Plugins can use any icon from [Fluent UI System Icons](https://react.fluentui.dev/?path=/docs/icons-catalog--docs):

```typescript
icon: 'DocumentTableRegular'    // For CSV plugin
icon: 'ArrowDownloadRegular'    // For export functionality
icon: 'ArrowUploadRegular'      // For import functionality
icon: 'PuzzlePieceRegular'      // Generic plugin icon
icon: 'BugRegular'              // For bug/debug plugins
icon: 'BookOpenRegular'         // For book-related features
```

**Note**: Use `Regular` variant for default state and `Filled` for active/selected states.

### Testing Plugins

1. Add your plugin to this repository
2. Import it in \`src/plugins/index.ts\`:
   \`\`\`typescript
   import { myPlugin } from './core/my-plugin';

   export async function initializePlugins(): Promise<void> {
     await pluginManager.initialize();
     await pluginManager.registerPlugin(myPlugin);
     // ... other plugins
   }
   \`\`\`
3. Run Stomy in development mode: \`npm run tauri:dev\`
4. Navigate to Settings > Plugins
5. Enable your plugin and test its functionality

### Publishing Plugins

1. **Fork this repository**
2. **Create a new directory** in the root for your plugin
3. **Implement your plugin** following the structure above
4. **Test thoroughly** in development mode
5. **Submit a pull request** with:
   - Plugin code
   - README with usage instructions
   - Screenshots (if applicable)

### Plugin Review Guidelines

Pull requests for new plugins will be reviewed for:
- **Code quality**: Clean, well-documented TypeScript
- **Security**: No malicious code or security vulnerabilities
- **Functionality**: Works as described, handles errors gracefully
- **UI/UX**: Follows Stomy design patterns
- **Performance**: Doesn't negatively impact app performance

## Core Plugin Maintenance

This repository is maintained by the Stomy team. Core plugins are:
- Thoroughly tested
- Maintained with app updates
- Automatically loaded by default
- Available to all users

## Support

For questions or issues:
- **Plugin development**: Open an issue in this repository
- **Stomy bugs**: Open an issue in [main repository](https://github.com/izo/Stomy/issues)
- **Feature requests**: Discuss in main repository discussions

## License

Same as Stomy - Internal use only.
