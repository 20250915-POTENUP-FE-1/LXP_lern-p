'use client';

import { useRef, useEffect, useState } from 'react';
import { mockLoadPage } from '@/mocks/mockLoadPage';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

export default function InfiniteScrollTestPage() {
  const { items, isLoading, hasNext, setTarget, reset } = useInfiniteScroll({
    loadPage: mockLoadPage,
  });

  const prevLengthRef = useRef(0);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    setStartIndex(prevLengthRef.current);
    prevLengthRef.current = items.length;
  }, [items.length]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Infinite Scroll 테스트</h2>

      <button onClick={reset}>리셋</button>

      <ul>
        {items.map((item, index) => {
          const isNew = index >= startIndex;

          return (
            <li
              key={item.id}
              className={isNew ? 'item enter' : 'item'}
              style={{
                height: 200,
                backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#eaeaea',
              }}
            >
              {item.title}
            </li>
          );
        })}
      </ul>

      {hasNext && (
        <div
          ref={setTarget}
          style={{
            height: 40,
            background: '#eee',
            textAlign: 'center',
            lineHeight: '40px',
          }}
        >
          {isLoading ? '불러오는 중...' : '스크롤 더 내려보세요'}
        </div>
      )}
    </div>
  );
}
