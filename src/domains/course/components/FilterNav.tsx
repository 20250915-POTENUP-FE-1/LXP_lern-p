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

export function FilterNav({
  categoryMap,
  selectedFirst,
  selectedSecond,
  onSelectFirst,
  onSelectSecond,
}: FilterNavProps) {
  const firstCategories = Object.keys(categoryMap);

  const secondCategories =
    selectedFirst && selectedFirst !== '전체' ? (categoryMap[selectedFirst] ?? []) : [];

  const handleFirstClick = (cat: string) => {
    if (cat === selectedFirst) {
      onSelectFirst(null);
      return;
    }
    onSelectFirst(cat);
    onSelectSecond(null);
  };

  return (
    <nav className={styles['filter-nav']} aria-label="카테고리 필터">
      <ScrollableRow className={styles['filter-nav__row--primary']}>
        {firstCategories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] ?? Layers;
          const isActive = selectedFirst === cat;
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
          {secondCategories.map((sub) => (
            <li key={sub}>
              <button
                type="button"
                className={`${styles['filter-nav__chip']} ${
                  selectedSecond === sub ? styles['filter-nav__chip--active'] : ''
                }`}
                onClick={() => onSelectSecond(selectedSecond === sub ? null : sub)}
                aria-pressed={selectedSecond === sub}
              >
                {sub}
              </button>
            </li>
          ))}
        </ScrollableRow>
      )}
    </nav>
  );
}

// API 응답을 변환한 공통 포맷: { '프로그래밍': ['웹개발', '프론트엔드', ...] }
export type CategoryMap = Record<string, readonly string[]>;

interface FilterNavProps {
  categoryMap: CategoryMap;
  selectedFirst: string | null;
  selectedSecond: string | null;
  onSelectFirst: (cat: string | null) => void;
  onSelectSecond: (sub: string | null) => void;
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
