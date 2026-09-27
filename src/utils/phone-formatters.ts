const changeHttpToHttps = (url: string): string => {
  if (typeof url !== 'string') return '';
  if (url.startsWith('https://')) return url;
  if (url.startsWith('http://')) return url.replace('http://', 'https://');
  return '';
};

const normalizePrice = (price: number): number | null => {
  if (typeof price !== 'number') return null;
  return Math.round(price);
};

const dedupeById = <T extends { id: string }>(array: T[]): T[] => {
  const seen = new Set<string>();
  return array.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const formatPrice = (price: number | null): string => {
  if (price === null) return 'Price unavailable';
  return `${price} EUR`;
};

export { changeHttpToHttps, normalizePrice, dedupeById, formatPrice };
