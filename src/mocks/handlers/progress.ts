import { http, HttpResponse } from 'msw';
import type { GetProgressResponse } from '@/domains/course/types/progress';
import { MOCK_LEARN_PROGRESS } from '@/mocks/learn.mock';

// 🔹 in-memory 상태 (파일 스코프 OK)
const progressState: GetProgressResponse = structuredClone(MOCK_LEARN_PROGRESS);

export const progressHandlers = [
  http.get('/api/progresses/course/:courseId', ({ params }) => {
    const { courseId } = params; // ✅ 여기서만 가능

    console.log('[MSW GET]', { courseId });

    return HttpResponse.json({
      status: 'OK',
      code: 'SP002',
      message: '학습 이력을 조회하였습니다.',
      data: progressState,
    });
  }),

  http.patch('/api/progresses/course/:courseId', async ({ params, request }) => {
    const { courseId } = params; // ✅ 여기서만 가능
    const body = await request.json();
    const { resourceId, watchedDuration } = body as {
      resourceId: number;
      watchedDuration: number;
    };

    const target = progressState.lectureProgresses.find((p) => p.resourceId === resourceId);
    if (!target) {
      return HttpResponse.json({ message: 'not found' }, { status: 404 });
    }

    const prev = target.watchedDuration;

    // 🔁 누적
    target.watchedDuration = Math.max(prev, watchedDuration);

    target.progressRate = Math.min(
      100,
      Math.round((target.watchedDuration / target.totalDurationSeconds) * 100),
    );

    target.completed = target.progressRate >= 100;
    target.lastWatchedAt = new Date().toISOString();

    // 전체 상태 갱신
    progressState.lastWatchedResourceId = target.resourceId;
    progressState.lastWatchedAt = target.lastWatchedAt;
    progressState.overallProgressRate = Math.round(
      progressState.lectureProgresses.reduce((acc, p) => acc + p.progressRate, 0) /
        progressState.lectureProgresses.length,
    );

    console.log('[MSW PATCH]', {
      courseId,
      resourceId,
      watchedDuration,
      prev,
    });

    return HttpResponse.json({
      status: 'OK',
      code: 'SP001',
      message: '진도율이 갱신되었습니다.',
      data: {
        progressId: 9001,
        enrollmentId: progressState.enrollmentId,
        resourceId,
        watchedDuration: target.watchedDuration,
        completed: target.completed,
        updatedAt: target.lastWatchedAt,
      },
    });
  }),
];
