import { CourseLearn, UICourse, UISection } from '../types/learn';

export function createLearnPageUIModel(learnData: CourseLearn): UICourse {
  const course = learnData.course;

  const baseDescription = course.description ?? '';
  const baseSummary = course.summary ?? '';

  const sections: UISection[] = course.sections.map((sec) => ({
    id: String(sec.sectionId),
    title: sec.title,
    description: '',
    lectures: sec.lectures.map((lec) => {
      const isVideo = lec.resource.resourceType === 'VIDEO';
      const fileUrl = lec.resource.fileUrl;

      return {
        id: String(lec.lectureId),
        title: lec.title,
        type: isVideo ? 'VIDEO' : 'PDF',
        duration: lec.duration ? formatDurationSeconds(lec.duration) : undefined,
        description:
          (isVideo ? baseDescription : '강의 자료를 다운로드해 학습을 보완하세요.') ||
          baseSummary ||
          '',
        completed: false, // TODO: progress 연동 시 true/false 처리
        videoUrl: isVideo ? fileUrl : undefined,
        pdfUrl: !isVideo ? fileUrl : undefined,
      };
    }),
  }));

  return {
    id: String(course.courseId),
    title: course.title,
    instructor: course.instructor.name,
    description: course.description ?? '',
    sections,
  };
}

export function formatDurationSeconds(seconds: number) {
  if (!seconds || seconds <= 0) return undefined;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
