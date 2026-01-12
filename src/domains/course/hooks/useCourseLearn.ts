'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import type { CourseLearn } from '@/domains/course/types/learn';
import {
  getCourse,
  getLearnEnrollment,
  getLearnProgress,
  patchLearnProgress,
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
  const [completedLectureIds, setCompletedLectureIds] = useState<Set<string>>(new Set());

  const [manualLecture, setManualLecture] = useState<ProcessedLecture | null>(null);

  const lastSavedRef = useRef<number>(0);
  const lastWatchedSecondsRef = useRef<number>(0);

  const [openSections, setOpenSections] = useState<string[]>([]);

  const SAVE_INTERVAL = 5;

  useEffect(() => {
    if (!courseId || !enrollmentId) return;
    let cancelled = false;

    async function fetchAll() {
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

    return mapCourse(
      learnData.course,
      learnData.progress ?? undefined,
      new Set(learnData.progress?.completedLectureIds ?? []),
    );
  }, [learnData]);

  const autoLecture = useMemo<ProcessedLecture | null>(() => {
    if (!courseData) return null;

    const lastLectureId = learnData?.progress?.lastVideoId;
    if (lastLectureId) {
      for (const section of courseData.sections) {
        const found = section.lectures.find((l) => l.id === lastLectureId);
        if (found) return found;
      }
    }

    return courseData.sections[0]?.lectures[0] ?? null;
  }, [courseData, learnData]);

  const currentLecture = manualLecture ?? autoLecture;
  const currentLectureId = currentLecture?.id ?? null;

  const currentSectionId = useMemo(() => {
    if (!courseData || !currentLectureId) return null;

    const section = courseData.sections.find((s) =>
      s.lectures.some((l) => l.id === currentLectureId),
    );

    return section?.id ?? null;
  }, [courseData, currentLectureId]);

  useEffect(() => {
    if (!currentSectionId) return;

    setOpenSections((prev) => {
      if (prev.includes(currentSectionId)) return prev;
      return [...prev, currentSectionId];
    });
  }, [currentSectionId]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const totalLectures = courseData
    ? courseData.sections.reduce((acc, s) => acc + s.lectures.length, 0)
    : 0;

  const completedCount = completedLectureIds.size;

  const progressRate = totalLectures === 0 ? 0 : Math.floor((completedCount / totalLectures) * 100);

  const lastWatchedDuration = learnData?.progress?.lastWatchedDuration ?? 0;

  const saveProgress = async (lecture: ProcessedLecture) => {
    try {
      const res = await patchLearnProgress({
        enrollmentId,
        lectureId: lecture.id,
        lastWatchedDuration: lastWatchedSecondsRef.current,
      });

      setLearnData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          progress: res,
        };
      });

      // 서버 기준 완료 목록으로 동기화
      setCompletedLectureIds(new Set(res.completedLectureIds));
    } catch (e) {
      console.error('[saveProgress failed]', e);
    }
  };

  const findNextLecture = (
    currentId: string,
    courseData: ProcessedCourse,
  ): ProcessedLecture | null => {
    const flatLectures = courseData.sections.flatMap((s) => s.lectures);
    const index = flatLectures.findIndex((l) => l.id === currentId);
    return index === -1 ? null : (flatLectures[index + 1] ?? null);
  };

  const handleLectureClick = (lecture: ProcessedLecture) => {
    setManualLecture(lecture);
  };

  const handleVideoEnded = async () => {
    if (!currentLecture || !courseData) return;

    await saveProgress(currentLecture);

    const next = findNextLecture(currentLecture.id, courseData);
    if (next) {
      setManualLecture(next);
      lastWatchedSecondsRef.current = 0;
    }
  };

  const handleVideoTimeUpdate = (currentTime: number) => {
    if (!currentLecture) return;
    if (currentTime - lastSavedRef.current < SAVE_INTERVAL) return;

    lastSavedRef.current = currentTime;
    lastWatchedSecondsRef.current = Math.floor(currentTime);

    patchLearnProgress({
      enrollmentId,
      lectureId: currentLecture.id,
      lastWatchedDuration: lastWatchedSecondsRef.current,
    })
      .then((res) => {
        setLearnData((prev) => (prev ? { ...prev, progress: res } : prev));
      })
      .catch(() => {});
  };

  return {
    courseData,
    currentLecture,
    openSections,
    handleLectureClick,
    handleVideoEnded,
    handleVideoTimeUpdate,
    toggleSection,
    totalLectures,
    completedLectures: completedCount,
    progressRate,
    lastWatchedDuration,
  };
}
