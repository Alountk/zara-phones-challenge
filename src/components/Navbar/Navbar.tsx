'use client';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <nav className={styles['navbar']}>
      <Link href="/">
        <Image src="/logo/mbst-logo.svg" alt="MBST" height={29} width={77} priority />
      </Link>
      <Link href="/cart">
        {itemCount !== 0 ? (
          <Image src="/logo/cart_black.svg" alt="cart" height={16} width={13} priority />
        ) : (
          <Image src="/logo/cart.svg" alt="cart" height={16} width={13} priority />
        )}
        {itemCount}
      </Link>
    </nav>
  );
}
