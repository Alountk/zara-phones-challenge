import Link from 'next/link';
import styles from '../../error.module.scss';

export default function NotFound() {
  return (
    <main className={styles['error']}>
      <h1 className={styles['title']}>Phone not found</h1>
      <p className={styles['message']}>We couldn&apos;t find the phone you were looking for.</p>
      <Link href="/" className={styles['link']}>
        Back to home
      </Link>
    </main>
  );
}
