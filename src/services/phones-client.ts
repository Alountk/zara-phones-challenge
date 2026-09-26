import { PhoneSummary } from '@/types/phone';

export async function getPhones(search?: string, signal?: AbortSignal): Promise<PhoneSummary[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);

  const queryString = params.toString();
  const url = queryString ? `/api/phones?${queryString}` : '/api/phones';

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Error ${res.status} to obtain phones list`);
  }

  return res.json();
}
