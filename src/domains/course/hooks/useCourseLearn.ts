'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import type { CourseLearn } from '@/domains/course/types/learn';
import {
  getCourse,
  getLearnEnrollment,
  getLearnProgress,
} from '@/domains/course/services/learnService';
import {
  MOCK_LEARN_COURSE_MAP,
  MOCK_LEARN_ENROLLMENT,
  MOCK_LEARN_PROGRESS,
} from '@/mocks/learn.mock';
import { mapCourse } from '../utils/mapCourse';

type ProcessedCourse = ReturnType<typeof mapCourse>;
type ProcessedLecture = ProcessedCourse['sections'][number]['lectures'][number];

export function useCourseLearn(enrollmentId: string) {
  const params = useParams<{ id: string }>();
  const courseId = params?.id;
  const [learnData, setLearnData] = useState<CourseLearn | null>(null);
  const [completedLectureIds, setCompletedLectureIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!courseId || !enrollmentId) return;
    let cancelled = false;

    async function fetchAll() {
      // TODO: 임시 목업 데이터
      if (process.env.NODE_ENV === 'development') {
        const course = MOCK_LEARN_COURSE_MAP[courseId];
        if (!course) return;

        setLearnData({
          course,
          enrollment: MOCK_LEARN_ENROLLMENT,
          progress: MOCK_LEARN_PROGRESS,
        });
        return;
      }

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

  const courseData = useMemo(() => {
    if (!learnData) return null;

    return mapCourse(learnData.course, learnData.progress || undefined, completedLectureIds);
  }, [learnData, completedLectureIds]);

  const [currentLecture, setCurrentLecture] = useState<ProcessedLecture | null>(null);

  const initialLecture = useMemo<ProcessedLecture | null>(() => {
    if (!courseData) return null;

    const lastLectureId = learnData?.progress?.lastVideoId;

    if (lastLectureId) {
      for (const section of courseData.sections) {
        const found = section.lectures.find((lecture) => lecture.id === lastLectureId);
        if (found) return found;
      }
    }

    return courseData.sections[0]?.lectures[0] ?? null;
  }, [courseData, learnData]);

  useEffect(() => {
    if (!initialLecture) return;

    setCurrentLecture((prev) => (prev ? prev : initialLecture));
  }, [initialLecture]);

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
      return courseData.sections.map((s) => s.id);
    });
  }, [courseData, currentLecture]);

  const findNextLecture = (
    currentId: string,
    courseData: ProcessedCourse,
  ): ProcessedLecture | null => {
    const flatLectures = courseData.sections.flatMap((section) => section.lectures);

    const currentIndex = flatLectures.findIndex((lec) => lec.id === currentId);

    if (currentIndex === -1) return null;

    return flatLectures[currentIndex + 1] ?? null;
  };

  const handleLectureClick = (lec: ProcessedLecture) => {
    setCurrentLecture(lec);
  };

  const handleVideoEnded = () => {
    if (!courseData || !currentLecture) return;

    setCompletedLectureIds((prev) => {
      const next = new Set(prev);
      next.add(currentLecture.id);
      return next;
    });

    const nextLecture = findNextLecture(currentLecture.id, courseData);
    if (nextLecture) {
      setCurrentLecture(nextLecture);
    }
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

  const completedCount = useMemo(() => {
    return completedLectureIds.size;
  }, [completedLectureIds]);

  const progressRate = useMemo(() => {
    if (totalLectures === 0) return 0;
    return Math.floor((completedCount / totalLectures) * 100);
  }, [completedCount, totalLectures]);

  return {
    courseData,
    currentLecture,
    openSections,
    toggleSection,
    handleLectureClick,
    handleVideoEnded,
    totalLectures,
    completedLectures: completedCount,
    progressRate,
  };
}
