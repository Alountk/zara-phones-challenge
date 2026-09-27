import { NormalizedPhoneSummary } from '@/types/phone';
import { formatPrice } from '@/utils/phone-formatters';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PhoneCard.module.scss';

export default function PhoneCard({ phone }: { phone: NormalizedPhoneSummary }) {
  return (
    <Link href={`/phone/${phone.id}`}>
      <article className={styles['card']}>
        {phone.imageUrl ? (
          <div className={styles['phone-image-wrapper']}>
            <Image
              src={phone.imageUrl}
              alt={phone.name}
              fill
              sizes="(max-width: 599px) 100vw, (max-width: 1023px) 50vw, 20vw"
              style={{ maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div className={styles['phone-image-placeholder']}>Image not available</div>
        )}
        <div className={styles['phone-info']}>
          <div className={styles['phone-text']}>
            <h4 className={styles['phone-brand']}>{phone.brand}</h4>
            <h3 className={styles['phone-name']}>{phone.name}</h3>
          </div>
          <p className={styles['phone-price']}>{formatPrice(phone.basePrice)}</p>
        </div>
      </article>
    </Link>
  );
}
