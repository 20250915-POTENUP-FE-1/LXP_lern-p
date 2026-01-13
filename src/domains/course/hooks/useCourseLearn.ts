'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import type { CourseLearn, UILecture, UICourse } from '@/domains/course/types/learn';
import { getCourse } from '@/domains/course/services/learnService';
import { mapCourse } from '@/domains/course/utils/mapCourse';
import { useProgress } from '@/domains/course/hooks/useProgress';
import { MOCK_LEARN_COURSE_MAP, MOCK_LEARN_ENROLLMENT } from '@/mocks/learn.mock';
import { LectureProgressMapValue, ProgressInfo } from '../types/progress';

type UseCourseLearnOptions = {
  start?: 'first';
};

export function useCourseLearn(enrollmentId: string, options?: UseCourseLearnOptions) {
  const params = useParams<{ id: string }>();
  const courseId = params?.id;
  const [learnData, setLearnData] = useState<CourseLearn | null>(null);
  const [currentLecture, setCurrentLecture] = useState<UILecture | null>(null);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const { progressInfo, lectureProgressMap } = useProgress(enrollmentId);

  useEffect(() => {
    if (!courseId || !enrollmentId) return;

    // TODO: UI 검증용 mock 데이터 세팅
    const course = MOCK_LEARN_COURSE_MAP[courseId];
    if (!course) return;

    setLearnData({
      course,
      enrollment: MOCK_LEARN_ENROLLMENT,
    });

    /**
     * TODO: 서버 연동 원본 코드 (복구용)
     *
     * async function fetchAll() {
     *   const course = await getCourse(courseId);
     *   const enrollment = await getLearnEnrollment(enrollmentId);
     *   const progress = await getLearnProgress(enrollmentId);
     *
     *   setLearnData({ course, enrollment, progress });
     * }
     *
     * fetchAll();
     */
  }, [courseId, enrollmentId]);

  // TODO: UI 완료 상태 기준으로 courseData 생성
  const courseData = useMemo<UICourse | null>(() => {
    if (!learnData) return null;

    /**
     * TODO: 서버 기준 원본 코드
     *
     * const completedIds = new Set(
     *   learnData.progress?.completedLectureIds ?? [],
     * );
     *
     * return mapCourse(learnData.course, lectureProgressMap);
     */
    return mapCourse(learnData.course, lectureProgressMap);
  }, [learnData, lectureProgressMap]);

  const currentSectionId = useMemo(() => {
    if (!courseData || !currentLecture) return null;

    const section = courseData.sections.find((s) =>
      s.lectures.some((l) => l.id === currentLecture.id),
    );
    return section?.id ?? null;
  }, [courseData, currentLecture]);

  useEffect(() => {
    if (!courseData) return;

    setOpenSections(courseData.sections.map((s) => s.id));
  }, [courseData]);

  useEffect(() => {
    if (!currentSectionId) return;

    setOpenSections((prev) =>
      prev.includes(currentSectionId) ? prev : [...prev, currentSectionId],
    );
  }, [currentSectionId]);

  const initializedRef = useRef(false);
  useEffect(() => {
    if (!courseData) return;
    if (initializedRef.current) return;

    initializedRef.current = true;

    if (options?.start === 'first') {
      const first = courseData.sections[0]?.lectures[0] ?? null;
      setCurrentLecture(first);
      return;
    }

    if (progressInfo?.lectureId) {
      const found = courseData.sections
        .flatMap((s) => s.lectures)
        .find((l) => l.id === progressInfo.lectureId);

      if (found) {
        setCurrentLecture(found);
        return;
      }
    }

    const first = courseData.sections[0]?.lectures[0] ?? null;
    setCurrentLecture(first);
  }, [courseData, options?.start, progressInfo?.lectureId]);

  const handleLectureClick = (lecture: UILecture) => {
    setCurrentLecture(lecture);
  };

  const moveToNextLecture = () => {
    if (!courseData || !currentLecture) return;

    const flatLectures = courseData.sections.flatMap((section) => section.lectures);

    const currentIndex = flatLectures.findIndex((l) => l.id === currentLecture.id);

    if (currentIndex === -1) return;

    const nextLecture = flatLectures[currentIndex + 1];
    if (!nextLecture) return;

    setCurrentLecture(nextLecture);
  };

  function resolveStartLecture(
    lectures: UILecture[],
    progressInfo: ProgressInfo | null,
    lectureProgressMap: Map<string, LectureProgressMapValue>,
  ): UILecture {
    if (!progressInfo) return lectures[0];

    const idx = lectures.findIndex((l) => l.id === progressInfo.lectureId);

    if (idx === -1) return lectures[0];

    const progress = lectureProgressMap.get(progressInfo.lectureId);

    if (progress?.completed) {
      return lectures[idx + 1] ?? lectures[idx];
    }

    return lectures[idx];
  }

  return {
    courseData,
    currentLecture,
    openSections,
    handleLectureClick,
    toggleSection: (id: string) =>
      setOpenSections((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])),
    moveToNextLecture,
  };
}
