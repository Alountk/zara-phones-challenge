import { PhoneSummary } from '@/types/phone';
import { dedupeById } from '@/utils/phone-formatters';
import { NextResponse } from 'next/server';

const PHONES_API_BASE_URL = process.env.PHONES_API_BASE_URL as string;
const PHONES_API_KEY = process.env.PHONES_API_KEY as string;

const DEFAULT_PAGE_SIZE = 20;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

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
    return NextResponse.json(
      { error: `Error ${res.status} to call the external API` },
      { status: res.status },
    );
  }

  const phones: PhoneSummary[] = await res.json();

  // Control the duplication of phones with the same id
  const dedupedPhones = dedupeById(phones);

  return NextResponse.json(dedupedPhones);
}
