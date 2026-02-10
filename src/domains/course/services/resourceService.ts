import { postApi } from '@/shared/lib/api/fetchApi';

// Lecture Resource Presign
export type PresignedUploadUrlRequest = {
  fileName: string;
  contentType: string;
  size: number;
  duration: number;
  isDownloadable: boolean;
};

export type PresignedUploadUrlResponse = {
  presignedUrl: string;
  key: string;
  method: 'PUT';
  expireSeconds: number;
};

export async function createPresignedUploadUrl(
  payload: PresignedUploadUrlRequest,
): Promise<PresignedUploadUrlResponse> {
  return postApi<PresignedUploadUrlResponse>('/api/instructor/resources', payload);
}
