import 'server-only';

import { NormalizedPhoneSummary, PhoneSummary } from '@/types/phone';
import { changeHttpToHttps, dedupeById, normalizePrice } from '@/utils/phone-formatters';
import { ExternalApiError } from './errors';

const PHONES_API_BASE_URL = process.env.PHONES_API_BASE_URL as string;
const PHONES_API_KEY = process.env.PHONES_API_KEY as string;

const DEFAULT_PAGE_SIZE = 20;

export async function getPhonesFromExternalApi(search?: string): Promise<NormalizedPhoneSummary[]> {
  // Create new Params and add the limit and search.
  const params = new URLSearchParams({
    limit: String(DEFAULT_PAGE_SIZE),
  });

  if (search) params.set('search', search);

  const url = `${PHONES_API_BASE_URL}/products?${params.toString()}`;
  const res = await fetch(url, {
    headers: { 'x-api-key': PHONES_API_KEY },
  });

  if (!res.ok) {
    throw new ExternalApiError('Error to call the external API', res.status);
  }

  const phones: PhoneSummary[] = await res.json();

  // Control the duplication of phones with the same id
  const dedupedPhones = dedupeById(phones);

  // Normalize the price and imageUrl of each phone
  const normalizedPhones: NormalizedPhoneSummary[] = dedupedPhones.map((phone) => ({
    ...phone,
    basePrice: normalizePrice(phone.basePrice),
    imageUrl: changeHttpToHttps(phone.imageUrl),
  }));

  return normalizedPhones;
}
