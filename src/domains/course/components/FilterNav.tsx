'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Pencil,
  Scissors,
  CookingPot,
  Music,
  Camera,
  TrendingUp,
  Rocket,
  Brain,
  Bot,
  Code,
  Database,
  ClipboardList,
  Briefcase,
  Zap,
  Megaphone,
  Palette,
  Film,
  Languages,
  GraduationCap,
  Globe,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './FilterNav.module.css';

/** categoryId를 포함한 카테고리 맵 */
export type CategoryMapEntry = {
  categoryId: number;
  children: { categoryId: number; name: string }[];
};
export type CategoryMap = Record<string, CategoryMapEntry>;

interface FilterNavProps {
  categoryMap: CategoryMap;
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export function FilterNav({ categoryMap, selectedCategoryId, onSelectCategory }: FilterNavProps) {
  const [expandedFirst, setExpandedFirst] = useState<string | null>('전체');

  const firstCategories = ['전체', ...Object.keys(categoryMap)];

  const secondCategories =
    expandedFirst && expandedFirst !== '전체' ? (categoryMap[expandedFirst]?.children ?? []) : [];

  const handleFirstClick = (cat: string) => {
    if (cat === '전체') {
      setExpandedFirst('전체');
      onSelectCategory(null);
      return;
    }

    if (cat === expandedFirst) {
      setExpandedFirst(null);
      onSelectCategory(null);
      return;
    }
    setExpandedFirst(cat);
    // 1차 카테고리 클릭 시 해당 categoryId로 필터
    const entry = categoryMap[cat];
    onSelectCategory(entry ? entry.categoryId : null);
  };

  const handleSecondClick = (child: { categoryId: number; name: string }) => {
    if (selectedCategoryId === child.categoryId) {
      // 이미 선택된 2차 카테고리를 다시 클릭 → 1차로 복귀
      const entry = expandedFirst ? categoryMap[expandedFirst] : null;
      onSelectCategory(entry ? entry.categoryId : null);
    } else {
      onSelectCategory(child.categoryId);
    }
  };

  useEffect(() => {
    if (selectedCategoryId == null) {
      setExpandedFirst('전체');
      return;
    }

    const parentEntry = Object.entries(categoryMap).find(
      ([, entry]) => entry.categoryId === selectedCategoryId,
    );
    if (parentEntry) {
      setExpandedFirst(parentEntry[0]);
      return;
    }

    const childEntry = Object.entries(categoryMap).find(([, entry]) =>
      entry.children.some((child) => child.categoryId === selectedCategoryId),
    );
    if (childEntry) {
      setExpandedFirst(childEntry[0]);
      return;
    }

    setExpandedFirst(null);
  }, [categoryMap, selectedCategoryId]);

  return (
    <nav className={styles['filter-nav']} aria-label="카테고리 필터">
      <ScrollableRow className={styles['filter-nav__row--primary']}>
        {firstCategories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] ?? Layers;
          const entry = categoryMap[cat];
          const isActive =
            cat === '전체'
              ? selectedCategoryId == null
              : expandedFirst === cat || selectedCategoryId === entry?.categoryId;
          return (
            <li key={cat}>
              <button
                type="button"
                className={`${styles['filter-nav__item']} ${
                  isActive ? styles['filter-nav__item--active'] : ''
                }`}
                onClick={() => handleFirstClick(cat)}
                aria-pressed={isActive}
              >
                <Icon size={22} strokeWidth={1.5} />
                <span className={styles['filter-nav__label']}>{cat}</span>
              </button>
            </li>
          );
        })}
      </ScrollableRow>

      {secondCategories.length > 0 && (
        <ScrollableRow className={styles['filter-nav__row--secondary']}>
          {secondCategories.map((child) => (
            <li key={child.categoryId}>
              <button
                type="button"
                className={`${styles['filter-nav__chip']} ${
                  selectedCategoryId === child.categoryId ? styles['filter-nav__chip--active'] : ''
                }`}
                onClick={() => handleSecondClick(child)}
                aria-pressed={selectedCategoryId === child.categoryId}
              >
                {child.name}
              </button>
            </li>
          ))}
        </ScrollableRow>
      )}
    </nav>
  );
}

function ScrollableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = listRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, children]);

  const scroll = (direction: 'left' | 'right') => {
    const el = listRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className={`${styles['filter-nav__row']} ${className ?? ''}`}>
      {canScrollLeft && (
        <button
          type="button"
          className={`${styles['filter-nav__arrow']} ${styles['filter-nav__arrow--left']}`}
          onClick={() => scroll('left')}
          aria-label="이전 카테고리 보기"
        >
          ‹
        </button>
      )}
      <ul ref={listRef} className={styles['filter-nav__list']}>
        {children}
      </ul>
      {canScrollRight && (
        <button
          type="button"
          className={`${styles['filter-nav__arrow']} ${styles['filter-nav__arrow--right']}`}
          onClick={() => scroll('right')}
          aria-label="다음 카테고리 보기"
        >
          ›
        </button>
      )}
    </div>
  );
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  전체: Layers,
  드로잉: Pencil,
  공예: Scissors,
  '요리·음료': CookingPot,
  음악: Music,
  '사진·영상': Camera,
  '금융·재테크': TrendingUp,
  '창업·부업': Rocket,
  성공마인드: Brain,
  AI스킬업: Bot,
  프로그래밍: Code,
  데이터사이언스: Database,
  기획: ClipboardList,
  비즈니스: Briefcase,
  생산성: Zap,
  마케팅: Megaphone,
  디자인: Palette,
  영상3D: Film,
  영어: Languages,
  외국어시험: GraduationCap,
  제2외국어: Globe,
};
