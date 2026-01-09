export type LectureProgress = {
  resourceId: number;
  title: string;
  currentProgressRate: number;
  watchedDuration: number;
  totalDurationSeconds: number;
  isCompleted: boolean;
  lastWatchedAt: string | null;
};

export type CourseProgressDetail = {
  enrollmentId: number;
  overallProgressRate: number;

  lastWatchedVideoId: number | null;
  lastWatchedDurationOfLastVideo: number | null;
  lastWatchedAt: string | null;

  lectureProgresses: LectureProgress[];
};

export type LearnLecture = {
  id: number;
  title: string;
  type: 'VIDEO' | 'PDF';

  duration?: number;
  watchedDuration: number;
  progressRate: number;

  completed: boolean;
};

export type ResumeInfo = {
  lectureId: number | null;
  startTime: number;
};
