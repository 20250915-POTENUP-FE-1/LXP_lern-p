import { LearnLecture, LearnSection, LearnCourse } from '../types/learn';

export function mapLecture(lec: LearnLecture) {
  const minutes = Math.floor(lec.duration / 60);
  const seconds = lec.duration % 60;

  return {
    id: lec.lectureId,
    title: lec.title,
    type: lec.resource.resourceType,
    duration: `${minutes}:${String(seconds).padStart(2, '0')}`,
    description: '',
    completed: false,
    videoUrl: lec.resource.resourceType === 'VIDEO' ? lec.resource.fileUrl : undefined,
    pdfUrl: lec.resource.resourceType === 'PDF' ? lec.resource.fileUrl : undefined,
  };
}

export function mapSection(section: LearnSection) {
  return {
    id: section.sectionId,
    title: section.title,
    lectures: section.lectures.map(mapLecture),
  };
}

export function mapCourse(course: LearnCourse) {
  return {
    id: course.courseId,
    title: course.title,
    sections: course.sections.map(mapSection),
  };
}
