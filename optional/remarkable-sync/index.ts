/**
 * reMarkable Sync Plugin - Entry Point
 *
 * This plugin enables synchronization between Stomy and reMarkable e-paper tablets.
 * Supports USB connection via the reMarkable USB Web Interface.
 *
 * @see README.md for usage instructions
 * @see INTEGRATION.md for Rust backend setup
 */

export * from './types';
export * from './RemarkablePlugin';
export { remarkablePlugin as default } from './RemarkablePlugin';
