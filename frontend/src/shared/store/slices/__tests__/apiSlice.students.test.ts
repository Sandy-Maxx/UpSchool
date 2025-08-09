import { normalizeStudentsResponse } from '../apiSlice';

describe('apiSlice students transformResponse', () => {
  it('normalizes results/count from results array', () => {
const resp = normalizeStudentsResponse({ results: [{ id: 1 }], count: 12 });
    expect(resp).toEqual({ results: [{ id: 1 }], count: 12 });
  });

  it('normalizes results/count from data array', () => {
const resp = normalizeStudentsResponse({ data: [{ id: 1 }], total: 5 });
    expect(resp).toEqual({ results: [{ id: 1 }], count: 5 });
  });

  it('handles plain array', () => {
const resp = normalizeStudentsResponse([{ id: 1 }]);
    expect(resp).toEqual({ results: [{ id: 1 }], count: 1 });
  });
});
