const SIZE_MB = {
  VIDEO: 1024, // 1GB, 해상도 720p 기준 약 10시간
  IMAGE: 5, // 예: 5MB (필요하면 조정)
  PDF: 50, // 50MB
  DOC: 50, // 50MB
  ZIP: 1024, // 1GB
} as const;

export const IMAGE_MIME_TYPES = [
  'image/jpeg', // jpg, jpeg
  'image/png',
  'image/webp',
] as const;

export const RESOURCE_CONFIG = {
  IMAGE: {
    label: '이미지',
    accept: IMAGE_MIME_TYPES.join(','),
    maxSizeMB: SIZE_MB.IMAGE,
    hint: `jpg, png, webp 이미지를 업로드하세요 (최대 ${SIZE_MB.IMAGE}MB)`,
  },
  VIDEO: {
    label: '동영상',
    accept: 'video/*',
    maxSizeMB: SIZE_MB.VIDEO,
    hint: `MP4 형식의 비디오를 업로드하세요 (최대 ${SIZE_MB.VIDEO}MB)`,
  },
  PDF: {
    label: 'PDF 문서',
    accept: 'application/pdf',
    maxSizeMB: SIZE_MB.PDF,
    hint: `PDF 파일을 업로드하세요 (최대 ${SIZE_MB.PDF}MB)`,
  },
  DOC: {
    label: '문서 파일',
    accept: '.doc',
    maxSizeMB: SIZE_MB.DOC,
    hint: `DOC(.doc) 파일을 업로드하세요 (최대 ${SIZE_MB.DOC}MB)`,
  },
  ZIP: {
    label: '압축 파일',
    accept: '.zip,.rar',
    maxSizeMB: SIZE_MB.ZIP,
    hint: `ZIP, RAR 파일을 업로드하세요 (최대 ${SIZE_MB.ZIP}MB)`,
  },
} as const;
