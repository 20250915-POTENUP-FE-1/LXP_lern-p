import { ResourceType } from '../components/ResourceUploader';

export const RESOURCE_CONFIG: Record<
  ResourceType,
  {
    label: string;
    accept: string;
    maxSizeMB: number;
    hint: string;
  }
> = {
  VIDEO: {
    label: '동영상',
    accept: 'video/*',
    maxSizeMB: 200,
    hint: 'MP4, WebM 형식의 비디오를 업로드하세요 (최대 200MB 권장)',
  },
  PDF: {
    label: 'PDF 문서',
    accept: 'application/pdf',
    maxSizeMB: 50,
    hint: 'PDF 파일을 업로드하세요 (최대 50MB 권장)',
  },
  DOC: {
    label: '문서 파일',
    accept: '.doc,.docx,.txt',
    maxSizeMB: 50,
    hint: 'DOC, DOCX, TXT 파일을 업로드하세요 (최대 50MB 권장)',
  },
  ZIP: {
    label: '압축 파일',
    accept: '.zip,.rar',
    maxSizeMB: 100,
    hint: 'ZIP, RAR 파일을 업로드하세요 (최대 100MB 권장)',
  },
};
