export type LectureProgressResponse = {
  resourceId: number;
  title: string;
  watchedDuration: number;
  progressRate: number;
  totalDurationSeconds: number;
  completed: boolean;
  lastWatchedAt: string;
};

export interface GetProgressResponse {
  enrollmentId: number;
  overallProgressRate: number;
  lastWatchedResourceId: number;
  lastWatchedAt: string;
  resourceProgresses: LectureProgressResponse[]; // 🔥 여기를 서버 기준으로
}

export type UpdateProgressRequest = {
  resourceId: number;
  watchedDuration: number;
};

export type UpdateProgressResponse = {
  progressId: number;
  enrollmentId: number;
  resourceId: number;
  watchedDuration: number;
  completed: boolean;
  updatedAt: string;
};

// 이어보기 정보
export type ProgressInfo = {
  resourceId: number;
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
  progressInfo?: ProgressInfo;
  lectureProgressMap: Map<number, LectureProgressMapValue>;
};

// 진도율 갱신 보류
export type PendingProgress = {
  resourceId: number;
  watchedDuration: number;
  retryCount: number;
};
