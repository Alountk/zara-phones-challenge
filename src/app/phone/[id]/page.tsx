import { notFound } from 'next/navigation';
import { getPhoneDetailFromExternalApi } from '@/services/phones-server';
import { ExternalApiError } from '@/services/errors';
import { NormalizedPhoneDetail } from '@/types/phone';
import PhoneCard from '@/components/PhoneCard/PhoneCard';
import styles from './page.module.scss';
import Specifications from '@/components/Specifications/Specifications';

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
      <div className={styles['phone-detail-page']}>
        <div className={styles['back-link-wrapper']}>{/* <BackLink /> */}</div>
        <div className={styles['phone-detail-content']}>
          ← padding propio: 16/40/360 (mobile/tablet/desktop)
          {/* detalle principal, specs, similares */}
          <Specifications phone={phone} />
          <section>
            {phone.similarProducts.length > 0 &&
              phone.similarProducts.map((product, index) => (
                <PhoneCard key={product.id} phone={product} isPriority={index <= 2} />
              ))}
          </section>
        </div>
      </div>
    </main>
  );
}
