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
  overallProgressRate: number; // 해당 수강 내역의 전체 진도율
  lastWatchedResourceId: number; // 마지막으로 재생했던 Video ID
  lastWatchedAt: string; // 마지막 학습 활동 시간
  resourceProgresses: LectureProgressResponse[]; // 개별 강의별 진도 상세 목록
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
  progressInfo: ProgressInfo;
  lectureProgressMap: Map<number, LectureProgressMapValue>;
};

// 진도율 갱신 보류
export type PendingProgress = {
  resourceId: number;
  watchedDuration: number;
  retryCount: number;
};
