'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ApplyInstructorResponse } from '@/domains/user/types/user';
import { getMyInstructorApplication } from '@/domains/user/services/userService';

type ApplicationStatus = ApplyInstructorResponse['status'] | null;

const STORAGE_KEY = 'instructor_application_pending';

export function useInstructorApplicationStatus(enabled: boolean) {
  const [status, setStatus] = useState<ApplicationStatus>(null);
  const [loading, setLoading] = useState(false);
  const optimisticRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // sessionStorage에 저장된 낙관적 상태가 있으면 즉시 반영하고 API 호출 생략
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
        setStatus('PENDING');
        optimisticRef.current = true;
        return;
      }
    } catch {
      // SSR 또는 sessionStorage 접근 불가 시 무시
    }

    // sessionStorage에 없으면 API로 조회 시도
    let cancelled = false;
    setLoading(true);
    getMyInstructorApplication()
      .then((result) => {
        if (!cancelled) setStatus(result?.status ?? null);
      })
      .catch(() => {
        if (!cancelled) setStatus(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const markAsPending = useCallback(() => {
    setStatus('PENDING');
    optimisticRef.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // sessionStorage 접근 불가 시 무시
    }
  }, []);

  return { applicationStatus: status, loading, markAsPending };
}
