'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { formatDuration } from '../utils/formatDuration';
import styles from './CourseForm.module.css';
import { RESOURCE_CONFIG } from '../constants/resource';

export type ResourceType = 'VIDEO' | 'PDF' | 'DOC' | 'ZIP';

export type UploadResult = {
  resourceType: ResourceType;
  fileUrl: string;
  isDownloadable: boolean;
  duration?: number | null;
  fileName?: string | undefined;
};

type ResourceUploaderProps = {
  initialValue?: UploadResult;
  onUploadComplete?: (result: UploadResult) => void;
  onRemove?: () => void;
};

export function ResourceUploader({
  initialValue,
  onUploadComplete,
  onRemove,
}: ResourceUploaderProps) {
  const [resourceType, setResourceType] = useState<ResourceType>(
    initialValue?.resourceType ?? 'VIDEO',
  );

  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState(initialValue?.fileName ?? '');
  const [fileUrl, setFileUrl] = useState('');
  const [duration, setDuration] = useState<number | null>(initialValue?.duration ?? null);
  const [isDownloadable, setIsDownloadable] = useState(initialValue?.isDownloadable ?? false);

  useEffect(() => {
    if (initialValue && initialValue.fileUrl !== fileUrl) {
      setResourceType(initialValue.resourceType);
      setFileName(initialValue.fileName ?? '');
      setFileUrl(initialValue.fileUrl);
      setDuration(initialValue.duration ?? null);
      setIsDownloadable(initialValue.isDownloadable);
      const extractedName =
        initialValue.fileName ?? initialValue.fileUrl.split('/').pop()?.split('?')[0] ?? '';
      setFileName(extractedName ? decodeURIComponent(extractedName) : '');
    }
  }, [initialValue]);

  const handleResourceTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ResourceType;
    if (fileName) {
      const confirmed = window.confirm(
        '파일 종류를 변경하면 업로드된 파일이 초기화됩니다. 계속하시겠습니까?',
      );
      if (!confirmed) return;
    }

    setResourceType(newType);

    setFileName('');
    setFileUrl('');
    setDuration(null);
    setIsDownloadable(newType !== 'VIDEO');
  };

  const handleRemoveFile = () => {
    setFileName('');
    setFileUrl('');
    setDuration(null);
    onRemove?.();
  };
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = RESOURCE_CONFIG[resourceType].maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`파일 크기는 ${RESOURCE_CONFIG[resourceType].maxSizeMB}MB 이하여야 합니다.`);
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      const storedUrl = `/uploads/${encodeURIComponent(file.name)}`;

      let videoDuration: number | null = null;

      if (resourceType === 'VIDEO') {
        videoDuration = await calculateVideoDuration(url, file.name);
        setDuration(videoDuration);
      } else {
        setDuration(null);
      }

      setUploading(false);

      onUploadComplete?.({
        resourceType,
        fileUrl: storedUrl, // 서버/JSON에 저장될 값: blob 말고 문자열 경로
        isDownloadable,
        duration: videoDuration ?? undefined,
        fileName: file.name,
      });
    } catch (err) {
      let msg = '파일 처리 중 오류가 발생했습니다.';

      if (err instanceof Error) {
        if (err.message.includes('metadata')) {
          msg = '비디오 파일이 손상되었거나 지원하지 않는 형식입니다.';
        } else {
          msg = err.message;
        }
      }

      alert(msg);
      setUploading(false);

      setFileName('');
      setFileUrl('');
      setDuration(null);
    }
  };

  {
    /*const formData = new FormData();
formData.append('file', file);
formData.append('resourceType', resourceType);

const uploadRes = await fetch(`${BASE_URL}/files`, {
  method: 'POST',
  body: formData,
});
if (!uploadRes.ok) throw new Error('파일 업로드에 실패했습니다.');

const uploadJson = await uploadRes.json();
const storedUrl = uploadJson.data.fileUrl;  // 이제 진짜 URL*/
  }

  const calculateVideoDuration = (url: string, name: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = url;

      tempVideo.onloadedmetadata = () => {
        const totalSeconds = tempVideo.duration || 0;
        const totalMinutes = Math.floor(totalSeconds / 60);

        setDuration(totalMinutes);
        setUploading(false);

        onUploadComplete?.({
          resourceType: 'VIDEO',
          fileUrl: url,
          isDownloadable: false,
          duration: totalMinutes,
          fileName: name,
        });

        resolve(totalMinutes);
      };

      tempVideo.onerror = () => {
        reject(new Error('비디오 메타데이터를 읽을 수 없습니다.'));
      };
    });
  };

  const config = RESOURCE_CONFIG[resourceType];

  return (
    <div className={styles['upload-card']}>
      {/* ===== 파일 종류 선택 ===== */}
      <div className={styles['form__field']}>
        <label className={styles['form__label']}>파일 종류</label>
        <select
          value={resourceType}
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
      {resourceType !== 'VIDEO' && (
        <div className={styles['form__field']}>
          <label className={styles['form__checkbox']}>
            <input
              type="checkbox"
              checked={isDownloadable}
              onChange={(e) => setIsDownloadable(e.target.checked)}
            />
            <span>다운로드 가능</span>
          </label>
        </div>
      )}

      {/* ===== 파일 선택 ===== */}
      <div className={styles['form__field']}>
        <label className={styles['form__label']}>파일 선택</label>
        <input
          type="file"
          accept={config.accept}
          onChange={handleFileChange}
          disabled={uploading}
          className={styles['form__control']}
        />
      </div>

      {uploading && <p className={styles['upload__hint']}>업로드 중...</p>}

      {resourceType === 'VIDEO' && fileUrl && (
        <video src={fileUrl} controls className={styles['upload__preview']} />
      )}

      {fileName && !uploading && (
        <div className={styles['upload__info']}>
          <div className={styles['upload__info-header']}>
            <p className={styles['upload__hint']}>
              📎 {fileName}
              {resourceType === 'VIDEO' && duration !== null && (
                <span> (길이: {formatDuration(duration)})</span>
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
          {isDownloadable && resourceType !== 'VIDEO' && (
            <p className={styles['upload__hint']}>✅ 다운로드 가능</p>
          )}
        </div>
      )}
      {!fileName && <p className={styles['upload__hint']}>{config.hint}</p>}
    </div>
  );
}
