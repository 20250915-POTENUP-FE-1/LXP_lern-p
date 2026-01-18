'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type {
  CourseLearnProgress,
  LectureProgressMapValue,
  ProgressInfo,
  PendingProgress,
  GetProgressResponse,
} from '@/domains/course/types/progress';

import { USE_MOCK } from '@/shared/constants/config';
import { getLearnProgress, updateLearnProgress } from '@/domains/course/services/learnService';
import { MOCK_LEARN_PROGRESS } from '@/mocks/learn.mock';

export function useProgress(courseId: string) {
  const [progressData, setProgressData] = useState<GetProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchProgress = async () => {
      try {
        setIsLoading(true);

        const progress = USE_MOCK ? MOCK_LEARN_PROGRESS : await getLearnProgress(courseId);

        setProgressData(progress);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [courseId]);

  const lectureProgressMap = useMemo<Map<string, LectureProgressMapValue>>(() => {
    if (!progressData) return new Map();

    return new Map(
      progressData.lectureProgresses.map((p) => [
        p.resourceId,
        {
          progressRate: p.progressRate,
          watchedDuration: p.watchedDuration,
          totalDurationSeconds: p.totalDurationSeconds,
          completed: p.completed,
        },
      ]),
    );
  }, [progressData]);

  // 이어보기 정보
  const progressInfo = useMemo<ProgressInfo | null>(() => {
    if (!progressData?.lastWatchedResourceId) return null;

    // 마지막 watchedDuration은 강의별 목록에서 찾아오는 방식으로 맞춤
    const last = progressData.lectureProgresses.find(
      (p) => p.resourceId === progressData.lastWatchedResourceId,
    );

    return {
      lectureId: progressData.lastWatchedResourceId,
      resumeAt: last?.watchedDuration ?? 0,
    };
  }, [progressData]);

  const progress = useMemo<CourseLearnProgress | null>(() => {
    if (!progressData || !progressInfo) return null;

    return {
      enrollmentId: progressData.enrollmentId,
      overallProgressRate: progressData.overallProgressRate,
      progressInfo,
      lectureProgressMap,
    };
  }, [progressData, progressInfo, lectureProgressMap]);

  const lastSavedAtRef = useRef<number>(0); // 마지막 저장 시각 (throttle 용)
  const lastSavedDurationRef = useRef<number>(0); // 마지막으로 저장된 재생 위치 (delta 비교용)

  const pendingRef = useRef<PendingProgress | null>(null); // 저장 실패 시 재시도 대상

  const THROTTLE_INTERVAL = 10; // 저장 최소 호출 간격 (ms)
  const MIN_SAVE_DELTA = 3; // 저장할 최소 재생 시간 변화량 (초)
  const RETRY_DELAYS = [2000, 5000, 15000]; // 저장 실패 시 재시도 간격 (ms)

  // 저장 실패한 진도를 재시도
  const retryPending = () => {
    const pending = pendingRef.current;
    if (!pending) return;

    const delay = RETRY_DELAYS[pending.retryCount];
    if (!delay) return; // 재시도 포기

    setTimeout(async () => {
      try {
        // TODO(mock): mock 단계에서는 실제 API 호출 없이 UI 상태만 갱신
        if (!USE_MOCK) {
          await updateLearnProgress({
            resourceId: pending.resourceId,
            watchedDuration: pending.watchedDuration,
          });
        }

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

  // 진도 즉시 저장
  const saveProgress = async (resourceId: string, watchedDuration: number) => {
    try {
      // TODO(mock): mock 단계에서는 실제 네트워크 요청 없이 처리
      if (!USE_MOCK) {
        await updateLearnProgress({
          resourceId,
          watchedDuration,
        });
      }

      setProgressData((prev) =>
        prev ? applyProgressUpdate(prev, resourceId, watchedDuration) : prev,
      );

      // mock 단계에서는 실제 네트워크 호출 없음
      lastSavedDurationRef.current = watchedDuration;
    } catch (e) {
      console.error('[progress] save failed', e);

      // 실패한 값 저장해두고 재시도 큐로 넘김
      pendingRef.current = {
        resourceId,
        watchedDuration,
        retryCount: 0,
      };
      retryPending();
    }
  };

  // 재생 중 주기적 진도 저장
  const autoSaveProgress = (resourceId: string, watchedDuration: number) => {
    const now = Date.now();

    if (now - lastSavedAtRef.current < THROTTLE_INTERVAL) return;
    if (Math.abs(watchedDuration - lastSavedDurationRef.current) < MIN_SAVE_DELTA) return;

    lastSavedAtRef.current = now;
    saveProgress(resourceId, watchedDuration);
  };

  // 영상 종료 시 최종 진도 저장
  const saveFinalProgressOnEnd = (resourceId: string, watchedDuration: number) => {
    if (pendingRef.current) return;
    saveProgress(resourceId, watchedDuration);
  };

  // 프론트에서 진도 상태를 계산/반영
  function applyProgressUpdate(
    prev: GetProgressResponse,
    resourceId: string,
    watchedDuration: number,
  ): GetProgressResponse {
    const lectureProgresses = prev.lectureProgresses.map((p) => {
      if (p.resourceId !== resourceId) return p;

      const progressRate = Math.min(
        100,
        Math.round((watchedDuration / p.totalDurationSeconds) * 100),
      );

      return {
        ...p,
        watchedDuration,
        progressRate,
        completed: progressRate >= 100,
        lastWatchedAt: new Date().toISOString(),
      };
    });

    const next: GetProgressResponse = {
      ...prev,
      lectureProgresses,
      lastWatchedResourceId: resourceId,
      lastWatchedAt: new Date().toISOString(),
    };

    return next;
  }

  return {
    progress,
    lectureProgressMap,
    progressInfo,
    overallProgressRate: progress?.overallProgressRate ?? 0,
    saveProgress,
    autoSaveProgress,
    saveFinalProgressOnEnd,
    isLoading,
    error,
  };
}
