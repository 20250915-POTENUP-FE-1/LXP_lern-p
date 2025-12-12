import { LearnLecture, LearnSection, LearnCourse } from '../types/learn';

export function mapLecture(lec: LearnLecture) {
  const minutes = Math.floor(lec.duration / 60);
  const seconds = lec.duration % 60;

  const type = lec.resource?.resourceType;
  const fileUrl = lec.resource?.fileUrl;

  return {
    id: lec.lectureId,
    title: lec.title,
    duration: `${minutes}:${String(seconds).padStart(2, '0')}`,
    description: '',
    completed: false,
    type,
    videoUrl: type === 'VIDEO' ? fileUrl : undefined,
    pdfUrl: type === 'PDF' ? fileUrl : undefined,
  };
}

export function mapCourse(course: LearnCourse) {
  return {
    id: course.courseId,
    title: course.title,
    sections: course.sections.map(mapSection),
  };
}

function mapSection(section: LearnSection) {
  return {
    id: section.sectionId,
    title: section.title,
    lectures: section.lectures.map(mapLecture),
  };
}
