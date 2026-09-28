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
            <p>No phones available right now, please try again later.</p>
            <Link href="/">Retry</Link>
          </>
        ) : (
          <>
            <p>No matches for this search.</p>
            <Link href="/">Reset search</Link>
          </>
        )}
      </section>
    );
  }

  return (
    <>
      <section className={styles['phone-search']}>
        <PhoneSearch search={search} quantityResult={phones.length} />
      </section>
      <section className={styles['phone-list-section']}>
        <div className={styles['phone-grid']}>
          {phones.map((phone, index) => (
            <PhoneCard key={phone.id} phone={phone} isPriority={index <= 4} />
          ))}
        </div>
      </section>
    </>
  );
}
