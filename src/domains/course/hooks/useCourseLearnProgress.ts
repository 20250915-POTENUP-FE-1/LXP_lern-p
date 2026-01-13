'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type {
  CourseLearnProgress,
  LearnProgressResponse,
  LectureProgressMapValue,
  ResumeInfo,
  PendingProgress,
} from '@/domains/course/types/progress';

// TODO: 실제 API (복구용)
// import { getLearnProgress, updateLearnProgress } from '@/domains/course/services/learnService';

import { MOCK_LEARN_PROGRESS } from '@/mocks/learn.mock';

export function useCourseLearnProgress(enrollmentId: string) {
  const [progressData, setProgressData] = useState<LearnProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enrollmentId) return;

    /**
     * TODO: 서버 연동 원본 코드 (복구용)
     * async function fetchProgress() {
     *   try {
     *     setIsLoading(true);
     *     const response = await getLearnProgress(enrollmentId);
     *     setProgressData(response);
     *   } catch (e) {
     *     setError(e as Error);
     *   } finally {
     *     setIsLoading(false);
     *   }
     * }
     *
     * fetchProgress();
     */

    // TODO: UI 검증용 mock 데이터
    setIsLoading(true);
    setProgressData(MOCK_LEARN_PROGRESS);
    setIsLoading(false);
  }, [enrollmentId]);

  const lectureProgressMap = useMemo<Map<string, LectureProgressMapValue>>(() => {
    if (!progressData) return new Map();

    return new Map(
      progressData.lectureProgresses.map((p) => [
        p.resourceId,
        {
          progressRate: p.currentProgressRate,
          watchedDuration: p.watchedDuration,
          totalDurationSeconds: p.totalDurationSeconds,
          completed: p.isCompleted,
        },
      ]),
    );
  }, [progressData]);

  const resumeInfo = useMemo<ResumeInfo | null>(() => {
    if (!progressData?.lastVideoId) return null;

    return {
      lectureId: progressData.lastVideoId,
      resumeAt: progressData.lastWatchedDuration ?? 0,
    };
  }, [progressData]);

  const progress = useMemo<CourseLearnProgress | null>(() => {
    if (!progressData) return null;

    return {
      enrollmentId: progressData.enrollmentId,
      overallProgressRate: progressData.progressRate,
      resumeInfo,
      lectureProgressMap,
    };
  }, [progressData, resumeInfo, lectureProgressMap]);

  const lastSavedAtRef = useRef<number>(0);
  const lastSavedDurationRef = useRef<number>(0);

  const pendingRef = useRef<PendingProgress | null>(null);

  const THROTTLE_INTERVAL = 10;
  const MIN_SAVE_DELTA = 3;
  const RETRY_DELAYS = [2000, 5000, 15000];

  const retryPending = () => {
    const pending = pendingRef.current;
    if (!pending) return;

    const delay = RETRY_DELAYS[pending.retryCount];
    if (!delay) return; // 재시도 포기

    setTimeout(async () => {
      try {
        /**
         * await updateLearnProgress({
         *   resourceId: pending.resourceId,
         *   watchedDuration: pending.watchedDuration,
         * });
         */

        setProgressData((prev) =>
          prev ? applyProgressUpdate(prev, pending.resourceId, pending.watchedDuration) : prev,
        );

        pendingRef.current = null;
      } catch {
        pending.retryCount += 1;
        retryPending();
      }
    }, delay);
  };

  const saveProgress = async (resourceId: string, watchedDuration: number) => {
    try {
      /**
       * TODO: 서버 연동 원본 코드 (복구용)
       * await updateLearnProgress({
       *   resourceId,
       *   watchedDuration,
       * });
       */

      setProgressData((prev) =>
        prev ? applyProgressUpdate(prev, resourceId, watchedDuration) : prev,
      );

      // mock 단계에서는 실제 네트워크 호출 없음
      lastSavedDurationRef.current = watchedDuration;
    } catch (e) {
      console.error('[progress] save failed', e);
    }
  };

  const saveProgressThrottled = (resourceId: string, watchedDuration: number) => {
    const now = Date.now();

    if (now - lastSavedAtRef.current < THROTTLE_INTERVAL) return;
    if (Math.abs(watchedDuration - lastSavedDurationRef.current) < MIN_SAVE_DELTA) return;

    lastSavedAtRef.current = now;
    saveProgress(resourceId, watchedDuration);
  };

  const endedProgress = (resourceId: string, watchedDuration: number) => {
    if (pendingRef.current) return;
    saveProgress(resourceId, watchedDuration);
  };

  function applyProgressUpdate(
    prev: LearnProgressResponse,
    resourceId: string,
    watchedDuration: number,
  ): LearnProgressResponse {
    const lectureProgresses = prev.lectureProgresses.map((p) => {
      if (p.resourceId !== resourceId) return p;

      const progressRate = Math.min(
        100,
        Math.round((watchedDuration / p.totalDurationSeconds) * 100),
      );

      return {
        ...p,
        watchedDuration,
        currentProgressRate: progressRate,
        isCompleted: progressRate >= 100,
        lastWatchedAt: new Date().toISOString(),
      };
    });

    return {
      ...prev,
      lectureProgresses,
      lastVideoId: resourceId,
      lastWatchedDuration: watchedDuration,
      lastWatchedAt: new Date().toISOString(),
    };
  }

  return {
    progress,
    lectureProgressMap,
    resumeInfo,
    overallProgressRate: progress?.overallProgressRate ?? 0,
    saveProgress,
    saveProgressThrottled,
    endedProgress,
    isLoading,
    error,
  };
}
