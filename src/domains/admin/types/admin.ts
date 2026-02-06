// 강사 승인 관리 관련 타입 정의

// 강사 요청 상태
export type InstructorRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// 강사 요청 정보
export type InstructorRequest = {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  status: InstructorRequestStatus;
  requestedAt: string; // 신청일
  processedAt?: string; // 처리일 (승인/거절일)
};

// 강사 요청 목록 응답
export type GetInstructorRequestsResponse = {
  requests: InstructorRequest[];
  total: number;
};

// 강사 요청 승인/거절 요청
export type ProcessInstructorRequestRequest = {
  requestId: string;
  action: 'approve' | 'reject';
};

// 강사 요청 승인/거절 응답
export type ProcessInstructorRequestResponse = {
  requestId: string;
  status: InstructorRequestStatus;
  processedAt: string;
};

// 필터 타입
export type RequestFilter = 'PENDING' | 'APPROVED' | 'REJECTED';
