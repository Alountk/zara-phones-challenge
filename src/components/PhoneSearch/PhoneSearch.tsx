'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import styles from './PhoneSearch.module.scss';
import { usePathname, useRouter } from 'next/navigation';

const DEBOUNCE_MS = 500;

export default function PhoneSearch({
  search,
  quantityResult,
}: {
  search: string;
  quantityResult: number;
}) {
  const [inputData, setInputData] = useState<string>(search);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (inputData) params.set('search', inputData);
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [inputData, pathname, router]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const values = e.currentTarget.value;
    setInputData(values);
  };

  const cleanInput = () => {
    setInputData('');
  };
  return (
    <div className={styles['search-wrapper']}>
      <div className={styles['search-bar']}>
        <input
          className={styles['input']}
          placeholder="Search for a smartphone..."
          value={inputData}
          onChange={handleOnChange}
        />
        {inputData.length !== 0 && (
          <button className={styles['clear-button']} onClick={() => cleanInput()}>
            ×
          </button>
        )}
      </div>
      <div className={styles['search-results']}>{`${quantityResult} RESULTS`}</div>
    </div>
  );
}
