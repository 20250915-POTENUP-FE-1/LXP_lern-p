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

// Course Thumbnail Presign
export type CreateCourseThumbnailPresignedUrlRequest = {
  originalFileName: string;
  contentType: string;
  size: number;
};

export type CourseThumbnailPresignResponse = {
  uploadUrl: string;
  fileKey: string;
  fileUrl: string;
  expiresInSeconds: number;
};

export async function createCourseThumbnailPresignedUrl(payload: CourseThumbnailPresignRequest) {
  return postApi<CourseThumbnailPresignResponse>(
    '/api/uploads/courses/thumbnails/presign',
    payload,
  );
}
