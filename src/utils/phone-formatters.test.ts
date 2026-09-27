import { changeHttpToHttps, dedupeById, normalizePrice } from './phone-formatters';

describe('when change http to https', () => {
  it('http is empty return empty string', () => {
    const result = changeHttpToHttps('');
    expect(result).toBe('');
  });
  it('http is null return empty string', () => {
    const result = changeHttpToHttps(null as any);
    expect(result).toBe('');
  });
  it('http is undefined return empty string', () => {
    const result = changeHttpToHttps(undefined as any);
    expect(result).toBe('');
  });
  it('http is not a string return empty string', () => {
    const result = changeHttpToHttps(123 as any);
    expect(result).toBe('');
  });
  it('if the url has https return the same url', () => {
    const result = changeHttpToHttps('https://example.com');
    expect(result).toBe('https://example.com');
  });
  it('http is a valid url return https url', () => {
    const result = changeHttpToHttps('http://example.com');
    expect(result).toBe('https://example.com');
  });
});

describe('normalize the price', () => {
  it('if the price is a string return null', () => {
    const result = normalizePrice('123' as any);
    expect(result).toBeNull();
  });
  it('if the price is a null return null', () => {
    const result = normalizePrice(null as any);
    expect(result).toBeNull();
  });
  it('if the price is a undefined return null', () => {
    const result = normalizePrice(undefined as any);
    expect(result).toBeNull();
  });
  it('if the price has decimal round correctly', () => {
    const roundDown = normalizePrice(123.45);
    const roundUp = normalizePrice(123.55);
    expect(roundDown).toBe(123);
    expect(roundUp).toBe(124);
  });
});

describe('dedupeById', () => {
  it('if the array is empty return an empty array', () => {
    const result = dedupeById([]);
    expect(result).toEqual([]);
  });
  it('if there are no duplicates return the same array', () => {
    const array = [
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
    ];
    const result = dedupeById(array);
    expect(result).toEqual(array);
  });
  it('removes duplicates based on id', () => {
    const array = [
      { id: '1', name: 'Phone 1' },
      { id: '1', name: 'Phone 1 Duplicate' },
      { id: '2', name: 'Phone 2' },
    ];
    const result = dedupeById(array);
    expect(result).toEqual([
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
    ]);
  });
  it('removes duplicates not consecutively based on id', () => {
    const array = [
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
      { id: '1', name: 'Phone 1 Duplicate' },
    ];
    const result = dedupeById(array);
    expect(result).toEqual([
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
    ]);
  });
  it('if the array has a multiple duplicates return only one of each', () => {
    const array = [
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
      { id: '1', name: 'Phone 1 Duplicate' },
      { id: '3', name: 'Phone 3' },
      { id: '2', name: 'Phone 2 Duplicate' },
    ];
    const result = dedupeById(array);
    expect(result).toEqual([
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
      { id: '3', name: 'Phone 3' },
    ]);
  });
  it('removes duplicates not consecutively based on id with API data', () => {
    const array = [
      { id: 'XMI-RN13P5G', name: 'Redmi Note 13 Pro 5G' },
      { id: 'XMI-RN13P5G', name: 'Redmi Note 13 Pro 5G Duplicate' },
      { id: 'SMG-S24U', name: 'Galaxy S24 Ultra' },
      { id: 'SMG-A25', name: 'Galaxy A25 5G' },
      { id: 'GPX-8A', name: 'Pixel 8a' },
      { id: 'SMG-A25', name: 'Galaxy A25 5G Duplicate' },
    ];
    const result = dedupeById(array);
    expect(result).toEqual([
      { id: 'XMI-RN13P5G', name: 'Redmi Note 13 Pro 5G' },
      { id: 'SMG-S24U', name: 'Galaxy S24 Ultra' },
      { id: 'SMG-A25', name: 'Galaxy A25 5G' },
      { id: 'GPX-8A', name: 'Pixel 8a' },
    ]);
  });
});
