import { NormalizedPhoneSummary, PhoneSummary } from '@/types/phone';

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

const normalizePhoneSummaries = (phones: PhoneSummary[]): NormalizedPhoneSummary[] => {
  // Control the duplication of phones with the same id
  const dedupedPhones = dedupeById(phones);

  // Normalize the price and imageUrl of each phone
  const normalizedPhones: NormalizedPhoneSummary[] = dedupedPhones.map((phone) => ({
    ...phone,
    basePrice: normalizePrice(phone.basePrice),
    imageUrl: changeHttpToHttps(phone.imageUrl),
  }));
  return normalizedPhones;
};

export { changeHttpToHttps, normalizePrice, dedupeById, formatPrice, normalizePhoneSummaries };
