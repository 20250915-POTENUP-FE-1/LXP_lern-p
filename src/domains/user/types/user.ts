export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

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
  updatedAt?: Date;
};

export type UserResponse = {
  id: string;
  email: string;
  nickname: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileRequest = {
  nickname: string;
};

export type UpdateProfileResponse = UserResponse;

export type UpdateStudentToInstructorResponse = {
  id: string;
  roles: Role[];
};
