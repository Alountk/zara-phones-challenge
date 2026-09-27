import PhoneGrid from '@/components/PhoneGrid/PhoneGrid';
import { getPhonesFromExternalApi } from '@/services/phones-server';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string | string[] | undefined }>;
}) {
  const { search } = await searchParams;
  const normalizedSearch = Array.isArray(search) ? (search[0] ?? '') : (search ?? '');

  const phonesData = await getPhonesFromExternalApi(normalizedSearch);
  return (
    <main>
      <PhoneGrid phones={phonesData} search={normalizedSearch} />
    </main>
  );
}
