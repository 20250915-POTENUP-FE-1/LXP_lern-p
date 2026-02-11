'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ApplyInstructorResponse } from '@/domains/user/types/user';
import { getMyInstructorApplication } from '@/domains/user/services/userService';

type ApplicationStatus = ApplyInstructorResponse['status'] | null;

export function useInstructorApplicationStatus(enabled: boolean) {
  const [status, setStatus] = useState<ApplicationStatus>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    try {
      const result = await getMyInstructorApplication();
      setStatus(result?.status ?? null);
    } catch {
      // 신청 내역이 없으면 null
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { applicationStatus: status, loading, refresh };
}
