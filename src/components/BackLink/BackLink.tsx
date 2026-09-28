'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './BackLink.module.scss';

export default function BackLink() {
  const router = useRouter();
  return (
    <button type="button" className={styles['back-link']} onClick={() => router.back()}>
      <Image src="/logo/chevron_left.svg" alt="" height={9} width={5} priority />
      Back
    </button>
  );
}
