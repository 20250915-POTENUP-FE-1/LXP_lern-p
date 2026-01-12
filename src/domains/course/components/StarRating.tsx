import styles from '@/domains/course/components/StarRating.module.css';

export type StarRatingProps = {
  value: number; // 1~5
};

export function StarRating({ value }: StarRatingProps) {
  const filled = Math.round(value); // rating이 4.8 같은 값이어도 처리 가능
  return (
    <div className={styles['star-rating']} aria-label={`별점 ${value}점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={[
            styles['star'],
            i < filled ? styles['star--active'] : styles['star--inactive'],
          ].join(' ')}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}
