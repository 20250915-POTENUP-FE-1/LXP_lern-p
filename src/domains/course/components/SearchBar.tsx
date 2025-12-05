import styles from './SearchBar.module.css';

type SearchBarProps = {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSubmit: () => void;
};

export function SearchBar({ keyword, onKeywordChange, onSubmit }: SearchBarProps) {
  return (
    <form
      className={`${styles['search-bar']} ${styles['search-bar--center']}`}
      role="search"
      aria-label="강좌 검색"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="course-list-search" className="sr-only">
        검색어
      </label>
      <input
        id="course-list-search"
        type="search"
        value={keyword}
        className={styles['search-bar__input']}
        placeholder="제목, 강사명, 카테고리 검색"
        aria-describedby="course-list-search-hint"
        onChange={(e) => onKeywordChange(e.target.value)}
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
