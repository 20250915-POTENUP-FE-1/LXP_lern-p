'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';

import type {
  CourseLearn,
  LearnEnrollmentResponse,
  LearnProgressResponse,
} from '@/domains/course/types/learn';

import { getCourse, getEnrollment, getProgress } from '../services/learnService';
import { mapCourse, mapLecture } from '../utils/mapCourse';

type ProcessedCourse = ReturnType<typeof mapCourse>;
type ProcessedLecture = ReturnType<typeof mapLecture>;

export function useCourseLearn() {
  const { id: courseIdParam } = useParams();
  const courseId = Number(courseIdParam);

  const [learnData, setLearnData] = useState<CourseLearn | null>(null);

  useEffect(() => {
    if (!courseId) return;

    async function fetchAll() {
      // 강좌 상세 조회
      const course = await getCourse(courseId);

      // 수강 정보 단건 조회
      const enrollment: LearnEnrollmentResponse | null =
        course.isPurchased && course.studentCount > 0 ? await getEnrollment(courseId) : null;

      // 진도 조회
      const progress: LearnProgressResponse | null = enrollment
        ? await getProgress(enrollment.enrollmentId)
        : null;

      setLearnData({ course, enrollment, progress });
    }

    fetchAll();
  }, [courseId]);

  const courseData: ProcessedCourse | null = useMemo(() => {
    return learnData ? mapCourse(learnData.course) : null;
  }, [learnData]);

  const [currentLecture, setCurrentLecture] = useState<ProcessedLecture | null>(null);

  useEffect(() => {
    if (!courseData) return setCurrentLecture(null);
    setCurrentLecture(courseData.sections[0]?.lectures[0] ?? null);
  }, [courseData]);

  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (id: number) => {
    setOpenSections((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleLectureClick = (lec: ProcessedLecture) => {
    setCurrentLecture(lec);
  };

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
