import { notFound } from 'next/navigation';
import { getPhoneDetailFromExternalApi } from '@/services/phones-server';
import { ExternalApiError } from '@/services/errors';
import { NormalizedPhoneDetail } from '@/types/phone';
import styles from './page.module.scss';
import Specifications from '@/components/Specifications/Specifications';
import PhoneHero from '@/components/PhoneHero/PhoneHero';
import BackLink from '@/components/BackLink/BackLink';
import SimilarItems from '@/components/SimilarItems/SimilarItems';

export default async function PhonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let phone: NormalizedPhoneDetail;

  try {
    phone = await getPhoneDetailFromExternalApi(id);
  } catch (error) {
    if (error instanceof ExternalApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
  return (
    <main>
      <div className={styles['back-link-wrapper']}>
        <BackLink />
      </div>
      <div className={styles['phone-detail-page']}>
        <div className={styles['phone-detail-content']}>
          <PhoneHero phone={phone} />
          <Specifications phone={phone} />
          <SimilarItems items={phone.similarProducts} />
        </div>
      </div>
    </main>
  );
}
