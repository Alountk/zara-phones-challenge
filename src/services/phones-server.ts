import 'server-only';

import {
  NormalizedPhoneDetail,
  NormalizedPhoneSummary,
  PhoneDetail,
  PhoneSummary,
} from '@/types/phone';
import {
  changeHttpToHttps,
  normalizePhoneSummaries,
  normalizePrice,
} from '@/utils/phone-formatters';
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

  const normalizedPhones = normalizePhoneSummaries(phones);

  return normalizedPhones;
}

export async function getPhoneDetailFromExternalApi(id: string): Promise<NormalizedPhoneDetail> {
  const url = `${PHONES_API_BASE_URL}/products/${id}`;
  const res = await fetch(url, {
    headers: { 'x-api-key': PHONES_API_KEY },
  });

  if (!res.ok) {
    throw new ExternalApiError('Error to get a phone by Id', res.status);
  }

  const phoneDetail: PhoneDetail = await res.json();

  const normalizedPhoneDetail: NormalizedPhoneDetail = {
    ...phoneDetail,
    colorOptions: phoneDetail.colorOptions.map((color) => ({
      ...color,
      imageUrl: changeHttpToHttps(color.imageUrl),
    })),
    basePrice: normalizePrice(phoneDetail.basePrice),
    storageOptions: phoneDetail.storageOptions.map((storage) => ({
      ...storage,
      price: normalizePrice(storage.price),
    })),
    similarProducts: normalizePhoneSummaries(phoneDetail.similarProducts),
  };

  return normalizedPhoneDetail;
}
