# Kobo Sync Plugin

Plugin for synchronizing ebooks with Kobo e-reader devices via USB connection.

## Features

- 🔍 **Automatic Kobo Detection** - Detects Kobo devices when connected via USB
- 📚 **Native Format Support** - Native support for EPUB, PDF, MOBI, CBZ formats
- ⚡ **Smart Sync** - Only syncs books that aren't already on the device
- 🔄 **Bidirectional Support** - Can import books from Kobo to library
- 📊 **Device Info** - Shows Kobo model, firmware, and storage space
- 📖 **Reading Progress Sync** - Import reading progress from Kobo (percent read, time spent, read status)
- 📝 **Annotations Import** - Extract highlights and annotations from your Kobo
- 📚 **Vocabulary Tracking** - Import dictionary lookups for language learning
- 🗄️ **Database Access** - Full read access to KoboReader.sqlite database
- 📈 **Reading Statistics** - Track your reading habits with detailed events
- 🗂️ **Multi-Library Support** - Organize books by Stomy library (e.g., `/Stomy/Romans/`, `/Stomy/Science/`)

## Supported Devices

All Kobo e-reader models with USB mass storage support:

### 2024-2025 Models
- **Kobo Clara BW** (N365/N365B/P365) - Black & white, repairable
- **Kobo Clara Colour** (N367) - Color Kaleido 3 display
- **Kobo Libra Colour** (N428) - 7" color display

### 2021-2023 Models
- **Kobo Elipsa 2E** (N605) - 10.3" note-taking device
- **Kobo Clara 2E** (N506) - Eco-friendly model
- **Kobo Sage** (N778/N778K) - 8" premium model
- **Kobo Libra 2** (N418) - 7" with physical buttons
- **Kobo Elipsa** (N604) - First gen note-taking

### 2017-2020 Models
- **Kobo Nia** (N306) - Entry-level
- **Kobo Libra H2O** (N873) - Waterproof 7"
- **Kobo Forma** (N782) - 8" large screen
- **Kobo Clara HD** (N249) - Compact 6"

### Legacy Models (2012-2017)
- **Kobo Aura H2O Edition 2** (N867)
- **Kobo Aura ONE** (N709) - First 7.8" model
- **Kobo Aura Edition 2** (N236)
- **Kobo Touch 2.0** (N587)
- **Kobo Glo HD** (N437)
- **Kobo Aura H2O** (N250)
- **Kobo Aura** (N514)
- **Kobo Aura HD** (N204B)
- **Kobo Glo** (N613)
- **Kobo Touch** (N905/N905B/N905C) - Original

**Note:** All models listed support USB Mass Storage and contain the `KoboReader.sqlite` database with reading progress, annotations, and vocabulary data.

**Windows 11 Compatibility:** Some legacy models (Aura Edition 2, Touch 2.0, Glo HD, Aura ONE) may have limited Windows 11 support. macOS and Linux work with all models.

## Supported Formats

### Native Kobo Formats
- **EPUB** - Primary e-book format (fully supported)
- **PDF** - Supported by Kobo without conversion
- **MOBI** - Supported on most Kobo devices
- **CBZ/CBR** - Comic book formats
- **TXT** - Plain text files

## Installation

The plugin is included with Stomy as an optional plugin. To enable it:

1. Open Stomy
2. Go to Settings → Plugins
3. Find "Kobo Sync" in the plugin list
4. Click "Enable" to activate Kobo device support
5. Configure sync settings (reading progress, annotations, vocabulary)

## Usage

### Automatic Synchronization

**When you connect your Kobo via USB**, the plugin automatically:

1. **Detects the device** - Recognizes your Kobo model and storage info
2. **Reads KoboReader.sqlite** - Extracts all reading data from the database
3. **Matches books** - Links Kobo books to your Stomy library (by ISBN, title, author)
4. **Updates your library** - Syncs the following data to Stomy's SQLite database:
   - **Reading Progress** (percentage, time spent)
   - **Read Status** (unread → reading → finished)
   - **Annotations** (highlights and notes)
   - **Vocabulary** (dictionary lookups) _if enabled_
5. **Shows notification** - Displays sync summary (X books updated, Y annotations imported)

### Manual Sync

You can also trigger sync manually:

1. Click "Import Reading Progress from Kobo" in the toolbar
2. Or use the keyboard shortcut (if configured)
3. Watch real-time progress in the notification panel

### Syncing Books to Kobo

1. Select books in your library
2. Click "Sync to Kobo"
3. Books will be copied to the Kobo device
4. Progress will be shown in real-time

### Plugin Settings

**Folder Organization:**
- **Target Folder**: Base folder on Kobo (default: `Stomy`)
- **Use Library Folders**: Create subfolders per library (default: enabled)
  - Enabled: `/Stomy/Romans/`, `/Stomy/Science/`
  - Disabled: `/Stomy/` (all books together)
- **Library Folder Prefix**: Optional prefix for library folders (default: none)

**Sync Options:**
- **Show Notifications**: Display system notifications for sync events (default: enabled)
- **Auto Eject**: Automatically eject device after sync (default: disabled)
- **Sync Metadata**: Sync book metadata to Kobo database (default: enabled)
- **Sync Reading Progress**: Import reading progress from Kobo (default: enabled)
- **Sync Annotations**: Import highlights and annotations (default: enabled)
- **Sync Vocabulary**: Import vocabulary/dictionary lookups (default: disabled)

**📘 Multi-Library Support:**
If you use multiple libraries in Stomy (e.g., "Romans", "Science", "Jeunesse"), books will be organized in separate folders on your Kobo. See [MULTI_LIBRARY.md](./MULTI_LIBRARY.md) for details.

### Reading Progress Features

The plugin can now read data from the Kobo's internal SQLite database (`KoboReader.sqlite`) to import:

#### 📊 Reading Progress Data
- **Percent Read**: Exact reading progress (0-100%)
- **Read Status**: Unread, Reading, or Finished
- **Time Spent Reading**: Total time spent reading each book (in minutes)
- **Last Read Date**: When you last opened the book

#### 📝 Annotations & Highlights
- **Highlights**: Text passages you've marked
- **Annotations**: Your personal notes on passages
- **Location**: Chapter and position in the book
- **Timestamps**: When each highlight/note was created

#### 📚 Vocabulary Words
- **Dictionary Lookups**: Words you've looked up in the Kobo dictionary
- **Context**: Which book you were reading
- **Learning Progress**: Track your vocabulary expansion

#### 📈 Reading Events
- **Reading Milestones**: Automatic tracking at 25%, 50%, 75%, 100%
- **Session History**: Start/stop reading events
- **Reading Patterns**: Analyze your reading habits

### Book Matching Algorithm

The plugin uses intelligent matching to link Kobo books with your Stomy library:

**1. ISBN Match (Most Reliable)** ✅
- Compares ISBN-13 identifiers
- Case-insensitive, ignores hyphens
- 100% accuracy when ISBNs are present

**2. Title + Author Match** ✅
- Exact match on normalized title and author
- Removes punctuation, converts to lowercase
- Very high accuracy (~95%)

**3. Fuzzy Title Match** ⚠️
- Word-based similarity (70% threshold)
- Used when ISBN and exact title fail
- Useful for books with subtitle variations

**Example:**
```
Kobo:  "The Lord of the Rings: The Fellowship of the Ring"
Stomy: "The Fellowship of the Ring (Lord of the Rings #1)"
→ Matched via fuzzy title matching (85% similarity)
```

**Unmatched Books:**
- Books only on Kobo won't be created in Stomy
- Books only in Stomy won't receive Kobo data
- Check logs for matching issues

**Tip:** Add ISBNs to your Stomy books for best results!

## Technical Details

### Backend (Rust)

The plugin uses Rust for performance-critical operations:

- **Device Detection** (`detect_kobo_devices`): Scans `/Volumes` on macOS for Kobo devices
- **File Operations** (`copy_file_to_device`): Efficient file copying to Kobo storage
- **Database Reading** (`get_kobo_library_data`): Reads KoboReader.sqlite database
- **Progress Tracking** (`get_kobo_books`): Extracts reading progress for all books
- **Annotations** (`get_kobo_bookmarks`): Retrieves highlights and notes
- **Events** (`get_kobo_events`): Reads reading activity history
- **Vocabulary** (`get_kobo_vocabulary`): Extracts dictionary lookups

### Frontend (TypeScript)

TypeScript interfaces for:
- Device management
- Sync orchestration
- Settings management

## Limitations

- **macOS Focus**: Currently optimized for macOS (Windows/Linux support planned)
- **USB Connection Required**: No wireless sync support yet
- **No DRM Support**: Cannot sync DRM-protected books

## Troubleshooting

### Kobo Not Detected

1. Ensure Kobo is in USB mass storage mode (not charging only)
2. Check that `/Volumes/KOBOeReader` appears in Finder
3. Try reconnecting the USB cable
4. Restart Stomy

### Books Not Appearing on Kobo

1. Ensure books are in supported formats
2. Restart your Kobo device
3. Check Kobo storage is not full
4. Verify files are not corrupted

## Development

### Adding New Features

The plugin architecture allows easy extensions:

```typescript
// Add a new action
koboPlugin.actions?.push({
  id: 'my-action',
  label: 'My Action',
  icon: 'Star',
  context: 'library',
  onClick: async () => {
    // Your code here
  },
});
```

### Testing

```bash
# Build Rust backend
cd src-tauri
cargo test

# Run Tauri app
npm run tauri dev
```

## API Usage

### Importing Reading Progress

```typescript
import { getKoboLibraryData, formatReadingTime } from './optional/kobo-sync';

// Get all data from connected Kobo
const libraryData = await getKoboLibraryData('/Volumes/KOBOeReader');

// Display books with progress
libraryData.books.forEach(book => {
  console.log(`${book.title} by ${book.attribution}`);
  console.log(`  Progress: ${book.percentRead.toFixed(1)}%`);
  console.log(`  Status: ${book.readStatus === 2 ? 'Finished' : 'Reading'}`);
  console.log(`  Time spent: ${formatReadingTime(book.timeSpentReading)}`);
});

// Display annotations
libraryData.bookmarks.forEach(bookmark => {
  console.log(`"${bookmark.text}"`);
  if (bookmark.annotation) {
    console.log(`  Note: ${bookmark.annotation}`);
  }
});
```

### Checking Progress for Specific Book

```typescript
import { getBookProgress } from './optional/kobo-sync';

// By ISBN
const progress = await getBookProgress(
  '/Volumes/KOBOeReader',
  '9781234567890'
);

// By title
const progress = await getBookProgress(
  '/Volumes/KOBOeReader',
  undefined,
  'The Lord of the Rings'
);

if (progress) {
  console.log(`You're ${progress.percentRead}% through this book!`);
}
```

### Syncing to Stomy Library

```typescript
import { syncReadingProgress } from './optional/kobo-sync';

const stats = await syncReadingProgress(
  '/Volumes/KOBOeReader',
  (stats) => {
    console.log(`Synced: ${stats.booksUpdated} books`);
  }
);

console.log(`Total: ${stats.booksFound} books found`);
console.log(`Progress synced: ${stats.progressSynced}`);
console.log(`Annotations: ${stats.annotationsSynced}`);
```

## Database Schema

The Kobo database (`KoboReader.sqlite`) contains these key tables:

### `content` - Book metadata and progress
- `ContentID` - Unique identifier
- `Title`, `Attribution`, `ISBN` - Book info
- `___PercentRead` - Reading progress (0-100)
- `ReadStatus` - 0=Unread, 1=Reading, 2=Finished
- `TimeSpentReading` - Minutes
- `DateLastRead` - ISO timestamp

### `Bookmark` - Highlights and annotations
- `BookmarkID` - Unique identifier
- `Text` - Highlighted text
- `Annotation` - User's note
- `DateCreated` - Timestamp
- `Type` - highlight, annotation, bookmark

### `Event` - Reading activity
- `Type` - 3=Start, 5=Finish, 1011-1014=Progress
- `ContentID` - Book reference
- `LastOccurrence` - Timestamp

### `WordList` - Dictionary lookups
- `Text` - Word looked up
- `VolumeID` - Book reference
- `DateCreated` - Timestamp

## Integration

See [INTEGRATION.md](./INTEGRATION.md) for detailed instructions on integrating the Rust backend into your Stomy application.

## Roadmap

- [x] Reading progress sync
- [x] Annotations and highlights import
- [x] Vocabulary tracking
- [x] Reading events and statistics
- [ ] Windows and Linux compatibility
- [ ] Wireless sync via Kobo WiFi
- [ ] Batch sync UI
- [ ] Collection/shelf sync
- [ ] Cover image optimization
- [ ] Write support (sync progress back to Kobo)

## License

Part of Stomy - see main LICENSE file.

## Credits

- Built with [Tauri](https://tauri.app/)
- Icons from [Lucide](https://lucide.dev/)
