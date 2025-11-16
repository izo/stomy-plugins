/**
 * Fake Kobo Data Generator
 * Generates realistic Kobo database data for testing and development
 */

import type {
  FakeKoboBook,
  FakeKoboEvent,
  FakeKoboBookmark,
  FakeKoboVocabulary,
  FakeKoboLibraryData,
  FakeKoboReadStatus,
  FakeKoboEventType,
  FakeKoboBookmarkType,
} from './types';

/**
 * Sample book data for realistic simulation
 */
const SAMPLE_BOOKS = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    description: 'A classic novel of the Jazz Age',
    publisher: 'Scribner',
    language: 'en',
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    description: 'A dystopian social science fiction novel',
    publisher: 'Signet Classic',
    language: 'en',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    description: 'A romantic novel of manners',
    publisher: 'Penguin Classics',
    language: 'en',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    description: 'A story of racial injustice and childhood innocence',
    publisher: 'Harper Perennial',
    language: 'en',
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780547928227',
    description: 'A fantasy adventure of a hobbit\'s journey',
    publisher: 'Houghton Mifflin Harcourt',
    language: 'en',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '9780441013593',
    description: 'A science fiction masterpiece',
    publisher: 'Ace',
    language: 'en',
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '9780316769488',
    description: 'A story of teenage rebellion and alienation',
    publisher: 'Little, Brown and Company',
    language: 'en',
  },
];

/**
 * Sample highlights and annotations
 */
const SAMPLE_HIGHLIGHTS = [
  'It was the best of times, it was the worst of times.',
  'All animals are equal, but some animals are more equal than others.',
  'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
  'You never really understand a person until you consider things from his point of view.',
  'In a hole in the ground there lived a hobbit.',
  'The beginning is the most important part of the work.',
  'If you want to keep a secret, you must also hide it from yourself.',
];

/**
 * Sample vocabulary words
 */
const SAMPLE_VOCABULARY = [
  'serendipity',
  'ephemeral',
  'melancholy',
  'nostalgia',
  'ubiquitous',
  'paradigm',
  'eloquent',
  'lucid',
  'pristine',
  'enigmatic',
];

/**
 * Generate a random date within the last N days
 */
function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

/**
 * Generate a random Kobo content ID
 */
function generateContentID(title: string): string {
  const hash = Math.random().toString(36).substring(2, 15);
  return `file:///mnt/onboard/${title.replace(/\s+/g, '_')}_${hash}.kepub.epub`;
}

/**
 * Generate a fake Kobo book with realistic reading progress
 */
export function generateFakeKoboBook(
  bookData: {
    title: string;
    author: string;
    isbn?: string;
    description?: string;
    publisher?: string;
    language?: string;
  },
  readStatus: FakeKoboReadStatus = 1, // Default: Reading
  percentRead?: number
): FakeKoboBook {
  const contentID = generateContentID(bookData.title);

  // Generate realistic reading progress
  let actualPercentRead: number;
  if (percentRead !== undefined) {
    actualPercentRead = percentRead;
  } else {
    switch (readStatus) {
      case 2: // Finished
        actualPercentRead = 100;
        break;
      case 1: // Reading
        actualPercentRead = 5 + Math.random() * 90; // 5-95%
        break;
      default: // Unread
        actualPercentRead = 0;
    }
  }

  // Generate time spent reading (roughly 1 minute per 1% read)
  const timeSpentReading = Math.floor(actualPercentRead * (1 + Math.random() * 2));

  return {
    contentID,
    isbn: bookData.isbn,
    title: bookData.title,
    attribution: bookData.author,
    description: bookData.description,
    publisher: bookData.publisher,
    language: bookData.language || 'en',
    percentRead: actualPercentRead,
    readStatus,
    timeSpentReading,
    dateLastRead: readStatus > 0 ? randomDate(30) : undefined,
    mimeType: 'application/epub+zip',
    contentType: '6', // Regular book
    userID: 'fake-user-001',
  };
}

/**
 * Generate reading events for a book
 */
export function generateFakeKoboEvents(
  book: FakeKoboBook,
  startId: number = 1
): FakeKoboEvent[] {
  const events: FakeKoboEvent[] = [];

  if (book.readStatus === 0) {
    return events; // No events for unread books
  }

  // Start reading event
  events.push({
    id: startId,
    contentID: book.contentID,
    eventType: 3 as FakeKoboEventType, // StartReadingBook
    eventCount: 1,
    lastOccurrence: book.dateLastRead || randomDate(30),
  });

  // Progress milestones
  if (book.percentRead >= 25) {
    events.push({
      id: startId + 1,
      contentID: book.contentID,
      eventType: 1011 as FakeKoboEventType, // Progress25
      eventCount: 1,
      lastOccurrence: randomDate(25),
    });
  }

  if (book.percentRead >= 50) {
    events.push({
      id: startId + 2,
      contentID: book.contentID,
      eventType: 1013 as FakeKoboEventType, // Progress50
      eventCount: 1,
      lastOccurrence: randomDate(20),
    });
  }

  if (book.percentRead >= 75) {
    events.push({
      id: startId + 3,
      contentID: book.contentID,
      eventType: 1014 as FakeKoboEventType, // Progress75
      eventCount: 1,
      lastOccurrence: randomDate(15),
    });
  }

  if (book.readStatus === 2) {
    events.push({
      id: startId + 4,
      contentID: book.contentID,
      eventType: 5 as FakeKoboEventType, // FinishedReadingBook
      eventCount: 1,
      lastOccurrence: book.dateLastRead || randomDate(10),
    });
  }

  return events;
}

/**
 * Generate bookmarks and highlights for a book
 */
export function generateFakeKoboBookmarks(
  book: FakeKoboBook,
  count: number = 0
): FakeKoboBookmark[] {
  const bookmarks: FakeKoboBookmark[] = [];

  // Only generate bookmarks for books that are being read
  if (book.readStatus === 0 || count === 0) {
    return bookmarks;
  }

  const actualCount = count || Math.floor(Math.random() * 5) + 1; // 1-5 bookmarks

  for (let i = 0; i < actualCount; i++) {
    const highlight = SAMPLE_HIGHLIGHTS[Math.floor(Math.random() * SAMPLE_HIGHLIGHTS.length)];
    const hasAnnotation = Math.random() > 0.6;

    bookmarks.push({
      bookmarkID: `bookmark-${book.contentID}-${i + 1}`,
      volumeID: book.contentID,
      contentID: `${book.contentID}#epubcfi(/6/4[chap01ref]!/4[body01]/10[para05])`,
      text: highlight,
      annotation: hasAnnotation ? `My thoughts on: "${highlight.substring(0, 20)}..."` : undefined,
      chapterProgress: Math.random(),
      startContainerPath: `OEBPS/chapter${Math.floor(Math.random() * 10) + 1}.xhtml`,
      startOffset: Math.floor(Math.random() * 1000),
      dateCreated: randomDate(60),
      dateModified: hasAnnotation ? randomDate(40) : undefined,
      type: hasAnnotation ? ('annotation' as FakeKoboBookmarkType) : ('highlight' as FakeKoboBookmarkType),
    });
  }

  return bookmarks;
}

/**
 * Generate vocabulary entries for a book
 */
export function generateFakeKoboVocabulary(
  book: FakeKoboBook,
  count: number = 0
): FakeKoboVocabulary[] {
  const vocabulary: FakeKoboVocabulary[] = [];

  // Only generate vocabulary for books that are being read
  if (book.readStatus === 0 || count === 0) {
    return vocabulary;
  }

  const actualCount = count || Math.floor(Math.random() * 8) + 1; // 1-8 words

  for (let i = 0; i < actualCount; i++) {
    const word = SAMPLE_VOCABULARY[Math.floor(Math.random() * SAMPLE_VOCABULARY.length)];

    vocabulary.push({
      text: word,
      volumeID: book.contentID,
      dateCreated: randomDate(60),
    });
  }

  return vocabulary;
}

/**
 * Generate a complete fake Kobo library with realistic data
 */
export function generateFakeKoboLibrary(options?: {
  bookCount?: number;
  includeBookmarks?: boolean;
  includeVocabulary?: boolean;
}): FakeKoboLibraryData {
  const bookCount = options?.bookCount || Math.floor(Math.random() * 5) + 3; // 3-7 books
  const includeBookmarks = options?.includeBookmarks ?? true;
  const includeVocabulary = options?.includeVocabulary ?? true;

  const books: FakeKoboBook[] = [];
  const events: FakeKoboEvent[] = [];
  const bookmarks: FakeKoboBookmark[] = [];
  const vocabulary: FakeKoboVocabulary[] = [];

  let eventId = 1;

  // Generate books with varied reading statuses
  for (let i = 0; i < Math.min(bookCount, SAMPLE_BOOKS.length); i++) {
    const bookData = SAMPLE_BOOKS[i];

    // Random read status distribution
    let readStatus: FakeKoboReadStatus;
    const rand = Math.random();
    if (rand < 0.1) {
      readStatus = 0; // 10% unread
    } else if (rand < 0.6) {
      readStatus = 1; // 50% reading
    } else {
      readStatus = 2; // 40% finished
    }

    const book = generateFakeKoboBook(bookData, readStatus);
    books.push(book);

    // Generate events
    const bookEvents = generateFakeKoboEvents(book, eventId);
    events.push(...bookEvents);
    eventId += bookEvents.length;

    // Generate bookmarks
    if (includeBookmarks && book.readStatus > 0) {
      const bookBookmarks = generateFakeKoboBookmarks(book, Math.floor(Math.random() * 4));
      bookmarks.push(...bookBookmarks);
    }

    // Generate vocabulary
    if (includeVocabulary && book.readStatus > 0) {
      const bookVocabulary = generateFakeKoboVocabulary(book, Math.floor(Math.random() * 6));
      vocabulary.push(...bookVocabulary);
    }
  }

  return {
    books,
    events,
    bookmarks,
    vocabulary,
    lastSync: new Date().toISOString(),
  };
}

/**
 * Generate reading progress for a specific book by title or ISBN
 */
export function generateFakeKoboProgress(
  title?: string,
  isbn?: string
): FakeKoboBook | null {
  const bookData = SAMPLE_BOOKS.find(
    (b) =>
      (title && b.title.toLowerCase().includes(title.toLowerCase())) ||
      (isbn && b.isbn === isbn)
  );

  if (!bookData) {
    return null;
  }

  return generateFakeKoboBook(bookData, 1, 45 + Math.random() * 50); // 45-95% read
}
