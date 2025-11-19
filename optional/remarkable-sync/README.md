# reMarkable Sync Plugin

Synchronize your Stomy ebook library with reMarkable e-paper tablets via USB connection. This plugin uses the reMarkable USB Web Interface to transfer EPUB and PDF files directly to your device.

## Features

- **USB Sync**: Transfer books via USB using reMarkable's built-in web interface
- **Native Format Support**: EPUB and PDF formats work natively (no conversion needed)
- **Batch Operations**: Sync multiple books at once
- **Smart Organization**: Organize books by library with automatic folder creation
- **Storage Management**: Check available space before syncing
- **File Size Validation**: Automatic check for USB API 100MB limit
- **Progress Notifications**: Real-time upload progress and completion notifications

## Supported Devices

- reMarkable 1
- reMarkable 2
- reMarkable Paper Pro

## Requirements

### On Your reMarkable Tablet

1. **Enable USB Web Interface**:
   - Go to **Settings** > **Storage**
   - Toggle **"USB web interface"** to ON

2. **Connect via USB**:
   - Use the official USB cable
   - Connect to your computer running Stomy

### On Your Computer

- Stomy application with plugin system enabled
- USB connection to reMarkable tablet
- Network access to `http://10.11.99.1` (local USB endpoint)

## Installation

1. **Plugin is included** in the `stomy-plugins/optional/remarkable-sync` directory
2. **Enable in Stomy**: Settings > Plugins > reMarkable Sync > Enable
3. **Configure backend**: See [INTEGRATION.md](./INTEGRATION.md) for Rust backend setup

## Usage

### Quick Start

1. **Connect your reMarkable** via USB
2. **Enable USB Web Interface** on the tablet (Settings > Storage)
3. **Open Stomy** and navigate to your library
4. **Detect Device**: Click "Detect reMarkable Tablet" in the toolbar
5. **Sync a Book**:
   - Right-click on any book
   - Select "Sync to reMarkable"
   - Wait for upload confirmation

### Batch Sync

1. **Select multiple books** in your library (Ctrl/Cmd + Click)
2. Click **"Batch Sync to reMarkable"** in the toolbar
3. Monitor progress in notifications
4. Review sync results when complete

### Check Storage

- Click **"Check Storage"** to see available space on your reMarkable
- Displays total, used, and free space in GB

### Open Web Interface

- Click **"Open reMarkable Web Interface"** to access the native web UI
- Useful for manual file management

## Plugin Settings

Access via: **Settings > Plugins > reMarkable Sync > Configure**

### Connection Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Connection Method | `usb` | USB, SSH, or Cloud (USB recommended) |
| USB Web Interface Enabled | `true` | Must be enabled on tablet |
| SSH Host | `10.11.99.1` | For advanced SSH access |
| SSH Port | `22` | SSH port number |

### Upload Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Target Folder | `/` | Root folder on reMarkable |
| Create Library Folders | `true` | Organize books by library name |
| Library Folder Prefix | `Stomy-` | Prefix for library folders (e.g., "Stomy-Fiction") |

### File Handling

| Setting | Default | Description |
|---------|---------|-------------|
| Max File Size | `100` MB | USB API limit (cannot exceed) |
| Convert EPUB to PDF | `false` | Auto-convert EPUB if needed (future feature) |
| Compress Large PDFs | `false` | Compress PDFs over max size (future feature) |

### Sync Options

| Setting | Default | Description |
|---------|---------|-------------|
| Sync Metadata | `true` | Sync book metadata if possible |
| Auto Sync | `false` | Auto-sync on device connection |
| Sync Only Selected | `false` | Only sync selected books in batch mode |

### UI Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Show Notifications | `true` | Display upload notifications |
| Show Upload Progress | `true` | Show progress during upload |
| Confirm Before Sync | `true` | Ask before starting sync |

### Advanced Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Enable SSH Fallback | `false` | Use SSH if USB fails (future feature) |
| Debug Mode | `false` | Enable debug logging |

## File Organization

### Default Structure (Library Folders Enabled)

```
/Stomy-Fiction/
  ├── The Great Gatsby.epub
  ├── 1984.pdf
  └── Brave New World.epub
/Stomy-Technical/
  ├── Clean Code.pdf
  └── Design Patterns.epub
```

### Flat Structure (Library Folders Disabled)

```
/
├── The Great Gatsby.epub
├── 1984.pdf
├── Clean Code.pdf
└── Design Patterns.epub
```

## Supported File Formats

| Format | Support | Notes |
|--------|---------|-------|
| **EPUB** | ✅ Native | Fully supported, no conversion |
| **PDF** | ✅ Native | Fully supported, no conversion |
| MOBI | ❌ Not supported | Convert to EPUB first |
| AZW3 | ❌ Not supported | Convert to EPUB first |
| TXT | ⚠️ Limited | May work but not optimized |

## Limitations

### USB Web Interface Limitations

1. **File Size**: 100MB maximum per file (API limitation)
2. **Manual Enable**: USB Web Interface must be enabled manually on tablet
3. **One File at a Time**: Sequential uploads (no parallel transfers)
4. **No Reading Progress**: Cannot import reading progress back to Stomy (Phase 1)

### Workarounds

- **Large Files**: Consider splitting or compressing PDFs before sync
- **Batch Speed**: Uploads are sequential; expect ~30 seconds per large file
- **Reading Progress**: Future feature planned (requires SSH + file parsing)

## Troubleshooting

### Device Not Detected

**Problem**: "No reMarkable Found" error

**Solutions**:
1. Check USB cable is securely connected
2. Verify USB Web Interface is enabled (Settings > Storage)
3. Try unplugging and reconnecting
4. Restart the reMarkable tablet
5. Check network access to `http://10.11.99.1` in your browser

### Upload Failed

**Problem**: "Upload failed" error

**Solutions**:
1. Check file size (must be ≤100MB)
2. Verify format is EPUB or PDF
3. Check available storage on reMarkable
4. Try syncing one file at a time
5. Enable debug mode for detailed logs

### Connection Timeout

**Problem**: Upload times out or hangs

**Solutions**:
1. Ensure stable USB connection
2. Close other apps accessing the tablet
3. Restart both Stomy and reMarkable
4. Check system firewall settings

### File Not Appearing on Tablet

**Problem**: Upload succeeds but file not visible

**Solutions**:
1. Swipe down from top on reMarkable to refresh
2. Check the target folder on tablet
3. Look in "All files" or root directory
4. Restart the reMarkable tablet

## Advanced Features (Future Roadmap)

### Phase 2: Enhanced Features
- ⏳ Reading progress import (from reMarkable to Stomy)
- ⏳ Annotation sync (highlights, notes)
- ⏳ Automatic EPUB to PDF conversion
- ⏳ PDF compression for large files
- ⏳ SSH fallback for large files

### Phase 3: Premium Features
- ⏳ Bidirectional sync
- ⏳ Conflict resolution
- ⏳ Cloud sync integration
- ⏳ Wireless sync (SSH over WiFi)

## Security & Privacy

- **No Cloud**: All transfers happen locally via USB
- **No Data Collection**: Plugin doesn't collect or transmit user data
- **SSH Credentials**: Stored encrypted in Stomy database (if SSH enabled)
- **Local Only**: No internet connection required

## Performance

### Typical Upload Speeds

| File Size | Upload Time |
|-----------|-------------|
| 1 MB | ~2-3 seconds |
| 10 MB | ~10-15 seconds |
| 50 MB | ~45-60 seconds |
| 100 MB | ~90-120 seconds |

*Times vary based on USB connection quality and system performance*

## Development

### Project Structure

```
remarkable-sync/
├── index.ts              # Entry point
├── RemarkablePlugin.ts   # Main implementation
├── types.ts              # TypeScript types
├── README.md             # This file
├── INTEGRATION.md        # Rust backend setup
└── manifest.json         # Plugin metadata
```

### Testing

1. **With Real Device**: Connect actual reMarkable tablet
2. **Manual Testing**: Use the web interface directly at `http://10.11.99.1`
3. **Debug Mode**: Enable in settings for detailed console logs

### Contributing

When contributing to this plugin:

1. Follow the [DEVELOPMENT_GUIDE.md](../../dummy-plugin/DEVELOPMENT_GUIDE.md)
2. Test with actual reMarkable device
3. Update documentation for new features
4. Add type definitions to `types.ts`
5. Follow existing code style

## Resources

### Official reMarkable Documentation
- [USB Web Interface](https://support.remarkable.com/s/article/Transferring-files-using-a-USB-cable)
- [File Formats](https://support.remarkable.com/s/article/Importing-and-exporting-files)
- [Device Support](https://support.remarkable.com/)

### Community Resources
- [reMarkable Guide](https://remarkable.guide/tech/usb-web-interface.html)
- [reMarkable API Documentation](https://github.com/splitbrain/ReMarkableAPI)
- [Community Tools](https://github.com/reHackable/awesome-reMarkable)

### reMarkable Specifications
- **Display**: 10.3" E Ink Carta (reMarkable 2)
- **Storage**: 8GB internal storage
- **Formats**: PDF, EPUB
- **Connectivity**: USB-C, Wi-Fi
- **OS**: Codex (Linux-based)

## License

This plugin is part of the Stomy project and follows the same license.

## Support

- **Issues**: Report bugs in the main Stomy repository
- **Questions**: Check the [dummy-plugin documentation](../../dummy-plugin/)
- **Updates**: Plugin updates are distributed with Stomy releases

## Changelog

### Version 1.0.0 (2025-11-19)
- ✨ Initial release
- ✅ USB Web Interface support
- ✅ EPUB and PDF upload
- ✅ Batch sync functionality
- ✅ Storage checking
- ✅ Library folder organization
- ✅ File size validation

---

**Made with ❤️ for the reMarkable and Stomy communities**
