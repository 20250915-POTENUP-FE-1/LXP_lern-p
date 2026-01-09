'use client';

import { useState } from 'react';

export default function CourseReviewSection() {
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!rating || !content.trim()) {
      alert('평점과 리뷰를 입력해주세요.');
      return;
    }

    // 지금은 콘솔로만 확인 (API 연결 전)
    console.log({
      rating,
      content,
    });

    // 임시 초기화
    setRating(0);
    setContent('');
  };

  return (
    <div>
      <div>
        <div>
          {/*별점*/}

          <div>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: value <= rating ? '#f5c518' : '#ccc',
                }}
                aria-label={`${value}점`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        {/* 리뷰내용 */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="강좌에 대한 솔직한 후기를 남겨주세요"
            rows={4}
            className="width"
          />
        </div>

        <button type="button" onClick={handleSubmit}>
          리뷰 등록
        </button>
      </div>
    </div>
  );
}
