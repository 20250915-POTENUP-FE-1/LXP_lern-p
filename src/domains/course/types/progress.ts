export type LectureProgressResponse = {
  resourceId: string;
  title: string;
  watchedDuration: number;
  progressRate: number;
  totalDurationSeconds: number;
  completed: boolean;
  lastWatchedAt: string;
};

export type GetProgressResponse = {
  enrollmentId: string;
  overallProgressRate: number; // 해당 수강 내역의 전체 진도율
  lastWatchedResourceId: string; // 마지막으로 재생했던 Video ID
  lastWatchedAt: string; // 마지막 학습 활동 시간
  lectureProgresses: LectureProgressResponse[]; // 개별 강의별 진도 상세 목록
};

export type UpdateProgressRequest = {
  resourceId: string;
  watchedDuration: number;
};

export type UpdateProgressResponse = {
  progressId: string;
  enrollmentId: string;
  resourceId: string;
  watchedDuration: number;
  completed: boolean;
  updatedAt: string;
};

// 이어보기 정보
export type ProgressInfo = {
  lectureId: string;
  resumeAt: number;
};

// Map에 들어갈 progress 값
export type LectureProgressMapValue = {
  progressRate: number;
  watchedDuration: number;
  totalDurationSeconds: number;
  completed: boolean;
};

// useProgress 반환 타입
export type CourseLearnProgress = {
  enrollmentId: string;
  overallProgressRate: number;
  progressInfo: ProgressInfo;
  lectureProgressMap: Map<string, LectureProgressMapValue>;
};

// 진도율 갱신 보류
export type PendingProgress = {
  resourceId: string;
  watchedDuration: number;
  retryCount: number;
};
