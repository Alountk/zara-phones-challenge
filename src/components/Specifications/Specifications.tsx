import { NormalizedPhoneDetail, NormalizedPhoneSummary } from '@/types/phone';
import styles from './Specifications.module.scss';

export default function Specifications({ phone }: { phone: NormalizedPhoneDetail }) {
  const { name, brand, basePrice, specs } = phone;
  const specsArray = [
    {
      label: 'Brand',
      value: brand,
    },
    {
      label: 'Name',
      value: name,
    },
    ...Object.entries(specs).map(([label, value]) => ({
      label,
      value,
    })),
  ];
  return (
    <section className={styles['specifications']}>
      <h2 className={styles['title']}>Specifications</h2>
      {specsArray.map((spec) => (
        <div key={spec.label} className={styles['row']}>
          <span className={styles['label']}>{spec.label}</span>
          <span className={styles['value']}>{spec.value}</span>
        </div>
      ))}
    </section>
  );
}
