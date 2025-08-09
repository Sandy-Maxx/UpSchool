'use strict';

// Axios mock that forwards to fetch so MSW can intercept network calls in tests.
function buildInstance(baseURL = '') {
  const requestInterceptors = [];
  const responseInterceptors = [];

  const applyRequestInterceptors = async (config) => {
    let cfg = { ...config };
    for (const { onFulfilled } of requestInterceptors) {
      if (typeof onFulfilled === 'function') cfg = (await onFulfilled(cfg)) || cfg;
    }
    return cfg;
  };

  const applyResponseInterceptors = async (response, error) => {
    if (error) {
      for (const { onRejected } of responseInterceptors) {
        if (typeof onRejected === 'function') return onRejected(error);
      }
      throw error;
    } else {
      let resp = response;
      for (const { onFulfilled } of responseInterceptors) {
        if (typeof onFulfilled === 'function') resp = (await onFulfilled(resp)) || resp;
      }
      return resp;
    }
  };

  const buildUrl = (url) => {
    if (!baseURL) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const slash = baseURL.endsWith('/') || url.startsWith('/') ? '' : '/';
    return `${baseURL}${slash}${url.replace(/^\//, '')}`;
  };

  const doFetch = async (method, url, data, config = {}) => {
    const initial = { method, url, headers: { 'Content-Type': 'application/json', ...(config.headers || {}) }, data };
    const req = await applyRequestInterceptors(initial);
    const fullUrl = buildUrl(req.url);
    try {
      const res = await fetch(fullUrl, {
        method: req.method,
        headers: req.headers,
        body: ['GET', 'HEAD'].includes(req.method?.toUpperCase?.() || '') ? undefined : (req.data ? JSON.stringify(req.data) : undefined),
      });
      const contentType = res.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? await res.json() : await res.text();
      const response = { status: res.status, data: payload, headers: res.headers, config: req, request: {} };
      if (!res.ok) {
        const error = { response, config: req, isAxiosError: true, message: res.statusText };
        return applyResponseInterceptors(undefined, error);
      }
      return applyResponseInterceptors(response);
    } catch (e) {
      const error = { isAxiosError: true, message: e?.message || 'Network error', config: req };
      return applyResponseInterceptors(undefined, error);
    }
  };

  return {
    baseURL,
    interceptors: {
      request: {
        use: (onFulfilled, onRejected) => {
          requestInterceptors.push({ onFulfilled, onRejected });
          return requestInterceptors.length - 1;
        },
        eject: (id) => { requestInterceptors[id] = {}; },
      },
      response: {
        use: (onFulfilled, onRejected) => {
          responseInterceptors.push({ onFulfilled, onRejected });
          return responseInterceptors.length - 1;
        },
        eject: (id) => { responseInterceptors[id] = {}; },
      },
    },
    get: (url, config) => doFetch('GET', url, undefined, config),
    delete: (url, config) => doFetch('DELETE', url, undefined, config),
    post: (url, data, config) => doFetch('POST', url, data, config),
    put: (url, data, config) => doFetch('PUT', url, data, config),
    patch: (url, data, config) => doFetch('PATCH', url, data, config),
  };
}

const mockAxios = {
  create: (config = {}) => buildInstance(config.baseURL || ''),
  interceptors: buildInstance().interceptors,
  get: (url, config) => buildInstance().get(url, config),
  delete: (url, config) => buildInstance().delete(url, config),
  post: (url, data, config) => buildInstance().post(url, data, config),
  put: (url, data, config) => buildInstance().put(url, data, config),
  patch: (url, data, config) => buildInstance().patch(url, data, config),
  defaults: {},
};

module.exports = mockAxios;
module.exports.default = mockAxios;
