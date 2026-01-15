'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { formatDuration, formatLectureDuration } from '../utils/formatDuration';
import { RESOURCE_CONFIG } from '../constants/resource';
import styles from './CourseForm.module.css';

export type ResourceType = 'VIDEO' | 'PDF' | 'DOC' | 'ZIP';

export type UploadResult = {
  resourceType: ResourceType;

  resourceKey: string;
  previewUrl?: string; // VIDEO 미리보기(대개 blob URL)
  displayUrl?: string; // 문서류 표시/다운로드 링크(선택)

  isDownloadable: boolean;
  duration?: number | null;
  fileName?: string;
  multiFile?: File;
};

type ResourceUploaderProps = {
  initialValue?: UploadResult;
  onUploadComplete?: (result: UploadResult) => void;
  onRemove?: () => void;
};

function getFileNameFromUrl(url: string) {
  if (!url) return '';
  const raw = url.split('/').pop()?.split('?')[0] ?? '';
  try {
    return raw ? decodeURIComponent(raw) : '';
  } catch {
    return raw;
  }
}

async function getVideoDurationSeconds(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;

    video.onloadedmetadata = () => {
      const totalSeconds = Number.isFinite(video.duration) ? video.duration : 0;
      const roundedSeconds = Math.max(0, Math.round(totalSeconds));

      // 메모리 정리
      video.removeAttribute('src');
      video.load();

      resolve(roundedSeconds);
    };

    video.onerror = () => reject(new Error('비디오 메타데이터를 읽을 수 없습니다.'));
  });
}

export function ResourceUploader({
  initialValue,
  onUploadComplete,
  onRemove,
}: ResourceUploaderProps) {
  // ===== "로컬(draft)"만 state로 관리 (props->state 동기화 useEffect 제거) =====
  const [draftType, setDraftType] = useState<ResourceType | null>(null);
  const [uploading, setUploading] = useState(false);

  const [draftPreviewUrl, setDraftPreviewUrl] = useState<string>(''); // blob url
  const [draftDisplayUrl, setDraftDisplayUrl] = useState<string>('');
  const [draftFileName, setDraftFileName] = useState<string>('');
  const [draftDuration, setDraftDuration] = useState<number | null>(null);
  const [draftIsDownloadable, setDraftIsDownloadable] = useState<boolean | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const effectiveType: ResourceType = draftType ?? initialValue?.resourceType ?? 'VIDEO';

  // 저장 기준 key
  const initialResourceKey = initialValue?.resourceKey ?? '';

  // 미리보기/표시 URL은 key가 아니라 별도 필드로 관리
  const initialPreviewUrl = initialValue?.previewUrl ?? '';
  const initialDisplayUrl = initialValue?.displayUrl ?? '';

  const effectivePreviewUrl = draftPreviewUrl || initialPreviewUrl;
  const effectiveDisplayUrl = draftDisplayUrl || initialDisplayUrl;

  const initialName =
    initialValue?.fileName ??
    getFileNameFromUrl(effectiveDisplayUrl) ??
    getFileNameFromUrl(initialPreviewUrl);

  const effectiveFileName = draftFileName || initialName;

  const effectiveDuration =
    effectiveType === 'VIDEO' ? (draftDuration ?? initialValue?.duration ?? null) : null;

  const effectiveIsDownloadable =
    effectiveType === 'VIDEO'
      ? false
      : (draftIsDownloadable ?? initialValue?.isDownloadable ?? true);

  const config = RESOURCE_CONFIG[effectiveType];
  const maxSizeBytes = useMemo(() => config.maxSizeMB * 1024 * 1024, [config.maxSizeMB]);

  const revokeBlobIfAny = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  // 언마운트 시 blob 정리 (setState 없음)
  useEffect(() => {
    return () => {
      revokeBlobIfAny();
    };
  }, []);

  const resetDraftFileOnly = () => {
    revokeBlobIfAny();
    setUploading(false);
    setDraftPreviewUrl('');
    setDraftDisplayUrl('');
    setDraftFileName('');
    setDraftDuration(null);
    setDraftIsDownloadable(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleResourceTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ResourceType;

    const hasAnyFile = Boolean(effectiveFileName) || Boolean(initialResourceKey);
    if (hasAnyFile) {
      const confirmed = window.confirm(
        '파일 종류를 변경하면 업로드된 파일이 초기화됩니다. 계속하시겠습니까?',
      );
      if (!confirmed) return;
    }

    // 타입 바꾸면 파일은 초기화
    resetDraftFileOnly();

    setDraftType(newType);
    // VIDEO는 다운로드 불가, 나머지는 기본 true
    setDraftIsDownloadable(newType !== 'VIDEO');
  };

  const handleRemoveFile = () => {
    resetDraftFileOnly();
    onRemove?.();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeBytes) {
      alert(`파일 크기는 ${config.maxSizeMB}MB 이하여야 합니다.`);
      resetDraftFileOnly();
      return;
    }

    setUploading(true);
    setDraftFileName(file.name);

    // 이전 blob 정리 후 새 blob 생성
    revokeBlobIfAny();
    const objectUrl = URL.createObjectURL(file);
    blobUrlRef.current = objectUrl;
    setDraftPreviewUrl(objectUrl);

    try {
      let videoSeconds: number | null = null;

      if (effectiveType === 'VIDEO') {
        videoSeconds = await getVideoDurationSeconds(objectUrl);
        setDraftDuration(videoSeconds);
      } else {
        setDraftDuration(null);
      }

      // TODO: 저장용 storedKey (지금은 더미. 실제로는 업로드 API 응답에서 받는 게 정석)
      setUploading(false);

      const storedKey = `tmp/${effectiveType}/${Date.now()}_${encodeURIComponent(file.name)}`;
      console.log('UPLOAD RESULT', {
        resourceKey: storedKey,
        type: effectiveType,
      });

      onUploadComplete?.({
        resourceType: effectiveType,
        resourceKey: storedKey, // TODO: 실제 resourseKey 넣기
        previewUrl: effectiveType === 'VIDEO' ? objectUrl : undefined,
        displayUrl: effectiveType === 'VIDEO' ? undefined : objectUrl,
        isDownloadable: effectiveType === 'VIDEO' ? false : effectiveIsDownloadable,
        duration: videoSeconds ?? undefined,
        fileName: file.name,
        multiFile: file,
      });
    } catch (err) {
      let msg = '파일 처리 중 오류가 발생했습니다.';
      if (err instanceof Error) {
        msg = err.message.includes('metadata')
          ? '비디오 파일이 손상되었거나 지원하지 않는 형식입니다.'
          : err.message;
      }
      alert(msg);
      resetDraftFileOnly();
    }
  };

  return (
    <div className={styles['upload-card']}>
      <div className={`${styles['form__field-item']} ${styles['upload-card__item']}`}>
        {/* ===== 파일 종류 선택 ===== */}
        <div className={styles['form__field']}>
          <label className={styles['form__label']}>파일 종류</label>
          <select
            value={effectiveType}
            onChange={handleResourceTypeChange}
            disabled={uploading}
            className={styles['form__control']}
          >
            <option value="VIDEO">동영상 (VIDEO)</option>
            <option value="PDF">PDF 문서</option>
            <option value="DOC">문서 파일 (DOC/DOCX)</option>
            <option value="ZIP">압축 파일 (ZIP)</option>
          </select>
        </div>

        {/* ===== 다운로드 가능 (VIDEO 제외) ===== */}
        {effectiveType !== 'VIDEO' && (
          <div className={styles['form__field']}>
            <label className={styles['form__checkbox']}>
              <input
                type="checkbox"
                checked={effectiveIsDownloadable}
                onChange={(e) => setDraftIsDownloadable(e.target.checked)}
              />
              <span>다운로드 가능</span>
            </label>
          </div>
        )}

        {/* ===== 파일 선택 ===== */}
        <div className={styles['form__field']}>
          <label className={styles['form__label']}>파일 선택</label>
          <input
            ref={inputRef}
            type="file"
            accept={config.accept}
            onChange={handleFileChange}
            disabled={uploading}
            className={styles['form__control']}
          />
          {!effectiveFileName && <p className={styles['upload__hint']}>{config.hint}</p>}
        </div>

        {uploading && <p className={styles['upload__status']}>업로드 중...</p>}
      </div>

      <div className={`${styles['form__field-item']} ${styles['upload-card__preview']}`}>
        {effectiveType === 'VIDEO' && effectivePreviewUrl && (
          <video
            src={effectivePreviewUrl}
            controls
            className={styles['upload__preview']}
            onLoadedMetadata={(event) => {
              // draftDuration 없을 때만 보정
              if (draftDuration && draftDuration > 0) return;
              const secs = Math.max(0, Math.round(event.currentTarget.duration || 0));
              if (secs > 0) setDraftDuration(secs);
            }}
          />
        )}

        {effectiveFileName && !uploading && (
          <div className={`${styles['upload__info']} ${styles['upload__info--bottom']}`}>
            <div className={styles['upload__info-header']}>
              <p className={styles['upload__hint']}>
                {effectiveFileName}
                {effectiveType === 'VIDEO' && effectiveDuration !== null && (
                  <span>
                    {' '}
                    (길이:{' '}
                    {effectiveDuration >= 60
                      ? formatDuration(Math.max(1, Math.round(effectiveDuration / 60)))
                      : formatLectureDuration(effectiveDuration)}
                    )
                  </span>
                )}
              </p>

              <button
                type="button"
                onClick={handleRemoveFile}
                className={styles['upload__remove-btn']}
              >
                ✕
              </button>
            </div>

            {effectiveIsDownloadable && effectiveType !== 'VIDEO' && (
              <p className={styles['upload__hint']}>다운로드 가능</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
