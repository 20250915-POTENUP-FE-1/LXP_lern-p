const SIZE_MB = {
  VIDEO: 1024, // 1GB, 해상도 720p 기준 약 10시간
  PDF: 50, // 50MB
  DOC: 50, // 50MB
  ZIP: 1024, // 1GB
} as const;

export const RESOURCE_CONFIG = {
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
    hint: `DOC 파일을 업로드하세요 (최대 ${SIZE_MB.DOC}MB)`,
  },
  ZIP: {
    label: '압축 파일',
    accept: '.zip,.rar',
    maxSizeMB: SIZE_MB.ZIP,
    hint: `ZIP, RAR 파일을 업로드하세요 (최대 ${SIZE_MB.ZIP}MB)`,
  },
} as const;
