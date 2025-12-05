'use client';

import { useState, type ChangeEvent } from 'react';
import { formatDuration } from '../utils/formatDuration';
import styles from './CourseForm.module.css';

type LectureUploaderProps = {
  onUploadComplete?: (payload: { videoUrl: string; duration: number }) => void;
};

export function LectureUploader({ onUploadComplete }: LectureUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState<number | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    try {
      const url = URL.createObjectURL(file);

      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = url;

      tempVideo.onloadedmetadata = () => {
        const totalSeconds = tempVideo.duration || 0;
        const totalMinutes = Math.floor(totalSeconds / 60);

        setDuration(totalMinutes);
        setVideoUrl(url);
        setUploading(false);

        onUploadComplete?.({
          videoUrl: url,
          duration: totalMinutes,
        });
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : '비디오 처리 중 오류가 발생했습니다.';
      alert(msg);
      setUploading(false);
    }
  };

  return (
    <div className={styles['upload-card']}>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={uploading}
        className={styles['form__control']}
      />

      {uploading && <p className={styles['upload__hint']}>업로드 중...</p>}

      {videoUrl && <video src={videoUrl} controls className={styles['upload__preview']} />}

      {fileName && !uploading && (
        <p className={styles['upload__hint']}>
          {fileName}
          {duration !== null && ` (${formatDuration(duration)})`}
        </p>
      )}

      {!fileName && (
        <p className={styles['upload__hint']}>
          MP4, WebM 형식의 비디오를 업로드하세요 (최대 200MB 권장)
        </p>
      )}
    </div>
  );
}
