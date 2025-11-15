# Kobo Sync - Stomy Library Integration Guide

This document explains how to integrate the Kobo sync plugin with the main Stomy application's database and library service.

## Database Schema Requirements

The Kobo sync plugin expects the following database schema in the main Stomy application:

### 1. Books Table Extensions

Add these columns to your existing `books` table:

```sql
ALTER TABLE books ADD COLUMN readingProgress REAL DEFAULT 0; -- 0-100%
ALTER TABLE books ADD COLUMN readStatus TEXT CHECK(readStatus IN ('unread', 'reading', 'finished')) DEFAULT 'unread';
ALTER TABLE books ADD COLUMN timeSpentReading INTEGER DEFAULT 0; -- seconds
ALTER TABLE books ADD COLUMN lastReadDate TEXT; -- ISO 8601 date string
```

### 2. Annotations Table (NEW)

Create a new table to store highlights and annotations from Kobo:

```sql
CREATE TABLE IF NOT EXISTS annotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bookId INTEGER NOT NULL,
  text TEXT NOT NULL, -- Highlighted text
  note TEXT, -- User's annotation/note
  location REAL, -- Position in book (0-1)
  createdAt TEXT NOT NULL, -- ISO 8601 date string
  type TEXT NOT NULL, -- 'highlight', 'annotation', 'bookmark'
  source TEXT DEFAULT 'kobo', -- Device/app that created this
  FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE
);

CREATE INDEX idx_annotations_bookId ON annotations(bookId);
CREATE INDEX idx_annotations_createdAt ON annotations(createdAt);
```

### 3. Vocabulary Table (NEW)

Create a table to store dictionary lookups:

```sql
CREATE TABLE IF NOT EXISTS vocabulary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,
  context TEXT, -- Book or context where word was looked up
  lookedUpAt TEXT NOT NULL, -- ISO 8601 date string
  source TEXT DEFAULT 'kobo',
  definition TEXT, -- Optional: definition from dictionary
  bookId INTEGER, -- Optional: link to book
  FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE SET NULL
);

CREATE INDEX idx_vocabulary_word ON vocabulary(word);
CREATE INDEX idx_vocabulary_lookedUpAt ON vocabulary(lookedUpAt);
```

## Library Service Methods

The plugin expects these methods in `libraryService`:

### Core Methods (Already Exists)

```typescript
interface LibraryService {
  /**
   * Get all books in library
   */
  getBooks(): Promise<Book[]>;

  /**
   * Update a book's properties
   */
  updateBook(bookId: number, updates: Partial<Book>): Promise<void>;
}
```

### New Methods Required

Add these methods to `libraryService`:

```typescript
interface LibraryService {
  /**
   * Add an annotation/highlight to a book
   */
  addAnnotation(annotation: {
    bookId: number;
    text: string;
    note?: string;
    location: number;
    createdAt: string;
    type: string;
  }): Promise<number>; // Returns annotation ID

  /**
   * Get annotations for a book
   */
  getAnnotations(bookId: number): Promise<Annotation[]>;

  /**
   * Add a vocabulary word
   */
  addVocabulary(word: {
    word: string;
    context?: string;
    lookedUpAt: string;
    bookId?: number;
  }): Promise<number>; // Returns vocabulary ID

  /**
   * Get all vocabulary words
   */
  getVocabulary(options?: {
    limit?: number;
    bookId?: number;
  }): Promise<VocabularyWord[]>;
}
```

### Implementation Examples

#### addAnnotation

```typescript
async addAnnotation(annotation: AnnotationInput): Promise<number> {
  const db = await this.getDatabase();

  const result = await db.run(
    `INSERT INTO annotations (bookId, text, note, location, createdAt, type, source)
     VALUES (?, ?, ?, ?, ?, ?, 'kobo')`,
    [
      annotation.bookId,
      annotation.text,
      annotation.note || null,
      annotation.location,
      annotation.createdAt,
      annotation.type,
    ]
  );

  return result.lastID!;
}
```

#### addVocabulary

```typescript
async addVocabulary(word: VocabularyInput): Promise<number> {
  const db = await this.getDatabase();

  // Check if word already exists (avoid duplicates)
  const existing = await db.get(
    `SELECT id FROM vocabulary WHERE word = ? AND source = 'kobo' LIMIT 1`,
    [word.word]
  );

  if (existing) {
    return existing.id;
  }

  const result = await db.run(
    `INSERT INTO vocabulary (word, context, lookedUpAt, bookId, source)
     VALUES (?, ?, ?, ?, 'kobo')`,
    [
      word.word,
      word.context || null,
      word.lookedUpAt,
      word.bookId || null,
    ]
  );

  return result.lastID!;
}
```

## Book Model Extensions

Update your `Book` TypeScript type/interface:

```typescript
interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  // ... existing fields ...

  // Reading progress fields (NEW)
  readingProgress?: number; // 0-100 percentage
  readStatus?: 'unread' | 'reading' | 'finished';
  timeSpentReading?: number; // in seconds
  lastReadDate?: string; // ISO 8601 date string
}
```

### New Types

```typescript
interface Annotation {
  id: number;
  bookId: number;
  text: string;
  note?: string;
  location: number;
  createdAt: string;
  type: 'highlight' | 'annotation' | 'bookmark' | 'dogear';
  source: string;
}

interface VocabularyWord {
  id: number;
  word: string;
  context?: string;
  lookedUpAt: string;
  source: string;
  definition?: string;
  bookId?: number;
}
```

## Automatic Sync on Device Connection

To trigger automatic sync when a Kobo is connected, you can use a device watcher:

### Option 1: Periodic Polling

```typescript
// In your main app initialization
let lastDeviceCount = 0;

setInterval(async () => {
  const devices = await invoke('detect_kobo_devices');

  // New device connected
  if (devices.length > lastDeviceCount) {
    const koboPlugin = pluginManager.getPlugin('kobo-sync');

    if (koboPlugin && koboPlugin.enabled) {
      // Trigger auto-sync
      await syncReadingProgress(devices[0].path);
    }
  }

  lastDeviceCount = devices.length;
}, 3000); // Check every 3 seconds
```

### Option 2: USB Event Listener (Platform-Specific)

For macOS/Linux, you can use system events:

```rust
// In your Tauri app
use notify::{Watcher, RecursiveMode, watcher};

fn watch_usb_devices() {
    let (tx, rx) = channel();
    let mut watcher = watcher(tx, Duration::from_secs(2)).unwrap();

    watcher.watch("/Volumes", RecursiveMode::NonRecursive).unwrap();

    loop {
        match rx.recv() {
            Ok(event) => {
                // Check if it's a Kobo device
                // Emit event to frontend
                app.emit_all("device-connected", event);
            }
            Err(e) => println!("watch error: {:?}", e),
        }
    }
}
```

Then in TypeScript:

```typescript
import { listen } from '@tauri-apps/api/event';

await listen('device-connected', async (event) => {
  const devices = await invoke('detect_kobo_devices');

  if (devices.length > 0) {
    const koboPlugin = pluginManager.getPlugin('kobo-sync');

    if (koboPlugin?.settings?.syncReadingProgress) {
      await syncReadingProgress(devices[0].path);
    }
  }
});
```

## Conflict Resolution

The plugin uses a simple "Kobo wins" strategy:

- **Reading Progress**: Kobo percentage overwrites Stomy data
- **Read Status**: Kobo status takes precedence
- **Time Spent**: Kobo time is added to existing Stomy time
- **Annotations**: All Kobo annotations are imported (duplicates avoided by checking text + location)

### Alternative: User Choice

For more control, you can prompt the user:

```typescript
async function updateBookProgress(stomyBook: Book, koboBook: KoboBook): Promise<boolean> {
  // Check if there's a conflict
  if (stomyBook.readingProgress && stomyBook.readingProgress !== koboBook.percentRead) {
    const choice = await promptUser({
      title: 'Conflict Detected',
      message: `
        Stomy shows ${stomyBook.title} at ${stomyBook.readingProgress}%
        Kobo shows ${koboBook.percentRead}%
        Which should we keep?
      `,
      options: ['Keep Stomy', 'Use Kobo', 'Keep Both'],
    });

    if (choice === 'Keep Stomy') return false;
    // ... handle other choices
  }

  // No conflict, proceed with update
  // ...
}
```

## Performance Considerations

### Batch Updates

For large libraries, use batch updates:

```typescript
async function syncReadingProgress(devicePath: string): Promise<KoboSyncStats> {
  // ... get data ...

  // Collect all updates
  const updates: Array<{bookId: number, data: Partial<Book>}> = [];

  for (const koboBook of libraryData.books) {
    const stomyBook = matchBook(koboBook, stomyBooks);
    if (stomyBook) {
      updates.push({
        bookId: stomyBook.id,
        data: buildUpdateData(koboBook),
      });
    }
  }

  // Execute as a single transaction
  await libraryService.batchUpdateBooks(updates);
}
```

### Indexing

Ensure proper indexes for fast matching:

```sql
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
```

## Testing

### Unit Tests

```typescript
describe('Kobo Sync', () => {
  it('should match books by ISBN', () => {
    const koboBook = { isbn: '9781234567890', title: 'Test Book' };
    const stomyBooks = [{ id: 1, isbn: '9781234567890', title: 'Test Book' }];

    const match = matchBook(koboBook, stomyBooks);
    expect(match).toBeDefined();
    expect(match.id).toBe(1);
  });

  it('should update reading progress', async () => {
    const stomyBook = { id: 1, readingProgress: 0 };
    const koboBook = { percentRead: 45.5, readStatus: 1 };

    await updateBookProgress(stomyBook, koboBook);

    const updated = await libraryService.getBook(1);
    expect(updated.readingProgress).toBe(45.5);
    expect(updated.readStatus).toBe('reading');
  });
});
```

## Troubleshooting

### Books Not Matching

If books aren't matching:

1. Check ISBN formatting (remove hyphens)
2. Enable fuzzy matching logs
3. Manually inspect `KoboReader.sqlite` for title/author discrepancies

### Annotations Not Importing

1. Check `libraryService.addAnnotation` implementation
2. Verify `annotations` table exists
3. Check foreign key constraints

### Performance Issues

1. Add database indexes (see above)
2. Implement batch updates
3. Limit initial sync to recent books only

## Migration Script

Run this migration when first installing the plugin:

```sql
-- Migration: Kobo Sync v2.0.0

BEGIN TRANSACTION;

-- Add reading progress columns to books
ALTER TABLE books ADD COLUMN readingProgress REAL DEFAULT 0;
ALTER TABLE books ADD COLUMN readStatus TEXT DEFAULT 'unread';
ALTER TABLE books ADD COLUMN timeSpentReading INTEGER DEFAULT 0;
ALTER TABLE books ADD COLUMN lastReadDate TEXT;

-- Create annotations table
CREATE TABLE IF NOT EXISTS annotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bookId INTEGER NOT NULL,
  text TEXT NOT NULL,
  note TEXT,
  location REAL,
  createdAt TEXT NOT NULL,
  type TEXT NOT NULL,
  source TEXT DEFAULT 'kobo',
  FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE
);

CREATE INDEX idx_annotations_bookId ON annotations(bookId);

-- Create vocabulary table
CREATE TABLE IF NOT EXISTS vocabulary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,
  context TEXT,
  lookedUpAt TEXT NOT NULL,
  source TEXT DEFAULT 'kobo',
  bookId INTEGER,
  FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE SET NULL
);

CREATE INDEX idx_vocabulary_word ON vocabulary(word);

COMMIT;
```

## Security Considerations

- **Read-Only Access**: Plugin only reads from Kobo database, never writes
- **SQL Injection**: All queries use parameterized statements
- **File Access**: Limited to Kobo device mount points
- **Data Validation**: All imported data is sanitized before insertion

## Future Enhancements

- **Two-Way Sync**: Write progress from Stomy back to Kobo
- **Conflict UI**: Visual conflict resolution interface
- **Selective Sync**: Choose which books/data to sync
- **Sync History**: Track all sync operations
- **Incremental Sync**: Only sync changes since last sync
