import Image from 'next/image';
import { CartItem } from '@/types/cart';
import { formatPrice } from '@/utils/phone-formatters';
import styles from './CartLine.module.scss';

interface CartLineProps {
  item: CartItem;
  onRemove: (id: string) => void;
}

export default function CartLine({ item, onRemove }: CartLineProps) {
  return (
    <li className={styles['line']}>
      <div className={styles['image-wrapper']}>
        <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: 'contain' }} />
      </div>

      <div className={styles['info']}>
        <div className={styles['details']}>
          <p>{item.name}</p>
          <p>
            {item.storage} | {item.color}
          </p>
        </div>
        <p className={styles['price']}>{formatPrice(item.price)}</p>
        {item.quantity > 1 && <p className={styles['quantity']}>x{item.quantity}</p>}
        <button type="button" className={styles['remove']} onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
    </li>
  );
}
