import type { Plugin, PluginAction } from '../../types';
import type {
  OpenLibraryPluginSettings,
  OpenLibrarySearchResult,
  OpenLibraryWork,
  OpenLibraryEdition,
  OpenLibraryAuthor,
  EnrichedMetadata,
} from './types';
import { notificationService } from '@/services/notificationService';
import { libraryService } from '@/services/libraryService';

const OPEN_LIBRARY_API = 'https://openlibrary.org';
const COVERS_API = 'https://covers.openlibrary.org/b';

export class OpenLibraryPlugin implements Plugin {
  id = 'open-library';
  name = 'Open Library';
  version = '1.0.0';
  description =
    'Automatically enriches your ebook metadata with information from Open Library, including descriptions, covers, publishers, and more.';
  author = 'Stomy Team';
  icon = 'BookOpen24Regular';
  enabled = false;

  settings: OpenLibraryPluginSettings = {
    enabled: true,
    autoEnrich: true,
    preferISBN: true,
    maxSubjects: 10,
    coverSize: 'L',
  };

  actions: PluginAction[] = [
    {
      id: 'enrich-metadata',
      label: 'Enrich with Open Library',
      icon: 'ArrowSyncRegular',
      context: 'book',
      onClick: async (data) => {
        if (data?.bookId) {
          await this.enrichBook(data.bookId);
        }
      },
    },
    {
      id: 'enrich-all',
      label: 'Enrich All Books',
      icon: 'ArrowSyncRegular',
      context: 'library',
      onClick: async () => {
        await this.enrichAllBooks();
      },
    },
  ];

  async onEnable(): Promise<void> {
    console.log('[OpenLibrary] Plugin enabled');
    notificationService.show({
      title: 'Open Library Enabled',
      message: 'Metadata enrichment is now active',
      type: 'success',
    });
  }

  async onDisable(): Promise<void> {
    console.log('[OpenLibrary] Plugin disabled');
  }

  /**
   * Enrich a single book with Open Library metadata
   */
  private async enrichBook(bookId: number): Promise<void> {
    try {
      notificationService.show({
        title: 'Enriching Metadata',
        message: 'Fetching information from Open Library...',
        type: 'info',
      });

      const book = await libraryService.getBookById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }

      const metadata = await this.fetchMetadata(
        book.title,
        book.author,
        book.isbn13 || book.isbn10
      );

      if (!metadata) {
        notificationService.show({
          title: 'No Results',
          message: 'Could not find metadata for this book',
          type: 'warning',
        });
        return;
      }

      // Update book with enriched metadata
      await libraryService.updateBook(bookId, {
        description: metadata.description || book.description,
        publisher: metadata.publisher || book.publisher,
        publishDate: metadata.publishDate || book.publishDate,
        coverUrl: metadata.coverUrl || book.coverUrl,
        pageCount: metadata.pageCount || book.pageCount,
        isbn13: metadata.isbn13 || book.isbn13,
        isbn10: metadata.isbn10 || book.isbn10,
      });

      // Add subjects as tags if available
      if (metadata.subjects && metadata.subjects.length > 0) {
        const limitedSubjects = metadata.subjects.slice(
          0,
          this.settings.maxSubjects
        );
        for (const subject of limitedSubjects) {
          await libraryService.addTagToBook(bookId, subject);
        }
      }

      notificationService.show({
        title: 'Metadata Enriched',
        message: `Successfully updated "${book.title}"`,
        type: 'success',
      });
    } catch (error) {
      console.error('[OpenLibrary] Error enriching book:', error);
      notificationService.show({
        title: 'Enrichment Failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'error',
      });
    }
  }

  /**
   * Enrich all books in the library
   */
  private async enrichAllBooks(): Promise<void> {
    try {
      const books = await libraryService.getAllBooks();
      let enriched = 0;
      let failed = 0;

      notificationService.show({
        title: 'Enriching Library',
        message: `Processing ${books.length} books...`,
        type: 'info',
      });

      for (const book of books) {
        try {
          const metadata = await this.fetchMetadata(
            book.title,
            book.author,
            book.isbn13 || book.isbn10
          );

          if (metadata) {
            await libraryService.updateBook(book.id, {
              description: metadata.description || book.description,
              publisher: metadata.publisher || book.publisher,
              publishDate: metadata.publishDate || book.publishDate,
              coverUrl: metadata.coverUrl || book.coverUrl,
              pageCount: metadata.pageCount || book.pageCount,
              isbn13: metadata.isbn13 || book.isbn13,
              isbn10: metadata.isbn10 || book.isbn10,
            });

            if (metadata.subjects && metadata.subjects.length > 0) {
              const limitedSubjects = metadata.subjects.slice(
                0,
                this.settings.maxSubjects
              );
              for (const subject of limitedSubjects) {
                await libraryService.addTagToBook(book.id, subject);
              }
            }

            enriched++;
          }

          // Rate limiting - wait 1 second between requests
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`[OpenLibrary] Failed to enrich "${book.title}":`, error);
          failed++;
        }
      }

      notificationService.show({
        title: 'Enrichment Complete',
        message: `Enriched ${enriched} books, ${failed} failed`,
        type: 'success',
      });
    } catch (error) {
      console.error('[OpenLibrary] Error enriching all books:', error);
      notificationService.show({
        title: 'Enrichment Failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'error',
      });
    }
  }

  /**
   * Fetch metadata from Open Library API
   */
  private async fetchMetadata(
    title: string,
    author?: string,
    isbn?: string
  ): Promise<EnrichedMetadata | null> {
    try {
      // Try ISBN lookup first if available and preferred
      if (isbn && this.settings.preferISBN) {
        const isbnMetadata = await this.fetchByISBN(isbn);
        if (isbnMetadata) return isbnMetadata;
      }

      // Fall back to title/author search
      const searchResults = await this.searchBooks(title, author);
      if (!searchResults || searchResults.length === 0) {
        return null;
      }

      // Use the first result
      const firstResult = searchResults[0];
      return await this.getDetailedMetadata(firstResult);
    } catch (error) {
      console.error('[OpenLibrary] Error fetching metadata:', error);
      return null;
    }
  }

  /**
   * Fetch book by ISBN
   */
  private async fetchByISBN(isbn: string): Promise<EnrichedMetadata | null> {
    try {
      const response = await fetch(
        `${OPEN_LIBRARY_API}/isbn/${isbn}.json`
      );

      if (!response.ok) return null;

      const edition: OpenLibraryEdition = await response.json();
      return await this.parseEdition(edition);
    } catch (error) {
      console.error('[OpenLibrary] ISBN lookup failed:', error);
      return null;
    }
  }

  /**
   * Search for books by title and author
   */
  private async searchBooks(
    title: string,
    author?: string
  ): Promise<OpenLibrarySearchResult[]> {
    try {
      const params = new URLSearchParams();
      params.append('title', title);
      if (author) {
        params.append('author', author);
      }
      params.append('limit', '5');

      const response = await fetch(
        `${OPEN_LIBRARY_API}/search.json?${params.toString()}`
      );

      if (!response.ok) return [];

      const data = await response.json();
      return data.docs || [];
    } catch (error) {
      console.error('[OpenLibrary] Search failed:', error);
      return [];
    }
  }

  /**
   * Get detailed metadata from search result
   */
  private async getDetailedMetadata(
    result: OpenLibrarySearchResult
  ): Promise<EnrichedMetadata | null> {
    try {
      const metadata: EnrichedMetadata = {
        title: result.title,
        author: result.author_name?.[0],
        publisher: result.publisher?.[0],
        subjects: result.subject?.slice(0, this.settings.maxSubjects),
      };

      // Fetch work details if available
      if (result.key) {
        const workResponse = await fetch(
          `${OPEN_LIBRARY_API}${result.key}.json`
        );
        if (workResponse.ok) {
          const work: OpenLibraryWork = await workResponse.json();
          metadata.description = this.extractDescription(work.description);
          metadata.subjects = work.subjects?.slice(0, this.settings.maxSubjects);
        }
      }

      // Add cover URL if available
      if (result.cover_i) {
        metadata.coverUrl = `${COVERS_API}/id/${result.cover_i}-${this.settings.coverSize}.jpg`;
      }

      // Add ISBN if available
      if (result.isbn && result.isbn.length > 0) {
        const isbn = result.isbn[0];
        if (isbn.length === 13) {
          metadata.isbn13 = isbn;
        } else if (isbn.length === 10) {
          metadata.isbn10 = isbn;
        }
      }

      return metadata;
    } catch (error) {
      console.error('[OpenLibrary] Failed to get detailed metadata:', error);
      return null;
    }
  }

  /**
   * Parse edition data into enriched metadata
   */
  private async parseEdition(
    edition: OpenLibraryEdition
  ): Promise<EnrichedMetadata | null> {
    try {
      const metadata: EnrichedMetadata = {
        title: edition.title,
        publisher: edition.publishers?.[0],
        publishDate: edition.publish_date,
        pageCount: edition.number_of_pages,
        isbn13: edition.isbn_13?.[0],
        isbn10: edition.isbn_10?.[0],
        description: this.extractDescription(edition.description),
      };

      // Fetch work details for subjects
      if (edition.works && edition.works.length > 0) {
        const workKey = edition.works[0].key;
        const workResponse = await fetch(`${OPEN_LIBRARY_API}${workKey}.json`);
        if (workResponse.ok) {
          const work: OpenLibraryWork = await workResponse.json();
          metadata.subjects = work.subjects?.slice(0, this.settings.maxSubjects);
          if (!metadata.description) {
            metadata.description = this.extractDescription(work.description);
          }
        }
      }

      // Add cover URL if available
      if (edition.covers && edition.covers.length > 0) {
        metadata.coverUrl = `${COVERS_API}/id/${edition.covers[0]}-${this.settings.coverSize}.jpg`;
      }

      return metadata;
    } catch (error) {
      console.error('[OpenLibrary] Failed to parse edition:', error);
      return null;
    }
  }

  /**
   * Extract description string from various formats
   */
  private extractDescription(
    description?: string | { type: string; value: string }
  ): string | undefined {
    if (!description) return undefined;
    if (typeof description === 'string') return description;
    return description.value;
  }
}
