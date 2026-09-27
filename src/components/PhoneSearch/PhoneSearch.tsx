import styles from './PhoneSearch.module.scss';

export default function PhoneSearch({
  search,
  quantityResult,
}: {
  search: string;
  quantityResult: number;
}) {
  return (
    <div className={styles['search-wrapper']}>
      <div className={styles['search-bar']}>
        <input
          className={styles['input']}
          placeholder="Search for a smartphone..."
          value={search}
        />
        {search.length !== 0 && <button className={styles['clear-button']}>×</button>}
      </div>
      <div className={styles['search-results']}>{`${quantityResult} RESULTS`}</div>
    </div>
  );
}
