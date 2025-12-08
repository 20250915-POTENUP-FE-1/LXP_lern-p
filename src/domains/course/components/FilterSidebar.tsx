'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './FilterSidebar.module.css';

export function FilterSidebar() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category],
    );
    router.push(`/?cat=${category}`); // 카테고리 쿼리로 URL 업데이트
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((item) => item !== level) : [...prev, level],
    );
    router.push(`/?level=${level}`); // 난이도 쿼리로 URL 업데이트
  };

  return (
    <>
      <nav
        className={`${styles['sidebar']} ${styles['sidebar--left']} ${styles['sidebar--floating']} ${styles['filter--desktop']}`}
        aria-label="카테고리 및 난이도 필터"
      >
        <div className={styles['filter']}>
          <h2 className={styles['filter__title']}>필터</h2>

          <section
            className={`${styles['filter__section']} ${styles['filter__section--category']}`}
            aria-labelledby="filter-cat-title"
          >
            <h3 id="filter-cat-title" className={styles['filter__section-title']}>
              카테고리
            </h3>
            <ul className={`${styles['filter__list']} ${styles['filter__list--depth1']}`}>
              <li className={styles['filter__item']}>
                <Link
                  href="/?cat=frontend"
                  className={styles['filter__link']}
                  onClick={() => handleCategoryChange('frontend')}
                >
                  프론트엔드
                </Link>
              </li>
              <li className={styles['filter__item']}>
                <Link
                  href="/?cat=backend"
                  className={styles['filter__link']}
                  onClick={() => handleCategoryChange('backend')}
                >
                  백엔드
                </Link>
              </li>
            </ul>
          </section>

          <section
            className={`${styles['filter__section']} ${styles['filter__section--level']}`}
            aria-labelledby="filter-level-title"
          >
            <h3 id="filter-level-title" className={styles['filter__section-title']}>
              난이도
            </h3>
            <ul className={styles['filter__list']}>
              <li className={styles['filter__item']}>
                <label className={styles['filter__checkbox']}>
                  <input
                    type="checkbox"
                    className={styles['filter__checkbox-input']}
                    onChange={() => handleLevelChange('beginner')}
                  />
                  <span className={styles['filter__checkbox-label']}>입문</span>
                </label>
              </li>
              <li className={styles['filter__item']}>
                <label className={styles['filter__checkbox']}>
                  <input
                    type="checkbox"
                    className={styles['filter__checkbox-input']}
                    onChange={() => handleLevelChange('intermediate')}
                  />
                  <span className={styles['filter__checkbox-label']}>중급</span>
                </label>
              </li>
              <li className={styles['filter__item']}>
                <label className={styles['filter__checkbox']}>
                  <input
                    type="checkbox"
                    className={styles['filter__checkbox-input']}
                    onChange={() => handleLevelChange('advanced')}
                  />
                  <span className={styles['filter__checkbox-label']}>고급</span>
                </label>
              </li>
            </ul>
          </section>
        </div>
      </nav>

      <details
        className={`${styles['sidebar']} ${styles['sidebar--collapsible']} ${styles['filter--mobile']}`}
      >
        <summary className={styles['sidebar__summary']} aria-label="필터 열기">
          필터
        </summary>
        <div className={styles['sidebar__panel']}>
          <div className={styles['filter']}>
            <section
              className={`${styles['filter__section']} ${styles['filter__section--category']}`}
              aria-label="카테고리"
            >
              <h3 className={styles['filter__section-title']}>카테고리</h3>
              <ul className={`${styles['filter__list']} ${styles['filter__list--depth1']}`}>
                <li className={styles['filter__item']}>
                  <Link href="/?cat=frontend" className={styles['filter__link']}>
                    프론트엔드
                  </Link>
                </li>
                <li className={styles['filter__item']}>
                  <Link href="/?cat=backend" className={styles['filter__link']}>
                    백엔드
                  </Link>
                </li>
              </ul>
            </section>

            <section
              className={`${styles['filter__section']} ${styles['filter__section--level']}`}
              aria-label="난이도"
            >
              <h3 className={styles['filter__section-title']}>난이도</h3>
              <ul className={styles['filter__list']}>
                <li className={styles['filter__item']}>
                  <label className={styles['filter__checkbox']}>
                    <input
                      type="checkbox"
                      className={styles['filter__checkbox-input']}
                      onChange={() => handleLevelChange('beginner')}
                    />
                    <span className={styles['filter__checkbox-label']}>입문</span>
                  </label>
                </li>
                <li className={styles['filter__item']}>
                  <label className={styles['filter__checkbox']}>
                    <input
                      type="checkbox"
                      className={styles['filter__checkbox-input']}
                      onChange={() => handleLevelChange('intermediate')}
                    />
                    <span className={styles['filter__checkbox-label']}>중급</span>
                  </label>
                </li>
                <li className={styles['filter__item']}>
                  <label className={styles['filter__checkbox']}>
                    <input
                      type="checkbox"
                      className={styles['filter__checkbox-input']}
                      onChange={() => handleLevelChange('advanced')}
                    />
                    <span className={styles['filter__checkbox-label']}>고급</span>
                  </label>
                </li>
              </ul>
            </section>

            <Link href="#" className={styles['sidebar__close']} aria-label="필터 닫기">
              닫기
            </Link>
          </div>
        </div>
      </details>
    </>
  );
}
