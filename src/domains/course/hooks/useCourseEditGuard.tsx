import { useEffect, useState } from 'react';
import { getCourse } from '../services/courseService';

type BlockedReason = 'published' | 'not-found' | 'error';

export type BlockMessage = {
  icon: string;
  title: string;
  message: string;
  primaryLabel: string;
  secondaryLabel: string | null;
};

export const BLOCK_MESSAGES: Record<BlockedReason, BlockMessage> = {
  published: {
    icon: '🔒',
    title: '수정할 수 없는 강좌입니다',
    message:
      '이미 발행된 강좌는 수정할 수 없습니다. 강좌를 다시 임시 저장 상태로 되돌리거나 새로운 강좌를 생성해주세요.',
    primaryLabel: '강좌 상세 페이지로 이동',
    secondaryLabel: '내 강좌 목록',
  },
  'not-found': {
    icon: '❓',
    title: '강좌를 찾을 수 없습니다',
    message: '존재하지 않는 강좌이거나 삭제된 강좌입니다.',
    primaryLabel: '내 강좌 목록으로 이동',
    secondaryLabel: null,
  },
  error: {
    icon: '⚠️',
    title: '오류가 발생했습니다',
    message: '강좌 정보를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
    primaryLabel: '내 강좌 목록으로 이동',
    secondaryLabel: null,
  },
};
export function useCourseEditGuard(courseId: string) {
  const [checking, setChecking] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [blockedReason, setBlockedReason] = useState<BlockedReason>('error');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { course } = await getCourse(courseId);

        if (!course) {
          setBlocked(true);
          setBlockedReason('not-found');
          return;
        }

        if (course.status !== 'draft') {
          setBlocked(true);
          setBlockedReason('published');
        }
      } catch (err) {
        console.error('[CourseEditClientPage] status check 실패:', err);
        setBlocked(true);
        setBlockedReason('error');
      } finally {
        setChecking(false);
      }
    };

    void checkStatus();
  }, [courseId]);
  return { checking, blocked, blockedReason };
}
