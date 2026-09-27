import { NormalizedPhoneSummary } from '@/types/phone';
import PhoneCard from '../PhoneCard/PhoneCard';
import Link from 'next/link';
import styles from './PhoneGrid.module.scss';

export default function PhoneGrid({
  phones,
  search,
}: {
  phones: NormalizedPhoneSummary[];
  search: string;
}) {
  if (phones.length === 0) {
    return (
      <section>
        {search === '' ? (
          <div>
            No hay móviles disponibles, inténtelo más tarde. <Link href="/">Reintentar</Link>
          </div>
        ) : (
          <div>
            No hay coincidencias para esta búsqueda. <Link href="/">Reiniciar búsqueda</Link>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={styles['phone-grid']}>
      {phones.map((phone) => (
        <PhoneCard key={phone.id} phone={phone} />
      ))}
    </section>
  );
}
