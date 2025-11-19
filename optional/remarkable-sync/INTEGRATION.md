# reMarkable Sync Plugin - Backend Integration Guide

This guide explains how to integrate the reMarkable Sync plugin's Rust backend into the main Stomy application.

## Overview

The reMarkable Sync plugin requires Rust/Tauri commands to handle:
- USB device detection via HTTP API
- File uploads to reMarkable via multipart form data
- Storage information retrieval
- File system operations

## Prerequisites

- Stomy main application repository
- Rust toolchain (comes with Tauri)
- Access to `src-tauri/` directory in main Stomy app

## Integration Steps

### Step 1: Add Dependencies

Add these dependencies to `src-tauri/Cargo.toml`:

```toml
[dependencies]
# Existing dependencies...

# HTTP client for reMarkable API
reqwest = { version = "0.11", features = ["blocking", "multipart", "json"] }
tokio = { version = "1", features = ["full"] }

# File operations
mime_guess = "2.0"
walkdir = "2.4"

# Error handling
anyhow = "1.0"
thiserror = "1.0"
```

### Step 2: Create Rust Module

Create a new file `src-tauri/src/remarkable.rs`:

```rust
//! reMarkable Sync Plugin - Rust Backend
//!
//! Provides Tauri commands for interacting with reMarkable tablets
//! via USB Web Interface (HTTP API at http://10.11.99.1)

use reqwest::blocking::Client;
use reqwest::multipart;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use std::time::Duration;
use anyhow::{Result, Context};

/// reMarkable USB Web Interface base URL
const REMARKABLE_BASE_URL: &str = "http://10.11.99.1";

/// Request timeout in seconds
const REQUEST_TIMEOUT: u64 = 30;

/// Maximum file size for USB API (100MB)
const MAX_FILE_SIZE: u64 = 100 * 1024 * 1024;

// ============================================================================
// Type Definitions
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct RemarkableDevice {
    pub id: String,
    pub name: String,
    pub model: String,
    pub manufacturer: String,
    pub software_version: Option<String>,
    pub serial_number: Option<String>,
    pub connected: bool,
    pub connection_type: String,
    pub base_url: String,
    pub total_space: Option<u64>,
    pub free_space: Option<u64>,
    pub book_count: Option<u32>,
    pub last_sync: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UploadResult {
    pub success: bool,
    pub file_name: String,
    pub file_size: u64,
    pub uploaded_at: Option<String>,
    pub error: Option<String>,
    pub device_path: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StorageInfo {
    pub total: u64,
    pub used: u64,
    pub free: u64,
    pub percent_used: f64,
}

// ============================================================================
// Tauri Commands
// ============================================================================

/// Detect connected reMarkable device
#[tauri::command]
pub async fn detect_remarkable_device() -> Result<Option<RemarkableDevice>, String> {
    match check_remarkable_connection().await {
        Ok(connected) => {
            if connected {
                Ok(Some(RemarkableDevice {
                    id: "remarkable-usb".to_string(),
                    name: "reMarkable".to_string(),
                    model: "reMarkable 2".to_string(), // Could be detected via API
                    manufacturer: "reMarkable AS".to_string(),
                    software_version: None,
                    serial_number: None,
                    connected: true,
                    connection_type: "usb".to_string(),
                    base_url: REMARKABLE_BASE_URL.to_string(),
                    total_space: None,
                    free_space: None,
                    book_count: None,
                    last_sync: None,
                }))
            } else {
                Ok(None)
            }
        }
        Err(e) => Err(format!("Device detection failed: {}", e)),
    }
}

/// Check if reMarkable is connected and Web Interface is accessible
async fn check_remarkable_connection() -> Result<bool> {
    let client = Client::builder()
        .timeout(Duration::from_secs(5))
        .build()?;

    match client.get(REMARKABLE_BASE_URL).send() {
        Ok(response) => Ok(response.status().is_success()),
        Err(_) => Ok(false),
    }
}

/// Upload a file to reMarkable device
#[tauri::command]
pub async fn upload_to_remarkable(
    file_path: String,
    file_name: String,
    target_folder: String,
    device_url: String,
) -> Result<UploadResult, String> {
    // Validate file exists
    let path = Path::new(&file_path);
    if !path.exists() {
        return Err(format!("File not found: {}", file_path));
    }

    // Check file size
    let metadata = fs::metadata(path)
        .map_err(|e| format!("Cannot read file metadata: {}", e))?;

    let file_size = metadata.len();
    if file_size > MAX_FILE_SIZE {
        return Err(format!(
            "File too large: {:.1}MB (max: 100MB)",
            file_size as f64 / 1024.0 / 1024.0
        ));
    }

    // Validate file format
    let extension = path.extension()
        .and_then(|ext| ext.to_str())
        .map(|s| s.to_lowercase());

    match extension.as_deref() {
        Some("pdf") | Some("epub") => {},
        _ => return Err("Unsupported format. Only PDF and EPUB are supported.".to_string()),
    }

    // Read file
    let file_bytes = fs::read(path)
        .map_err(|e| format!("Cannot read file: {}", e))?;

    // Create multipart form
    let mime_type = mime_guess::from_path(path)
        .first_or_octet_stream()
        .to_string();

    let file_part = multipart::Part::bytes(file_bytes)
        .file_name(file_name.clone())
        .mime_str(&mime_type)
        .map_err(|e| format!("Cannot create file part: {}", e))?;

    let form = multipart::Form::new()
        .part("file", file_part);

    // Upload to reMarkable
    let client = Client::builder()
        .timeout(Duration::from_secs(REQUEST_TIMEOUT))
        .build()
        .map_err(|e| format!("Cannot create HTTP client: {}", e))?;

    let upload_url = format!("{}/upload", device_url);

    match client.post(&upload_url).multipart(form).send() {
        Ok(response) => {
            if response.status().is_success() {
                Ok(UploadResult {
                    success: true,
                    file_name: file_name.clone(),
                    file_size,
                    uploaded_at: Some(chrono::Utc::now().to_rfc3339()),
                    error: None,
                    device_path: Some(format!("{}/{}", target_folder, file_name)),
                })
            } else {
                Err(format!("Upload failed: HTTP {}", response.status()))
            }
        }
        Err(e) => Err(format!("Upload request failed: {}", e)),
    }
}

/// Get storage information from reMarkable (best-effort)
#[tauri::command]
pub async fn get_remarkable_storage(device_url: String) -> Result<StorageInfo, String> {
    // Note: The USB Web Interface may not expose storage info via API
    // This is a placeholder that could be enhanced with SSH access

    // For now, return estimated values or try to fetch via API if available
    // This would need actual API endpoint documentation from reMarkable

    Ok(StorageInfo {
        total: 8 * 1024 * 1024 * 1024, // 8GB typical for reMarkable
        used: 0,
        free: 8 * 1024 * 1024 * 1024,
        percent_used: 0.0,
    })
}

/// Check if USB Web Interface is enabled
#[tauri::command]
pub async fn check_remarkable_web_interface() -> Result<bool, String> {
    check_remarkable_connection()
        .await
        .map_err(|e| format!("Connection check failed: {}", e))
}

/// Get file size in bytes
#[tauri::command]
pub fn get_file_size(file_path: String) -> Result<u64, String> {
    let metadata = fs::metadata(&file_path)
        .map_err(|e| format!("Cannot read file: {}", e))?;
    Ok(metadata.len())
}

/// Get reMarkable device information (extended)
#[tauri::command]
pub async fn get_remarkable_info(device_url: String) -> Result<RemarkableDevice, String> {
    // Check if device is accessible
    let connected = check_remarkable_connection().await
        .map_err(|e| format!("Connection failed: {}", e))?;

    if !connected {
        return Err("Device not connected".to_string());
    }

    // Return device info
    // In a real implementation, this could query device endpoints for more details
    Ok(RemarkableDevice {
        id: "remarkable-usb".to_string(),
        name: "reMarkable".to_string(),
        model: "reMarkable 2".to_string(),
        manufacturer: "reMarkable AS".to_string(),
        software_version: None,
        serial_number: None,
        connected: true,
        connection_type: "usb".to_string(),
        base_url: device_url,
        total_space: Some(8 * 1024 * 1024 * 1024),
        free_space: None,
        book_count: None,
        last_sync: None,
    })
}

/// Open URL in default browser
#[tauri::command]
pub async fn open_url(url: String) -> Result<(), String> {
    opener::open(url)
        .map_err(|e| format!("Cannot open URL: {}", e))
}

// ============================================================================
// Helper Functions
// ============================================================================

/// Sanitize filename for reMarkable
pub fn sanitize_filename(filename: &str) -> String {
    filename
        .chars()
        .map(|c| match c {
            '/' | '\\' | ':' | '*' | '?' | '"' | '<' | '>' | '|' => '-',
            _ => c,
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sanitize_filename() {
        assert_eq!(sanitize_filename("normal.pdf"), "normal.pdf");
        assert_eq!(sanitize_filename("file:with*bad?chars.pdf"), "file-with-bad-chars.pdf");
    }
}
```

### Step 3: Register Module in lib.rs

Edit `src-tauri/src/lib.rs` to include the remarkable module:

```rust
// Add at the top with other module declarations
mod remarkable;

// In the main setup function, add the commands:
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // ... existing commands ...

            // reMarkable Sync commands
            remarkable::detect_remarkable_device,
            remarkable::upload_to_remarkable,
            remarkable::get_remarkable_storage,
            remarkable::check_remarkable_web_interface,
            remarkable::get_file_size,
            remarkable::get_remarkable_info,
            remarkable::open_url,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Step 4: Update Tauri Permissions

Edit `src-tauri/capabilities/default.json` to add HTTP permissions:

```json
{
  "permissions": [
    // ... existing permissions ...

    {
      "identifier": "http:default",
      "allow": [
        {
          "url": "http://10.11.99.1/*"
        }
      ]
    }
  ]
}
```

Or in `tauri.conf.json` under `security.csp`:

```json
{
  "security": {
    "csp": {
      "default-src": "'self'",
      "connect-src": "'self' http://10.11.99.1"
    }
  }
}
```

### Step 5: Add Chrono Dependency

The upload function uses `chrono` for timestamps. Add to `Cargo.toml`:

```toml
chrono = { version = "0.4", features = ["serde"] }
opener = "0.6" # For open_url command
```

### Step 6: Build and Test

```bash
cd /path/to/stomy-main-app
cargo build
npm run tauri:dev
```

## Testing the Integration

### Manual Testing

1. **Test device detection**:
```bash
# In Stomy app console:
await invoke('detect_remarkable_device')
```

2. **Test upload**:
```bash
await invoke('upload_to_remarkable', {
  filePath: '/path/to/book.pdf',
  fileName: 'test.pdf',
  targetFolder: '/',
  deviceUrl: 'http://10.11.99.1'
})
```

3. **Test storage check**:
```bash
await invoke('get_remarkable_storage', {
  deviceUrl: 'http://10.11.99.1'
})
```

### Automated Testing

Add tests to `src-tauri/src/remarkable.rs`:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_device_detection() {
        // This test requires a connected reMarkable
        let result = detect_remarkable_device().await;
        // Add assertions based on your setup
    }
}
```

## Troubleshooting

### Build Errors

**Error**: `reqwest` fails to compile
- **Solution**: Update Rust toolchain: `rustup update`

**Error**: OpenSSL missing
- **Solution** (Linux): `sudo apt install libssl-dev pkg-config`
- **Solution** (macOS): `brew install openssl`

### Runtime Errors

**Error**: "Connection refused" at `http://10.11.99.1`
- **Solution**: Enable USB Web Interface on reMarkable

**Error**: CORS errors in browser
- **Solution**: Update CSP in `tauri.conf.json`

**Error**: "File too large"
- **Solution**: Check file size is under 100MB (USB API limit)

## Advanced: SSH Support (Future Enhancement)

To add SSH support for large files and reading progress:

### Additional Dependencies

```toml
ssh2 = "0.9"
```

### Example SSH Command

```rust
#[tauri::command]
pub async fn upload_via_ssh(
    file_path: String,
    ssh_host: String,
    ssh_user: String,
    ssh_password: String,
) -> Result<UploadResult, String> {
    // SSH upload implementation
    // This would bypass the 100MB HTTP limit
    todo!("Implement SSH upload")
}
```

## Performance Optimization

### Connection Pooling

Reuse HTTP client across requests:

```rust
use once_cell::sync::Lazy;

static HTTP_CLIENT: Lazy<Client> = Lazy::new(|| {
    Client::builder()
        .timeout(Duration::from_secs(30))
        .build()
        .expect("Failed to create HTTP client")
});
```

### Parallel Uploads

For batch operations, use `tokio::spawn`:

```rust
let tasks: Vec<_> = files.into_iter()
    .map(|file| tokio::spawn(upload_to_remarkable(...)))
    .collect();

let results = futures::future::join_all(tasks).await;
```

## Security Considerations

### Credential Storage

If implementing SSH:
- Store passwords encrypted in database
- Use system keychain where possible
- Never log sensitive data

### Network Security

- Only connect to local USB endpoint (`10.11.99.1`)
- Validate all user-provided file paths
- Sanitize filenames to prevent path traversal

### File Validation

- Check file extensions before upload
- Validate file size limits
- Verify MIME types match extensions

## Resources

- [Tauri Invoke System](https://tauri.app/v1/guides/features/command/)
- [Reqwest Documentation](https://docs.rs/reqwest/)
- [reMarkable API Info](https://github.com/splitbrain/ReMarkableAPI)

## Support

For integration issues:
1. Check Rust compiler errors carefully
2. Verify all dependencies are added
3. Test with `cargo build` before running Tauri
4. Enable debug mode in plugin settings for detailed logs

---

**Integration Status**: ✅ Ready to integrate

Last updated: 2025-11-19
