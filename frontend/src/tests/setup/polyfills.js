/**
 * Node.js Polyfills for MSW in Jest Environment
 * This file provides necessary polyfills for MSW to work correctly in the Jest test environment
 */

// TextEncoder/TextDecoder polyfill for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Fetch API polyfill (MSW requires this in Node.js environment)
if (typeof global.fetch === 'undefined') {
  // We don't actually polyfill fetch globally since MSW handles it,
  // but we ensure it's available for MSW to intercept
  global.fetch = require('node-fetch');
  global.Headers = require('node-fetch').Headers;
  global.Request = require('node-fetch').Request;
  global.Response = require('node-fetch').Response;
}

// ReadableStream polyfill for MSW
if (typeof global.ReadableStream === 'undefined') {
  try {
    const { ReadableStream, TransformStream } = require('web-streams-polyfill');
    global.ReadableStream = ReadableStream;
    global.TransformStream = TransformStream;
  } catch (error) {
    // Polyfill not available, MSW might not work correctly
    console.warn('Web streams polyfill not available. Some MSW features may not work.');
  }
}

// AbortController polyfill
if (typeof global.AbortController === 'undefined') {
  global.AbortController = require('abort-controller');
  global.AbortSignal = global.AbortController.AbortSignal || require('abort-controller/AbortSignal');
}

// Blob polyfill for Node.js
if (typeof global.Blob === 'undefined') {
  // Basic Blob implementation for MSW
  global.Blob = class Blob {
    constructor(parts = [], options = {}) {
      this.parts = parts;
      this.type = options.type || '';
      this.size = parts.reduce((size, part) => {
        if (typeof part === 'string') return size + part.length;
        if (part instanceof Buffer) return size + part.length;
        return size;
      }, 0);
    }

    text() {
      return Promise.resolve(this.parts.join(''));
    }

    arrayBuffer() {
      const text = this.parts.join('');
      return Promise.resolve(new TextEncoder().encode(text).buffer);
    }
  };
}

// URL polyfill for Node.js (if needed)
if (typeof global.URL === 'undefined') {
  global.URL = require('url').URL;
  global.URLSearchParams = require('url').URLSearchParams;
}
