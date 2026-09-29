'use client';

import { useCart } from '@/context/CartContext';
import { NormalizedPhoneDetail } from '@/types/phone';
import { formatPrice } from '@/utils/phone-formatters';
import Image from 'next/image';
import { useState } from 'react';
import Button from '../Button/Button';
import styles from './PhoneHero.module.scss';

export default function PhoneHero({ phone }: { phone: NormalizedPhoneDetail }) {
  const { addItem } = useCart();
  const { name, basePrice, colorOptions, storageOptions } = phone;

  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const selectedColorOption = colorOptions.find((color) => color.name === selectedColor);
  const displayImage = selectedColorOption?.imageUrl ?? colorOptions[0]?.imageUrl;

  const selectedStorageOption = storageOptions.find(
    (storage) => storage.capacity === selectedStorage,
  );
  const displayPrice = selectedStorageOption?.price ?? basePrice;

  const canAdd = Boolean(
    selectedColorOption && selectedStorageOption && selectedStorageOption.price !== null,
  );

  const handleAdd = () => {
    // The button is disabled until both are selected, this only narrows the types
    if (!selectedStorageOption || !selectedColorOption) return;

    const { price } = selectedStorageOption;
    if (price === null) return;

    addItem({
      id: `${phone.id}-${selectedStorageOption.capacity}-${selectedColorOption.name}`.replaceAll(
        ' ',
        '',
      ),
      phoneId: phone.id,
      name: phone.name,
      brand: phone.brand,
      imageUrl: selectedColorOption.imageUrl,
      price,
      storage: selectedStorageOption.capacity,
      color: selectedColorOption.name,
    });
  };

  return (
    <section className={styles['hero']}>
      <div className={styles['image-wrapper']}>
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <span className={styles['image-placeholder']}>Image not available</span>
        )}
      </div>

      <div className={styles['heading']}>
        <h1 className={styles['name']}>{name}</h1>
        <p className={styles['price']}>From {formatPrice(displayPrice)}</p>
      </div>

      <div className={styles['selectors']}>
        <span className={styles['label']}>Storage. How much space do you need?</span>
        <div className={styles['pills']}>
          {storageOptions.map((storage) => (
            <button
              key={storage.capacity}
              type="button"
              aria-pressed={selectedStorage === storage.capacity}
              className={`${styles['pill']} ${
                selectedStorage === storage.capacity ? styles['pill--selected'] : ''
              }`}
              onClick={() => setSelectedStorage(storage.capacity)}
            >
              {storage.capacity}
            </button>
          ))}
        </div>
        <span className={styles['label']}>Color. Pick your favourite.</span>
        <div className={styles['swatches']}>
          {colorOptions.map((color) => (
            <button
              key={color.name}
              type="button"
              aria-label={color.name}
              aria-pressed={selectedColor === color.name}
              className={`${styles['swatch']} ${
                selectedColor === color.name ? styles['swatch--selected'] : ''
              }`}
              style={{ backgroundColor: color.hexCode }}
              onClick={() => setSelectedColor(color.name)}
            />
          ))}
        </div>
      </div>

      <Button variant="primary" disabled={!canAdd} onClick={handleAdd}>
        ADD
      </Button>
    </section>
  );
}
