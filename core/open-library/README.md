# Open Library Plugin

Automatically enriches your ebook metadata with information from [Open Library](https://openlibrary.org), including descriptions, covers, publishers, subjects, and more.

## Features

- **Automatic Metadata Enrichment**: Fetch comprehensive book information from Open Library's extensive database
- **ISBN Lookup**: Prefer ISBN-based searches for more accurate results
- **Title/Author Search**: Fallback to title and author search when ISBN is unavailable
- **Cover Images**: Download high-quality book covers in multiple sizes (S, M, L)
- **Subject Tags**: Automatically add relevant subjects as tags to your books
- **Batch Processing**: Enrich your entire library with a single action
- **Rate Limiting**: Built-in delays to respect Open Library's API usage policies

## Enriched Metadata

The plugin can fetch and update the following metadata fields:

- **Description**: Book synopsis and overview
- **Publisher**: Publishing company name
- **Publish Date**: Original publication date
- **Cover Image**: High-quality cover artwork
- **Page Count**: Number of pages
- **ISBN-13 & ISBN-10**: International Standard Book Numbers
- **Subjects**: Genre and topic tags (up to 10 by default)

## Settings

- **enabled**: Enable/disable automatic metadata enrichment
- **autoEnrich**: Automatically enrich books when imported (future feature)
- **preferISBN**: Prefer ISBN lookup over title/author search (more accurate)
- **maxSubjects**: Maximum number of subject tags to fetch (default: 10)
- **coverSize**: Cover image size - S (Small), M (Medium), or L (Large)

## Actions

### Enrich with Open Library (Book Context)
Right-click on any book and select "Enrich with Open Library" to fetch metadata for that specific book.

### Enrich All Books (Library Context)
From the library view, click "Enrich All Books" to process your entire collection. This action:
- Processes all books in your library
- Respects rate limits (1 second delay between requests)
- Shows progress notifications
- Reports success/failure statistics

## API Information

This plugin uses the official Open Library API:
- **Search API**: `https://openlibrary.org/search.json`
- **Books API**: `https://openlibrary.org/books/{id}.json`
- **ISBN API**: `https://openlibrary.org/isbn/{isbn}.json`
- **Covers API**: `https://covers.openlibrary.org/b/id/{id}-{size}.jpg`

**Rate Limiting**: The plugin includes built-in delays (1 second between requests) to respect Open Library's usage policies.

## Usage Tips

1. **For best results**: Ensure your books have accurate ISBNs in their metadata
2. **Manual enrichment**: Use the book context action for individual books
3. **Batch processing**: Use "Enrich All Books" for your entire library (be patient, this respects rate limits)
4. **Cover quality**: Use "L" (Large) size for best quality covers
5. **Subject tags**: Adjust `maxSubjects` to control how many tags are added to each book

## Example Workflow

1. Import your ebook collection into Stomy
2. Enable the Open Library plugin
3. Right-click on a book → "Enrich with Open Library"
4. Review the enriched metadata (description, cover, tags, etc.)
5. For bulk operations: Use "Enrich All Books" from the library view

## Troubleshooting

**No results found**:
- Verify the book title and author are correct
- Try adjusting the ISBN if available
- Some obscure books may not be in Open Library's database

**Missing covers**:
- Not all books have cover images in Open Library
- Try different cover sizes in settings

**Slow enrichment**:
- Rate limiting is intentional to respect API usage policies
- Large libraries will take time to process (1 book per second)

## API Reference

Open Library provides a free, open API with no authentication required. Learn more:
- [Open Library API Documentation](https://openlibrary.org/developers/api)
- [Search API](https://openlibrary.org/dev/docs/api/search)
- [Books API](https://openlibrary.org/dev/docs/api/books)
- [Covers API](https://openlibrary.org/dev/docs/api/covers)

## Version History

- **1.0.0**: Initial release with ISBN lookup, search, and batch enrichment
