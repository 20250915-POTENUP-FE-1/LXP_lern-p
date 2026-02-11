import { postApi } from '@/shared/lib/api/fetchApi';

// Course Thumbnail Presign
export type CreateCourseThumbnailPresignedUrlRequest = {
  originalFileName: string;
  contentType: string;
  size: number;
};

export type CreateCourseThumbnailPresignedUrlResponse = {
  uploadUrl: string;
  fileKey: string;
  fileUrl: string;
  expiresInSeconds: number;
};

export async function createCourseThumbnailPresignedUrl(
  payload: CreateCourseThumbnailPresignedUrlRequest,
) {
  return postApi<CreateCourseThumbnailPresignedUrlResponse>(
    '/api/uploads/courses/thumbnails/presign',
    payload,
  );
}
