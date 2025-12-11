'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import styles from './CourseForm.module.css';

type ThumbnailUploaderProps = {
  value?: string | null;
  onUploadComplete?: (url: string) => void;
};

export function ThumbnailUploader({ value, onUploadComplete }: ThumbnailUploaderProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setThumbnailUrl(value);
    } else {
      setThumbnailUrl(null);
    }
  }, [value]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = String(reader.result ?? '');
      setThumbnailUrl(base64Url);
      onUploadComplete?.(base64Url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className={styles['upload-card']}>
      {thumbnailUrl && (
        <div className={styles['upload__preview']}>
          <Image src={thumbnailUrl} alt="썸네일 미리보기" width={320} height={200} />
        </div>
      )}

      <input
        id="thumbnail"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles['form__control']}
      />

      <p className={styles['upload__hint']}>
        16:11 비율의 JPG 또는 PNG 파일(최대 5MB)을 업로드하세요.
      </p>
    </aside>
  );
}
