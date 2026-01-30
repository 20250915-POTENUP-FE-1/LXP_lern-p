import type { LearnCourseResponse, UICourse } from '@/domains/course/types/learn';
import type { LectureProgressMapValue } from '@/domains/course/types/progress';

export function mapCourse(
  course: LearnCourseResponse,
  lectureProgressMap: Map<string, LectureProgressMapValue>,
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

    sections: course.sections
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((section) => ({
        id: section.sectionId,
        title: section.title,
        order: section.order,

        lectures: section.lectures
          .slice()
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((lecture) => {
            const progress = lectureProgressMap.get(String(lecture.resource.resourceId));

            return {
              id: lecture.lectureId,
              resourceId: lecture.resource.resourceId,
              title: lecture.title,
              duration: lecture.totalDurationSeconds,
              type: lecture.resource.resourceType,
              videoUrl:
                lecture.resource.resourceType === 'VIDEO' ? lecture.resource.fileUrl : undefined,
              pdfUrl:
                lecture.resource.resourceType === 'PDF' ? lecture.resource.fileUrl : undefined,
              completed: progress?.completed ?? false,
              isCurrent: false,
            };
          }),
      })),
  };
}
