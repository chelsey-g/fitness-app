import { expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Run cleanup after each test case (e.g., clearing up DOM elements)
afterEach(() => {
  cleanup();
});

// Mock the browser environment
import { JSDOM } from 'jsdom';
const { window } = new JSDOM('');
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

// Global error handler to catch unhandled promise rejections
// This prevents Vitest from reporting unhandled errors during test runs
process.on('unhandledRejection', (reason, promise) => {
  // Silently handle unhandled rejections in tests
  // This is expected when testing error scenarios with SWR
});

