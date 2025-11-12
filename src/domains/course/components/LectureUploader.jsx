import { useState } from 'react';
import { formatDuration } from '../utils/formatDuration';
import styles from './CourseForm.module.css';

/**
 * LectureUploader
 * - 로컬 비디오 미리보기 + 재생시간(duration) 자동 계산
 */
export function LectureUploader({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFileName(file.name);

    try {
      const url = URL.createObjectURL(file);

      // 비디오 메타데이터 로드 후 duration 계산
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        const totalSeconds = tempVideo.duration;
        const totalMinutes = Math.floor(totalSeconds / 60);
        setDuration(totalMinutes);
        setVideoUrl(url);
        setUploading(false);

        // 부모 컴포넌트에 전달
        onUploadComplete?.({
          videoUrl: url,
          duration: Number(totalMinutes.toFixed(2)), //  분 단위 숫자
        });
      };
    } catch (err) {
      alert('비디오 처리 중 오류가 발생했습니다: ' + err.message);
      setUploading(false);
    }
  };

  return (
    <div className={styles['upload-card']}>
      {/* 파일 선택 */}
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={uploading}
        className={styles['form__control']}
      />

      {uploading && <p className={styles['upload__hint']}>업로드 중... </p>}
      {videoUrl && <video src={videoUrl} controls className={styles['upload__preview']} />}
      {fileName && !uploading && (
        <p className={styles['upload__hint']}>
          {fileName} {duration && `(${formatDuration(duration)})`}
        </p>
      )}

      {/* 안내문 */}
      {!fileName && (
        <p className={styles['upload__hint']}>
          MP4, WebM 형식의 비디오를 업로드하세요 (최대 200MB 권장)
        </p>
      )}
    </div>
  );
}
