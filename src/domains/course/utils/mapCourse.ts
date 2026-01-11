import type {
  LearnCourseResponse,
  LearnLectureResponse,
  LearnProgressResponse,
  UICourse,
  UISection,
  UILecture,
} from '@/domains/course/types/learn';

/**
 * 초 단위를 "MM:SS" 로 포맷하는 유틸 (필요하면 시/분 형태로 바꿔도 됨)
 */
function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function mapCourse(
  course: LearnCourseResponse,
  progress?: LearnProgressResponse,
  completedLectureIds: Set<string> = new Set(),
) {
  return {
    ...course,
    sections: course.sections.map((section) => ({
      ...section,
      lectures: section.lectures.map((lecture) => {
        const isVideo = lecture.resource.resourceType === 'VIDEO';

        return {
          id: lecture.lectureId,
          title: lecture.title,
          // TODO: API 호출시 확인
          // description: lecture.description ?? '',

          type: lecture.resource.resourceType,
          duration: lecture.totalDurationSeconds,

          videoUrl: isVideo ? lecture.resource.fileUrl : undefined,
          pdfUrl: !isVideo ? lecture.resource.fileUrl : undefined,

          // TODO: completed 기준을 서버 상태 기준으로 통합 예정
          completed:
            completedLectureIds.has(lecture.lectureId) ||
            lecture.lectureId === progress?.lastVideoId,
        };
      }),
    })),
  };
}
