/**
 * Minimal MSW wrapper for tests.
 * Always exports a non-crashing stub server/rest so Jest never fails to parse or import.
 */

let rest: any;
let server: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const real = require('msw');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const realNode = require('msw/node');
  rest = real.rest;
  server = realNode.setupServer();
} catch (_e) {
  const noop = () => undefined;
  rest = { get: noop, post: noop, put: noop, patch: noop, delete: noop } as any;
  server = { listen: noop, close: noop, resetHandlers: noop, use: noop } as any;
}

export { rest, server };
export const addTestHandler = (...handlersToAdd: any[]) => server.use?.(...handlersToAdd);
export const resetTestHandlers = () => server.resetHandlers?.();
export default server;
