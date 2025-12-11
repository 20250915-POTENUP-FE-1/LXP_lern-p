import { useMemo, useState, useEffect } from 'react';
import type { CourseLearn } from '@/domains/course/types/learn';
import { getLearnPageData } from '../services/learnService';
import { useParams } from 'next/navigation';
import { mapLecture, mapCourse } from '../utils/formatLecture';

type ProcessedLecture = ReturnType<typeof mapLecture>;
type ProcessedCourse = ReturnType<typeof mapCourse>;

export function useCourseLearn() {
  const [learnData, setLearnData] = useState<CourseLearn | null>(null);

  const params = useParams();
  const { id: courseId } = params;

  useEffect(() => {
    getLearnPageData(courseId as string).then(setLearnData);
  }, [courseId]);

  const courseData: ProcessedCourse | null = useMemo(() => {
    if (!learnData) return null;
    return mapCourse(learnData.course);
  }, [learnData]);

  const [currentLecture, setCurrentLecture] = useState<ProcessedLecture | null>(null);

  useEffect(() => {
    if (!courseData) {
      setCurrentLecture(null);
      return;
    }

    const first = courseData.sections[0]?.lectures[0] ?? null;
    setCurrentLecture(first);
  }, [courseData]);

  const [openSections, setOpenSections] = useState<number[]>([]);

  const totalLectures = courseData
    ? courseData.sections.reduce((acc, section) => acc + section.lectures.length, 0)
    : 0;

  const completedLectures = courseData
    ? courseData.sections.reduce(
        (acc, section) => acc + section.lectures.filter((l) => l.completed).length,
        0,
      )
    : 0;

  const toggleSection = (id: number) => {
    setOpenSections((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleLectureClick = (lecture: ProcessedLecture) => {
    setCurrentLecture(lecture);
  };

  return {
    courseData,
    currentLecture,
    openSections,
    toggleSection,
    handleLectureClick,
    totalLectures,
    completedLectures,
  };
}
