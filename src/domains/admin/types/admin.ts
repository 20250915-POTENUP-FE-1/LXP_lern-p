import { PageResponse } from '@/shared/types/page';

// 요청 상태
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type RequestFilter = ApplicationStatus | 'ALL';

export type InstructorApplication = {
  applicationId: number;
  userId: number;
  email: string;
  name: string;
  status: ApplicationStatus;
  appliedAt: string;
};

// 강사 요청
export type ApplyInstructorResponse = {
  applicationId: number;
  userId: number;
  status: ApplicationStatus;
  appliedAt: string;
};

// 강사 요청 목록 조회
export type GetInstructorApplicationsParams = {
  page?: number;
  size?: number;
  status?: ApplicationStatus;
};
export type GetInstructorApplicationsResponse = PageResponse<InstructorApplication>;

// 강사 요청 승인/거절
export type ProcessInstructorApplicationRequest = {
  status: ApplicationStatus;
};

// TODO: 관리자 대시보드 통계
export type AdminStats = {
  totalUsers: number;
  totalCourses: number;
  totalInstructors: number;
  pendingRequests: number;
};
