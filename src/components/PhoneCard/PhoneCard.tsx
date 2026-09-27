import { NormalizedPhoneSummary } from '@/types/phone';
import { formatPrice } from '@/utils/phone-formatters';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PhoneCard.module.scss';

export default function PhoneCard({ phone }: { phone: NormalizedPhoneSummary }) {
  return (
    <Link href={`/phone/${phone.id}`}>
      <div className={styles['card']}>
        {phone.imageUrl ? (
          <Image src={phone.imageUrl} alt={phone.name} width={312} height={257} />
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
      </div>
    </Link>
  );
}
