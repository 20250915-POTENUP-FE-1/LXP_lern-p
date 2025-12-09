export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export type User = {
  id: string;
  email: string;
  name: string;
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
  createdAt: Date;
};

export type UpdateProfileRequest = {
  nickname: string;
};

export type UpdateProfileResponse = {
  nickname: string;
};

export type updateStudentToInstructorResponse = {
  userId: string;
  roles: Role[];
};
