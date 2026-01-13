// API: GET /api/progresses/{enrollmentId}
export type LearnLectureProgressResponse = {
  resourceId: string;
  title: string;
  currentProgressRate: number;
  watchedDuration: number;
  totalDurationSeconds: number;
  isCompleted: boolean;
  lastWatchedAt: string | null;
};

export type LearnProgressResponse = {
  enrollmentId: string;
  progressRate: number;
  lastVideoId: string | null;
  lastWatchedDuration: number;
  lastWatchedAt: string | null;
  lectureProgresses: LearnLectureProgressResponse[];
  updatedAt: string;
};

// API: PATCH /api/progresses
export type LearnProgressRequest = {
  resourceId: string;
  watchedDuration: number;
};

// 이어보기 정보
export type ResumeInfo = {
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

// useCourseLearnProgress 반환 타입
export type CourseLearnProgress = {
  enrollmentId: string;
  overallProgressRate: number;
  resumeInfo: ResumeInfo | null;
  lectureProgressMap: Map<string, LectureProgressMapValue>;
};

export type PendingProgress = {
  resourceId: string;
  watchedDuration: number;
  retryCount: number;
};
