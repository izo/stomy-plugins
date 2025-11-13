# Kobo Sync Plugin

Plugin for synchronizing ebooks with Kobo e-reader devices via USB connection.

## Features

- 🔍 **Automatic Kobo Detection** - Detects Kobo devices when connected via USB
- 📚 **Native Format Support** - Native support for EPUB, PDF, MOBI, CBZ formats
- ⚡ **Smart Sync** - Only syncs books that aren't already on the device
- 🔄 **Bidirectional Support** - Can import books from Kobo to library
- 📊 **Device Info** - Shows Kobo model, firmware, and storage space

## Supported Devices

All Kobo e-reader models with USB mass storage support:
- Kobo Clara
- Kobo Libra
- Kobo Forma
- Kobo Aura
- Kobo Glo
- Kobo Touch
- Older Kobo models

## Supported Formats

### Native Kobo Formats
- **EPUB** - Primary e-book format (fully supported)
- **PDF** - Supported by Kobo without conversion
- **MOBI** - Supported on most Kobo devices
- **CBZ/CBR** - Comic book formats
- **TXT** - Plain text files

## Installation

The plugin is included with Stomy and enabled by default. To disable it:

1. Open Stomy
2. Go to Settings → Plugins
3. Find "Kobo Sync" in the plugin list
4. Click "Disable" if you don't use Kobo devices

## Usage

### Detecting Kobo Devices

1. Connect your Kobo via USB
2. The plugin will automatically detect it in the Sync view
3. You'll see device information including:
   - Model name
   - Serial number
   - Available storage space

### Syncing Books

1. Select books in your library
2. Click "Sync to Kobo"
3. Books will be copied to the Kobo device
4. Progress will be shown in real-time

### Plugin Settings

- **Target Folder**: Kobo folder to sync to (default: .kobo)
- **Show Notifications**: Display system notifications for sync events (default: enabled)
- **Auto Eject**: Automatically eject device after sync (default: disabled)
- **Sync Metadata**: Sync book metadata to Kobo database (default: enabled)

## Technical Details

### Backend (Rust)

The plugin uses Rust for performance-critical operations:

- **Device Detection** (`detect_kobo_devices`): Scans `/Volumes` on macOS for Kobo devices
- **File Operations** (`copy_file_to_device`): Efficient file copying to Kobo storage
- **Metadata Sync**: Updates Kobo's SQLite database with book information

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

## Roadmap

- [ ] Windows and Linux compatibility
- [ ] Wireless sync via Kobo WiFi
- [ ] Batch sync UI
- [ ] Collection/shelf sync
- [ ] Reading progress sync
- [ ] Cover image optimization

## License

Part of Stomy - see main LICENSE file.

## Credits

- Built with [Tauri](https://tauri.app/)
- Icons from [Lucide](https://lucide.dev/)
