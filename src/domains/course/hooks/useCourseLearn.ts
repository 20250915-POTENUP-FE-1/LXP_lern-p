'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';

import type { CourseLearn } from '@/domains/course/types/learn';

import {
  getCourse,
  getLearnEnrollment,
  getLearnProgress,
} from '@/domains/course/services/learnService';

import { mapCourse } from '../utils/mapCourse';

/** -------------------------------
 * 타입 유추용 별칭
 * ------------------------------- */
type ProcessedCourse = ReturnType<typeof mapCourse>;
type ProcessedLecture = ProcessedCourse['sections'][number]['lectures'][number];

export function useCourseLearn(enrollmentId: string) {
  const params = useParams<{ id: string }>();
  const courseId = params?.id;
  const [learnData, setLearnData] = useState<CourseLearn | null>(null);

  useEffect(() => {
    if (!courseId || !enrollmentId) return;
    let cancelled = false;

    async function fetchAll() {
      const course = await getCourse(courseId);
      if (cancelled) return;

      const enrollment = await getLearnEnrollment(enrollmentId);
      const progress = await getLearnProgress(enrollmentId);
      if (cancelled) return;

      setLearnData({ course, enrollment, progress });
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [courseId, enrollmentId]);

  /** UI용 courseData 가공 */
  const courseData: ProcessedCourse | null = useMemo(() => {
    if (!learnData) return null;
    const mapped = mapCourse(learnData.course, learnData.progress || undefined);
    return mapped;
  }, [learnData]);

  /** 현재 강의 */
  const [currentLecture, setCurrentLecture] = useState<ProcessedLecture | null>(null);

  useEffect(() => {
    if (!courseData) {
      setCurrentLecture(null);
      return;
    }

    const firstLecture = courseData.sections[0]?.lectures[0] ?? null;

    setCurrentLecture(firstLecture);
  }, [courseData]);

  /** 펼침 섹션 */
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  useEffect(() => {
    if (!courseData || !currentLecture) return;

    const currentSection = courseData.sections.find((section) =>
      section.lectures.some((lecture) => lecture.id === currentLecture.id),
    );

    if (!currentSection) return;

    setOpenSections((prev) => {
      if (prev.includes(currentSection.id)) return prev;
      //return [currentSection.id];
      return courseData.sections.map((s) => s.id);
    });
  }, [courseData, currentLecture]);

  /** 강의 클릭 */
  const handleLectureClick = (lec: ProcessedLecture) => {
    setCurrentLecture(lec);
  };

  /** 총 강의 / 완료 강의 수 */
  const totalLectures = useMemo(() => {
    return courseData ? courseData.sections.reduce((acc, s) => acc + s.lectures.length, 0) : 0;
  }, [courseData]);

  const completedLectures = useMemo(() => {
    return courseData
      ? courseData.sections.reduce(
          (acc, s) => acc + s.lectures.filter((l) => l.completed).length,
          0,
        )
      : 0;
  }, [courseData]);

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
