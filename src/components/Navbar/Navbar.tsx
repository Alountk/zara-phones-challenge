'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.scss';

export default function Navbar() {
  return (
    <nav className={styles['navbar']}>
      <Link href="/">
        <Image src="/logo/mbst-logo.svg" alt="MBST" height={29} width={77} priority />
      </Link>
      <Link href="/cart">
        <Image src="/logo/cart.svg" alt="cart" height={16} width={13} priority />0
      </Link>
    </nav>
  );
}
