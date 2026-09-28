'use client';

import { NormalizedPhoneSummary } from '@/types/phone';
import { useRef, useState, type UIEvent } from 'react';
import PhoneCard from '../PhoneCard/PhoneCard';
import styles from './SimilarItems.module.scss';

export default function SimilarItems({ items }: { items: NormalizedPhoneSummary[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState<{ width: number; offset: number }>({
    width: 0,
    offset: 0,
  });

  const updateScrollRatio = (el: HTMLDivElement) => {
    const { scrollWidth, clientWidth, scrollLeft } = el;
    if (scrollWidth <= clientWidth) {
      setScrollRatio({ width: 1, offset: 0 });
      return;
    }
    const width = clientWidth / scrollWidth;
    const offset = scrollLeft / scrollWidth;
    setScrollRatio({ width, offset });
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    updateScrollRatio(event.currentTarget);
  };

  if (items.length === 0) return null;

  return (
    <section className={styles['similar-items']}>
      <h2 className={styles['title']}>Similar items</h2>
      <div ref={listRef} className={styles['list']} onScroll={handleScroll}>
        {items.map((phone) => (
          <PhoneCard key={phone.id} phone={phone} isPriority={false} />
        ))}
      </div>
      <div className={styles['scroll-track']}>
        <div
          className={styles['scroll-thumb']}
          style={{
            width: `${scrollRatio.width * 100}%`,
            transform: `translateX(${(scrollRatio.offset / scrollRatio.width) * 100}%)`,
          }}
        />
      </div>
    </section>
  );
}
