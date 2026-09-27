import { NormalizedPhoneSummary } from '@/types/phone';
import PhoneCard from '../PhoneCard/PhoneCard';
import Link from 'next/link';
import styles from './PhoneGrid.module.scss';
import PhoneSearch from '../PhoneSearch/PhoneSearch';

export default function PhoneGrid({
  phones,
  search,
}: {
  phones: NormalizedPhoneSummary[];
  search: string;
}) {
  if (phones.length === 0) {
    return (
      <section className={styles['empty-state']}>
        <PhoneSearch search={search} quantityResult={phones.length} />
        {search === '' ? (
          <>
            <p>No hay móviles disponibles, inténtelo más tarde.</p>
            <Link href="/">Reintentar</Link>
          </>
        ) : (
          <>
            <p>No hay coincidencias para esta búsqueda.</p>
            <Link href="/">Reiniciar búsqueda</Link>
          </>
        )}
      </section>
    );
  }

  return (
    <section className={styles['phone-list-section']}>
      <PhoneSearch search={search} quantityResult={phones.length} />
      <div className={styles['phone-grid']}>
        {phones.map((phone, index) => (
          <PhoneCard key={phone.id} phone={phone} isPriority={index <= 4} />
        ))}
      </div>
    </section>
  );
}
