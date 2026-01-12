import type {
  LearnCourseResponse,
  UILecture,
  UISection,
  UICourse,
} from '@/domains/course/types/learn';

export function mapCourse(
  course: LearnCourseResponse,
  completedLectureIds: Set<string>, // ✅ Set 기반
): UICourse {
  return {
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

    sections: course.sections.map<UISection>((section) => ({
      id: section.sectionId,
      title: section.title,
      order: section.order,

      lectures: section.lectures.map<UILecture>((lecture) => {
        const isVideo = lecture.resource.resourceType === 'VIDEO';

        return {
          id: lecture.lectureId,
          title: lecture.title,
          duration: lecture.totalDurationSeconds,
          type: lecture.resource.resourceType,

          videoUrl: isVideo ? lecture.resource.fileUrl : undefined,
          pdfUrl: !isVideo ? lecture.resource.fileUrl : undefined,

          completed: completedLectureIds.has(lecture.lectureId), // ✅ 핵심
          isCurrent: false, // UI에서 별도 처리
        };
      }),
    })),
  };
}
