'use client';

import styles from './CourseApplyModal.module.css';

export type SortOption = 'latest' | 'popular' | 'oldest';

type CourseSortProps = {
  value: SortOption;
  onChange: (sort: SortOption) => void;
};

export function CourseSort({ value, onChange }: CourseSortProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as SortOption);
  };
  return (
    <div className={styles.sort}>
      <label className={styles.label}>
        정렬
        <select className={styles.select} value={value} onChange={handleChange}>
          <option value="latest">최신순</option>
          <option value="popular">수강인원순</option>
          <option value="oldest">오래된 순</option>
        </select>
      </label>
    </div>
  );
}
