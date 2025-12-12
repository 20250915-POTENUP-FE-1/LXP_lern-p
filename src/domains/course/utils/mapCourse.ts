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
  progress?: LearnProgressResponse | null,
): UICourse {
  const lastVideoId = progress?.lastVideoId ?? null;

  const toUILecture = (lec: LearnLectureResponse): UILecture => ({
    id: lec.lectureId,
    title: lec.title,
    // 백엔드에서 설명 필드 없으니 일단 비워두기 (나중에 확장 가능)
    description: '',
    duration: lec.totalDurationSeconds,
    type: lec.resource.resourceType,
    videoUrl: lec.resource.resourceType === 'VIDEO' ? lec.resource.fileUrl : undefined,
    pdfUrl: lec.resource.resourceType === 'PDF' ? lec.resource.fileUrl : undefined,
    completed: lastVideoId ? lec.lectureId < lastVideoId : false,
    isCurrent: lastVideoId ? lec.lectureId === lastVideoId : false,
  });

  const sections: UISection[] = course.sections.map((section) => ({
    id: section.sectionId,
    title: section.title,
    order: section.order,
    lectures: section.lectures.map(toUILecture),
  }));

  const mapped: UICourse = {
    courseId: course.courseId,
    title: course.title,
    summary: course.summary,
    description: course.description,
    categories: course.categories,
    level: course.level,
    price: course.price,
    status: course.status,
    thumbnailUrl: course.thumbnailUrl,
    instructor: course.instructor,
    sections,
  };

  return mapped;
}
