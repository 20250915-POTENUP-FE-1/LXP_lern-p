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
      id: section.sectionId,
      title: section.title,
      order: section.order,
      lectures: section.lectures.map((lecture) => {
        const isVideo = lecture.resource.resourceType === 'VIDEO';

        return {
          id: lecture.lectureId,
          title: lecture.title,
          // description: lecture.description ?? '',

          type: lecture.resource.resourceType,
          duration: lecture.totalDurationSeconds,

          videoUrl: isVideo ? lecture.resource.fileUrl : undefined,
          pdfUrl: !isVideo ? lecture.resource.fileUrl : undefined,

          completed:
            completedLectureIds.has(lecture.lectureId) ||
            lecture.lectureId === progress?.lastVideoId,
        };
      }),
    })),
  };
}
