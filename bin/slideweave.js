#!/usr/bin/env node

/**
 * SlideWeave CLI binary entry point
 */

import('../dist/cli/index.js').catch((error) => {
  console.error('Failed to load SlideWeave CLI:', error.message);
  process.exit(1);
});