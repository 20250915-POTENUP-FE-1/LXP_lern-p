/**
 * 강사가 개설한 강좌 타입 정의
 */
export type InstructorCourse = {
  id: string;
  title: string;
  category: string | string[] | null;
  thumbnailUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};