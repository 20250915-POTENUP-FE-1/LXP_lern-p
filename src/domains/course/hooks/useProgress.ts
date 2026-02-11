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
  const [lastSavedResourceId, setLastSavedResourceId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchProgress = async () => {
      try {
        setIsLoading(true);

        // TODO(mock): mock 단계에서는 네트워크 호출 없이 학습 진도 데이터 사용
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

  const lectureProgressMap = useMemo<Map<number, LectureProgressMapValue>>(() => {
    if (!progressData?.resourceProgresses?.length) {
      return new Map();
    }

    return new Map(
      progressData.resourceProgresses.map((p) => [
        p.resourceId,
        {
          progressRate: p.progressRate,
          completed: p.completed,
          watchedDuration: p.watchedDuration,
          totalDurationSeconds: p.totalDurationSeconds,
        },
      ]),
    );
  }, [progressData]);

  // 이어보기 정보
  const progressInfo = useMemo<ProgressInfo | null>(() => {
    const id = progressData?.lastWatchedResourceId;
    if (!id) return null;

    // 마지막 watchedDuration은 강의별 목록에서 찾아오는 방식으로 맞춤
    const list = progressData?.resourceProgresses ?? [];
    const last = list.find((p) => p.resourceId === id);

    return {
      resourceId: id,
      resumeAt: last?.watchedDuration ?? 0,
    };
  }, [progressData]);

  const progress = useMemo<CourseLearnProgress | null>(() => {
    if (!progressData) return null;

    return {
      enrollmentId: String(progressData.enrollmentId),
      overallProgressRate: progressData.overallProgressRate,
      progressInfo: progressInfo ?? undefined,
      lectureProgressMap,
    };
  }, [progressData, progressInfo, lectureProgressMap]);

  const lastSavedAtRef = useRef<number>(0); // 마지막 저장 시각 (throttle 용)
  const lastSavedDurationRef = useRef<number>(0); // 마지막으로 저장된 재생 위치 (delta 비교용)

  const pendingRef = useRef<PendingProgress | null>(null); // 저장 실패 시 재시도 대상

  const THROTTLE_INTERVAL = 10_000; // 저장 최소 호출 간격 (ms)
  const MIN_SAVE_DELTA = 3; // 저장할 최소 재생 시간 변화량 (초)
  const RETRY_DELAYS = [2000, 5000, 15000]; // 저장 실패 시 재시도 간격 (ms)

  // 저장 실패한 진도를 재시도
  const retryPending = () => {
    const pending = pendingRef.current;
    if (!pending) return;

    const delay = RETRY_DELAYS[pending.retryCount];
    if (!delay) {
      pendingRef.current = null; // 포기
      return;
    }

    setTimeout(async () => {
      try {
        if (!USE_MOCK) {
          await updateLearnProgress(courseId, {
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
        retryPending(); // 실패 시만 재귀
      }
    }, delay);
  };

  // 진도 즉시 저장
  const saveProgress = async (resourceId: number, watchedDuration: number) => {
    if (!USE_MOCK) {
      await updateLearnProgress(courseId, {
        resourceId,
        watchedDuration,
      });
    }

    lastSavedDurationRef.current = watchedDuration;

    setProgressData((prev) =>
      prev ? applyProgressUpdate(prev, resourceId, watchedDuration) : prev,
    );
  };

  // 재생 중 주기적 진도 저장
  const autoSaveProgress = (resourceId: number, watchedDuration: number) => {
    const now = Date.now();

    if (now - lastSavedAtRef.current < THROTTLE_INTERVAL) return;
    if (Math.abs(watchedDuration - lastSavedDurationRef.current) < MIN_SAVE_DELTA) return;

    lastSavedAtRef.current = now;
    saveProgress(resourceId, watchedDuration);
  };

  // 영상 종료 시 최종 진도 저장
  const saveFinalProgressOnEnd = (resourceId: number) => {
    const target = progressData?.resourceProgresses.find((p) => p.resourceId === resourceId);

    if (!target) return;

    saveProgress(resourceId, target.totalDurationSeconds);
  };

  // 프론트에서 진도 상태를 계산/반영
  function applyProgressUpdate(
    prev: GetProgressResponse,
    resourceId: number,
    watchedDuration: number,
  ): GetProgressResponse {
    const lectureProgresses = (prev.resourceProgresses ?? []).map((p) => {
      if (p.resourceId !== resourceId) return p;

      const progressRate =
        watchedDuration >= p.totalDurationSeconds - 0.5
          ? 100
          : Math.min(100, Math.round((watchedDuration / p.totalDurationSeconds) * 100));

      return {
        ...p,
        watchedDuration,
        progressRate,
        completed: progressRate >= 100,
        lastWatchedAt: new Date().toISOString(),
      };
    });

    console.log(
      '각 강의 progressRate:',
      lectureProgresses.map((p) => ({
        id: p.resourceId,
        rate: p.progressRate,
      })),
    );

    // 전체 진도율 재계산
    const overallProgressRate =
      lectureProgresses.length === 0
        ? 0
        : Math.round(
            lectureProgresses.reduce((acc, p) => acc + p.progressRate, 0) /
              lectureProgresses.length,
          );

    return {
      ...prev,
      resourceProgresses: lectureProgresses,
      overallProgressRate,
      lastWatchedResourceId: resourceId,
      lastWatchedAt: new Date().toISOString(),
    };
  }

  return {
    progress,
    lectureProgressMap,
    progressInfo,
    overallProgressRate: progress?.overallProgressRate ?? 0,
    saveProgress,
    autoSaveProgress,
    saveFinalProgressOnEnd,
    lastSavedResourceId,
    isLoading,
    error,
  };
}
