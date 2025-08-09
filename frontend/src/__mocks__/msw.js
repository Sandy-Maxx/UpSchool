// Manual mock for MSW to avoid ES module transformation issues

// Mock rest handlers
const rest = {
  get: jest.fn((url, handler) => ({ url, handler, method: 'GET' })),
  post: jest.fn((url, handler) => ({ url, handler, method: 'POST' })),
  put: jest.fn((url, handler) => ({ url, handler, method: 'PUT' })),
  delete: jest.fn((url, handler) => ({ url, handler, method: 'DELETE' })),
  patch: jest.fn((url, handler) => ({ url, handler, method: 'PATCH' })),
};

// Mock response methods
const mockRes = {
  ctx: {
    status: jest.fn(code => ({ type: 'status', code })),
    json: jest.fn(data => ({ type: 'json', data })),
    text: jest.fn(text => ({ type: 'text', text })),
    delay: jest.fn(ms => ({ type: 'delay', ms })),
    cookie: jest.fn((name, value, options) => ({ type: 'cookie', name, value, options })),
  },
  once: jest.fn(),
  networkError: jest.fn(message => new Error(`Network Error: ${message}`)),
};

// Mock request object
const mockReq = {
  url: 'http://localhost/api/test',
  method: 'GET',
  headers: {},
  body: null,
  params: {},
  cookies: {},
  json: jest.fn().mockResolvedValue({}),
  text: jest.fn().mockResolvedValue(''),
  arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
};

// Setup a function that returns response transformers
const setupResponseTransformers = () => ({
  status: code => mockRes.ctx.status(code),
  json: data => mockRes.ctx.json(data),
  text: text => mockRes.ctx.text(text),
  delay: ms => mockRes.ctx.delay(ms),
  cookie: (name, value, options) => mockRes.ctx.cookie(name, value, options),
});

// Mock server setup
const setupServer = jest.fn(() => ({
  listen: jest.fn(options => {
    console.log('MSW Mock Server: listen called with', options);
  }),
  close: jest.fn(() => {
    console.log('MSW Mock Server: close called');
  }),
  resetHandlers: jest.fn((...handlers) => {
    console.log('MSW Mock Server: resetHandlers called with', handlers.length, 'handlers');
  }),
  restoreHandlers: jest.fn(() => {
    console.log('MSW Mock Server: restoreHandlers called');
  }),
  use: jest.fn((...handlers) => {
    console.log('MSW Mock Server: use called with', handlers.length, 'handlers');
  }),
}));

module.exports = {
  rest,
  setupServer,
  // Export individual functions for named imports
  default: {
    rest,
    setupServer,
  },
};

// Also support named exports for ES module compatibility
module.exports.rest = rest;
module.exports.setupServer = setupServer;
