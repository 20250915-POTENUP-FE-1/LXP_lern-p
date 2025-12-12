'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';

import type { CourseLearn } from '@/domains/course/types/learn';

import {
  getCourse,
  getLearnEnrollment,
  getLearnProgress,
} from '@/domains/course/services/learnService';

import { getEnrollmentList } from '@/domains/user/services/enrollmentService';
import { mapCourse } from '../utils/mapCourse';

/** -------------------------------
 * 타입 유추용 별칭
 * ------------------------------- */
type ProcessedCourse = ReturnType<typeof mapCourse>;
type ProcessedLecture = ProcessedCourse['sections'][number]['lectures'][number];

/** -------------------------------
 * courseId → 내 enrollmentId 찾기
 * ------------------------------- */
async function getMyEnrollmentId(courseId: string): Promise<string | null> {
  const page = await getEnrollmentList({
    status: 'ENROLLED',
    page: 1,
    size: 30,
  });

  const match = page.content.find((item) => String(item.courseId) === String(courseId));
  return match ? match.enrollmentId : null;
}

export function useCourseLearn() {
  const { id: courseIdParam } = useParams();
  const courseId = String(courseIdParam);

  const [learnData, setLearnData] = useState<CourseLearn | null>(null);

  useEffect(() => {
    if (!courseId) return;

    async function fetchAll() {
      // 1) 강좌 상세
      const course = await getCourse(courseId);

      // 2) 내 enrollmentId 찾기
      const enrollmentId = await getMyEnrollmentId(courseId);

      // 3) Learn 도메인용 enrollment / progress 조회
      const enrollment = enrollmentId ? await getLearnEnrollment(enrollmentId) : null;
      const progress = enrollmentId ? await getLearnProgress(enrollmentId) : null;

      const next: CourseLearn = {
        course,
        enrollment,
        progress,
      };

      setLearnData(next);
    }

    fetchAll();
  }, [courseId]);

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
