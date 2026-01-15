import { useEffect, useState } from 'react';
import { MOCK_GET_COURSE_DETAIL } from '@/mocks/course.mock';
import { getCourseDetail } from '../services/courseService';
import type {
  CourseDetail,
  Course,
  Section,
  Lecture,
  GetCourseDetailResponse,
} from '../types/course';
import { LEVEL_LABEL } from '../constants/level';
import { USE_MOCK } from '@/shared/constants/config';

export function useCourseDetail(courseId: string) {
  const [courseData, setCourseData] = useState<CourseDetail>({
    course: null,
    sections: [],
    lectures: {},
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetail = async () => {
      try {
        setLoading(true);

        // TODO(mock): 개발 중 환경변수로 강좌 상세 데이터를 mock으로 조회
        const courseDetailResponse: GetCourseDetailResponse = USE_MOCK
          ? MOCK_GET_COURSE_DETAIL[courseId]
          : await getCourseDetail(courseId);

        // 1) CourseDetail.course 매핑 (API 응답 → Course 도메인)
        const course: Course = {
          id: courseDetailResponse.courseId,
          title: courseDetailResponse.title,
          summary: courseDetailResponse.summary,
          description: courseDetailResponse.description,
          thumbnailUrl: courseDetailResponse.thumbnailUrl,

          instructorId: courseDetailResponse.instructor.id,
          instructorName: courseDetailResponse.instructor.name,

          category: courseDetailResponse.categories,
          level: courseDetailResponse.level,
          tags: [
            courseDetailResponse.categories[courseDetailResponse.categories.length - 1],
            LEVEL_LABEL[courseDetailResponse.level],
          ],

          price: courseDetailResponse.price,
          isFree: courseDetailResponse.price === 0,

          studentCount: courseDetailResponse.studentCount,

          duration: courseDetailResponse.totalDuration,
          status: courseDetailResponse.status,

          // API에 생성/수정 시간이 없으니 우선 빈 값으로 세팅
          createdAt: '',
          updatedAt: '',

          // 섹션 id 목록으로만 채움
          sections: courseDetailResponse.sections.map((section) => section.sectionId),
        };

        // 2) CourseDetail.sections 매핑 (SectionDetailResponse[] → Section[])
        const sections: Section[] = courseDetailResponse.sections.map((section) => ({
          id: section.sectionId,
          courseId: course.id,
          title: section.title,
          sequence: section.order,
          lectures: section.lectures.map((lecture) => lecture.lectureId),
          createdAt: '',
          updatedAt: '',
        }));

        // 3) CourseDetail.lectures 매핑 (섹션별 Lecture[] 맵)
        const lecturesBySection: Record<string, Lecture[]> = {};

        courseDetailResponse.sections.forEach((section) => {
          const lectureList: Lecture[] = section.lectures.map((lecture) => ({
            id: lecture.lectureId,
            sectionId: section.sectionId,
            courseId: course.id,
            title: lecture.title,
            resource: lecture.resource,
            isPreview: lecture.isPreview,
            duration: lecture.totalDurationSeconds,
            sequence: lecture.orderIndex,
            createdAt: lecture.createdAt,
            updatedAt: lecture.updatedAt,
          }));

          lecturesBySection[section.sectionId] = lectureList;
        });

        // 4) 최종 CourseDetail 세팅
        setCourseData({
          course,
          sections,
          lectures: lecturesBySection,
        });
      } catch (err) {
        console.error('강좌 상세 정보 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchCourseDetail();
  }, [courseId]);

  return {
    ...courseData,
    loading,
  };
}
