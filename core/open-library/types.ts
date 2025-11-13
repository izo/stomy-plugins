export interface OpenLibraryPluginSettings {
  enabled: boolean;
  autoEnrich: boolean;
  preferISBN: boolean;
  maxSubjects: number;
  coverSize: 'S' | 'M' | 'L';
}

export interface OpenLibrarySearchResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  publisher?: string[];
  subject?: string[];
}

export interface OpenLibraryWork {
  key: string;
  title: string;
  description?: string | { type: string; value: string };
  covers?: number[];
  subjects?: string[];
  authors?: Array<{ author: { key: string } }>;
  first_publish_date?: string;
}

export interface OpenLibraryEdition {
  key: string;
  title: string;
  isbn_13?: string[];
  isbn_10?: string[];
  publishers?: string[];
  publish_date?: string;
  number_of_pages?: number;
  covers?: number[];
  description?: string | { type: string; value: string };
  authors?: Array<{ key: string }>;
  works?: Array<{ key: string }>;
}

export interface OpenLibraryAuthor {
  key: string;
  name: string;
  bio?: string | { type: string; value: string };
  birth_date?: string;
  death_date?: string;
  photos?: number[];
}

export interface EnrichedMetadata {
  title?: string;
  author?: string;
  description?: string;
  publisher?: string;
  publishDate?: string;
  coverUrl?: string;
  subjects?: string[];
  pageCount?: number;
  isbn13?: string;
  isbn10?: string;
}
