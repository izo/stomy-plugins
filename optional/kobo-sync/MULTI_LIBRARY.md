# Multi-Library Support for Kobo Sync

The Kobo Sync plugin supports Stomy's multi-library feature by creating separate folders for each library on your Kobo device.

## Overview

When you have multiple libraries in Stomy (e.g., "Romans", "Science", "Jeunesse"), the plugin can organize books in separate folders on your Kobo:

```
/Volumes/KOBOeReader/
└── Stomy/                  ← Base folder (configurable)
    ├── Romans/             ← Library 1
    │   ├── livre1.epub
    │   └── livre2.epub
    ├── Science/            ← Library 2
    │   ├── livre3.epub
    │   └── livre4.epub
    └── Jeunesse/           ← Library 3
        └── livre5.epub
```

## Configuration

### Plugin Settings

**targetFolder** (default: `"Stomy"`)
- Base folder on your Kobo where all books will be synced
- Examples: `"Stomy"`, `"Books"`, `"MyLibrary"`

**useLibraryFolders** (default: `true`)
- When enabled, creates a subfolder for each Stomy library
- When disabled, all books go in the base folder

**libraryFolderPrefix** (default: `""`)
- Optional prefix for library folder names
- Example: `"Lib-"` creates folders like `Stomy/Lib-Romans/`

### Example Configurations

#### Configuration 1: Separate Folders (Default)
```typescript
{
  targetFolder: "Stomy",
  useLibraryFolders: true,
  libraryFolderPrefix: ""
}
```

Result on Kobo:
```
/Stomy/
├── Romans/
├── Science/
└── Jeunesse/
```

#### Configuration 2: With Prefix
```typescript
{
  targetFolder: "Stomy",
  useLibraryFolders: true,
  libraryFolderPrefix: "Lib-"
}
```

Result on Kobo:
```
/Stomy/
├── Lib-Romans/
├── Lib-Science/
└── Lib-Jeunesse/
```

#### Configuration 3: All Books Together
```typescript
{
  targetFolder: "Stomy",
  useLibraryFolders: false
}
```

Result on Kobo:
```
/Stomy/
├── livre1.epub
├── livre2.epub
├── livre3.epub
├── livre4.epub
└── livre5.epub
```

#### Configuration 4: Custom Base Folder
```typescript
{
  targetFolder: "MaCollection",
  useLibraryFolders: true,
  libraryFolderPrefix: ""
}
```

Result on Kobo:
```
/MaCollection/
├── Romans/
├── Science/
└── Jeunesse/
```

## How It Works

### Syncing TO Kobo (Stomy → Kobo)

When you sync books from a Stomy library to your Kobo:

1. **Plugin detects current library**
   - Gets library name from Stomy (e.g., "Romans")

2. **Calculates target folder**
   ```typescript
   const targetFolder = getLibraryFolderPath(devicePath, settings, libraryName);
   // Example result: "/Volumes/KOBOeReader/Stomy/Romans"
   ```

3. **Creates library folder if needed**
   - Folder is created automatically on first sync
   - Sanitizes folder name (removes special characters)

4. **Copies books to folder**
   - Each book goes to its library's folder
   - Books from different libraries stay separated

### Syncing FROM Kobo (Kobo → Stomy)

When importing reading progress from Kobo:

1. **Plugin reads KoboReader.sqlite**
   - Gets all books with reading progress
   - Books can be anywhere on the Kobo (any folder)

2. **Matches books to Stomy libraries**
   - Uses ISBN, title, or author matching
   - Links each Kobo book to its Stomy counterpart
   - **Note:** The Kobo folder structure doesn't matter for reading progress import

3. **Updates Stomy database**
   - Reading progress is imported per book
   - Updates the correct library in Stomy

**Important:** Reading progress import works regardless of folder structure on Kobo, because it reads from `KoboReader.sqlite` which tracks all books.

## API Usage

### Syncing a Book to a Specific Library

```typescript
import { syncBookToKobo } from './optional/kobo-sync';

// Sync a book from the "Romans" library
await syncBookToKobo(
  '/path/to/book.epub',          // Book file path
  'Le Seigneur des Anneaux.epub', // Filename
  '/Volumes/KOBOeReader',         // Kobo device path
  pluginSettings,                 // Plugin settings
  'Romans'                        // Library name
);

// Result: Book copied to /Volumes/KOBOeReader/Stomy/Romans/
```

### Getting Target Folder for a Library

```typescript
import { getLibraryFolderPath } from './optional/kobo-sync';

const targetPath = getLibraryFolderPath(
  '/Volumes/KOBOeReader',
  pluginSettings,
  'Science'
);
// Returns: "/Volumes/KOBOeReader/Stomy/Science"
```

### Syncing Multiple Libraries

```typescript
const libraries = [
  { id: '1', name: 'Romans', books: [...] },
  { id: '2', name: 'Science', books: [...] },
  { id: '3', name: 'Jeunesse', books: [...] },
];

for (const library of libraries) {
  for (const book of library.books) {
    await syncBookToKobo(
      book.filePath,
      book.filename,
      devicePath,
      settings,
      library.name  // ← Library name for folder organization
    );
  }
}
```

## Reading Progress Import

Reading progress import from Kobo works **independently of folder structure**:

```typescript
import { syncReadingProgress } from './optional/kobo-sync';

// Import progress from all books on Kobo
const stats = await syncReadingProgress(devicePath);

// Stats will show:
// - Total books found on Kobo (all folders)
// - Books matched to Stomy libraries
// - Progress synced per library
```

The plugin:
1. Reads `KoboReader.sqlite` (has ALL books regardless of folder)
2. Matches each Kobo book to Stomy books (by ISBN/title/author)
3. Updates reading progress in the correct Stomy library

## Folder Name Sanitization

Library names are sanitized before creating folders:

```typescript
// Original library name → Sanitized folder name
"Romans & Fantasy"  → "Romans - Fantasy"
"Science/Fiction"   → "Science-Fiction"
"Jeunesse (6-12)"   → "Jeunesse -6-12-"
"Études: Philo"     → "Études- Philo"
```

Characters replaced: `/` `\` `:` `*` `?` `"` `<` `>` `|` → `-`

## Benefits

### Organization
- Clear separation between different types of books
- Easy to navigate on Kobo
- Mirrors your Stomy library structure

### Selective Sync
- Sync only specific libraries to Kobo
- Useful if you don't want all your books on your device
- Example: Sync "Currently Reading" library only

### No Name Conflicts
- Books with same name in different libraries won't conflict
- Each library has its own namespace

### Kobo Collections Integration
- Some Kobo models can create collections from folder structure
- Your library folders become Kobo collections automatically

## Limitations

### Kobo Firmware
- Not all Kobo models show folder structure in the UI
- Some show all books in a flat list regardless of folders
- Folders still work for organization and file management

### Reading Progress Import
- Reading progress is per-book, not per-folder
- A book moved between folders on Kobo keeps its progress
- Stomy links progress by book metadata, not folder

### Maximum Path Length
- Very long library names may be truncated
- Windows/macOS have path length limits (~255 characters)
- Use reasonable library names (< 50 characters recommended)

## Migration from v1.0

If you used kobo-sync v1.0 (which synced to `.kobo` folder), here's how to migrate:

### Option 1: Keep Old Structure
```typescript
{
  targetFolder: ".kobo",
  useLibraryFolders: false
}
```
Your books stay in `.kobo/` folder as before.

### Option 2: Move to New Structure
1. Enable `useLibraryFolders: true`
2. Set `targetFolder: "Stomy"`
3. Re-sync all your libraries
4. Old books in `.kobo/` can be deleted manually

### Option 3: Gradual Migration
1. Keep `targetFolder: ".kobo"` temporarily
2. Enable `useLibraryFolders: true`
3. New syncs go to `.kobo/LibraryName/`
4. Old books stay in `.kobo/` root
5. Manually move books or re-sync as needed

## Troubleshooting

### Books Not Found in Correct Folder

**Issue:** Books appear in wrong library folder on Kobo

**Solution:**
- Check that you're passing the correct `libraryName` parameter
- Verify `useLibraryFolders` is enabled in settings
- Check Kobo has enough space for new folders

### Folder Not Created

**Issue:** Library folder not created on Kobo

**Solution:**
- Ensure Kobo is mounted with write permissions
- Check base folder (`targetFolder`) exists and is writable
- Try creating folder manually to test permissions

### Progress Not Importing

**Issue:** Reading progress not updating in Stomy

**Solution:**
- Reading progress import doesn't depend on folder structure
- Check that books are properly matched (ISBN/title/author)
- Verify `syncReadingProgress` is enabled in settings
- Check Stomy database has necessary columns (see LIBRARY_INTEGRATION.md)

### Library Name Contains Special Characters

**Issue:** Folder name looks weird (e.g., `Science-Fiction` instead of `Science/Fiction`)

**Explanation:** Special characters are replaced with `-` for filesystem compatibility

**Solution:**
- Rename library in Stomy to avoid special characters
- Or use `libraryFolderPrefix` to add a cleaner prefix

## Best Practices

### Library Naming
- Use simple names: "Romans", "Science", "Jeunesse"
- Avoid special characters: `/`, `\`, `:`, etc.
- Keep names short (< 30 characters)
- Use title case for better readability

### Folder Organization
- Use `targetFolder: "Stomy"` to avoid conflicts with Kobo system folders
- Enable `useLibraryFolders: true` for better organization
- Leave `libraryFolderPrefix` empty unless you need it

### Syncing Strategy
- Sync frequently-read libraries regularly
- Archive libraries can be synced less often
- Consider selective sync for large libraries

## Examples

### Example 1: Academic User

```typescript
// Settings
{
  targetFolder: "Academic",
  useLibraryFolders: true,
  libraryFolderPrefix: ""
}

// Libraries
- Research Papers
- Textbooks
- Articles

// Result on Kobo
/Academic/
├── Research Papers/
├── Textbooks/
└── Articles/
```

### Example 2: Fiction Reader

```typescript
// Settings
{
  targetFolder: "Books",
  useLibraryFolders: true,
  libraryFolderPrefix: ""
}

// Libraries
- SciFi
- Fantasy
- Mystery
- Romance

// Result on Kobo
/Books/
├── SciFi/
├── Fantasy/
├── Mystery/
└── Romance/
```

### Example 3: Family Device

```typescript
// Settings
{
  targetFolder: "Family",
  useLibraryFolders: true,
  libraryFolderPrefix: ""
}

// Libraries
- Dad
- Mom
- Kids

// Result on Kobo
/Family/
├── Dad/
├── Mom/
└── Kids/
```

## Future Enhancements

- [ ] Auto-detect library from folder when importing
- [ ] Selective library sync UI (checkboxes per library)
- [ ] Sync presets (e.g., "Currently Reading only")
- [ ] Smart folder suggestions based on book metadata
- [ ] Collection mapping (Kobo collections ↔ Stomy libraries)
