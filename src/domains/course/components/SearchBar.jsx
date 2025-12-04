import React from 'react';
import styles from './SearchBar.module.css';

export function SearchBar() {
  return (
    <form
      className={`${styles['search-bar']} ${styles['search-bar--center']}`}
      role="search"
      aria-label="강좌 검색"
    >
      <label htmlFor="course-list-search" className="sr-only">
        검색어
      </label>
      <input
        id="course-list-search"
        type="search"
        className={styles['search-bar__input']}
        placeholder="제목, 강사명, 카테고리 검색"
        aria-describedby="course-list-search-hint"
      />
      <span id="course-list-search-hint" className="sr-only">
        엔터 키로 검색
      </span>
      <button type="submit" className={styles['search-bar__button']}>
        검색
      </button>
    </form>
  );
}
