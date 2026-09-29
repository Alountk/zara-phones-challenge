'use client';

import Button from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/phone-formatters';
import CartLine from '../CartLine/CartLine';
import styles from './CartView.module.scss';

export default function CartView() {
  const router = useRouter();
  const { items, itemCount, removeItem } = useCart();

  const hasItems = items.length > 0;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const continueShopping = () => router.push('/');

  return (
    <section className={styles['cart']}>
      <h1 className={styles['title']}>Cart ({itemCount})</h1>

      <ul className={styles['list']}>
        {items.map((item) => (
          <CartLine key={item.id} item={item} onRemove={removeItem} />
        ))}
      </ul>

      <footer className={styles['footer']}>
        {hasItems && (
          <div className={styles['total']}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        )}
        <div className={styles['actions']}>
          <Button variant="standard" onClick={continueShopping}>
            Continue shopping
          </Button>
          {/* TODO: define what PAY does */}
          {hasItems && <Button variant="primary">Pay</Button>}
        </div>
      </footer>
    </section>
  );
}
