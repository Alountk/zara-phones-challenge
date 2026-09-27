import { changeHttpToHttps, normalizePrice } from './phone-formatters';

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
  it('if the price is a string return 0', () => {
    const result = normalizePrice('123' as any);
    expect(result).toBeNull();
  });
  it('if the price is a null return 0', () => {
    const result = normalizePrice(null as any);
    expect(result).toBeNull();
  });
  it('if the price is a undefined return 0', () => {
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
