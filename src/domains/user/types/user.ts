export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export type InstructorApplicationStatus = 'NOT_APPLIED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type User = {
  id: string;
  email: string;
  nickname: string;
  roles: Role[];
  cart: string[];
  enrolledCourses: string[];
  createdCourses: string[];
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  instructorApplicationStatus: InstructorApplicationStatus;
};

export type UserResponse = {
  id: string;
  email: string;
  nickname: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  instructorApplicationStatus: InstructorApplicationStatus;
};

export type UpdateProfileRequest = {
  nickname: string;
};

export type UpdateProfileResponse = UserResponse;

export type UpdateStudentToInstructorResponse = {
  id: string;
  roles: Role[];
};

export type ApplyInstructorResponse = {
  id: string;
  userId: string;
  status: InstructorApplicationStatus;
  appliedAt: string;
};
