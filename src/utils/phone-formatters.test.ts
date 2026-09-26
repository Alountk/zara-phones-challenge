import { changeHttpToHttps } from './phone-formatters';

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
