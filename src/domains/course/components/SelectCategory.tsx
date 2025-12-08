'use client';

import { ChangeEvent } from 'react';
import { CATEGORY } from '../constants/category';
import styles from './CourseForm.module.css';

type SelectCategoryProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
  id?: string;
};

type CategoryObject = Record<string, Record<string, string[]>>;

const CATEGORY_OBJ = CATEGORY as CategoryObject;

export function SelectCategory({ value = [], onChange, id }: SelectCategoryProps) {
  const first = value[0] ?? '';
  const second = value[1] ?? '';
  const third = value[2] ?? '';

  const firstCategories = Object.keys(CATEGORY_OBJ).filter((key) => key !== '전체');
  const secondCategories = first ? Object.keys(CATEGORY_OBJ[first] ?? {}) : [];
  const thirdCategories = first && second ? (CATEGORY_OBJ[first]?.[second] ?? []) : [];

  const handleFirstChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextFirst = e.target.value;
    // 1차만 선택된 상태로 리셋
    onChange?.([nextFirst]);
  };

  const handleSecondChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextSecond = e.target.value;
    // 1차 + 2차까지만
    onChange?.([first, nextSecond]);
  };

  const handleThirdChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextThird = e.target.value;
    // 1차 + 2차 + 3차
    onChange?.([first, second, nextThird]);
  };

  return (
    <>
      <div className={styles['course-form__category-group']}>
        {/* 1차 카테고리 */}
        <select
          id={id}
          value={first}
          onChange={handleFirstChange}
          className={styles['course-form__select']}
        >
          <option value="" disabled>
            1차 카테고리 선택
          </option>
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
          <option value="" disabled>
            2차 카테고리 선택
          </option>
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
          <option value="" disabled>
            3차 카테고리 선택
          </option>
          {thirdCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <p className={styles['course-form__hint']}>
        선택된 카테고리:{' '}
        {first && second && third ? `${first} > ${second} > ${third}` : '아직 선택되지 않음'}
      </p>
    </>
  );
}
