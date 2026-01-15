import { postApi } from '@/shared/lib/api/fetchApi';
import type {
  PresignedUploadUrlRequest,
  PresignedUrlResponse,
} from '@/domains/course/types/course';
import { bytesToKB } from '@/shared/util/fileSize';

// TODO: Thumbnail 업로드도 이 함수 사용하도록 리팩토링 필요
export async function uploadThumbnail(file: File): Promise<string> {
  const requestBody: PresignedUploadUrlRequest = {
    fileName: file.name,
    contentType: file.type,
    size: bytesToKB(file.size),
    duration: 0,
    isDownloadable: true,
  };

  const { presignedUrl, key } = await postApi<PresignedUrlResponse>(
    '/api/instructor/resources',
    requestBody,
  );

  return key;
}
