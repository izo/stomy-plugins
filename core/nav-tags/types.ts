/**
 * Types for Nav Tags Plugin
 */

export interface NavTagsSettings {
  // Show tag count in sidebar
  showTagCount: boolean;
  // Sort tags alphabetically or by count
  sortBy: 'alphabetical' | 'count';
  // Show tags with 0 books
  showEmptyTags: boolean;
  // Default selected tag on load
  defaultTag?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  count: number;
}

export interface TagStats {
  totalTags: number;
  totalBooks: number;
  averageBooksPerTag: number;
  mostUsedTag?: Tag;
}
