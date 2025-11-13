# Kindle Sync Plugin

Plugin for synchronizing ebooks with Amazon Kindle devices via USB connection.

## Features

- 🔍 **Automatic Kindle Detection** - Detects Kindle devices when connected via USB
- 📚 **Format Conversion** - Converts EPUB files to MOBI format automatically
- ⚡ **Smart Sync** - Only syncs books that aren't already on the device
- 🔄 **Bidirectional Support** - Can import books from Kindle to library
- 📊 **Device Info** - Shows Kindle model, firmware, and storage space

## Supported Devices

All Kindle models with USB mass storage support:
- Kindle Paperwhite (all generations)
- Kindle Oasis
- Kindle Scribe
- Kindle Basic
- Older Kindle models

## Supported Formats

### Native Kindle Formats
- **MOBI** - Legacy Kindle format (fully supported)
- **AZW3** - Modern Kindle format (planned)
- **PDF** - Supported by Kindle without conversion

### Converted Formats
- **EPUB** → **MOBI** - Automatic conversion using `iepub` library

## Installation

The plugin is included with Stomy. To enable it:

1. Open Stomy
2. Go to Settings → Plugins
3. Find "Kindle Sync" in the plugin list
4. Click "Enable"

## Usage

### Detecting Kindle Devices

1. Connect your Kindle via USB
2. The plugin will automatically detect it in the Sync view
3. You'll see device information including:
   - Model name
   - Serial number
   - Available storage space

### Syncing Books

1. Select books in your library
2. Click "Sync to Kindle"
3. EPUB books will be automatically converted to MOBI
4. Books will be copied to `Kindle/documents/` folder

### Plugin Settings

- **Auto Convert**: Automatically convert EPUB to MOBI (default: enabled)
- **Delete After Convert**: Remove temporary MOBI files after sync (default: disabled)
- **Preferred Format**: Choose between MOBI or AZW3 (default: MOBI)
- **Target Folder**: Kindle folder to sync to (default: documents)
- **Show Notifications**: Display system notifications for sync events (default: enabled)

## Technical Details

### Backend (Rust)

The plugin uses Rust for performance-critical operations:

- **Device Detection** (`detect_kindle_devices`): Scans `/Volumes` on macOS for Kindle devices
- **Format Conversion** (`convert_epub_to_mobi`): Uses `iepub` crate for EPUB→MOBI conversion
- **File Operations** (`copy_file_to_kindle`): Efficient file copying to Kindle storage

### Frontend (TypeScript)

TypeScript interfaces for:
- Device management
- Conversion tracking
- Sync orchestration
- Settings management

### Conversion Library

Uses **iepub** (v1.2) - a pure Rust library for ebook format conversion:
- W3C EPUB 3.3 compliant
- Preserves metadata during conversion
- No external dependencies (unlike Calibre CLI)

## Limitations

- **macOS Only**: Currently only supports macOS (Windows/Linux support planned)
- **USB Connection Required**: No wireless sync support yet
- **DRM Protection**: Cannot sync DRM-protected books purchased from Amazon
- **No AZW3**: Currently only MOBI output (AZW3 support planned)

## Troubleshooting

### Kindle Not Detected

1. Ensure Kindle is in USB mass storage mode (not charging only)
2. Check that `/Volumes/Kindle` appears in Finder
3. Try reconnecting the USB cable
4. Restart Anticalibre

### Conversion Fails

1. Verify the EPUB file is not corrupted
2. Check that the EPUB follows standard specifications
3. Look at console logs for detailed error messages
4. Try converting with Calibre to verify the file

### Books Not Appearing on Kindle

1. Ensure books are in the `documents/` folder
2. Restart your Kindle device
3. Check Kindle storage is not full
4. Verify MOBI files are not corrupted

## Development

### Adding New Features

The plugin architecture allows easy extensions:

```typescript
// Add a new action
kindlePlugin.actions?.push({
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

## Roadmap

- [ ] AZW3 format support
- [ ] Windows and Linux compatibility
- [ ] Wireless sync via Kindle email
- [ ] Batch conversion UI
- [ ] Conversion quality settings
- [ ] Metadata preservation improvements
- [ ] Collection/folder sync
- [ ] Reading progress sync

## License

Part of Stomy - see main LICENSE file.

## Credits

- Built with [Tauri](https://tauri.app/)
- Conversion powered by [iepub](https://github.com/inkroom/iepub)
- Icons from [Lucide](https://lucide.dev/)
