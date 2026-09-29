'use client';

import Button from '@/components/Button/Button';
import styles from './error.module.scss';

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className={styles['error']}>
      <h1 className={styles['title']}>Something went wrong</h1>
      <p className={styles['message']}>We couldn&apos;t load this page. Please try again.</p>
      <Button variant="primary" onClick={() => retry()}>
        Try again
      </Button>
    </main>
  );
}
