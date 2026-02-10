const SIZE_MB = {
  IMAGE: 5, // 예: 5MB (필요하면 조정)
} as const;

export const IMAGE_MIME_TYPES = [
  'image/jpeg', // jpg, jpeg
  'image/png',
  'image/webp',
] as const;

export const THUMBNAIL_CONFIG = {
    label: '이미지',
    accept: IMAGE_MIME_TYPES.join(','),
    maxSizeMB: SIZE_MB.IMAGE,
    hint: `jpg, png, webp 이미지를 업로드하세요 (최대 ${SIZE_MB.IMAGE}MB)`,
} as const;
