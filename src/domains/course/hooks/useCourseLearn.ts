'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import type { CourseLearn, UILecture, UICourse } from '@/domains/course/types/learn';
import { getCourse } from '@/domains/course/services/learnService';
import { mapCourse } from '@/domains/course/utils/mapCourse';
import { useProgress } from '@/domains/course/hooks/useProgress';
import { MOCK_LEARN_COURSE_MAP } from '@/mocks/learn.mock';
import { USE_MOCK } from '@/shared/constants/config';
import { getEnrollmentByCourseId } from '@/domains/user/services/enrollmentService';
import { MOCK_GET_ENROLLMENT_BY_COURSEID } from '@/mocks/enrollmentList.mock';
import { ProgressInfo, LectureProgressMapValue } from '../types/progress';

export function useCourseLearn() {
  const { id: courseId } = useParams<{ id: string }>();

  const [learnData, setLearnData] = useState<CourseLearn | null>(null);

  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => new Set());

  const { progressInfo, lectureProgressMap, autoSaveProgress, saveFinalProgressOnEnd } =
    useProgress(courseId);

  const searchParams = useSearchParams();
  const start = searchParams.get('start') === 'first' ? 'first' : undefined;

  useEffect(() => {
    if (!courseId) return;

    async function fetchAll() {
      // TODO(mock): 개발 중 환경변수로 학습 페이지 UI 검증을 위한 mock 데이터 사용
      if (USE_MOCK) {
        const course = MOCK_LEARN_COURSE_MAP[courseId];
        if (!course) return;

        setLearnData({
          course,
          enrollment: MOCK_GET_ENROLLMENT_BY_COURSEID,
        });
        return;
      }

      const course = await getCourse(courseId);
      const enrollment = await getEnrollmentByCourseId(courseId);

      setLearnData({ course, enrollment });
    }

    fetchAll();
  }, [courseId]);

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

  const flatLectures = useMemo(() => {
    return courseData?.sections.flatMap((s) => s.lectures) ?? [];
  }, [courseData]);

  function selectLectureToWatch(
    lectures: UILecture[],
    progressInfo: ProgressInfo | null,
    lectureProgressMap: Map<string, LectureProgressMapValue>,
  ): UILecture {
    if (!progressInfo) return lectures[0];

    // TODO: 초기 자동 선택 (이어보기), 다음 강의 상태
    console.log('[AUTO SELECT]', {
      lastWatched: progressInfo?.resourceId,
      completed: lectureProgressMap.get(progressInfo?.resourceId)?.completed,
    });

    const idx = lectures.findIndex((l) => l.resourceId === progressInfo.resourceId);

    if (idx === -1) return lectures[0];

    const progress = lectureProgressMap.get(progressInfo.resourceId);

    if (progress?.completed) {
      return lectures[idx + 1] ?? lectures[idx];
    }

    return lectures[idx];
  }

  // 유저가 선택하지 않았을 때 자동으로 보여줄 강의 계산
  const autoLecture = useMemo(() => {
    if (!flatLectures.length) return null;

    if (!progressInfo) return null;

    if (start === 'first') return flatLectures[0];

    return selectLectureToWatch(flatLectures, progressInfo, lectureProgressMap);
  }, [flatLectures, start, progressInfo, lectureProgressMap]);

  const currentLecture = useMemo<UILecture | null>(() => {
    if (!flatLectures.length) return null;

    // TODO: 다음 강의 자동 이동
    console.log('[CURRENT LECTURE DECIDE]', {
      selectedLectureId,
      autoLecture: autoLecture?.id,
    });

    if (selectedLectureId) {
      const found = flatLectures.find((l) => l.id === selectedLectureId);
      if (found) return found;
    }

    return autoLecture ?? flatLectures[0] ?? null;
  }, [flatLectures, selectedLectureId, autoLecture]);

  const currentSectionId = useMemo(() => {
    if (!courseData || !currentLecture) return null;

    const section = courseData.sections.find((s) =>
      s.lectures.some((l) => l.id === currentLecture.id),
    );
    return section?.id ?? null;
  }, [courseData, currentLecture]);

  const openSections = useMemo(() => {
    if (!courseData) return [];

    const all = courseData.sections.map((s) => s.id);
    const opened = all.filter((id) => !collapsedSections.has(id));

    // 현재 재생 섹션은 항상 열리도록(원하던 UX일 때)
    if (currentSectionId && !opened.includes(currentSectionId)) {
      return [...opened, currentSectionId];
    }

    return opened;
  }, [courseData, collapsedSections, currentSectionId]);

  const totalLectures = useMemo(() => {
    return lectureProgressMap.size;
  }, [lectureProgressMap]);

  const completedLectures = useMemo(() => {
    if (!lectureProgressMap.size) return 0;

    return Array.from(lectureProgressMap.values()).filter((p) => p.completed === true).length;
  }, [lectureProgressMap]);

  const handleLectureClick = (lecture: UILecture) => {
    setSelectedLectureId(lecture.id);
  };

  const moveToNextLecture = () => {
    if (!currentLecture) return;

    const currentIndex = flatLectures.findIndex((l) => l.id === currentLecture.id);

    if (currentIndex === -1) return;

    const nextLecture = flatLectures[currentIndex + 1];
    if (!nextLecture) return;

    setSelectedLectureId(nextLecture.id);
  };

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return {
    courseData,
    currentLecture,
    openSections,
    handleLectureClick,
    toggleSection,
    moveToNextLecture,
    progressInfo,
    lectureProgressMap,
    autoSaveProgress,
    saveFinalProgressOnEnd,
    totalLectures,
    completedLectures,
  };
}
