export type Role = 'USER' | 'INSTRUCTOR' | 'ADMIN'; // 추후 'USER' -> 'STUDENT' 로 변경

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
  updatedAt: Date;
};

export type UserResponse = User | null;
