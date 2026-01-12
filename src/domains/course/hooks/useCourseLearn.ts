'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import type { CourseLearn, UILecture } from '@/domains/course/types/learn';
import { getCourse } from '@/domains/course/services/learnService';
import { mapCourse } from '@/domains/course/utils/mapCourse';

import {
  MOCK_LEARN_COURSE_MAP,
  MOCK_LEARN_ENROLLMENT,
  MOCK_LEARN_PROGRESS,
} from '@/mocks/learn.mock';

type UseCourseLearnOptions = {
  start?: 'first';
};

export function useCourseLearn(enrollmentId: string, options?: UseCourseLearnOptions) {
  const params = useParams<{ id: string }>();
  const courseId = params?.id;

  const [learnData, setLearnData] = useState<CourseLearn | null>(null);
  const [currentLecture, setCurrentLecture] = useState<UILecture | null>(null);
  const [openSections, setOpenSections] = useState<string[]>([]);

  // TODO: UI 검증용 완료 상태 (서버 progress 대신 사용)
  const [uiCompletedLectureIds, setUiCompletedLectureIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!courseId || !enrollmentId) return;

    // TODO: UI 검증용 mock 데이터 세팅
    const course = MOCK_LEARN_COURSE_MAP[courseId];
    if (!course) return;

    setLearnData({
      course,
      enrollment: MOCK_LEARN_ENROLLMENT,
      progress: MOCK_LEARN_PROGRESS,
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
  const courseData = useMemo(() => {
    if (!learnData) return null;

    return mapCourse(learnData.course, uiCompletedLectureIds);

    /**
     * TODO: 서버 기준 원본 코드
     *
     * const completedIds = new Set(
     *   learnData.progress?.completedLectureIds ?? [],
     * );
     *
     * return mapCourse(learnData.course, completedIds);
     */
  }, [learnData, uiCompletedLectureIds]);

  useEffect(() => {
    if (!courseData) return;
    if (currentLecture) return;

    if (options?.start === 'first') {
      setCurrentLecture(courseData.sections[0]?.lectures[0] ?? null);
      return;
    }

    setCurrentLecture(courseData.sections[0]?.lectures[0] ?? null);

    /**
     * TODO: 서버 기준 원본 (이어보기)
     *
     * const lastId = learnData?.progress?.lastVideoId;
     * const found = lastId
     *   ? courseData.sections
     *       .flatMap((s) => s.lectures)
     *       .find((l) => l.id === lastId)
     *   : null;
     *
     * setCurrentLecture(found ?? courseData.sections[0]?.lectures[0] ?? null);
     */
  }, [courseData, currentLecture, options?.start]);

  const currentSectionId = useMemo(() => {
    if (!courseData || !currentLecture) return null;

    const section = courseData.sections.find((s) =>
      s.lectures.some((l) => l.id === currentLecture.id),
    );
    return section?.id ?? null;
  }, [courseData, currentLecture]);

  useEffect(() => {
    if (!currentSectionId) return;

    setOpenSections((prev) =>
      prev.includes(currentSectionId) ? prev : [...prev, currentSectionId],
    );
  }, [currentSectionId]);

  const handleLectureClick = (lecture: UILecture) => {
    setCurrentLecture(lecture);
  };

  // TODO: 영상 종료 → UI 완료 처리
  const handleVideoEnded = () => {
    if (!currentLecture) return;

    setUiCompletedLectureIds((prev) => {
      const next = new Set(prev);
      next.add(currentLecture.id);
      return next;
    });

    /**
     * TODO: 서버 기준 원본
     *
     * await updateLearnProgress({
     *   resourceId: currentLecture.id,
     *   watchedDuration: currentLecture.duration,
     * });
     */
  };

  // TODO: 영상 시청 중 (UI 검증 단계에서는 아무 것도 안 함)
  const handleVideoTimeUpdate = () => {
    /**
     * TODO: 서버 기준 원본
     *
     * await updateLearnProgress({
     *   resourceId: currentLecture.id,
     *   watchedDuration,
     * });
     */
  };

  // TODO: PDF 완료 처리 (다운로드 시)
  const markPdfCompleted = (lecture: UILecture) => {
    setUiCompletedLectureIds((prev) => {
      const next = new Set(prev);
      next.add(lecture.id);
      return next;
    });

    /**
     * TODO: 서버 기준 원본
     *
     * await updateLearnProgress({
     *   resourceId: lecture.id,
     *   watchedDuration: 0,
     * });
     */
  };

  const totalLectures = useMemo(() => {
    if (!courseData) return 0;
    return courseData.sections.reduce((acc, s) => acc + s.lectures.length, 0);
  }, [courseData]);

  const completedLectures = uiCompletedLectureIds.size;

  return {
    courseData,
    currentLecture,
    openSections,
    handleLectureClick,
    handleVideoEnded,
    handleVideoTimeUpdate,
    toggleSection: (id: string) =>
      setOpenSections((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])),
    markPdfCompleted,

    learnData,
    totalLectures,
    completedLectures,
    lastWatchedDuration: 0,
  };
}
