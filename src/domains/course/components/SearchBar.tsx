'use client';

import { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

export function SearchBar() {
  const router = useRouter();
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    router.push(`/?search=${query}`);
  };

  return (
    <form className={styles['search-bar']} role="search" aria-label="강좌 검색">
      <Search size={18} className={styles['search-bar__icon']} />
      <label htmlFor="course-list-search" className="sr-only">
        검색어
      </label>
      <input
        id="course-list-search"
        type="search"
        className={styles['search-bar__input']}
        placeholder="제목, 강사명, 카테고리 검색"
        aria-describedby="course-list-search-hint"
        onChange={handleSearchChange}
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
