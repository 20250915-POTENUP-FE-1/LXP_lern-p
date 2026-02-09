'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useCourseListQuery } from '../hooks/useCourseListQuery';
import styles from './SearchBar.module.css';

export function SearchBar() {
  const { title, setTitle } = useCourseListQuery();
  const [inputValue, setInputValue] = useState(title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTitle(inputValue.trim());
  };

  return (
    <form
      className={styles['search-bar']}
      role="search"
      aria-label="강좌 검색"
      onSubmit={handleSubmit}
    >
      <Search size={18} className={styles['search-bar__icon']} />
      <label htmlFor="course-list-search" className="sr-only">
        검색어
      </label>
      <input
        id="course-list-search"
        type="search"
        className={styles['search-bar__input']}
        placeholder="강좌명 검색"
        aria-describedby="course-list-search-hint"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <span id="course-list-search-hint" className="sr-only">
        엔터 키로 검색
      </span>
      <button type="submit" className={styles['search-bar__button']}>
        <Search size={18} />
      </button>
    </form>
  );
}
