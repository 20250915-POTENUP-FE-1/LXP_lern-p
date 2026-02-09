'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import styles from './CourseForm.module.css';

type ThumbnailUploaderProps = {
  value?: string; // 부모에서 내려오는 썸네일(서버 url이든 base64든)
  onFileSelect?: (multiFile: File | null) => void; // 실제 파일 전달(업로드용)
  disabled?: boolean;
};

export function ThumbnailUploader({ value, onFileSelect, disabled }: ThumbnailUploaderProps) {
  // 로컬에서 "사용자가 방금 선택한" 미리보기만 관리 (props를 복사하지 않음)
  const [localPreview, setLocalPreview] = useState<string>('');

  // 화면에 보여줄 최종 미리보기: 로컬이 있으면 로컬, 없으면 value
  const previewUrl = useMemo(() => localPreview || value || '', [localPreview, value]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    // 파일 선택 취소/제거
    if (!file) {
      setLocalPreview('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있어요.');
      e.currentTarget.value = '';
      setLocalPreview('');
      onFileSelect?.(null);
      return;
    }

    // 용량 제한 (5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert('썸네일 파일은 최대 5MB까지 업로드할 수 있어요.');
      e.currentTarget.value = '';
      setLocalPreview('');
      onFileSelect?.(null);
      return;
    }

    // 부모에게 파일 전달(업로드 준비)
    onFileSelect?.(file);

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = String(reader.result ?? '');
      setLocalPreview(base64Url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className={`${styles['upload-card']} ${styles['upload-card--thumbnail']}`}>
      <div className={styles['upload-card__item']}>
        <input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles['form__control']}
          disabled={disabled}
        />

        <p className={styles['upload__hint']}>
          16:11 비율의 JPG 또는 PNG 파일(최대 5MB)을 업로드하세요.
        </p>

        {disabled && <p className={styles['upload__loading']}>썸네일 업로드 중입니다…</p>}

        <div className={styles['upload__preview']} data-has-image={previewUrl ? 'true' : 'false'}>
          {previewUrl ? (
            <Image src={previewUrl} alt="썸네일 미리보기" width={320} height={200} />
          ) : (
            <div className={styles['upload__preview-placeholder']}>
              <span>미리보기 없음</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
