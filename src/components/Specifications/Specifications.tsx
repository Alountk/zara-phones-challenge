import { NormalizedPhoneDetail } from '@/types/phone';
import styles from './Specifications.module.scss';

export default function Specifications({ phone }: { phone: NormalizedPhoneDetail }) {
  const { name, brand, specs } = phone;
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
      <dl className={styles['rows']}>
        {specsArray.map((spec) => (
          <div key={spec.label} className={styles['row']}>
            <dt className={styles['label']}>{spec.label}</dt>
            <dd className={styles['value']}>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
