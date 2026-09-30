'use client';

import { NormalizedPhoneSummary } from '@/types/phone';
import { useCallback, useEffect, useRef, useState } from 'react';
import PhoneCard from '../PhoneCard/PhoneCard';
import styles from './SimilarItems.module.scss';

type ThumbStyle = { widthPercent: number; translatePercent: number };

const FULL_TRACK: ThumbStyle = { widthPercent: 100, translatePercent: 0 };

function readThumbStyle(el: HTMLDivElement): ThumbStyle {
  const { scrollWidth, clientWidth, scrollLeft } = el;
  const maxScroll = scrollWidth - clientWidth;

  if (maxScroll <= 0) return FULL_TRACK;

  const widthPercent = (clientWidth / scrollWidth) * 100;
  // translateX(%) on the thumb is relative to the thumb itself, so it must
  // travel (track - thumb) / thumb to reach the right edge.
  const travelPercent = ((100 - widthPercent) / widthPercent) * 100;
  const progress = scrollLeft / maxScroll;

  return { widthPercent, translatePercent: progress * travelPercent };
}

export default function SimilarItems({ items }: { items: NormalizedPhoneSummary[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<ThumbStyle>(FULL_TRACK);

  const sync = useCallback(() => {
    const el = listRef.current;
    if (el) setThumb(readThumbStyle(el));
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync, items]);

  if (items.length === 0) return null;

  return (
    <section className={styles['similar-items']}>
      <h2 className={styles['title']}>Similar items</h2>
      <div ref={listRef} className={styles['list']} onScroll={sync}>
        {items.map((phone) => (
          <PhoneCard key={phone.id} phone={phone} isPriority={false} />
        ))}
      </div>
      <div className={styles['scroll-track']}>
        <div
          className={styles['scroll-thumb']}
          style={{
            width: `${thumb.widthPercent}%`,
            transform: `translateX(${thumb.translatePercent}%)`,
          }}
        />
      </div>
    </section>
  );
}
