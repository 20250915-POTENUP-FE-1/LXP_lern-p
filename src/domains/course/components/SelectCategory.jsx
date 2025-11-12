import { useEffect, useState } from 'react';
import { CATEGORY } from '../constants/category';
import styles from './CourseForm.module.css';

export function SelectCategory({ value = [], onChange }) {
  const [first, setFirst] = useState(value[0] || '');
  const [second, setSecond] = useState(value[1] || '');
  const [third, setThird] = useState(value[2] || '');

  const firstCategories = Object.keys(CATEGORY).filter((key) => key !== '전체');
  const secondCategories = first ? Object.keys(CATEGORY[first]) : [];
  const thirdCategories = first && second ? CATEGORY[first][second] || [] : [];

  // 첫, 두, 세 카테고리 중 하나라도 바뀌면 상위로 알림
  useEffect(() => {
    if (onChange) onChange([first, second, third].filter(Boolean));
  }, [first, second, third]);

  const handleFirstChange = (e) => {
    setFirst(e.target.value);
    setSecond('');
    setThird('');
  };

  const handleSecondChange = (e) => {
    setSecond(e.target.value);
    setThird('');
  };

  const handleThirdChange = (e) => {
    setThird(e.target.value);
  };

  return (
    <>
      <div className={styles['course-form__category-group']}>
        {/* 1차 카테고리 */}
        <select
          value={first}
          onChange={handleFirstChange}
          className={styles['course-form__select']}
        >
          <option value="">1차 카테고리 선택</option>
          {firstCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* 2차 카테고리 */}
        <select
          value={second}
          onChange={handleSecondChange}
          className={styles['course-form__select']}
          disabled={!first}
        >
          <option value="">2차 카테고리 선택</option>
          {secondCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* 3차 카테고리 */}
        <select
          value={third}
          onChange={handleThirdChange}
          className={styles['course-form__select']}
          disabled={!second}
        >
          <option value="">3차 카테고리 선택</option>
          {thirdCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 선택 상태 표시 */}
      <p className={styles['course-form__hint']}>
        선택된 카테고리:{' '}
        {first && second && third ? `${first} > ${second} > ${third}` : '아직 선택되지 않음'}
      </p>
    </>
  );
}
