// src/domains/course/services/courseCreateService.ts

import type { User } from '@/domains/user/types/user';
import type {
  CourseDraftForm,
  SectionDraftForm,
  CreateCourseRequest,
  CourseIdResponse,
} from '../types/course';
import { updateDraftSection } from './courseEditService';
// fetchApi 유틸 (경로는 프로젝트 구조에 맞게 수정)
import { postApi, patchApi } from '@/shared/lib/api/fetchApi'; // 예시 경로

/**
 * CourseDraftForm → CreateCourseRequest 매핑
 * - categoryId, courseLevel 매핑 로직은 백엔드 규칙에 맞게 조정 필요
 */
const mapDraftToCreateRequest = (draft: CourseDraftForm): CreateCourseRequest => {
  // TODO: 실제 카테고리 ID 매핑 로직 적용
  const categoryId = 1; // 임시 값. 실제로는 draft.category[0]을 기준으로 매핑해야 함.

  // TODO: level → courseLevel 매핑 테이블 백엔드와 합의 후 수정
  const levelMap: Record<string, CreateCourseRequest['courseLevel']> = {
    beginner: 'BEGINNER',
    intermediate: 'INTERMEDIATE',
    advanced: 'ADVANCED',
  };

  const normalizedLevel = draft.level?.toLowerCase() ?? 'beginner';

  return {
    title: draft.title,
    summary: draft.summary,
    description: draft.description,
    thumbnailUrl: draft.thumbnailUrl,
    categoryId,
    price: draft.price,
    courseLevel: levelMap[normalizedLevel] ?? 'BEGINNER',
  };
};

/**
 * 1단계: 임시 강좌 생성 (Draft 생성)
 * - 백엔드: 강좌 생성 API (임시 상태로 생성)
 * - 응답: { data: { courseId: number } }
 */
export const createDraftCourse = async (
  user: User,
  draftData: CourseDraftForm,
): Promise<string> => {
  if (!user?.id) throw new Error('로그인이 필요합니다.');

  try {
    const requestBody = mapDraftToCreateRequest(draftData);

    // 엔드포인트는 실제 백엔드 path에 맞게 수정
    // 예: '/instructor/courses' 또는 '/api/instructor/courses'
    const result = await postApi<CourseIdResponse>('/instructor/courses', requestBody);

    // fetchApi는 data만 반환하므로 result === { courseId: number }
    return String(result.courseId);
  } catch (err) {
    console.error('createDraftCourse 실패:', err);
    throw new Error('임시 강좌 생성 중 오류가 발생했습니다.');
  }
};

/**
 * 2단계: 강좌 발행
 * - 백엔드: 강좌 발행 API
 *   - Body가 없는 경우: PATCH/POST 둘 중 협의된 방식 사용
 */
export const publishDraftCourse = async (courseId: string): Promise<boolean> => {
  if (!courseId) throw new Error('Invalid course ID');

  const checkCoursePublish = confirm('강좌를 발행하면 수정할 수 없습니다. 최종 발행하시겠습니까?');
  if (!checkCoursePublish) return false;

  try {
    // 예시 1) 바디 없는 발행 API
    // await patchApi<void>(`/instructor/courses/${courseId}/publish`);

    // 예시 2) status만 PATCH 하는 방식 (기존 JSON 서버 스타일 유지시)
    await patchApi<void>(`/instructor/courses/${courseId}`, {
      status: 'PUBLISHED',
    });

    return true;
  } catch (err) {
    console.error('publishDraftCourse 실패:', err);
    throw new Error('강좌 발행 중 오류가 발생했습니다.');
  }
};

/**
 * 3단계: 강좌 + 섹션/강의 생성 플로우
 * - (1) Draft 강좌 생성
 * - (2) 섹션/강의 전체 저장
 * - (3) 옵션에 따라 발행
 */
export const createCourse = async (
  user: User,
  courseDraft: CourseDraftForm,
  sectionDrafts: SectionDraftForm[],
  shouldPublish: boolean = false,
): Promise<string> => {
  if (!user?.id) throw new Error('로그인이 필요합니다.');

  try {
    // 1) Draft 강좌 생성
    const draftId = await createDraftCourse(user, courseDraft);

    // 2) 섹션/강의 저장 (이 함수는 JSON 서버 스타일이면,
    //    나중에 백엔드 API로 교체할 때 별도로 리팩토링)
    await updateDraftSection(draftId, sectionDrafts);

    // 3) 필요 시 발행
    if (shouldPublish) {
      await publishDraftCourse(draftId);
    }

    return draftId;
  } catch (err) {
    console.error('createCourse 실패:', err);
    throw new Error('강좌 등록 중 오류가 발생했습니다.');
  }
};
